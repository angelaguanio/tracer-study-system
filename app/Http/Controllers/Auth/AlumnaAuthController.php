<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class AlumnaAuthController extends Controller
{
    /**
     * Show the signup form.
     */
    public function roles(): Response 
    {
        $user_role = 'alumna';

        return Inertia::render('Auth/AlumnaSignup', [
            'initialRole' => $user_role
        ]);
    }

    /**
     * Handle the Alumna registration.
     */
    public function signupAlumna(Request $request) 
    {
        $validation = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'year_graduated' => 'nullable|integer|between:2010,2030',
            'courses' => 'nullable|string',
            
            // Address and Contact Number to validation
            'address' => 'nullable|string|max:500',
            'contact_number' => 'nullable|string|max:20',

            'currently_employed' => 'required|in:Yes,No',

            // Conditional validation based on employment status
            'employment_type' => 'required_if:currently_employed,Yes|nullable|string',
            'company_name' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'position' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'location' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'monthly_salary' => ['nullable'], // Removed 'numeric' to handle commas manually
            'unemployment_reason' => 'required_if:currently_employed,No|nullable|string|max:255',
        ]);


        $rawSalary = $validation['monthly_salary'] ?? null;
        $salary = $rawSalary;
        if ($salary !== null && $salary !== '') {
            // Robust cleaning: remove all non-digits except decimal point
            $salary = preg_replace('/[^\d.]/', '', $salary);
            // Ensure valid number format (remove extra decimals)
            if (preg_match('/^\d+(\.\d{1,2})?$/', $salary)) {
                Log::channel('signup')->info("Alumna signup: Raw salary='$rawSalary' → Cleaned='$salary'");
            } else {
                Log::channel('signup')->warning("Invalid salary format: '$rawSalary' → skipped");
                $salary = null;
            }
        }

        //Create User
        $user = User::create([
            'last_name' => $validation['last_name'],
            'first_name' => $validation['first_name'],
            'middle_name' => $validation['middle_name'] ?? null,
            'email' => $validation['email'],
            'password' => Hash::make($validation['password']),
            'year_graduated' => $validation['year_graduated'] ?? null,
            'courses' => $validation['courses'] ?? null,
            'user_role' => 'alumna',
            // FIX: Ensure these are saved to the users table
            'address' => $validation['address'] ?? null,
            'contact_number' => $validation['contact_number'] ?? null,
        ]);

        // Create Employment Record
        Employment::create([
            'user_id' => $user->id,
            'currently_employed' => $validation['currently_employed'],
            'employment_type' => $validation['currently_employed'] === 'Yes' ? $validation['employment_type'] : null,
            'company_name' => $validation['currently_employed'] === 'Yes' ? $validation['company_name'] : null,
            'position' => $validation['currently_employed'] === 'Yes' ? $validation['position'] : null,
            'location' => $validation['currently_employed'] === 'Yes' ? $validation['location'] : null,
            'monthly_salary' => $validation['currently_employed'] === 'Yes' ? $salary : null,
            'unemployment_reason' => $validation['currently_employed'] === 'No' ? $validation['unemployment_reason'] : null,
        ]);

        Auth::login($user);
        
        return redirect()->route('alumna.home')->with('success', 'Account created successfully!');
    }

    /**
     * Show the login page.
     */
    public function showLogin(): Response 
    {
        return Inertia::render('Auth/AlumnaLogin');
    }

    /**
     * Handle login authentication.
     */
    public function loginAlumna(Request $request) 
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if (Auth::user()->user_role === 'alumna') { 
                return redirect()->intended(route('alumna.home'));
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            throw ValidationException::withMessages([
                'email' => 'Access denied. You do not have alumna privileges.',
            ]);
        };

        throw ValidationException::withMessages([
            'credentials' => 'The username or password is incorrect.'
        ]);
    }

    /**
     * Handle logout.
     */
    public function logoutAlumna(Request $request) 
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('role.select');
    }
}