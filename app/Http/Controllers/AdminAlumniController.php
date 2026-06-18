<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
     * LIST PAGE - Fetching Alumna list
     */
    public function index(Request $request)
{
    $query = User::query()->where('user_role', 'alumna');

    // Search logic
    if ($request->filled('search')) {
        $search = trim($request->search);
        $query->where(function ($q) use ($search) {
            $q->where('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%");
        });
    }

    // UPDATED YEAR FILTERING LOGIC
    if ($request->filled('year') && $request->year !== 'all') {
        // I-handle ang "2017-2018" format
        if (strpos($request->year, '-') !== false) {
            // Kunin ang "2018" mula sa "2017-2018"
            $endYear = explode('-', $request->year)[1];
            $query->where('end_year', $endYear);
        } else {
            // Fallback kung sakaling "2018" lang ang input
            $query->where('end_year', $request->year);
        }
    }

    // Course logic
    if ($request->filled('course') && $request->course !== 'all') {
        $query->whereRaw('TRIM(courses) = ?', [$request->course]);
    }

    $query->orderBy('created_at', 'desc');

    // Pag-paginate ng data
    $users = $query->paginate(6)->appends($request->query());

    // Transformation ng data para sa frontend
    $users->getCollection()->transform(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->first_name . ' ' . $user->last_name,
            'course' => $user->courses,
            'year' => ($user->start_year && $user->end_year)
                        ? "{$user->start_year}-{$user->end_year}"
                        : ($user->end_year ?? 'N/A'),
            'avatar' => $user->profile_picture ? Storage::url($user->profile_picture) : null,
            'email' => $user->email,
        ];
    });

    return Inertia::render('Admin/AdminAlumni', [
        'alumni' => $users,
        'filters' => $request->only(['search', 'year', 'course']),
    ]);
}

    /**
     * SHOW PROFILE PAGE - Individual Alumna Detailed Profile
     */
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
                'course' => $user->courses,

                // 💡 COLUMN MAP FIX: Mapping actual DB attributes to expected payload keys
                'year_graduated'     => $user->end_year,
                'end_year'           => $user->end_year,
                'year'               => $user->end_year,

                'semester_graduated' => $user->semester,
                'semester'           => $user->semester,

                'profile_picture' => $user->profile_picture
                    ? asset('storage/' . $user->profile_picture)
                    : null,

                'initials' => $user->initials ?? '??',

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
                        'employment_start_year' => $history->employment_start_year,
                        'employment_end_year' => $history->employment_end_year,
                        'is_present' => $history->is_present,
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

        $clean = collect($validated)->map(function ($value) {
            if (is_string($value)) {
                $trimmed = trim($value);
                return $trimmed === '' ? null : $trimmed;
            }
            return $value;
        })->toArray();

        DB::transaction(function () use ($user, $clean) {
            $employment = $user->employment;

            if ($employment) {
                $employment->fill($clean);

                $isDirty = $employment->isDirty([
                    'company_name',
                    'position',
                    'currently_employed',
                    'employment_type'
                ]);

                if ($isDirty) {
                    $employment->save();

                    $user->employmentHistory()->create([
                        'company_name'       => $clean['company_name'] 
                            ?? ($clean['currently_employed'] === 'No' ? 'Unemployed' : 'N/A'),
                        'position'           => $clean['position'] ?? 'N/A',
                        'currently_employed' => $clean['currently_employed'],
                        'created_at'         => now(),
                    ]);
                } else {
                    $employment->save();
                }
            } else {
                $user->employment()->create($clean);

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

        foreach ($request->user_ids as $index => $userId) {
            $delaySeconds = 60 + ($index * 60);
            
            SendAlumniBroadcastJob::dispatch(
                $request->subject,
                $request->message,
                [$userId]
            )->delay(now()->addSeconds($delaySeconds));
        }

        return back()->with('success', 'Bulk email queued successfully ' . count($request->user_ids));
    }
}