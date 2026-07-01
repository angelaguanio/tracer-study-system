<?php

use App\Http\Middleware\ChatParticipantMiddleware;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureAlumna;
use App\Http\Middleware\EnsureCoordinator;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['middleware' => ['web', 'auth']],
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);
        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {

            $route = route('alumna.login');
        
            if (str_starts_with($request->path(), 'admin')) {
                $route = route('admin.login');
            }
        
            if (str_starts_with($request->path(), 'coordinator')) {
                $route = route('coordinator.login');
            }
        
            return $route . '?expired=1';
        });
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'admin'             => EnsureAdmin::class,
            'coordinator'       => EnsureCoordinator::class,
            'alumna'            => EnsureAlumna::class,
            'chat.participant'  => ChatParticipantMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
