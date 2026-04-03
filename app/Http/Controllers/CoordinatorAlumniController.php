<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CoordinatorAlumni;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
{
    $query = CoordinatorAlumni::query();

    if ($request->search) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    if ($request->year && $request->year !== 'all') {
        $query->where('year', $request->year);
    }

    if ($request->course && $request->course !== 'all') {
        $query->where('course', $request->course);
    }

    $alumni = $query->paginate(5)->withQueryString();

    return Inertia::render('Coordinator/CoordinatorAlumni', [
        'alumni' => $alumni,
        'filters' => $request->only(['search', 'year', 'course'])
    ]);
}
}