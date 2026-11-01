<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumniBroadcastEmail;
// use App\Jobs\SendAlumniBroadcastJob;

class AdminAlumniController extends Controller
{
    /**
     * LIST PAGE - Fetching Alumna list
     */
    public function index(Request $request)
{
    $status = $request->query('status', 'active');
    if (!in_array($status, ['active', 'archived'])) {
        $status = 'active';
    }

    $counts = [
        'active'   => User::where('user_role', 'alumna')->where('status', '!=', 'archived')->count(),
        'archived' => User::where('user_role', 'alumna')->where('status', 'archived')->count(),
    ];

    $query = User::query()->where('user_role', 'alumna');

    if ($status === 'archived') {
        $query->where('status', 'archived');
    } else {
        $query->where('status', '!=', 'archived');
    }

    // Search logic
    if ($request->filled('search')) {
        $searchTerm = trim($request->search);
        $terms = array_filter(explode(' ', $searchTerm));

        $query->where(function ($q) use ($terms) {
            foreach ($terms as $term) {
                $q->where(function ($subQ) use ($term) {
                    $subQ->where('first_name', 'LIKE', "%{$term}%")
                         ->orWhere('middle_name', 'LIKE', "%{$term}%")
                         ->orWhere('last_name', 'LIKE', "%{$term}%")
                         ->orWhere('email', 'LIKE', "%{$term}%")
                         ->orWhere('student_id', 'LIKE', "%{$term}%");
                });
            }
        });
    }

    // UPDATED YEAR FILTERING LOGIC
    if ($request->filled('year') && $request->year !== 'all') {
        if (strpos($request->year, '-') !== false) {
            $endYear = explode('-', $request->year)[1];
            $query->where('end_year', $endYear);
        } else {
            $query->where('end_year', $request->year);
        }
    }

    // Course logic
    if ($request->filled('course') && $request->course !== 'all') {
        $query->whereRaw('TRIM(courses) = ?', [$request->course]);
    }

    // Employment status filter
    if ($request->filled('employment') && $request->employment !== 'all') {
        $query->whereHas('employment', function ($q) use ($request) {
            $q->where('currently_employed', $request->employment);
        });
    }

    $query->orderBy('created_at', 'desc');

    // Pag-paginate ng data
    $users = $query->with('employment')->paginate(10)->appends($request->query());

    // Transformation ng data para sa frontend
    $users->getCollection()->transform(function ($user) {
        $email = str_ends_with($user->email ?? '', '@temp.alumniconnect.local') ? null : $user->email;
        return [
            'id' => $user->id,
            'student_id' => $user->student_id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'suffix' => $user->suffix,
            'name' => trim("{$user->first_name} {$user->middle_name} {$user->last_name} {$user->suffix}"),
            'course' => $user->courses,
            'department' => $user->department,
            'start_year' => $user->start_year,
            'end_year' => $user->end_year,
            'semester' => $user->semester,
            'year' => ($user->start_year && $user->end_year)
                        ? "{$user->start_year}-{$user->end_year}"
                        : ($user->end_year ?? 'N/A'),
            'avatar' => $user->profile_picture,
            'email' => $email,
            'contact_number' => $user->contact_number,
            'status' => $user->status,
            'employment_status' => $user->employment?->currently_employed === 'Yes' ? 'Employed' : 'Unemployed',
        ];
    });

    return Inertia::render('Admin/AdminAlumni', [
        'alumni' => $users,
        'filters' => array_merge($request->only(['search', 'year', 'course', 'employment']), ['status' => $status]),
        'counts' => $counts,
    ]);
}

    /**
     * UPDATE ALUMNI INFORMATION
     */
    public function update(Request $request, $id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);

