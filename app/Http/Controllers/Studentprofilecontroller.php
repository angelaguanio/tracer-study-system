<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\EmploymentHistory;

class StudentProfileController extends Controller
{
    // Para sa "View Profile" page
    public function show() 
    {
        $user = Auth::user()->load(['employment', 'employmentHistory' => function($query) {
            $query->latest(); 
        }]);
        
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => $user
        ]);
    }

    // Para sa "View History Details"
   public function showHistory($id)
{
  
    $history = \App\Models\EmploymentHistory::findOrFail($id);
    
  
    return Inertia::render('Alumna/HistoryDetails', [
        'history' => $history
    ]);
}

    // Para sa "Edit Profile" page
    public function edit() 
    {
        $user = Auth::user()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

    // "Save Changes" logic
    public function update(Request $request) 
    {
        $user = Auth::user();

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        try {
            DB::transaction(function () use ($request, $user) {
                if ($request->hasFile('profile_picture')) {
                    if ($user->profile_picture) {
                        Storage::disk('public')->delete($user->profile_picture);
                    }
                    $path = $request->file('profile_picture')->store('avatars', 'public');
                    $user->profile_picture = $path;
                }

                $user->update([
                    'first_name'     => $request->first_name,
                    'middle_name'    => $request->middle_name ?? null,
                    'last_name'      => $request->last_name,
                    'contact_number' => $request->contact_number,
                    'address'        => $request->address,
                    'email'          => $request->email,
                ]);

               $isEmployed = (strtolower($request->is_employed) === 'yes') ? 'Yes' : 'No';

// ... (existing update logic para sa main user profile)

$oldEmp = $user->employment;

// PAGBABAGO DITO:
// 1. Siguraduhin na ang status ay 'Yes' (Employed) bago mag-create sa history
// 2. I-check din kung may pagbabago (hasChanged)
if ($isEmployed === 'Yes' && $oldEmp) {
    
    $hasChanged = (
        $oldEmp->company_name !== $request->company ||
        $oldEmp->position !== $request->position
    );

    if ($hasChanged) {
        $user->employmentHistory()->create([
            'user_id'            => $user->id,
            'currently_employed' => 'Yes',
            'employment_type'    => $request->employment_type,
            'company_name'       => $request->company,
            'position'           => $request->position,
            'location'           => $request->location,
            'monthly_salary'     => $salaryValue,
            'unemployment_reason'=> null, // Explicitly null
        ]);
    }
}

                $user->employment()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'currently_employed'  => $isEmployed,
                        'employment_type'     => $isEmployed === 'Yes' ? $request->employment_type : null,
                        'company_name'        => $isEmployed === 'Yes' ? $request->company : null,
                        'position'            => $isEmployed === 'Yes' ? $request->position : null,
                        'location'            => $isEmployed === 'Yes' ? $request->location : null,
                        'monthly_salary'      => $isEmployed === 'Yes' ? $salaryValue : null,
                        'unemployment_reason' => $unemploymentReason,
                    ]
                );
            });

            return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
            
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Update failed: ' . $e->getMessage()]);
        }
    }
}