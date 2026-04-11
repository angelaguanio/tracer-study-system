<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Response;
use Illuminate\Pagination\LengthAwarePaginator;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
    {
        // 🔥 GET ALL RESPONSES WITH USER
        $responses = Response::with('user')->get()->groupBy('user_id');

        $alumni = collect();

        foreach ($responses as $userId => $userResponses) {
            $user = $userResponses->first()->user;

            // ⚠️ PALITAN mo question_id depende sa DB mo
            $course = optional($userResponses->where('question_id', 2)->first())->answer_value;
            $year = optional($userResponses->where('question_id', 3)->first())->answer_value;

            // ✅ skip kung walang year (not alumni)
            if (!$year) continue;

            $alumni->push([
                'id' => $user->id,
                'name' => $user->name,
                'course' => $course,
                'year' => $year,
                'avatar' => $user->avatar ?? null,
            ]);
        }

        // 🔍 SEARCH FILTER
        if ($request->search) {
            $alumni = $alumni->filter(fn ($a) =>
                str_contains(strtolower($a['name']), strtolower($request->search))
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
                'query' => request()->query(),
            ]
        );

        return Inertia::render('Coordinator/CoordinatorAlumni', [
            'alumni' => $paginated,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }
}