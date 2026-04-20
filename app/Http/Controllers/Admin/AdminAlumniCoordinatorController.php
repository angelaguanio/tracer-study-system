<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminAlumniCoordinatorController extends Controller
{
    private function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->user_role !== 'admin') {
            abort(403);
        }
    }

    public function index()
    {
        $this->checkAdmin();

        return Inertia::render('Admin/AdminAlumniCoordinator', [
            'coordinators' => User::where('user_role', 'coordinator')
                ->latest()
                ->get(),
        ]);
    }

    public function show(User $alumni_coordinator)
    {
        $this->checkAdmin();

        if ($alumni_coordinator->user_role !== 'coordinator') {
            abort(403);
        }

        return Inertia::render('Admin/AdminAlumniCoordinatorView', [
            'coordinator' => $alumni_coordinator,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name'  => ['required', 'string'],
            'middle_name'=> ['nullable', 'string'],
            'email'      => ['required', 'email', 'unique:users,email'],
            'password'   => ['required', 'min:6'],
            'department' => ['required', 'string'],
            'courses'    => ['required', 'string'],
        ]);

        User::create([
            'first_name'  => $validated['first_name'],
            'last_name'   => $validated['last_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'department'  => $validated['department'],
            'courses'     => $validated['courses'],
            'user_role'   => 'coordinator',
        ]);

  
        return back();
    }

    public function update(Request $request, User $alumni_coordinator)
    {
        $this->checkAdmin();

        if ($alumni_coordinator->user_role !== 'coordinator') {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name'  => ['required', 'string'],
            'middle_name'=> ['nullable', 'string'],
            'email'      => [
                'required',
                'email',
                'unique:users,email,' . $alumni_coordinator->id
            ],
            'department' => ['required', 'string'],
            'courses'    => ['required', 'string'],
        ]);

        $alumni_coordinator->update([
            'first_name'  => $validated['first_name'],
            'last_name'   => $validated['last_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'email'       => $validated['email'],
            'department'  => $validated['department'],
            'courses'     => $validated['courses'],
        ]);

       
        return back();
    }

    public function destroy(User $alumni_coordinator)
    {
        $this->checkAdmin();

        if ($alumni_coordinator->user_role !== 'coordinator') {
            abort(403);
        }

        $alumni_coordinator->delete();

        return back();
    }
}