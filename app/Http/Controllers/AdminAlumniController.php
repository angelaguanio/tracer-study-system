<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumniBroadcastEmail;
use App\Jobs\SendAlumniBroadcastJob;

class AdminAlumniController extends Controller
{
    /**
     * LIST PAGE - Pagkuha ng listahan ng mga Alumna
     */
    public function index(Request $request)
    {
        $query = User::query()->where('user_role', 'alumna');

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        if ($request->filled('course') && $request->course !== 'all') {
            $query->whereRaw('TRIM(courses) = ?', [$request->course]);
        }

        // Order by newest account created first
        $query->orderBy('created_at', 'desc');

        $users = $query->paginate(6)->appends($request->query());

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->profile_picture ? Storage::url($user->profile_picture) : null,
                'email' => $user->email,
            ];
        });

        return Inertia::render('Admin/AdminAlumni', [
            'alumni' => $users,
            'filters' => $request->only(['search', 'year', 'course']),
        ]);
    }

    public function show($id)
{
    $user = User::with(['employment', 'employmentHistory' => function($query) {
        $query->orderBy('created_at', 'desc');
    }])->findOrFail($id);

    return Inertia::render('Admin/AdminViewProfileOfRespondents', [
        'user' => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'courses' => $user->courses,
            'year_graduated' => $user->year_graduated,

            //  IMPORTANT FIX (RAW PATH ONLY) - using profile_picture column
            'profile_picture' => $user->profile_picture
            ? asset('storage/' . $user->profile_picture)
            : null,

            'initials' => strtoupper(
                substr($user->first_name ?? '', 0, 1) .
                substr($user->last_name ?? '', 0, 1)
            ) ?: '??',

            'address' => $user->address ?? 'N/A',
            'contact_number' => $user->contact_number ?? 'N/A',

            'employment' => $user->employment,
            'employment_history' => $user->employmentHistory->map(function ($history) {
                return [
                    'id' => $history->id,
                    'created_at' => $history->created_at,
                    'company_name' => $history->company_name,
                    'position' => $history->position,
                    'currently_employed' => $history->currently_employed,
                    'employment_type' => $history->employment_type,
                    'location' => $history->location,
                    'monthly_salary' => $history->monthly_salary,
                    'unemployment_reason' => $history->unemployment_reason,
                ];
            }) ?? [],
        ]
    ]);
}
    /**
     * Update or create employment records.
     */
    public function updateEmployment(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'company_name'       => 'nullable|string|max:255',
        'position'           => 'nullable|string|max:255',
        'employment_type'    => 'nullable|string|max:255',
        'location'           => 'nullable|string|max:255',
        'currently_employed' => 'required|string|in:Yes,No',
        'monthly_salary'     => 'nullable|string',
        'unemployment_reason'=> 'nullable|string',
    ]);

    // Clean values: Gawing null ang empty strings para sa accurate comparison
    $clean = collect($validated)->map(function ($value) {
        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed === '' ? null : $trimmed;
        }
        return $value;
    })->toArray();

    DB::transaction(function () use ($user, $clean) {
        // Kunin ang current record
        $employment = $user->employment;

        if ($employment) {
            // I-fill ang data para makita kung ano ang magbabago
            $employment->fill($clean);

            // Titingnan lang natin ang mga core fields para sa history
            $isDirty = $employment->isDirty([
                'company_name',
                'position',
                'currently_employed',
                'employment_type'
            ]);

            if ($isDirty) {
                $employment->save();

                // Dito lang gagawa ng history record kung may totoong nagbago
                $user->employmentHistory()->create([
                    'company_name'       => $clean['company_name'] 
                        ?? ($clean['currently_employed'] === 'No' ? 'Unemployed' : 'N/A'),
                    'position'           => $clean['position'] ?? 'N/A',
                    'currently_employed' => $clean['currently_employed'],
                    'created_at'         => now(),
                ]);
            } else {
                // Kung walang pagbabago sa history fields, i-save pa rin ang iba (e.g. salary, location)
                $employment->save();
            }
        } else {
            // Kung first time pa lang gagawa ng record
            $newEmployment = $user->employment()->create($clean);

            // Gawa ng initial history record
            $user->employmentHistory()->create([
                'company_name'       => $clean['company_name'] 
                    ?? ($clean['currently_employed'] === 'No' ? 'Unemployed' : 'N/A'),
                'position'           => $clean['position'] ?? 'N/A',
                'currently_employed' => $clean['currently_employed'],
                'created_at'         => now(),
            ]);
        }
    });

    return back()->with('success', 'Employment updated successfully.');
}

    /**
     * Send email to individual alumni
     */
    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = User::findOrFail($id);

        Mail::to($user->email)->send(new AlumniBroadcastEmail(
            $request->subject,
            $request->message
        ));

        return back()->with('success', 'Email sent successfully to ' . $user->first_name . ' ' . $user->last_name);
    }

    /**
     * Send bulk email to selected alumni
     */
    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

       

        // Dispatch individual jobs for each user with delays
        // Start with 60 seconds for first email, then add 60 seconds for each subsequent email
        // This ensures we stay well under Mailtrap's rate limit
        foreach ($request->user_ids as $index => $userId) {
            $delaySeconds = 60 + ($index * 60); // 60, 120, 180, 240, etc. (1 min intervals)
            
            SendAlumniBroadcastJob::dispatch(
                $request->subject,
                $request->message,
                [$userId] // Send to one user at a time
            )->delay(now()->addSeconds($delaySeconds));
        }

        return back()->with('success', 'Bulk email queued successfully' . count($request->user_ids));
    }
}