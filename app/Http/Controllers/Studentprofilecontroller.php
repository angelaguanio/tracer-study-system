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
        $user = User::with(['address', 'employment', 'employmentHistory' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($userId);
        
        return Inertia::render('Alumna/StudentProfile', [
            'profile' => $user
        ]);
    }

    public function showHistory($id)
    {
        $history = EmploymentHistory::with(['user.address'])->findOrFail($id);
        return Inertia::render('Alumna/HistoryDetail', [
            'history' => $history,
            'profile' => $history->user
        ]);
    }

    public function edit() 
    {
        $user = Auth::user()->load(['address', 'employment']);
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
            'middle_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $val = trim($value);
                    if ($val === '*') return;
                    if (strlen($val) === 1 || preg_match('/^[A-Z]{2}$/', $val) || str_ends_with($val, '.')) {
                        $fail('Please enter your full middle name, not just an initial. Enter * if you do not have a middle name.');
                    }
                }
            ],
            'suffix'         => 'nullable|string|max:10',
            'country'        => 'nullable|string|max:255',
            'street_address' => 'nullable|string|max:255',
            'subdivision'    => 'nullable|string|max:255',
            'region'         => 'nullable|string|max:255',
            'province'       => 'nullable|string|max:255',
            'city'           => 'nullable|string|max:255',
            'barangay'       => 'nullable|string|max:255',
            'address'        => 'nullable|string|max:500',
            'contact_number' => 'required|string|max:20',
            'email'          => 'required|email|max:255|unique:users,email,' . $user->id,
            'profile_picture'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            'is_employed'    => 'required|in:yes,no',

            'company'                => 'required_if:is_employed,yes|string|max:255',
            'employment_type'        => 'required_if:is_employed,yes|string|max:255',
            'position'                => 'required_if:is_employed,yes|string|max:255',
            'employment_duration'     => 'required_if:is_employed,yes|string|max:255',
            'location'                => 'required_if:is_employed,yes|string|max:255',
            'monthly_salary'          => 'nullable|numeric|min:0',

            'reason_unemployed' => 'required_if:is_employed,no|string|max:255',
        ]);

        // 1. Define variables clearly before usage to prevent crashes
        $isEmployed = (strtolower($request->is_employed ?? '') === 'yes') ? 'Yes' : 'No';
        $salaryValue = $request->monthly_salary ?? null;
        $unemploymentReason = ($isEmployed === 'No') ? $request->reason_unemployed : null;
        $isPresent = $request->boolean('is_present');

        $fullAddress = \App\Models\Address::formatFullAddress($request->all());
        if (empty($fullAddress)) {
            $fullAddress = $request->address;
        }

        try {
            DB::transaction(function () use ($request, $user, $isEmployed, $salaryValue, $unemploymentReason, $isPresent, $fullAddress) {
                
                // Handle File Upload
                if ($request->hasFile('profile_picture')) {

                    // Delete old profile picture
                    if ($user->profile_picture) {
                        $oldFile = public_path(ltrim($user->profile_picture, '/'));
                
                        if (file_exists($oldFile)) {
                            unlink($oldFile);
                        }
                    }
                
                    $baseFilename = uniqid() . '_' . time();
                    $filename = \App\Helpers\ImageHelper::convertAndSaveToWebp(
                        $request->file('profile_picture'),
                        'uploads/profile-pictures',
                        $baseFilename
                    );
                
                    $user->profile_picture = '/uploads/profile-pictures/' . $filename;
                }

                // Update User Basic Info
                $user->update([
                    'first_name'     => $request->first_name,
                    'middle_name'    => $request->middle_name,
                    'suffix'         => $request->suffix ?? null,
                    'last_name'      => $request->last_name,
                    'contact_number' => $request->contact_number,
                    'address'        => $fullAddress,
                    'email'          => $request->email,
                    'profile_picture' => $user->profile_picture,
                ]);

                // Update or Create Address Record
                \App\Models\Address::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'country'        => $request->country ?? 'Philippines',
                        'street_address' => $request->street_address ?? null,
                        'subdivision'    => $request->subdivision ?? null,
                        'region'         => $request->region ?? null,
                        'province'       => $request->province ?? null,
                        'city'           => $request->city ?? null,
                        'barangay'       => $request->barangay ?? null,
                        'full_address'   => $fullAddress,
                    ]
                );

                $oldEmp = $user->employment;

                // Create History Entry if status is Yes and details changed
                if ($isEmployed === 'Yes' && $oldEmp) {
                    $hasChanged = (
                       $oldEmp->company_name !== $request->company ||
                       $oldEmp->employment_duration !== $request->employment_duration
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
                            'employment_duration' => ($isEmployed === 'Yes') ? $request->employment_duration : null,
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
                        'employment_duration'  => $isEmployed === 'Yes' ? $request->employment_duration : null,
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