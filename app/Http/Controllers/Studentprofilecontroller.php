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
     * Update the profile and archive a copy into employment history ONLY if data changed.
     */
    public function update(Request $request) {
        /** @var \App\Models\User $user */
        $user = Auth::user();

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

        $user->fill([
            'first_name'     => $request->first_name,
            'middle_name'    => $request->middle_name ?? '',
            'last_name'      => $request->last_name,
            'contact_number' => $request->contact_number,
            'address'        => $request->address,
            'email'          => $request->email,
        ]);
        $user->save();

        $salaryValue = $request->monthly_salary;
        if ($salaryValue !== null && $salaryValue !== '') {
            $salaryValue = preg_replace('/[^\d.]/', '', $salaryValue);
        }

        $isEmployed = (strtolower($request->is_employed) === 'yes') ? 'Yes' : 'No';
        $unemploymentReason = ($isEmployed === 'No') ? ($request->reason_unemployed ?? null) : null;

        $currentEmp = $user->employment;
        $hasEmploymentChanges = true;

        if ($currentEmp) {
            $hasEmploymentChanges = 
                $currentEmp->currently_employed !== $isEmployed ||
                $currentEmp->employment_type    !== $request->employment_type ||
                $currentEmp->company_name       !== $request->company ||
                $currentEmp->position           !== $request->position ||
                $currentEmp->location           !== $request->location ||
                $currentEmp->monthly_salary     !=  $salaryValue || 
                $currentEmp->unemployment_reason !== $unemploymentReason;
        }

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

        if ($hasEmploymentChanges) {
            $user->employmentHistory()->create([
                'currently_employed' => $isEmployed,
                'employment_type'    => $request->employment_type,
                'company_name'       => $request->company,
                'position'           => $request->position,
                'location'           => $request->location,
                'monthly_salary'     => $salaryValue,
                'unemployment_reason' => $unemploymentReason,
            ]);
        }

        return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
    }

    /**
     * Show details of a specific history record.
     */
    public function showHistory($id) {
        $history = EmploymentHistory::findOrFail($id);
        
        if ($history->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Alumna/HistoryDetail', [
            'history' => $history,
            'profile' => Auth::user()
        ]);
    }
}