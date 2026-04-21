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
        $query = User::query()->where('user_role', 'alumna');

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
            'filters' => $request->only(['search', 'year', 'course']),
        ]);
    }

    public function show($id)
    {
        $user = User::with('employment')->findOrFail($id);

        return Inertia::render('Admin/AdminViewProfileOfRespondents', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'courses' => $user->courses,
                'year_graduated' => $user->year_graduated,
                'avatar' => $user->avatar,
                'address' => $user->address ?? 'N/A',
                'contact_number' => $user->contact_number ?? 'N/A',

                'employment' => $user->employment ? [
                    'currently_employed' => $user->employment->currently_employed,
                    'company_name' => $user->employment->company_name,
                    'position' => $user->employment->position,
                    'employment_type' => $user->employment->employment_type,
                    'location' => $user->employment->location,
                    'monthly_salary' => $user->employment->monthly_salary,
                    'unemployment_reason' => $user->employment->unemployment_reason,
                ] : null,
            ]
        ]);
    }

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

    public function sendEmail(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Mail::to($user->email)
            ->queue(new AlumniBroadcastEmail($request->subject, $request->message));

        return back()->with('success', 'Email queued successfully.');
    }

    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'send_all' => 'boolean',
            'user_ids' => 'required_if:send_all,false|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $userIds = $request->boolean('send_all') ? null : $request->user_ids;

        $count = $userIds
            ? count($userIds)
            : User::where('user_role', 'alumna')->count();

        SendAlumniBroadcastJob::dispatch(
            $request->subject,
            $request->message,
            $userIds
        );

        return back()->with(
            'success',
            "Bulk email queued for {$count} users."
        );
    }
}