<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumniBroadcastEmail;
use App\Jobs\SendAlumniBroadcastJob;

class AdminAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('user_role', 'alumna');

        if ($request->filled('search')) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search) {
                $q->whereRaw("LOWER(first_name) LIKE ?", ["%{$search}%"])
                  ->orWhereRaw("LOWER(last_name) LIKE ?", ["%{$search}%"]);
            });
        }

        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        $users = $query->paginate(6)->appends($request->query());

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar,
                'email' => $user->email,
            ];
        });

        return Inertia::render('Admin/AdminAlumni', [
            'alumni' => $users,
            'filters' => [
                'search' => $request->search,
                'year' => $request->year,
                'course' => $request->course,
            ],
        ]);
    }

    // SHOW PROFILE
    public function show($id)
    {
        $user = User::with('employment')->findOrFail($id);

        return Inertia::render('Admin/AdminViewProfileOfRespondents', [
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar,
                'address' => $user->address ?? 'N/A',
                'contact' => $user->contact_number ?? 'N/A',

                //  EMPLOYMENT FROM RELATIONSHIP
                'employment' => [
                    'status' => $user->employment
                        ? ($user->employment->currently_employed ? 'Employed' : 'Unemployed')
                        : 'No record',

                    'type' => $user->employment->employment_type ?? 'N/A',
                    'company' => $user->employment->company_name ?? 'N/A',
                    'position' => $user->employment->position ?? 'N/A',
                    'location' => $user->employment->location ?? 'N/A',
                    'salary' => $user->employment->monthly_salary ?? 'N/A',
                    'reason' => $user->employment->unemployment_reason ?? 'N/A',
                ],
            ]
        ]);
    }

    // EMAIL FORM
    public function emailForm($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/AdminSendEmail', [
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
            ]
        ]);
    }

    // SEND EMAIL (single alumna by route ID)
    public function sendEmail(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Mail::to($user->email)
            ->queue(new AlumniBroadcastEmail($request->subject, $request->message));

        return back()->with('success', "Email queued for {$user->first_name} {$user->last_name} ({$user->email}).");
    }

    // SEND BULK EMAIL (selected IDs or all alumni)
    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject'    => 'required|string|max:255',
            'message'    => 'required|string',
            'send_all'   => 'boolean',
            'user_ids'   => 'required_if:send_all,false|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $userIds = $request->boolean('send_all') ? null : $request->user_ids;

        // Count before dispatching so we can give a meaningful toast message
        $count = $userIds === null
            ? User::where('user_role', 'alumna')->count()
            : count($userIds);

        SendAlumniBroadcastJob::dispatch(
            $request->subject,
            $request->message,
            $userIds,
        );

        $target = $userIds === null ? 'all alumni' : "{$count} selected alumni";

        return back()->with('success', "✓ Bulk email queued for {$target}. Mailtrap will receive {$count} message(s) shortly.");
    }
}