        $validated = $request->validate([
            'student_id'     => 'required|string|max:50|unique:users,student_id,' . $user->id,
            'first_name'     => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'middle_name'    => 'nullable|string|max:100',
            'suffix'         => 'nullable|string|max:50',
            'department'     => 'required|string|max:100',
            'courses'        => 'required|string|max:100',
            'start_year'     => 'nullable|integer|min:1970|max:2100',
            'end_year'       => 'nullable|integer|min:1970|max:2100',
            'semester'       => 'nullable|string|max:50',
            'email'          => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'contact_number' => 'nullable|string|max:50',
        ]);

        $user->update($validated);

        return back()->with('success', 'Alumni information updated successfully.');
    }

    /**
     * ARCHIVE ALUMNI (Soft Archive)
     */
    public function archive($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $user->update(['status' => 'archived']);

        return back()->with('success', "{$user->first_name} {$user->last_name} has been archived.");
    }

    /**
     * RESTORE ARCHIVED ALUMNI
     */
    public function restore($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $user->update(['status' => 'active']);

        return back()->with('success', "{$user->first_name} {$user->last_name} has been restored.");
    }

    /**
     * PERMANENTLY DELETE ALUMNI
     */
    public function destroy($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $name = "{$user->first_name} {$user->last_name}";

        // Delete profile picture if stored
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();

        return back()->with('success', "{$name} was permanently deleted.");
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

                'profile_picture' => $user->profile_picture ?: null,

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
                        'employment_duration' => $history->employment_duration,
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

        Mail::to($user->email)->send(
            new AlumniBroadcastEmail(
                $request->subject,
                $request->message,
                'admin'
            )
        );

        return back()->with('success', 'Email sent successfully to ' . $user->first_name . ' ' . $user->last_name);
    }

    /**
     * Send bulk email to selected alumni
     */
    // public function sendBulkEmail(Request $request)
    // {
    //     $request->validate([
    //         'subject' => 'required|string|max:255',
    //         'message' => 'required|string',
    //         'user_ids' => 'required|array',
    //         'user_ids.*' => 'exists:users,id',
    //     ]);

    //     foreach ($request->user_ids as $index => $userId) {
    //         $delaySeconds = 60 + ($index * 60);
            
    //         SendAlumniBroadcastJob::dispatch(
    //             $request->subject,
    //             $request->message,
    //             [$userId]
    //         )->delay(now()->addSeconds($delaySeconds));
    //     }

    //     return back()->with('success', 'Bulk email queued successfully ' . count($request->user_ids));
    // }

    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'message'     => 'required|string',
            'send_all'    => 'nullable|boolean',
            'user_ids'    => 'required_without:send_all|nullable|array',
            'user_ids.*'  => 'exists:users,id',

            // batching
            'offset'      => 'nullable|integer|min:0',
            'batch_size'  => 'nullable|integer|min:1|max:20',
        ]);

        $offset = $request->offset ?? 0;
        $batchSize = $request->batch_size ?? 10;

        if ($request->boolean('send_all')) {
            $ids = User::where('user_role', 'alumna')
                ->where('status', '!=', 'archived')
                ->whereNotNull('email')
                ->where('email', 'not like', '%@temp.alumniconnect.local')
                ->pluck('id')
                ->toArray();
        } else {
            $ids = $request->user_ids ?? [];
        }

        // Get only the next batch
        $batchIds = array_slice($ids, $offset, $batchSize);

        $users = User::whereIn('id', $batchIds)->get();

        $sent = 0;
        $failed = [];

        foreach ($users as $user) {
            try {
                Mail::to($user->email)->send(
                    new AlumniBroadcastEmail(
                        $request->subject,
                        $request->message,
                        'admin'
                    )
                );

                $sent++;

                // small pause to avoid rate limits
                usleep(500000); // 0.5 second

            } catch (\Throwable $e) {

                $failed[] = [
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ];

                \Log::error("Bulk mail failed to {$user->email}: ".$e->getMessage());
            }
        }

        $nextOffset = $offset + count($batchIds);

        return response()->json([
            'finished' => $nextOffset >= count($ids),

            'next_offset' => $nextOffset,

            'processed' => $nextOffset,

            'total' => count($ids),

            'sent' => $sent,

            'failed' => $failed,
        ]);
    }
}