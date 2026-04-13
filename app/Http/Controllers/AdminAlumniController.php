<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AdminAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('user_role', 'alumna');

        // ✅ SEARCH
        if ($request->filled('search')) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search) {
                $q->whereRaw("LOWER(first_name) LIKE ?", ["%{$search}%"])
                  ->orWhereRaw("LOWER(last_name) LIKE ?", ["%{$search}%"]);
            });
        }

        // ✅ YEAR FILTER
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        // ✅ COURSE FILTER
        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // ✅ PAGINATION FIX - APPENDS CURRENT QUERY PARAMETERS TO PAGINATION LINKS
        $users = $query
            ->paginate(5)
            ->appends($request->query()); //THIS FIXES PAGE RESET ISSUE

        // ✅ FORMAT PAGINATED DATA
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar,
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
}