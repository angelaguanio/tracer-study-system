<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminAlumniCoordinatorController extends Controller
{
    // CHECK ADMIN
    private function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->user_role !== 'admin') {
            abort(403);
        }
    }

    // INDEX
    public function index()
    {
        $this->checkAdmin();

        return Inertia::render('Admin/AdminAlumniCoordinator', [
            'coordinators' => User::where('user_role', 'coordinator')->get()
        ]);
    }

    // SHOW (VIEW SINGLE COORDINATOR)
    public function show(User $alumni_coordinator)
    {
        $this->checkAdmin();

        if ($alumni_coordinator->user_role !== 'coordinator') {
            abort(403);
        }

        return Inertia::render('Admin/AdminAlumniCoordinatorView', [
            'coordinator' => $alumni_coordinator
        ]);
    }

    // STORE
    public function store(Request $request)
    {
        $this->checkAdmin();

        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:6',
            'department' => 'nullable'
        ]);

        User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'middle_name'=> $request->middle_name,
            'email'      => $request->email,
            'department' => $request->department,
            'password'   => Hash::make($request->password),
            'user_role'  => 'coordinator',
        ]);

        return back();
    }

    // UPDATE
    public function update(Request $request, User $alumni_coordinator)
    {
        $this->checkAdmin();

        if ($alumni_coordinator->user_role !== 'coordinator') {
            abort(403);
        }

        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users,email,' . $alumni_coordinator->id,
            'department' => 'nullable'
        ]);

        $alumni_coordinator->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'middle_name'=> $request->middle_name,
            'email'      => $request->email,
            'department' => $request->department,
        ]);

        return back();
    }

    // DELETE
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