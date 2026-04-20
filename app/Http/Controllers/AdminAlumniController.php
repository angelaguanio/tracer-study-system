<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

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

    // SEND EMAIL
    public function sendEmail(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'subject' => 'required',
            'message' => 'required',
        ]);

        Mail::raw($request->message, function ($mail) use ($user, $request) {
            $mail->to($user->email)
                 ->subject($request->subject);
        });

        return back()->with('success', 'Email sent successfully!');
    }
}