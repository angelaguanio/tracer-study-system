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

        if (
            Auth::attempt([
                'email' => $credentials['email'],
                'password' => $credentials['password'],
                'user_role' => 'coordinator',
                'status' => 'active', // 🔥 BLOCK INACTIVE
            ])
        ) {
            $request->session()->regenerate();

            return redirect()->intended('/coordinator/dashboard');
        }

        return back()->withErrors([
            'email' => 'Invalid credentials or account inactive.',
        ]);
    }

    public function logoutCoordinator(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(route('role.select'));
    }
}