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

    public int $tries = 1; // Don't retry — bulk mail failures should be logged and skipped
    public int $timeout = 600; // 10 minutes to handle large batches with delays
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
                // Respect Mailtrap free tier rate limit (1 email/second).
                // 1.5s delay gives comfortable headroom.
                sleep(5);
                
                Mail::to($user->email)
                    ->send(new AlumniBroadcastEmail($this->subject, $this->body));
                $emailsSent++;
                \Log::info("Email sent to: {$user->email}");
            } catch (\Exception $e) {
                \Log::error("Bulk mail failed to {$user->email}: " . $e->getMessage());
                // Don't rethrow — skip this recipient and continue with the rest.
                // On rate limit errors (550), retrying immediately won't help.
            }
        }

        \Log::info("SendAlumniBroadcastJob completed. Total emails sent: {$emailsSent}");
    }
}
