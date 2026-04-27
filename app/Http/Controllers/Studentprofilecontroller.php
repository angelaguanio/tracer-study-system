<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\EmploymentHistory;
use App\Models\User;

class StudentProfileController extends Controller
{
    /**
     * Display the student profile with current employment and history.
     */
    public function show() {
        $user = Auth::user()->fresh()->load(['employment', 'employmentHistory' => function($query) {
            $query->latest(); 
        }]);
        
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => $user
        ]);
    }

    /**
     * Show the profile edit form.
     */
    public function edit() {
        $user = Auth::user()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

    /**
     * Update the profile and archive the *previous* state into history ONLY if employment changed.
     */
    public function update(Request $request) {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // --- PROFILE PICTURE LOGIC ---
        if ($request->hasFile('profile_picture')) {
            $picture = $request->file('profile_picture');
            if ($picture->isValid()) {
                if ($user->profile_picture) {
                    Storage::disk('public')->delete($user->profile_picture);
                }
                $path = $picture->store('avatars', 'public');
                $user->profile_picture = $path;
            }
        }

        // --- UPDATE PERSONAL INFO (USER MODEL) ---
        $user->fill([
            'first_name'     => $request->first_name,
            'middle_name'    => $request->middle_name ?? '',
            'last_name'      => $request->last_name,
            'contact_number' => $request->contact_number,
            'address'        => $request->address,
            'email'          => $request->email,
        ]);
        $user->save();

        // --- PREPARE NEW EMPLOYMENT DATA ---
        $salaryValue = $request->monthly_salary;
        if ($salaryValue !== null && $salaryValue !== '') {
            $salaryValue = preg_replace('/[^\d.]/', '', $salaryValue);
        }

        $isEmployed = (strtolower($request->is_employed) === 'yes') ? 'Yes' : 'No';
        $unemploymentReason = ($isEmployed === 'No') ? ($request->reason_unemployed ?? null) : null;

        // --- THE CRITICAL LOGIC: ARCHIVE ONLY IF EMPLOYMENT DATA CHANGED ---
        $oldEmp = $user->employment;

        if ($oldEmp) {
            $hasEmploymentChanged = (
                $oldEmp->currently_employed !== $isEmployed ||
                $oldEmp->company_name       !== $request->company ||
                $oldEmp->position           !== $request->position ||
                $oldEmp->employment_type    !== $request->employment_type ||
                $oldEmp->location           !== $request->location ||
                $oldEmp->monthly_salary     !=  $salaryValue || 
                $oldEmp->unemployment_reason !== $unemploymentReason
            );

            if ($hasEmploymentChanged) {
                $user->employmentHistory()->create([
                    'currently_employed' => $oldEmp->currently_employed,
                    'employment_type'    => $oldEmp->employment_type,
                    'company_name'       => $oldEmp->company_name,
                    'position'           => $oldEmp->position,
                    'location'           => $oldEmp->location,
                    'monthly_salary'     => $oldEmp->monthly_salary,
                    'unemployment_reason' => $oldEmp->unemployment_reason,
                    'created_at'         => $oldEmp->updated_at, 
                ]);
            }
        }

        // --- UPDATE CURRENT EMPLOYMENT RECORD ---
        $user->employment()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'currently_employed' => $isEmployed,
                'employment_type'    => $request->employment_type,
                'company_name'       => $request->company,
                'position'           => $request->position,
                'location'           => $request->location,
                'monthly_salary'     => $salaryValue,
                'unemployment_reason' => $unemploymentReason,
            ]
        );

        return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
    }

    /**
     * Show details of a specific history record.
     */
    public function showHistory($id) {
        $history = \App\Models\EmploymentHistory::findOrFail($id);
        
        if ($history->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Alumna/HistoryDetail', [
            'history' => $history,
            'profile' => Auth::user()
        ]);
    }
}