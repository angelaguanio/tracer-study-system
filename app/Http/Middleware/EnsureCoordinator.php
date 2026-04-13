<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureCoordinator
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::user()->isCoordinator()) {
            abort(403);
        }

        return $next($request);
    }
}
