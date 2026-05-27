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

    private function checkCoordinator(User $user)
    {
        if ($user->user_role !== 'coordinator') {
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
        $this->checkCoordinator($alumni_coordinator);

        return Inertia::render('Admin/AdminAlumniCoordinatorView', [
            'coordinator' => $alumni_coordinator,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'first_name'  => ['required', 'string'],
            'last_name'   => ['required', 'string'],
            'middle_name' => ['nullable', 'string'],

            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:6'],

            'department' => ['required', 'string'],
            'courses'    => ['nullable', 'string'],

            // FIXED
            'start_year' => ['required', 'numeric'],
            'end_year'   => ['required', 'numeric'],

            'status' => ['required', 'in:active,inactive'],
        ]);

        User::create([
            'first_name'  => $validated['first_name'],
            'last_name'   => $validated['last_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),

            'department'  => $validated['department'],
            'courses'     => $validated['courses'] ?? null,

            'start_year'  => (int) $validated['start_year'],
            'end_year'    => (int) $validated['end_year'],

            'status'      => $validated['status'],
            'user_role'   => 'coordinator',
        ]);

        return back();
    }

    public function update(Request $request, User $alumni_coordinator)
    {
        $this->checkAdmin();
        $this->checkCoordinator($alumni_coordinator);

        $validated = $request->validate([
            'first_name'  => ['required', 'string'],
            'last_name'   => ['required', 'string'],
            'middle_name' => ['nullable', 'string'],

            'email' => [
                'required',
                'email',
                'unique:users,email,' . $alumni_coordinator->id,
            ],

            'department' => ['required', 'string'],
            'courses'    => ['nullable', 'string'],

            // FIXED
            'start_year' => ['nullable', 'numeric'],
            'end_year'   => ['nullable', 'numeric'],

            'status'     => ['required', 'in:active,inactive'],
            'password'   => ['nullable', 'min:6'],
        ]);

        $updateData = [
            'first_name'  => $validated['first_name'],
            'last_name'   => $validated['last_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'email'       => $validated['email'],

            'department'  => $validated['department'],
            'courses'     => $validated['courses'] ?? $alumni_coordinator->courses,

            // SAFE UPDATE
            'start_year'  => isset($validated['start_year'])
                ? (int) $validated['start_year']
                : $alumni_coordinator->start_year,

            'end_year'    => isset($validated['end_year'])
                ? (int) $validated['end_year']
                : $alumni_coordinator->end_year,

            'status'      => $validated['status'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $alumni_coordinator->update($updateData);

        return back();
    }

    public function destroy(User $alumni_coordinator)
    {
        $this->checkAdmin();
        $this->checkCoordinator($alumni_coordinator);

        $alumni_coordinator->delete();

        return back();
    }
}