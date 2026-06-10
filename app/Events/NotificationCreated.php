<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcastNow
{
    use SerializesModels;

    public function __construct(public Notification $notification) {}

   public function broadcastOn(): array
    {
        $channels = [];

        match($this->notification->target_role) {
            'all' => array_push(
                $channels,
                new Channel('role.admin'),
                new Channel('role.coordinator')
            ),
            'admin' => array_push($channels, new Channel('role.admin')),
            'coordinator' => array_push($channels, new Channel('role.coordinator')),
            // Specific coordinator gets their own private-ish channel
            'coordinator_specific' => array_push(
                $channels,
                new Channel("user.{$this->notification->target_user_id}")
            ),
            default => null,
        };

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    // Only send the ID — client fetches the rest from your API
    public function broadcastWith(): array
    {
        return [
            'notification_id' => $this->notification->id,
            'type'            => $this->notification->type,
            'title'           => $this->notification->title,
        ];
    }
}
