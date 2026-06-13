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

    public function showChangePassword() {
        return Inertia::render('Auth/CoordinatorLogin', [
            'forceChangePassword' => true,
        ]);
    }

    public function loginCoordinator(Request $request) {
        $credentials = $request->only('email', 'password');

        if (
            Auth::attempt([
                'email' => $credentials['email'],
                'password' => $credentials['password'],
                'user_role' => 'coordinator',
                'status' => 'active',
            ])
        ) {
            $request->session()->regenerate();

            if (!Auth::user()->password_changed) {
                return redirect()->route('coordinator.show-change-password');
            }

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

    // change pass func
    public function changePassword(Request $request) {
        $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[!@#$%^&*()\,.?":{}|<>_]/',
            ],
            'password_confirmation' => ['required'],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number, and one symbol.',
        ]);

        $user = Auth::user();
        $user->password         = bcrypt($request->password);
        $user->password_changed = true;
        $user->save();

        return redirect('/coordinator/dashboard');
    }
}