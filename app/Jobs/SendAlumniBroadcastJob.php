<?php

namespace App\Jobs;

use App\Mail\AlumniBroadcastEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAlumniBroadcastJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    /**
     * @param array<int>|null $userIds  Specific IDs, or null to send to all alumni
     */
    public function __construct(
        public string $subject,
        public string $body,
        public ?array $userIds = null,
    ) {}

    public function handle(): void
    {
        $query = User::where('user_role', 'alumna')
            ->select('email');

        if ($this->userIds !== null) {
            $query->whereIn('id', $this->userIds);
        }

        // chunk(100) keeps memory flat regardless of alumni count
        $query->chunk(100, function ($users) {
            foreach ($users as $user) {
                Mail::to($user->email)
                    ->queue(new AlumniBroadcastEmail($this->subject, $this->body));
            }
        });
    }
}
