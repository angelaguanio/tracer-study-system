<?php

namespace App\Events;

use App\Models\Announcement;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

/**
 * Fired when an announcement status changes (submitted, approved, rejected, resubmitted).
 * Triggers realtime list refresh for admin and coordinator announcement pages.
 */
class AnnouncementStatusChanged implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $announcementId,
        public readonly string $newStatus
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('role.admin'),
            new Channel('role.coordinator'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'announcement.status.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'announcement_id' => $this->announcementId,
            'status'          => $this->newStatus,
        ];
    }
}
