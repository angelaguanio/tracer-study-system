<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
    {
        // 1. Build the base query with database-level filtering
        $query = User::where('user_role', 'alumna')
            ->latest()
            ->when($request->search, function ($q, $search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->when($request->year && $request->year !== 'all', function ($q) use ($request) {
                $q->where('end_year', $request->year);
            })
            ->when($request->course && $request->course !== 'all', function ($q) use ($request) {
                $q->where('courses', $request->course);
            });

        // 2. Paginate with 10 items per page
        $alumni = $query->paginate(10)->withQueryString();

        // 3. Transform the data format for your frontend template
        $alumni->through(fn ($user) => [
            'id' => $user->id,
            'name' => "{$user->first_name} {$user->last_name}",
            'course' => $user->courses,
            'year' => $user->end_year, 
            'avatar' => $user->avatar_url,
            'survey_status' => 'Not Completed', 
        ]);

        return Inertia::render('Coordinator/CoordinatorAlumni', [
            'alumni' => $alumni,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }

    public function show($id)
    {
        $user = User::with(['employment', 'employmentHistory'])->findOrFail($id);

        return Inertia::render('Coordinator/CoordinatorViewProfile', [
            'user' => $user
        ]);
    }
}