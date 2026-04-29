<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function alumniIndex() {
        $coordinators = User::where('user_role', 'coordinator')
            ->select('id', 'first_name', 'last_name', 'department')
            ->get();

        // Get unique departments from coordinators
        $departments = $coordinators->pluck('department')->unique()->filter()->values();

        return Inertia::render('Alumna/ContactUs', [
            'userEmail' => Auth::user()->email,
            'userName' => Auth::user()->first_name. ' ' .Auth::user()->last_name,
            'coordinators' => $coordinators,
            'departments' => $departments
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'alumni_coord' => 'nullable|integer',
            'message' => 'required|string|min:10',
        ]);

        Contact::create([
            'user_id'        => Auth::id(),
            'recipient_type' => $request->department === 'admin' ? 'admin' : 'coordinator',
            'recipient_id'   => $request->department === 'admin' ? null : $request->alumni_coord,
            'department'     => $request->department === 'admin' ? null : $request->department,
            'title'          => $validated['title'],
            'message'        => $validated['message'],
            'status'         => 'pending',
        ]);

        return redirect()->back()->with('success', 'Message sent successfully!');
    }
}
