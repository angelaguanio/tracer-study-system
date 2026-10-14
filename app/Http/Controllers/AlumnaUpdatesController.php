<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Employment;
use App\Models\EmploymentHistory;

class AlumnaUpdatesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employment = Employment::where('user_id', $user->id)->first();
        $history = EmploymentHistory::where('user_id', $user->id)
                                    ->where('currently_employed', 'Yes')
                                    ->orderBy('created_at', 'desc')
                                    ->get();

        return Inertia::render('Alumna/AlumnaUpdates', [
            'employment' => $employment,
            'history' => $history
        ]);
    }

    public function updateEmployment(Request $request)
    {
        $user = Auth::user();

        $validation = $request->validate([
            'currently_employed' => 'required|in:Yes,No',
            'employment_type' => 'required_if:currently_employed,Yes|nullable|string',
            'company_name' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'position' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'location' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'monthly_salary' => 'nullable|numeric',
            'employment_duration' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'unemployment_reason' => 'required_if:currently_employed,No|nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($user, $validation) {
                // Determine values based on employment status
                $isEmployed = $validation['currently_employed'] === 'Yes';
                
                // Get old employment if it exists
                $oldEmployment = Employment::where('user_id', $user->id)->first();

                // Handle employment_duration and is_present logic
                $duration = $isEmployed ? ($validation['employment_duration'] ?? null) : null;
                $isPresent = false;
                if ($duration) {
                    $parts = array_map('trim', explode('-', $duration));
                    if (count($parts) === 1 || empty($parts[1]) || strtolower($parts[1]) === 'current') {
                        $duration = $parts[0] . ' - Present';
                    }
                    $isPresent = str_contains(strtolower($duration), 'present');
                }

                // Update or Create Current Employment
                $employment = Employment::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'currently_employed' => $validation['currently_employed'],
                        'company_name' => $isEmployed ? $validation['company_name'] : null,
                        'position' => $isEmployed ? $validation['position'] : null,
                        'location' => $isEmployed ? $validation['location'] : null,
                        'is_present' => $isPresent ? 1 : 0,
                        'employment_type' => $isEmployed ? $validation['employment_type'] : null,
                        'monthly_salary' => $isEmployed ? $validation['monthly_salary'] : null,
                        'employment_duration' => $duration,
                        'unemployment_reason' => !$isEmployed ? $validation['unemployment_reason'] : null,
                    ]
                );

                // Add to history if anything significant changed
                $hasChanged = !$oldEmployment ||
                              $oldEmployment->currently_employed !== $employment->currently_employed ||
                              $oldEmployment->company_name !== $employment->company_name ||
                              $oldEmployment->position !== $employment->position;

                if ($hasChanged && $employment->currently_employed === 'Yes') {
                    EmploymentHistory::create([
                        'user_id' => $user->id,
                        'currently_employed' => $employment->currently_employed,
                        'company_name' => $employment->company_name,
                        'position' => $employment->position,
                        'location' => $employment->location,
                        'is_present' => $employment->is_present,
                        'employment_type' => $employment->employment_type,
                        'monthly_salary' => $employment->monthly_salary,
                        'employment_duration' => $employment->employment_duration,
                        'unemployment_reason' => $employment->unemployment_reason,
                    ]);
                }
            });

            return redirect()->back()->with('success', 'Employment status updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Employment update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update employment.']);
        }
    }
}
