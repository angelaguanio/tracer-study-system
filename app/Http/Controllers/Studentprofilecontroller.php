<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema; 
use App\Models\EmploymentHistory;
use App\Models\User;

class StudentProfileController extends Controller
{
    public function show() {
        $user = Auth::user()->fresh()->load(['employment']);
        
        // Dynamic payload mapping to guarantee the frontend React table receives start_year and end_year properties
        $history = EmploymentHistory::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->start_year = $item->employment_start_year ?? $item->start_year ?? $item->year_started ?? null;
                $item->end_year = $item->employment_end_year ?? $item->end_year ?? $item->year_ended ?? null;
                $item->return_item = $item; // Fallback mapping containment layer
                return $item;
            });
            
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => array_merge($user->toArray(), [
                'employment_history' => $history
            ]),
            'flash' => [
                'success' => session('success')
            ]
        ]);
    }

    public function edit() {
        $user = Auth::user()->fresh()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

    public function update(Request $request) {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // --- PROFILE PICTURE PROCESSING ---
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

        // --- UPDATE PERSONAL INFORMATION & EDUCATION ---
        $user->fill([
            'first_name'     => $request->first_name,
            'middle_name'    => $request->middle_name ?? '',
            'last_name'      => $request->last_name,
            'contact_number' => $request->contact_number,
            'address'        => $request->address,
            'email'          => $request->email,
            
            'courses'        => $request->courses ?? $request->course,
            'end_year'       => $request->end_year ?? $request->year_graduated,
            'semester'       => $request->semester ?? $request->semester_graduated,
        ]);
        $user->save();

        // --- EMPLOYMENT DATA PREPARATION ---
        $oldEmployment = $user->employment;
        $isCurrentlyEmployed = (strtolower($request->is_employed) === 'yes' || strtolower($request->currently_employed) === 'yes') ? 'Yes' : 'No';
        
        $salaryValue = $request->monthly_salary;
        if ($isCurrentlyEmployed === 'Yes' && $salaryValue !== null && $salaryValue !== '') {
            $salaryValue = preg_replace('/[^\d.]/', '', $salaryValue);
        } else {
            $salaryValue = 0.00;
        }

        // --- ARCHIVE ENGINE: Triggered only when transitioning from an active job by providing an End Year ---
        if ($oldEmployment && $oldEmployment->currently_employed === 'Yes' && !empty($request->employment_end_year)) {
            
            // Read actual physical table columns dynamically at runtime to completely prevent SQL 1054 exceptions
            $databaseColumns = Schema::getColumnListing('employment_history');
            
            $historyPayload = [
                'currently_employed'  => 'Yes', 
                'employment_type'     => $oldEmployment->employment_type,
                'company_name'        => $oldEmployment->company_name ?? '—',
                'position'            => $oldEmployment->position ?? '—',
                'location'            => $oldEmployment->location,
                'monthly_salary'      => $oldEmployment->monthly_salary,
                'unemployment_reason' => 'Job Transition / Relocation',
                'created_at'          => $oldEmployment->updated_at, 
            ];

            // Inspect and auto-assign whichever Start Year variation exists in your database table schema
            if (in_array('employment_start_year', $databaseColumns)) {
                $historyPayload['employment_start_year'] = $oldEmployment->employment_start_year;
            } elseif (in_array('start_year', $databaseColumns)) {
                $historyPayload['start_year'] = $oldEmployment->employment_start_year;
            } elseif (in_array('year_started', $databaseColumns)) {
                $historyPayload['year_started'] = $oldEmployment->employment_start_year;
            }

            // Inspect and auto-assign whichever End Year variation exists in your database table schema
            if (in_array('employment_end_year', $databaseColumns)) {
                $historyPayload['employment_end_year'] = $request->employment_end_year;
            } elseif (in_array('end_year', $databaseColumns)) {
                $historyPayload['end_year'] = $request->employment_end_year;
            } elseif (in_array('year_ended', $databaseColumns)) {
                $historyPayload['year_ended'] = $request->employment_end_year;
            }

            // 1. Safely store the historical job entry without mapping structural mismatches
            $user->employmentHistory()->create($historyPayload);

            // 2. Flush operational variables in the active placeholder profile to receive the next career record
            $user->employment()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'currently_employed'    => 'No',
                    'employment_type'       => null,
                    'company_name'          => null,
                    'position'              => null,
                    'location'              => null,
                    'monthly_salary'        => 0.00,
                    'unemployment_reason'   => 'Job Hunting', 
                    'employment_start_year' => 0,
                    'employment_end_year'   => null,
                ]
            );

            return redirect()->to('/alumna/profile')->with('success', 'Your previous job has been successfully archived. You can now add your new employment details!');
        }

        // --- STANDARD PROFILE UPDATE FLOW ---
        $user->employment()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'currently_employed'    => $isCurrentlyEmployed,
                'employment_type'       => $isCurrentlyEmployed === 'Yes' ? $request->employment_type : null,
                'company_name'          => $isCurrentlyEmployed === 'Yes' ? ($request->company ?? $request->company_name) : null,
                'position'              => $isCurrentlyEmployed === 'Yes' ? $request->position : null,
                'location'              => $isCurrentlyEmployed === 'Yes' ? $request->location : null,
                'monthly_salary'        => $salaryValue,
                'unemployment_reason'   => ($isCurrentlyEmployed === 'No') ? ($request->reason_unemployed ?? 'Career Break') : null,
                'employment_start_year' => $isCurrentlyEmployed === 'Yes' ? ($request->employment_start_year ?? 0) : 0,
                'employment_end_year'   => null,
            ]
        );

        return redirect()->to('/alumna/profile')->with('success', 'Profile updated successfully!');
    }

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