<?php

namespace App\Events;

use App\Models\Inquiries;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class InquiryCreated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Inquiries $inquiry)
    {
        $this->inquiry->loadMissing('alumni:id,first_name,last_name,email,profile_picture');
    }

    public function broadcastOn(): array
    {
        $channels = [];

        if ($this->inquiry->recipient_type === 'admin') {
            $channels[] = new Channel('role.admin');
        } elseif ($this->inquiry->recipient_type === 'coordinator' && $this->inquiry->recipient_id) {
            $channels[] = new Channel("user.{$this->inquiry->recipient_id}");
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'inquiry.created';
    }

    public function broadcastWith(): array
    {
        return [
            'inquiry_id'     => $this->inquiry->id,
            'subject'        => $this->inquiry->subject,
            'status'         => $this->inquiry->status,
            'recipient_type' => $this->inquiry->recipient_type,
            'recipient_id'   => $this->inquiry->recipient_id,
            'alumni'         => $this->inquiry->alumni,
        ];
    }
}
