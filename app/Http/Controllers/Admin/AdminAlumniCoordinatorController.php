<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminAlumniCoordinatorController extends Controller
{
    /**
     * CHECK ADMIN
     */
    private function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->user_role !== 'admin') {
            abort(403);
        }
    }

    /**
     * CHECK ONLY ROLE (NO STATUS BLOCKING)
     * Admin must be able to edit inactive users
     */
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

            'courses' => ['nullable', 'string'],

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
            'status'      => $validated['status'],
        ];

        // update password only if filled
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