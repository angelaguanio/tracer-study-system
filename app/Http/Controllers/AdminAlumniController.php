<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminAlumniController extends Controller
{
    public function index(Request $request)
    {
        //GET USERS NA ALUMNI
        $users = User::where('user_role', 'alumna')->get();

        $alumni = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar ?? null,
            ];
        });

        //SEARCH FILTER
        if ($request->search) {
            $alumni = $alumni->filter(fn ($a) =>
                str_contains(strtolower($a['name']), strtolower($request->search))
            );
        }

        //YEAR FILTER
        if ($request->year && $request->year !== 'all') {
            $alumni = $alumni->where('year', $request->year);
        }

        //COURSE FILTER
        if ($request->course && $request->course !== 'all') {
            $alumni = $alumni->where('course', $request->course);
        }

        //PAGINATION
        $perPage = 5;
        $page = $request->get('page', 1);

        $paginated = new LengthAwarePaginator(
            $alumni->forPage($page, $perPage)->values(),
            $alumni->count(),
            $perPage,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render('Admin/AdminAlumni', [
            'alumni' => $paginated,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }
}