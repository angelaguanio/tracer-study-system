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
        // FIX: Tinanggal muna ang ->with(['surveyResponses']) para iwas SQL error
        // dahil wala pang table sa database.
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

        // 🔍 SEARCH FILTER
        if ($request->search) {
            $search = strtolower($request->search);
            $alumni = $alumni->filter(fn ($a) =>
                str_contains(strtolower($a['name'] ?? ''), $search)
            );
        }

        // 🎓 YEAR FILTER
        if ($request->year && $request->year !== 'all') {
            $alumni = $alumni->where('year', $request->year);
        }

        // 📘 COURSE FILTER
        if ($request->course && $request->course !== 'all') {
            $alumni = $alumni->where('course', $request->course);
        }

        // 🔥 PAGINATION
        $perPage = 5;
        $page = $request->get('page', 1);

        $paginated = new LengthAwarePaginator(
            $alumni->forPage($page, $perPage)->values(),
            $alumni->count(),
            $perPage,
            $page,
            [
                'path' => request()->url(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('Coordinator/CoordinatorAlumni', [
            'alumni' => $paginated,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }
}