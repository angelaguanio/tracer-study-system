<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function store(Request $request) {
        $request->validate(['email' => 'required|email']);

        // Check if user exists with this email
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return back()->withErrors([
                'email' => 'We could not find a user with that email address.'
            ]);
        }

        // Generate password reset token
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Send reset email
        try {
            $user->notify(new ResetPasswordNotification($token));
            return back()->with('status', 'Password reset link sent to your email!');
        } catch (\Exception) {
            return back()->withErrors(['email' => 'Unable to send reset link. Please try again.']);
        }
    }
}
