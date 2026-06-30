<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\EmploymentHistory;

class StudentProfileController extends Controller
{
    public function show($id = null) 
    {
        $userId = $id ?? auth()->id();
       $user = User::with(['employment', 'employmentHistory' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($userId);
        
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => $user
        ]);
    }

    public function showHistory($id)
    {
        $history = EmploymentHistory::with('user')->findOrFail($id);
        return Inertia::render('Alumna/HistoryDetail', [
            'history' => $history,
            'profile' => $history->user
        ]);
    }

    public function edit() 
    {
        $user = Auth::user()->load('employment');
        return Inertia::render('Alumna/StudentProfileEdit', [
            'profile' => $user
        ]);
    }

    public function update(Request $request) 
    {
        $user = Auth::user();

        $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_name'    => 'nullable|string|max:255',
            'address'        => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email'          => 'required|email|max:255|unique:users,email,' . $user->id,
            'profile_picture'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            'is_employed'    => 'required|in:yes,no',

            'company'                => 'required_if:is_employed,yes|string|max:255',
            'employment_type'        => 'required_if:is_employed,yes|string|max:255',
            'position'                => 'required_if:is_employed,yes|string|max:255',
            'employment_start_year'   => 'required_if:is_employed,yes|numeric',
            'employment_end_year'     => 'nullable',
            'location'                => 'required_if:is_employed,yes|string|max:255',
            'monthly_salary'          => 'nullable|numeric|min:0',

            'reason_unemployed' => 'required_if:is_employed,no|string|max:255',
        ]);

        // 1. Define variables clearly before usage to prevent crashes
        $isEmployed = (strtolower($request->is_employed ?? '') === 'yes') ? 'Yes' : 'No';
        $salaryValue = $request->monthly_salary ?? null;
        $unemploymentReason = ($isEmployed === 'No') ? $request->reason_unemployed : null;
        $isPresent = $request->boolean('is_present');

        try {
            DB::transaction(function () use ($request, $user, $isEmployed, $salaryValue, $unemploymentReason, $isPresent) {
                
                // Handle File Upload
                if ($request->hasFile('profile_picture')) {

                    // Delete old profile picture
                    if ($user->profile_picture) {
                        $oldFile = public_path(ltrim($user->profile_picture, '/'));
                
                        if (file_exists($oldFile)) {
                            unlink($oldFile);
                        }
                    }
                
                    $filename = uniqid() . '_' . time() . '.' .
                        $request->file('profile_picture')->getClientOriginalExtension();
                
                    $request->file('profile_picture')->move(
                        public_path('uploads/profile-pictures'),
                        $filename
                    );
                
                    $user->profile_picture = '/uploads/profile-pictures/' . $filename;
                }

                // Update User Basic Info
                $user->update([
                    'first_name'     => $request->first_name,
                    'middle_name'    => $request->middle_name ?? null,
                    'last_name'      => $request->last_name,
                    'contact_number' => $request->contact_number,
                    'address'        => $request->address,
                    'email'          => $request->email,
                    'profile_picture' => $user->profile_picture,
                ]);

                $oldEmp = $user->employment;

                // Create History Entry if status is Yes and details changed
                if ($isEmployed === 'Yes' && $oldEmp) {
                    $hasChanged = (
                       $oldEmp->company_name !== $request->company ||
                       $oldEmp->employment_start_year != $request->employment_start_year ||
                      ($isPresent ? $oldEmp->employment_end_year !== null : $oldEmp->employment_end_year != $request->employment_end_year)
                    );

                    if ($hasChanged) {
                        $user->employmentHistory()->create([
                            'user_id'            => $user->id,
                            'currently_employed' => $isEmployed,
                            'employment_type'    => $request->employment_type,
                            'company_name'       => $request->company,
                            'position'           => $request->position,
                            'location'           => $request->location,
                            'monthly_salary'     => $salaryValue,
                            'unemployment_reason'=> null,
                            'employment_start_year' => ($isEmployed === 'Yes') ? $request->employment_start_year : null,
                            'employment_end_year' => $isPresent ? null : $request->employment_end_year,
                            'is_present'           => $isPresent ? 1 : 0,
                        ]);
                    }
                }

                // Update Current Employment
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
                        'employment_start_year'=> $isEmployed === 'Yes' ? $request->employment_start_year : null,
                        'employment_end_year'  => $isEmployed === 'Yes' ? ($isPresent ? null : $request->employment_end_year) : null,
                        'is_present'           => ($isEmployed === 'Yes' && $isPresent) ? 1 : 0,
                    ]
                );
            });

            return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
            
        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage(), ['user_id' => $user->id]);
            return back()->withErrors(['error' => 'Something went wrong while updating your profile. Please try again.']);
        }
    }
}