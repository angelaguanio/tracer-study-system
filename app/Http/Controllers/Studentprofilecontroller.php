<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
        ]);

        // 1. Define variables clearly before usage to prevent crashes
        $isEmployed = (strtolower($request->is_employed) === 'yes') ? 'Yes' : 'No';
        $salaryValue = $request->monthly_salary ?? null;
        $unemploymentReason = ($isEmployed === 'No') ? $request->reason_unemployed : null;

        try {
            DB::transaction(function () use ($request, $user, $isEmployed, $salaryValue, $unemploymentReason) {
                
                // Handle File Upload
                if ($request->hasFile('profile_picture')) {
                    if ($user->profile_picture) {
                        Storage::disk('public')->delete($user->profile_picture);
                    }
                    $path = $request->file('profile_picture')->store('avatars', 'public');
                    $user->profile_picture = $path;
                }

                // Update User Basic Info
                $user->update([
                    'first_name'     => $request->first_name,
                    'middle_name'    => $request->middle_name ?? null,
                    'last_name'      => $request->last_name,
                    'contact_number' => $request->contact_number,
                    'address'        => $request->address,
                    'email'          => $request->email,
                ]);

                $oldEmp = $user->employment;

                // Create History Entry if status is Yes and details changed
                if ($isEmployed === 'Yes' && $oldEmp) {
                    $hasChanged = (
                        $oldEmp->company_name !== $request->company);

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
                            'employment_end_year' => ($request->employment_end_year === 'current') ? null : $request->employment_end_year,
                            'is_present'           => ($request->employment_end_year === 'current') ? 1 : 0,
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
                        'employment_end_year'  => $isEmployed === 'Yes' ? ($request->employment_end_year === 'current' ? null : $request->employment_end_year) : null,
                    ]
                );
            });

            return redirect()->route('alumna.profile')->with('success', 'Profile updated successfully!');
            
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Update failed: ' . $e->getMessage()]);
        }
    }
}