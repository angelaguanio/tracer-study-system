<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;


class ResetPasswordController extends Controller
{
    public function create(string $token) {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => request('email')
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*(),.?":{}|<>_]/', // At least one symbol (including underscore)
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number, and one symbol (!@#$%^&*(),.?":{}|<>_)',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => bcrypt($password)])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('alumna.login')->with('status', 'Password reset successfully!')
            : back()->withErrors(['email' => __($status)]);
    }
}
