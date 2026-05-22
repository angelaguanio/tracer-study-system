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

    public int $tries = 5; // Retry up to 5 times
    public int $timeout = 120;
    public int $backoff = 15; // Wait 15 seconds between retries

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
        \Log::info('SendAlumniBroadcastJob started', [
            'subject' => $this->subject,
            'userIds' => $this->userIds,
            'userIdsCount' => $this->userIds ? count($this->userIds) : 0
        ]);

        $query = User::where('user_role', 'alumna')
            ->select('id', 'email', 'first_name', 'last_name');

        if ($this->userIds !== null) {
            $query->whereIn('id', $this->userIds);
        }

        $emailsSent = 0;

        // Get users and send emails
        $users = $query->get();
        
        foreach ($users as $user) {
            try {
                // Add a 2-second delay before sending to ensure we don't hit rate limits
                // even if multiple jobs somehow run close together
                sleep(2);
                
                Mail::to($user->email)
                    ->send(new AlumniBroadcastEmail($this->subject, $this->body));
                $emailsSent++;
                \Log::info("Email sent to: {$user->email}");
            } catch (\Exception $e) {
                \Log::error("Failed to send email to {$user->email}: " . $e->getMessage());
            }
        }

        \Log::info("SendAlumniBroadcastJob completed. Total emails sent: {$emailsSent}");
    }
}
