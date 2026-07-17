<?php

namespace App\Events;

use App\Models\Announcement;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class AnnouncementPublished implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Announcement $announcement) {}

    public function broadcastOn(): array
    {
        // All roles see the announcement list update
        return [
            new Channel('announcements'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'announcement.published';
    }

    public function broadcastWith(): array
    {
        $images = is_string($this->announcement->image)
            ? json_decode($this->announcement->image, true)
            : ($this->announcement->image ?? []);

        return [
            'id'         => $this->announcement->id,
            'title'      => $this->announcement->title,
            'details'    => $this->announcement->details,
            'image'      => $images,
            'status'     => $this->announcement->status,
            'created_at' => $this->announcement->created_at->toISOString(),
        ];
    }
}
