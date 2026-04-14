<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use Inertia\Inertia;
 
class StudentProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
 
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => [
                'name'           => $user->first_name . ' ' . $user->last_name,
                'first_name'     => $user->first_name,
                'last_name'      => $user->last_name,
                'middle_name'    => $user->middle_name,
                'email'          => $user->email,
                'username'       => $user->username ?? '',       // ✅ added
                'address'        => $user->address ?? '',        // ✅ added
                'contact_number' => $user->contact_number ?? '', // ✅ added
                'initials'       => $user->initials,
            ],
        ]);
    }
 
    public function edit(Request $request)
    {
        $user = $request->user();
 
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => [
                'first_name'     => $user->first_name,
                'last_name'      => $user->last_name,
                'middle_name'    => $user->middle_name,
                'email'          => $user->email,
                'username'       => $user->username ?? '',
                'address'        => $user->address ?? '',
                'contact_number' => $user->contact_number ?? '',
                'initials'       => $user->initials,
            ],
        ]);
    }
 
    public function update(Request $request)
    {
        $user = $request->user();
 
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_name'    => 'nullable|string|max:255',
            'email'          => 'required|email|unique:users,email,' . $user->id,
            'username'       => 'nullable|string|max:255',
            'address'        => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'is_employed'    => 'nullable|string',
            'employment_type'=> 'nullable|string|max:100',
            'company'        => 'nullable|string|max:255',
            'position'       => 'nullable|string|max:255',
            'location'       => 'nullable|string|max:255',
            'monthly_salary' => 'nullable|string|max:100',
        ]);
 
        $user->update([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'middle_name'    => $validated['middle_name'] ?? null,
            'email'          => $validated['email'],
            'username'       => $validated['username'] ?? null,
            'address'        => $validated['address'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
        ]);
 
        return redirect()->route('alumna.profile')
            ->with('success', 'Profile updated successfully!');
    }
}