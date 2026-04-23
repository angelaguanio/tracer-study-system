<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AdminAlumniController extends Controller
{
    /**
     * LIST PAGE - Pagkuha ng listahan ng mga Alumna
     */
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'year'   => 'nullable|string|max:10',
            'course' => 'nullable|string|max:50',
        ]);

        $query = User::query()
            ->where('user_role', 'alumna');

        // Search Filter
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Year Filter
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        // Course Filter
        if ($request->filled('course') && $request->course !== 'all') {
            $query->whereRaw('TRIM(courses) = ?', [$request->course]);
        }

        $query->orderBy('last_name')->orderBy('first_name');

        $users = $query->paginate(6)->appends($request->query());

        // Pag-format ng data bago ipadala sa React
        $users->getCollection()->transform(function ($user) {
            return [
                'id'            => $user->id,
                'first_name'    => $user->first_name,
                'middle_name'   => $user->middle_name,
                'last_name'     => $user->last_name,
                'email'         => $user->email,
                'department'    => $user->department,
                'courses'       => trim($user->courses),
                'year_graduated'=> $user->year_graduated,
                'avatar'        => $user->avatar,
                'name'          => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
            ];
        });

        return Inertia::render('Admin/AdminAlumni', [
            'alumni' => $users,
            'filters' => $request->only(['search', 'year', 'course']),
        ]);
    }

    /**
     * SHOW - Kinukuha ang details ng isang coordinator
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/AdminAlumniCoordinatorView', [
            'coordinator' => [
                'id'            => $user->id,
                'first_name'    => $user->first_name,
                'middle_name'   => $user->middle_name,
                'last_name'     => $user->last_name,
                'email'         => $user->email,
                'department'    => $user->department,
                'courses'       => trim($user->courses),
            ]
        ]);
    }

    /**
     * STORE - Pag-save ng bagong coordinator
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'  => 'required|string|max:255',
            'last_name'   => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email'       => 'required|string|email|max:255|unique:users,email',
            'department'  => 'required|string',
            'courses'     => 'required|string',
            'password'    => ['required', Rules\Password::defaults()],
        ]);

        User::create([
            'first_name'  => $validated['first_name'],
            'last_name'   => $validated['last_name'],
            'middle_name' => $validated['middle_name'],
            'email'       => $validated['email'],
            'department'  => $validated['department'],
            'courses'     => trim($validated['courses']),
            'user_role'   => 'alumna',
            'password'    => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Coordinator created successfully.');
    }

    /**
     * UPDATE - Pag-update ng existing coordinator details
     */
    public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'first_name'  => 'required|string|max:255',
        'last_name'   => 'required|string|max:255',
        'middle_name' => 'nullable|string|max:255',
        'email'       => 'required|string|email|max:255|unique:users,email,' . $user->id,
        'department'  => 'required|string',
        'courses'     => 'required|string',
        'password'    => ['nullable', Rules\Password::defaults()],
    ]);

    $user->update([
        'first_name'  => $validated['first_name'],
        'last_name'   => $validated['last_name'],
        'middle_name' => $validated['middle_name'],
        'email'       => $validated['email'],
        'department'  => $validated['department'],
        'courses'     => trim($validated['courses']),
    ]);

    if (!empty($validated['password'])) {
        $user->update([
            'password' => Hash::make($validated['password'])
        ]);
    }

    return redirect()->back()->with('success', 'Coordinator updated successfully.');
}
    
    /**
     * DESTROY - Pag-delete ng coordinator
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Coordinator deleted successfully.');
    }
}