<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema; 
use App\Models\EmploymentHistory;

class StudentProfileController extends Controller
{
    public function edit() {
        $user = Auth::user()->fresh()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

    public function show() {
        $user = Auth::user()->fresh()->load(['employment']);
        
        $history = EmploymentHistory::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->start_year = $item->employment_start_year ?? $item->start_year ?? $item->year_started ?? null;
                $item->end_year = $item->employment_end_year ?? $item->end_year ?? $item->year_ended ?? null;
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

    public function update(Request $request) {
        $user = Auth::user();

        // 1. Profile Picture Processing
        if ($request->hasFile('profile_picture')) {
            $picture = $request->file('profile_picture');
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $user->profile_picture = $picture->store('avatars', 'public');
        }

        // 2. Update Personal Information
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

        // 3. Archive Engine
        $oldEmployment = $user->employment;
        if ($oldEmployment && $oldEmployment->currently_employed === 'Yes' && $request->is_employed === 'no' && !empty($request->employment_end_year)) {
            
            $databaseColumns = Schema::getColumnListing('employment_history');
            $historyPayload = [
                'currently_employed'  => 'Yes', 
                'employment_type'     => $oldEmployment->employment_type,
                'company_name'        => $oldEmployment->company_name ?? '—',
                'position'            => $oldEmployment->position ?? '—',
                'location'            => $oldEmployment->location,
                'monthly_salary'      => $oldEmployment->monthly_salary,
                'unemployment_reason' => 'Job Transition',
                'created_at'          => now(),
            ];

            if (in_array('employment_start_year', $databaseColumns)) $historyPayload['employment_start_year'] = $oldEmployment->employment_start_year;
            if (in_array('employment_end_year', $databaseColumns)) $historyPayload['employment_end_year'] = $request->employment_end_year;

            $user->employmentHistory()->create($historyPayload);
        }

        // 4. Update Current Employment Status
        $isCurrentlyEmployed = (strtolower($request->is_employed) === 'yes') ? 'Yes' : 'No';
        $salaryValue = preg_replace('/[^\d.]/', '', $request->monthly_salary ?? 0);

        $user->employment()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'currently_employed'    => $isCurrentlyEmployed,
                'employment_type'       => $isCurrentlyEmployed === 'Yes' ? $request->employment_type : null,
                'company_name'          => $isCurrentlyEmployed === 'Yes' ? $request->company : null,
                'position'              => $isCurrentlyEmployed === 'Yes' ? $request->position : null,
                'location'              => $isCurrentlyEmployed === 'Yes' ? $request->location : null,
                'monthly_salary'        => $isCurrentlyEmployed === 'Yes' ? $salaryValue : 0.00,
                'unemployment_reason'   => $isCurrentlyEmployed === 'No' ? $request->reason_unemployed : null,
                'employment_start_year' => $isCurrentlyEmployed === 'Yes' ? $request->employment_start_year : null,
                'employment_end_year'   => null,
            ]
        );

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}