<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * GET /chat/conversations
     * Admin: list all coordinator conversations with unread counts.
     * Coordinator: return the single conversation with the admin.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->user_role === 'admin') {
            $coordinators = User::where('user_role', 'coordinator')->get();

            $conversations = $coordinators->map(function (User $coordinator) use ($user) {
                $conversation = Conversation::firstOrCreate(
                    ['admin_id' => $user->id, 'coordinator_id' => $coordinator->id]
                );

                $unread = $this->unreadCount($conversation, $user->id);

                return [
                    'id'             => $conversation->id,
                    'admin_id'       => $user->id,
                    'coordinator_id' => $coordinator->id,
                    'coordinator'    => [
                        'id'         => $coordinator->id,
                        'first_name' => $coordinator->first_name,
                        'last_name'  => $coordinator->last_name,
                    ],
                    'unread_count'   => $unread,
                ];
            });

            return response()->json($conversations);
        }

        // Coordinator: find or create conversation with the admin
        $admin = User::where('user_role', 'admin')->first();

        $conversation = Conversation::firstOrCreate(
            ['admin_id' => $admin->id, 'coordinator_id' => $user->id]
        );

        $unread = $this->unreadCount($conversation, $user->id);

        return response()->json([
            'id'             => $conversation->id,
            'admin_id'       => $admin->id,
            'coordinator_id' => $user->id,
            'admin'          => [
                'id'         => $admin->id,
                'first_name' => $admin->first_name,
                'last_name'  => $admin->last_name,
            ],
            'unread_count'   => $unread,
        ]);
    }

    /**
     * GET /chat/conversations/{conversation}/messages
     * Paginated message history (50 per page, latest-first for pagination, but returned oldest-first for display).
     */
    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        // Get the latest 50 messages (or the requested page) in descending order
        $messages = $conversation->messages()
            ->with('sender:id,first_name,last_name')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        // Reverse the items so they're oldest-first for display
        $items = array_reverse($messages->items());

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page'    => $messages->lastPage(),
                'per_page'     => $messages->perPage(),
                'total'        => $messages->total(),
            ],
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
          ->header('Pragma', 'no-cache');
    }

    /**
     * POST /chat/messages
     * Store a message and broadcast it.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'body'            => ['required', 'string', 'min:1'],
        ]);

        // Trim and re-validate body is not whitespace-only
        $body = trim($validated['body']);
        if ($body === '') {
            return response()->json(['message' => 'The body field must not be empty.'], 422);
        }

        $user = $request->user();
        $conversation = Conversation::findOrFail($validated['conversation_id']);

        // Verify the user is a participant
        if ($user->id !== $conversation->admin_id && $user->id !== $conversation->coordinator_id) {
            abort(403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'body'            => $body,
        ]);

        event(new MessageSent($message));

        return response()->json($message, 201);
    }

    /**
     * POST /chat/conversations/{conversation}/read
     * Mark all messages in the conversation as read for the current user.
     */
    public function markRead(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $now  = now();

        // Get all messages NOT sent by the current user
        $messageIds = $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->pluck('id');

        foreach ($messageIds as $messageId) {
            MessageRead::updateOrCreate(
                ['message_id' => $messageId, 'user_id' => $user->id],
                ['read_at' => $now]
            );
        }

        // Broadcast read event to the channel
        $minId = min($conversation->admin_id, $conversation->coordinator_id);
        $maxId = max($conversation->admin_id, $conversation->coordinator_id);
        $channelName = 'chat.' . $minId . '.' . $maxId;
        
        broadcast(new class($user->id, $now, $channelName) implements \Illuminate\Contracts\Broadcasting\ShouldBroadcastNow {
            use \Illuminate\Broadcasting\InteractsWithSockets;
            
            public function __construct(public int $userId, public $readAt, public string $channel) {}
            
            public function broadcastOn(): array {
                return [new \Illuminate\Broadcasting\PrivateChannel($this->channel)];
            }
            
            public function broadcastWith(): array {
                return ['user_id' => $this->userId, 'read_at' => $this->readAt->toISOString()];
            }
            
            public function broadcastAs(): string {
                return 'messages.read';
            }
        });

        return response()->json(['ok' => true]);
    }

    /**
     * Calculate unread message count for a user in a conversation.
     */
    private function unreadCount(Conversation $conversation, int $userId): int
    {
        // Find the latest read_at for this user across all messages in this conversation
        $latestRead = MessageRead::whereHas('message', function ($q) use ($conversation) {
            $q->where('conversation_id', $conversation->id);
        })
            ->where('user_id', $userId)
            ->max('read_at');

        $query = $conversation->messages()->where('sender_id', '!=', $userId);

        if ($latestRead) {
            $query->where('created_at', '>', $latestRead);
        }

        return $query->count();
    }
}
