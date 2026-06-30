<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

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

    $alumni = $query->paginate(10)->withQueryString();
    
    $alumni->through(fn ($user) => [
        'id' => $user->id,
        'name' => "{$user->first_name} {$user->last_name}",
        'course' => $user->courses,
        'year' => ($user->start_year && $user->end_year)
                       ? "{$user->start_year}-{$user->end_year}"
                       : ($user->end_year ?? 'N/A'),
        'avatar' => $user->profile_picture,
        'survey_status' => 'Not Completed', 
    ]);

    return Inertia::render('Coordinator/CoordinatorAlumni', [
        'alumni' => $alumni,
        'filters' => $request->only(['search', 'year', 'course'])
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
}