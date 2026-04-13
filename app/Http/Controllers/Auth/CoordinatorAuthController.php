<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoordinatorAuthController extends Controller
{
     public function showLogin() {
        return Inertia::render('Auth/CoordinatorLogin');
    }

    public function loginCoordinator(Request $request) {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            if (Auth::user()->user_role === 'coordinator') {
                $request->session()->regenerate();
                return redirect()->intended(route('coordinator.dashboard'));
            }

            // Logged in but wrong role — log them back out
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    public function logoutCoordinator(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('role.select');
    }
}
