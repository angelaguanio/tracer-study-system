<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('user_role', 'alumna')->get();

        $alumni = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar_url,
                'survey_status' => 'Not Completed', 
            ];
        });

        // Filters
        if ($request->search) {
            $search = strtolower($request->search);
            $alumni = $alumni->filter(fn ($a) => str_contains(strtolower($a['name'] ?? ''), $search));
        }
        if ($request->year && $request->year !== 'all') {
            $alumni = $alumni->where('year', $request->year);
        }
        if ($request->course && $request->course !== 'all') {
            $alumni = $alumni->where('course', $request->course);
        }

        $perPage = 6;
        $page = $request->get('page', 1);
        $paginated = new LengthAwarePaginator(
            $alumni->forPage($page, $perPage)->values(),
            $alumni->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => $request->query()]
        );

        return Inertia::render('Coordinator/CoordinatorAlumni', [
            'alumni' => $paginated,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }

    public function show($id)
    {
        // Ginagamit ang relationships mula sa User.php
        $user = User::with(['employment', 'employmentHistory'])->findOrFail($id);

        return Inertia::render('Coordinator/CoordinatorViewProfile', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'contact_number' => $user->contact_number,
                'address' => $user->address,
                'courses' => $user->courses,
                'year_graduated' => $user->year_graduated,
                'profile_picture' => $user->avatar_url,
                'initials' => $user->initials,
                'employment' => $user->employment,
                'employment_history' => $user->employmentHistory,
            ]
        ]);
    }
}