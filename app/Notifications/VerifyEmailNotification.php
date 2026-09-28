<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Build the mail message.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Generate a relative signed URL (path + query only, no scheme/domain).
        // This prevents signature mismatches caused by InfinityFree's proxy
        // stripping https and forwarding the request as http internally.
        $url = URL::temporarySignedRoute(
            'alumna.verification.verify',
            now()->addHours(24),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ],
            absolute: false
        );

        // Prepend APP_URL manually so the link in the email is clickable
        $url = rtrim(config('app.url'), '/') . $url;

        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Thank you for registering with GATE.')
            ->line('Please verify your email address before using your account.')
            ->action('Verify Email', $url)
            ->line('If you did not create this account, no further action is required.');
    }
}