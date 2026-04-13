<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AdminAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->where('user_role', 'alumna');

        // ✅ SEARCH (database level)
        if ($request->search) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search) {
                $q->whereRaw("LOWER(first_name) LIKE ?", ["%$search%"])
                  ->orWhereRaw("LOWER(last_name) LIKE ?", ["%$search%"]);
            });
        }

        // ✅ YEAR FILTER
        if ($request->year && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        // ✅ COURSE FILTER
        if ($request->course && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // ✅ PAGINATION (IMPORTANT FIX)
        $users = $query->paginate(5)->withQueryString();

        // ✅ FORMAT DATA AFTER PAGINATION
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'course' => $user->courses,
                'year' => $user->year_graduated,
                'avatar' => $user->avatar ?? null,
            ];
        });

        return Inertia::render('Admin/AdminAlumni', [
            'alumni' => $users,
            'filters' => $request->only(['search', 'year', 'course'])
        ]);
    }
}