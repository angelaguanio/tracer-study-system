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
    public function show() {
        $user = Auth::user()->fresh()->load(['employment', 'employmentHistory' => function($query) {
            $query->latest(); 
        }]);
        
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => $user
        ]);
    }

    public function edit() {
        $user = Auth::user()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

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

        // --- UPDATE PERSONAL INFO & EXACT EDUCATION LAYERS ---
        $user->fill([
            'first_name'     => $request->first_name,
            'middle_name'    => $request->middle_name ?? '',
            'last_name'      => $request->last_name,
            'contact_number' => $request->contact_number,
            'address'        => $request->address,
            'email'          => $request->email,
            
            // FIXED: Using the exact schema column names from your User Model
            'courses'        => $request->courses ?? $request->course,
            'end_year'       => $request->end_year ?? $request->year_graduated,
            'semester'       => $request->semester ?? $request->semester_graduated,
        ]);
        $user->save();

        // --- EMPLOYMENT DATA PREPARATION ---
        $isEmployed = (strtolower($request->is_employed) === 'yes' || strtolower($request->currently_employed) === 'yes') ? 'Yes' : 'No';
        
        $salaryValue = $request->monthly_salary;
        if ($isEmployed === 'Yes' && $salaryValue !== null && $salaryValue !== '') {
            $salaryValue = preg_replace('/[^\d.]/', '', $salaryValue);
        } else {
            $salaryValue = 0.00; // Safe fallback for Unemployed status
        }

        $unemploymentReason = ($isEmployed === 'No') ? ($request->reason_unemployed ?? $request->unemployment_reason ?? 'Career Break') : null;

        // --- ARCHIVE OLD DATA IF CHANGED ---
        $oldEmp = $user->employment;
        if ($oldEmp) {
            $hasEmploymentChanged = (
                $oldEmp->currently_employed  !== $isEmployed ||
                $oldEmp->company_name        !== $request->company ||
                $oldEmp->position            !== $request->position ||
                $oldEmp->employment_type     !== $request->employment_type ||
                $oldEmp->location            !== $request->location ||
                $oldEmp->monthly_salary      !=  $salaryValue || 
                $oldEmp->unemployment_reason !== $unemploymentReason
            );

            // 🔥 FIXED LOGIC: Only archive if changes happened AND the old status was actively employed ('Yes')
            if ($hasEmploymentChanged && $oldEmp->currently_employed === 'Yes') {
                $user->employmentHistory()->create([
                    'currently_employed'  => $oldEmp->currently_employed,
                    'employment_type'     => $oldEmp->employment_type,
                    'company_name'        => $oldEmp->company_name,
                    'position'            => $oldEmp->position,
                    'location'            => $oldEmp->location,
                    'monthly_salary'      => $oldEmp->monthly_salary,
                    'unemployment_reason' => $oldEmp->unemployment_reason,
                    'created_at'          => $oldEmp->updated_at, 
                ]);
            }
        }

        // --- UPDATE CURRENT RECORD WITH NULLABLE FALLBACKS ---
        $user->employment()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'currently_employed'    => $isEmployed,
                'employment_type'       => $isEmployed === 'Yes' ? $request->employment_type : null,
                'company_name'          => $isEmployed === 'Yes' ? ($request->company ?? $request->company_name) : null,
                'position'              => $isEmployed === 'Yes' ? $request->position : null,
                'location'              => $isEmployed === 'Yes' ? $request->location : null,
                'monthly_salary'        => $salaryValue,
                'unemployment_reason'   => $unemploymentReason,
                
                // CRITICAL SQL FIX: Forces 0 instead of null if Unemployed to pass data integrity validation checks
                'employment_start_year' => $isEmployed === 'Yes' ? ($request->employment_start_year ?? 0) : 0,
                'employment_end_year'   => null,
            ]
        );

        return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
    }

    public function showHistory($id) {
        $history = \App\Models\EmploymentHistory::findOrFail($id);
        if ($history->user_id !== Auth::id()) { abort(403); }

        return Inertia::render('Alumna/HistoryDetail', [
            'history' => $history,
            'profile' => Auth::user()
        ]);
    }
}