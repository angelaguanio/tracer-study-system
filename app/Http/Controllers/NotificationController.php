<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    private function getNotificationsQuery()
    {
        $user = auth()->user();
        $role = $user->user_role; // 'admin' or 'coordinator'

        return Notification::query()
        ->where(function ($q) use ($role, $user) {
            if (in_array($role, ['admin', 'coordinator'])) {
                // 'all' historically means "admin + coordinator" only
                $q->whereIn('target_role', [$role, 'all'])
                  ->whereNull('target_user_id');
            } else {
                // alumna: only their own role-wide broadcasts
                $q->where('target_role', $role)
                  ->whereNull('target_user_id');
            }

            if ($role === 'coordinator') {
                $q->orWhere(function ($q2) use ($user) {
                    $q2->where('target_role', 'coordinator_specific')
                       ->where('target_user_id', $user->id);
                });
            }

            if ($role === 'alumna') {
                $q->orWhere(function ($q2) use ($user) {
                    $q2->where('target_role', 'alumna_specific')
                       ->where('target_user_id', $user->id);
                });
            }
        })
        ->orderByDesc('created_at');
            
    }


    public function index(Request $request)
    {
        $notifications = $this->getNotificationsQuery()
        ->paginate(20)
        ->through(function ($notif) {
            return [
                'id'         => $notif->id,
                'type'       => $notif->type,
                'title'      => $notif->title,
                'message'    => $notif->message,
                'data'       => $notif->data,
                'created_at' => $notif->created_at->diffForHumans(),
                'is_read'    => $notif->isReadBy(auth()->user()),
            ];
        });

    return response()->json($notifications);
    }

    public function unreadCount()
    {
        $user = auth()->user();
        $userId = $user->id;

        $query = $this->getNotificationsQuery();

        // Only count notifications created after the user last saw the bell
        if ($user->notifications_seen_at) {
            $query->where('created_at', '>', $user->notifications_seen_at);
        }

        $count = $query->count();

        return response()->json(['count' => $count]);
    }

    public function markSeen()
    {
        $user = auth()->user();
        $user->update(['notifications_seen_at' => now()]);

        return response()->json(['success' => true]);
    }

    public function markRead($id)
    {
        NotificationRead::firstOrCreate([
            'notification_id' => $id,
            'user_id'         => auth()->id(),
        ], [
            'read_at' => now()
        ]);

        return response()->json(['success' => true]);
    }

    public function markAllRead()
    {
        $user = auth()->user();
        $role = $user->user_role;
        $userId = auth()->id();

        $unread = Notification::where(function ($q) use ($role, $user) {
                $q->whereIn('target_role', [$role, 'all'])
                ->whereNull('target_user_id');

                if ($role === 'coordinator') {
                    $q->orWhere(function ($q2) use ($user) {
                        $q2->where('target_role', 'coordinator_specific')
                        ->where('target_user_id', $user->id);
                    });
                }

                if ($role === 'alumna') {
                    $q->orWhere(function ($q2) use ($user) {
                        $q2->where('target_role', 'alumna_specific')
                        ->where('target_user_id', $user->id);
                    });
                }
            })
            ->whereDoesntHave('reads', fn($q) => $q->where('user_id', $userId))
            ->pluck('id');

        $inserts = $unread->map(fn($id) => [
            'notification_id' => $id,
            'user_id'         => $userId,
            'read_at'         => now(),
            'created_at'      => now(),
            'updated_at'      => now(),
        ])->toArray();

        if (!empty($inserts)) {
            NotificationRead::insert($inserts);
        }

        return response()->json(['success' => true]);
    }
}
