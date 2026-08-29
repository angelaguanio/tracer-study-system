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
use App\Services\NotificationService;

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
        // Extract start_year and end_year from school_year if provided
        if ($request->has('school_year') && $request->school_year) {
            $years = explode('-', $request->school_year);
            if (count($years) === 2) {
                $request->merge([
                    'start_year' => trim($years[0]),
                    'end_year' => trim($years[1])
                ]);
            }
        }

        $validation = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $val = trim($value);
                    if ($val === '*') return;
                    if (strlen($val) === 1 || preg_match('/^[A-Z]{2}$/', $val) || str_ends_with($val, '.')) {
                        $fail('Please enter your full middle name, not just an initial. Enter * if you do not have a middle name.');
                    }
                }
            ],
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*(),.?":{}|<>_]/', // At least one symbol (including underscore)
            ],
            'start_year' => 'required|integer|digits:4',
            'end_year' => 'required|integer|digits:4|gt:start_year',
            'semester' => 'required|string',
            'department' => 'required|string',
            'courses' => 'required|string',

            // Profile picture — required at signup
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',

            // Address and Contact Number validation
            'street_address' => 'nullable|string|max:255',
            'subdivision' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'contact_number' => 'nullable|string|regex:/^\+\d{8,15}$/',

            'currently_employed' => 'required|in:Yes,No',

            // Conditional validation based on employment status
            'employment_type' => 'required_if:currently_employed,Yes|nullable|string',
            'company_name' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'position' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'location' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'monthly_salary' => ['nullable'], // Removed 'numeric' to handle commas manually
            'employment_duration' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'is_present' => 'required_if:currently_employed,Yes|boolean',
            'unemployment_reason' => 'required_if:currently_employed,No|nullable|string|max:255',
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number, and one symbol (!@#$%^&*(),.?":{}|<>_)',
            'profile_picture.required' => 'A profile picture is required to complete your registration.',
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

        // Handle profile picture upload
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $filename = uniqid() . '_' . time() . '.' .
                $request->file('profile_picture')->getClientOriginalExtension();

            $request->file('profile_picture')->move(
                public_path('uploads/profile-pictures'),
                $filename
            );

            $profilePicturePath = '/uploads/profile-pictures/' . $filename;
        }

        // Compute full address string
        $fullAddress = \App\Models\Address::formatFullAddress($validation);
        if (empty($fullAddress)) {
            $fullAddress = $validation['address'] ?? null;
        }

        //Create User
        $user = User::create([
            'last_name' => $validation['last_name'],
            'first_name' => $validation['first_name'],
            'middle_name' => $validation['middle_name'],
            'suffix' => $validation['suffix'] ?? null,
            'email' => $validation['email'],
            'password' => Hash::make($validation['password']),
            'start_year' => $validation['start_year'] ?? null,
            'end_year' => $validation['end_year'] ?? null,
            'semester' => $validation['semester'] ?? null,
            'department' => $validation['department'] ?? null,
            'courses' => $validation['courses'] ?? null,
            'user_role' => 'alumna',
            'address' => $fullAddress,
            'contact_number' => $validation['contact_number'] ?? null,
            'profile_picture' => $profilePicturePath,
        ]);

        // Create Address Record
        \App\Models\Address::create([
            'user_id' => $user->id,
            'street_address' => $validation['street_address'] ?? null,
            'subdivision' => $validation['subdivision'] ?? null,
            'region' => $validation['region'] ?? null,
            'province' => $validation['province'] ?? null,
            'city' => $validation['city'] ?? null,
            'barangay' => $validation['barangay'] ?? null,
            'full_address' => $fullAddress,
        ]);

        // Create Employment Record
        $employmentData = [
            'user_id' => $user->id,
            'currently_employed' => $validation['currently_employed'],
            'employment_type' => $validation['currently_employed'] === 'Yes' ? $validation['employment_type'] : null,
            'company_name' => $validation['currently_employed'] === 'Yes' ? $validation['company_name'] : null,
            'position' => $validation['currently_employed'] === 'Yes' ? $validation['position'] : null,
            'location' => $validation['currently_employed'] === 'Yes' ? $validation['location'] : null,
            'monthly_salary' => $validation['currently_employed'] === 'Yes' ? $salary : null,
            'employment_duration' => $validation['currently_employed'] === 'Yes' ? $validation['employment_duration'] : null,
            'unemployment_reason' => $validation['currently_employed'] === 'No' ? $validation['unemployment_reason'] : null,
        ];

        // Handle employment_end_year and is_current properly
        if ($validation['currently_employed'] === 'Yes') {

        $isPresent = filter_var(
            $validation['is_present'] ?? false,
            FILTER_VALIDATE_BOOLEAN
        );

        $employmentData['is_present'] = $isPresent;

    } else {

        $employmentData['is_present'] = false;

    }

    Employment::create($employmentData);

    // Send email verification
    $user->sendEmailVerificationNotification();

    NotificationService::alumniRegistered($user->id, $user->name);

    return Inertia::location(
        route('alumna.verification.notice', [
            'from' => 'signup',
            'email' => $user->email,
        ])
    );

    }

    /**
     * Show the login page.
     */
    public function showLogin(Request $request): Response 
    {
        return Inertia::render('Auth/AlumnaLogin', [
            'sessionExpired' => $request->boolean('expired'),
            'status' => $request->query('verified') === 'pending'
                ? 'Account created successfully! Please verify your email before logging in.'
                : session('status'),
        ]);
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

        if (Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
            'user_role' => 'alumna',
        ])) {

            $request->session()->regenerate();

            $user = Auth::user();

            if (!$user->hasVerifiedEmail()) {

                Auth::logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return Inertia::location(
                    route('alumna.verification.notice', [
                        'from' => 'login',
                        'email' => $user->email,
                    ])
                );
            }

            return Inertia::location(route('alumna.home'));
        }

        throw ValidationException::withMessages([
            'credentials' => 'The username or password is incorrect.',
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
        
        return Inertia::location(route('alumna.login'));
    }
}