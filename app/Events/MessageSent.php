<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Message $message)
    {
        // Ensure conversation and sender relations are loaded
        $this->message->loadMissing(['conversation', 'sender']);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        $conversation = $this->message->conversation;

        $minId = min($conversation->admin_id, $conversation->coordinator_id);
        $maxId = max($conversation->admin_id, $conversation->coordinator_id);

        // Use private channels for Pusher (instead of presence channels)
        return [
            new Channel('chat.' . $minId . '.' . $maxId),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $message = $this->message;
        $sender  = $message->sender;

        return [
            'id'              => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id'       => $message->sender_id,
            'sender_name'     => $sender->first_name . ' ' . $sender->last_name,
            'body'            => $message->body,
            'created_at'      => $message->created_at,
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
