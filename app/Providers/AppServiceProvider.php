<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\Events\MessageSending;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // On local only: disable SSL peer verification so Symfony Mailer
        // can connect to SMTP on Windows without a trusted CA bundle.
        if (app()->environment('local')) {
            $this->app->resolving(\Illuminate\Mail\MailManager::class, function (\Illuminate\Mail\MailManager $manager) {
                $manager->extend('smtp', function (array $config) {
                    $transport = new \Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport(
                        host: $config['host'] ?? '127.0.0.1',
                        port: (int) ($config['port'] ?? 587),
                        tls: false,
                    );

                    $transport->setUsername($config['username'] ?? '');
                    $transport->setPassword($config['password'] ?? '');

                    /** @var \Symfony\Component\Mailer\Transport\Smtp\Stream\SocketStream $stream */
                    $stream = $transport->getStream();
                    $stream->setStreamOptions([
                        'ssl' => [
                            'verify_peer'       => false,
                            'verify_peer_name'  => false,
                            'allow_self_signed' => true,
                        ],
                    ]);

                    return $transport;
                });
            });
        }
    }
}
