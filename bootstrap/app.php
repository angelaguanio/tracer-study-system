<?php

use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureAlumna;
use App\Http\Middleware\EnsureCoordinator;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);
        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {
            if (str_starts_with($request->path(), 'admin')) {
                return route('admin.login');
            }
            if (str_starts_with($request->path(), 'coordinator')) {
                return route('coordinator.login');
            }
            return route('alumna.login');
        });
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'admin'       => EnsureAdmin::class,
            'coordinator' => EnsureCoordinator::class,
            'alumna'      => EnsureAlumna::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
