<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumniBroadcastEmail;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
{
    $query = User::where('user_role', 'alumna')
        ->latest()
        ->when($request->search, function ($q, $search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%");
        })
        ->when($request->course && $request->course !== 'all', function ($q) use ($request) {
            $q->where('courses', $request->course);
        });

    if ($request->filled('year') && $request->year !== 'all') {
        if (strpos($request->year, '-') !== false) {
            $endYear = explode('-', $request->year)[1];
            $query->where('end_year', $endYear);
        } else {
            $query->where('end_year', $request->year);
        }
    }

    if ($request->filled('employment') && $request->employment !== 'all') {
        $query->whereHas('employment', function ($q) use ($request) {
            $q->where('currently_employed', $request->employment);
        });
    }

    $alumni = $query->with('employment')->paginate(10)->withQueryString();
    
    $alumni->through(fn ($user) => [
        'id' => $user->id,
        'name' => "{$user->first_name} {$user->last_name}",
        'email' => $user->email,
        'course' => $user->courses,
        'year' => ($user->start_year && $user->end_year)
            ? "{$user->start_year}-{$user->end_year}"
            : ($user->end_year ?? 'N/A'),
        'avatar' => $user->profile_picture,
        'survey_status' => 'Not Completed',
        'employment_status' => $user->employment?->currently_employed === 'Yes' ? 'Employed' : 'Unemployed',
    ]);

    return Inertia::render('Coordinator/CoordinatorAlumni', [
        'alumni' => $alumni,
        'filters' => $request->only(['search', 'year', 'course', 'employment'])
    ]);
}

    public function show($id)
    {
        $user = User::with(['employment', 'employmentHistory' => function($query) {
            $query->orderBy('employment_start_year', 'desc');
        }])->findOrFail($id);

        return Inertia::render('Coordinator/CoordinatorViewProfile', [
            'user' => $user
        ]);
    }

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
                'coordinator'
            )
        );

        return back()->with(
            'success',
            'Email sent successfully to '.$user->first_name.' '.$user->last_name
        );
    }

    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject'   => 'required|string|max:255',
            'message'   => 'required|string',
            'user_ids'  => 'required|array',
            'user_ids.*'=> 'exists:users,id',

            // batching
            'offset'    => 'nullable|integer|min:0',
            'batch_size'=> 'nullable|integer|min:1|max:20',
        ]);

        $offset = $request->offset ?? 0;
        $batchSize = $request->batch_size ?? 10;

        $ids = $request->user_ids;

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
                        'coordinator'
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