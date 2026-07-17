<?php

namespace App\Events;

use App\Models\InquiryReply;
use App\Models\Inquiries;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class InquiryReplied implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly InquiryReply $reply,
        public readonly Inquiries $inquiry
    ) {
        $this->reply->loadMissing('sender:id,first_name,last_name,profile_picture,user_role');
    }

    public function broadcastOn(): array
    {
        // Broadcast on inquiry-specific channel so all participants
        // (alumni, admin, coordinator) watching this thread receive it instantly.
        return [
            new Channel("inquiry.{$this->inquiry->id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'inquiry.replied';
    }

    public function broadcastWith(): array
    {
        return [
            'reply'  => $this->reply->toArray(),
            'status' => $this->inquiry->status,
        ];
    }
}
