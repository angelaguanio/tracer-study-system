<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employment;
use App\Models\Address;
use App\Helpers\ImageHelper;
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
     * Verify alumna identity via Student ID and Name (2 fields only).
     */
    public function verifyIdentity(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'name' => 'required|string',
        ]);

        $studentId = trim($validated['student_id']);
        $inputName = trim($validated['name']);

        // Find student record by student_id
        $user = User::where('student_id', $studentId)
            ->where('user_role', 'alumna')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No student record found with Student ID ' . $studentId . '. Please verify your ID or contact your department coordinator.'
            ], 422);
        }

        // Check if account has already been verified and activated
        $isTempEmail = str_contains($user->email, '@temporary.wesleyan.edu.ph');
        if ($user->email_verified_at !== null && !$isTempEmail) {
            return response()->json([
                'message' => 'This student account has already been activated. Please log in using your registered email and password.'
            ], 422);
        }

        // Normalize strings for strict name matching
        $normalizedInput = strtolower(trim(preg_replace('/[,\.\-_]/', ' ', $inputName)));
        $normalizedInput = preg_replace('/\s+/', ' ', $normalizedInput);

        $cleanFirst = strtolower(trim(preg_replace('/[,\.\-_]/', ' ', $user->first_name ?? '')));
        $cleanFirst = preg_replace('/\s+/', ' ', $cleanFirst);

        $cleanLast = strtolower(trim(preg_replace('/[,\.\-_]/', ' ', $user->last_name ?? '')));
        $cleanLast = preg_replace('/\s+/', ' ', $cleanLast);

        // 1. Last name verification (MUST be true and present)
        $lastNameMatches = false;
        if (!empty($cleanLast)) {
            if (str_contains($normalizedInput, $cleanLast)) {
                $lastNameMatches = true;
            } else {
                $lastWords = array_filter(explode(' ', $cleanLast));
                $allLastWordsFound = true;
                foreach ($lastWords as $w) {
                    if (strlen($w) > 1 && !str_contains($normalizedInput, $w)) {
                        $allLastWordsFound = false;
                        break;
                    }
                }
                if ($allLastWordsFound && count($lastWords) > 0) {
                    $lastNameMatches = true;
                }
            }
        }

        // 2. First name verification (MUST be true and present)
        $firstNameMatches = false;
        if (!empty($cleanFirst)) {
            if (str_contains($normalizedInput, $cleanFirst)) {
                $firstNameMatches = true;
            } else {
                $firstWords = array_filter(explode(' ', $cleanFirst));
                $foundCount = 0;
                foreach ($firstWords as $w) {
                    if (strlen($w) > 1 && str_contains($normalizedInput, $w)) {
                        $foundCount++;
                    }
                }
                if ($foundCount >= 1) {
                    $firstNameMatches = true;
                }
            }
        }

        // Access requires BOTH first name and last name to be true
        $matched = $lastNameMatches && $firstNameMatches;

        if (!$matched) {
            return response()->json([
                'message' => 'The name entered does not match the record on file for Student ID ' . $studentId . '. Please check the spelling of your name.'
            ], 422);
        }

        // Store the verified student user ID in the session for step 2
        session(['activating_student_id' => $user->id]);

        return response()->json([
            'success' => true,
            'student' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'middle_name' => $user->middle_name,
                'full_name' => trim("{$user->first_name} " . ($user->middle_name && $user->middle_name !== '*' ? "{$user->middle_name} " : '') . "{$user->last_name}"),
                'student_id' => $user->student_id,
                'department' => $user->department,
                'courses' => $user->courses,
                'school_year' => ($user->start_year && $user->end_year) ? "{$user->start_year}-{$user->end_year}" : null,
                'semester' => $user->semester,
            ]
        ]);
    }

    /**
     * Setup login credentials (Email and Password) for verified alumna.
     */
    public function setupCredentials(Request $request)
    {
        $studentUserId = session('activating_student_id') ?? $request->input('student_user_id');

        if (!$studentUserId) {
            return response()->json([
                'message' => 'Verification session expired. Please verify your Student ID and name again.'
            ], 422);
        }

        $user = User::where('id', $studentUserId)
            ->where('user_role', 'alumna')
            ->firstOrFail();

        $request->validate([
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*(),.?":{}|<>_]/', // At least one symbol
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number, and one symbol (!@#$%^&*(),.?":{}|<>_)',
        ]);

        $user->email = strtolower(trim($request->email));
        $user->password = Hash::make($request->password);
        $user->email_verified_at = null; // Unverified until email link is clicked
        $user->save();

        // Clear the activation session
        session()->forget('activating_student_id');

        // Authorize this device session to track verification
        session(['verifying_user_id' => $user->id]);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'redirect' => route('alumna.verification.notice', [
                'from' => 'signup',
                'email' => $user->email,
                'sent' => true
            ])
        ]);
    }

    /**
     * Check if email verification is completed (supports cross-device automatic reflection).
     */
    public function checkVerificationStatus(Request $request)
    {
        $email = $request->query('email');
        $studentUserId = session('verifying_user_id');

        $user = null;
        if ($studentUserId) {
            $user = User::where('id', $studentUserId)->where('user_role', 'alumna')->first();
        }

        if (!$user && $email) {
            $user = User::where('email', strtolower(trim($email)))->where('user_role', 'alumna')->first();
        }

        if ($user && $user->hasVerifiedEmail()) {
            // Auto authenticate this device session
            Auth::login($user);
            $request->session()->regenerate();
            session()->forget('verifying_user_id');

            return response()->json([
                'verified' => true,
                'redirect' => route('alumna.onboarding'),
            ]);
        }

        return response()->json([
            'verified' => false,
        ]);
    }

    /**
     * Show the profile setup (onboarding) form for authenticated alumna.
     */
    public function showOnboarding(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if (!$user || $user->user_role !== 'alumna') {
            return redirect()->route('alumna.login');
        }

        // If user already has profile picture AND an employment record, profile setup is already complete
        if ($user->profile_picture && Employment::where('user_id', $user->id)->exists()) {
            return redirect()->route('alumna.questionnaire', ['tab' => 'tracer-study']);
        }

        return Inertia::render('Auth/AlumnaOnboarding', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'suffix' => $user->suffix,
                'student_id' => $user->student_id,
                'department' => $user->department,
                'courses' => $user->courses,
                'school_year' => ($user->start_year && $user->end_year) ? "{$user->start_year}-{$user->end_year}" : '',
                'semester' => $user->semester,
                'email' => $user->email,
                'contact_number' => $user->contact_number,
            ]
        ]);
    }

    /**
     * Complete profile setup (onboarding) and redirect immediately to Tracer Study.
     */
    public function completeOnboarding(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_role !== 'alumna') {
            return redirect()->route('alumna.login');
        }

        $validated = $request->validate([
            // Profile picture
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',

            // Address and Contact
            'country' => 'nullable|string|max:255',
            'street_address' => 'nullable|string|max:255',
            'subdivision' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'contact_number' => 'nullable|string|regex:/^\+\d{8,15}$/',

            // Employment
            'currently_employed' => 'required|in:Yes,No',
            'employment_type' => 'required_if:currently_employed,Yes|nullable|string',
            'company_name' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'position' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'location' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'monthly_salary' => ['nullable'],
            'employment_duration' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'is_present' => 'required_if:currently_employed,Yes|boolean',
            'unemployment_reason' => 'required_if:currently_employed,No|nullable|string|max:255',
        ], [
            'profile_picture.required' => 'A clear profile picture is required to complete your profile setup.',
        ]);

        // Process profile picture using ImageHelper (WebP conversion)
        if ($request->hasFile('profile_picture')) {
            $baseFilename = uniqid() . '_' . time();
            $filename = ImageHelper::convertAndSaveToWebp(
                $request->file('profile_picture'),
                'uploads/profile-pictures',
                $baseFilename
            );
            $user->profile_picture = '/uploads/profile-pictures/' . $filename;
        }

        // Format and save address
        $fullAddress = Address::formatFullAddress($validated);
        if (empty($fullAddress)) {
            $fullAddress = $validated['address'] ?? null;
        }
        $user->address = $fullAddress;

        if (!empty($validated['contact_number'])) {
            $user->contact_number = $validated['contact_number'];
        }
        $user->save();

        // Update or create address record
        Address::updateOrCreate(
            ['user_id' => $user->id],
            [
                'country' => $validated['country'] ?? 'Philippines',
                'street_address' => $validated['street_address'] ?? null,
                'subdivision' => $validated['subdivision'] ?? null,
                'region' => $validated['region'] ?? null,
                'province' => $validated['province'] ?? null,
                'city' => $validated['city'] ?? null,
                'barangay' => $validated['barangay'] ?? null,
                'zip_code' => $validated['zip_code'] ?? null,
                'full_address' => $fullAddress,
            ]
        );

        // Clean salary
        $rawSalary = $validated['monthly_salary'] ?? null;
        $salary = $rawSalary;
        if ($salary !== null && $salary !== '') {
            $salary = preg_replace('/[^\d.]/', '', $salary);
            if (!preg_match('/^\d+(\.\d{1,2})?$/', $salary)) {
                $salary = null;
            }
        }

        $isPresent = filter_var($validated['is_present'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Update or create employment record
        Employment::updateOrCreate(
            ['user_id' => $user->id],
            [
                'currently_employed' => $validated['currently_employed'],
                'employment_type' => $validated['currently_employed'] === 'Yes' ? $validated['employment_type'] : null,
                'company_name' => $validated['currently_employed'] === 'Yes' ? $validated['company_name'] : null,
                'position' => $validated['currently_employed'] === 'Yes' ? $validated['position'] : null,
                'location' => $validated['currently_employed'] === 'Yes' ? $validated['location'] : null,
                'monthly_salary' => $validated['currently_employed'] === 'Yes' ? $salary : null,
                'employment_duration' => $validated['currently_employed'] === 'Yes' ? $validated['employment_duration'] : null,
                'unemployment_reason' => $validated['currently_employed'] === 'No' ? $validated['unemployment_reason'] : null,
                'is_present' => $validated['currently_employed'] === 'Yes' ? $isPresent : false,
            ]
        );

        // Notify admins/coordinators of newly registered alumna
        NotificationService::alumniRegistered($user->id, $user->name);

        // Immediately redirect to Tracer Study
        return redirect()->route('alumna.questionnaire', ['tab' => 'tracer-study'])
            ->with('success', 'Profile setup complete! Please answer the Tracer Study survey to proceed.');
    }

    /**
     * Show the legacy signup form (fallback: redirect to login).
     */
    public function roles(): \Illuminate\Http\RedirectResponse 
    {
        return redirect()->route('alumna.login');
    }

    /**
     * Handle the legacy Alumna registration (fallback: redirect to login).
     */
    public function signupAlumna(Request $request) 
    {
        return redirect()->route('alumna.login');
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

            // Check if profile setup (onboarding) is completed
            if (!$user->profile_picture || !Employment::where('user_id', $user->id)->exists()) {
                return Inertia::location(route('alumna.onboarding'));
            }

            return Inertia::location(route('alumna.home'));
        }

        throw ValidationException::withMessages([
            'credentials' => 'The email or password is incorrect.',
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
