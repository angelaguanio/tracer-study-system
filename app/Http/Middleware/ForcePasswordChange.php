<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForcePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Tiyakin na ang user ay naka-login at hindi pa nagpapalit ng password
        if (Auth::check() && Auth::user()->password_changed == false) {
            
            // Hayaan silang pumunta sa change password route, submission route, o logout
            if ($request->routeIs('password.change') || 
                $request->routeIs('password.update') || 
                $request->routeIs('logout')) {
                return $next($request);
            }

            // I-redirect sila sa page kung saan kailangan palitan ang password
            return redirect()->route('password.change'); 
        }

        return $next($request);
    }
}