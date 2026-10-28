<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    private function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->user_role !== 'admin') {
            abort(403, 'Unauthorized access.');
        }
    }

    /**
     * Display the settings index page with departments and their programs.
     */
    public function index()
    {
        $this->checkAdmin();

        $departments = Department::with(['programs' => function ($query) {
            $query->orderBy('name');
        }])
        ->orderBy('name')
        ->get()
        ->map(function ($dept) {
            $alumniCount = User::where('user_role', 'alumna')
                ->where('department', $dept->code)
                ->count();

            $coordinatorCount = User::where('user_role', 'coordinator')
                ->where('department', $dept->code)
                ->count();

            $programsWithStats = $dept->programs->map(function ($prog) {
                $progAlumniCount = User::where('user_role', 'alumna')
                    ->where('courses', $prog->code)
                    ->count();

                return [
                    'id'            => $prog->id,
                    'department_id' => $prog->department_id,
                    'name'          => $prog->name,
                    'code'          => $prog->code,
                    'status'        => $prog->status,
                    'alumni_count'  => $progAlumniCount,
                    'created_at'    => $prog->created_at?->format('M d, Y'),
                ];
            });

            return [
                'id'                => $dept->id,
                'name'              => $dept->name,
                'code'              => $dept->code,
                'status'            => $dept->status,
                'alumni_count'      => $alumniCount,
                'coordinator_count' => $coordinatorCount,
                'programs'          => $programsWithStats,
                'created_at'        => $dept->created_at?->format('M d, Y'),
            ];
        });

        return Inertia::render('Admin/AdminSettings', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function storeDepartment(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:255'],
            'code'   => ['required', 'string', 'max:50', 'unique:departments,code'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        Department::create([
            'name'   => trim($validated['name']),
            'code'   => strtoupper(trim($validated['code'])),
            'status' => $validated['status'],
        ]);

        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Department added successfully.');
    }

    /**
     * Update an existing department.
     */
    public function updateDepartment(Request $request, Department $department)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:255'],
            'code'   => ['required', 'string', 'max:50', 'unique:departments,code,' . $department->id],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $newCode = strtoupper(trim($validated['code']));
        $oldCode = $department->code;

        // If code changed, update associated users to prevent orphaned academic references
        if ($oldCode !== $newCode) {
            User::where('department', $oldCode)->update(['department' => $newCode]);
        }

        $department->update([
            'name'   => trim($validated['name']),
            'code'   => $newCode,
            'status' => $validated['status'],
        ]);

        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroyDepartment(Department $department)
    {
        $this->checkAdmin();

        // Safety verification: Check if alumni or coordinators are currently using this department
        $hasAlumni = User::where('user_role', 'alumna')->where('department', $department->code)->exists();
        $hasCoordinators = User::where('user_role', 'coordinator')->where('department', $department->code)->exists();

        if ($hasAlumni || $hasCoordinators) {
            return back()->with('error', 'Cannot delete this department because there are registered alumni or coordinators assigned to it. You can set its status to Inactive instead.');
        }

        $department->delete();
        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Department deleted successfully.');
    }

    /**
     * Store a newly created program under a department.
     */
    public function storeProgram(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'name'          => ['required', 'string', 'max:255'],
            'code'          => ['required', 'string', 'max:50'],
            'status'        => ['required', 'in:active,inactive'],
        ]);

        Program::create([
            'department_id' => $validated['department_id'],
            'name'          => trim($validated['name']),
            'code'          => strtoupper(trim($validated['code'])),
            'status'        => $validated['status'],
        ]);

        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Program added successfully.');
    }

    /**
     * Update an existing program.
     */
    public function updateProgram(Request $request, Program $program)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'name'          => ['required', 'string', 'max:255'],
            'code'          => ['required', 'string', 'max:50'],
            'status'        => ['required', 'in:active,inactive'],
        ]);

        $newCode = strtoupper(trim($validated['code']));
        $oldCode = $program->code;

        // If code changed, cascade update to alumni records
        if ($oldCode !== $newCode) {
            User::where('courses', $oldCode)->update(['courses' => $newCode]);
        }

        $program->update([
            'department_id' => $validated['department_id'],
            'name'          => trim($validated['name']),
            'code'          => $newCode,
            'status'        => $validated['status'],
        ]);

        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Program updated successfully.');
    }

    /**
     * Remove the specified program.
     */
    public function destroyProgram(Program $program)
    {
        $this->checkAdmin();

        $hasAlumni = User::where('user_role', 'alumna')->where('courses', $program->code)->exists();

        if ($hasAlumni) {
            return back()->with('error', 'Cannot delete this program because registered alumni are associated with it. You can set its status to Inactive instead.');
        }

        $program->delete();
        Cache::forget('academic_departments_programs');

        return back()->with('success', 'Program deleted successfully.');
    }
}
