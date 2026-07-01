<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    public function showLogin() {
        return Inertia::render('Auth/AdminLogin', [
            'sessionExpired' => $request->boolean('expired'),
        ]);
    }

    public function loginAdmin(Request $request) {
        $credentials = $request->only('email', 'password');

        if (
            Auth::attempt([
                'email' => $credentials['email'],
                'password' => $credentials['password'],
                'user_role' => 'admin',
                'status' => 'active',
            ])
        ) {
            $request->session()->regenerate();
            return Inertia::location(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Invalid credentials or inactive account.',
        ]);
    }

    public function logoutAdmin(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(route('role.select'));
    }
}