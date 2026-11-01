<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumniBroadcastEmail;

class CoordinatorAlumniController extends Controller
{
    public function index(Request $request)
{
    $status = $request->query('status', 'active');
    if (!in_array($status, ['active', 'archived'])) {
        $status = 'active';
    }

    $counts = [
        'active'   => User::where('user_role', 'alumna')->where('status', '!=', 'archived')->count(),
        'archived' => User::where('user_role', 'alumna')->where('status', 'archived')->count(),
    ];

    $query = User::where('user_role', 'alumna')
        ->when($status === 'archived', fn ($q) => $q->where('status', 'archived'))
        ->when($status !== 'archived', fn ($q) => $q->where('status', '!=', 'archived'))
        ->latest()
        ->when($request->search, function ($q, $search) {
            $terms = array_filter(explode(' ', trim($search)));
            $q->where(function ($subQ) use ($terms) {
                foreach ($terms as $term) {
                    $subQ->where(function ($innerQ) use ($term) {
                        $innerQ->where('first_name', 'like', "%{$term}%")
                               ->orWhere('middle_name', 'like', "%{$term}%")
                               ->orWhere('last_name', 'like', "%{$term}%")
                               ->orWhere('email', 'like', "%{$term}%")
                               ->orWhere('student_id', 'like', "%{$term}%");
                    });
                }
            });
        })
        ->when($request->course && $request->course !== 'all', function ($q) use ($request) {
            $q->where('courses', $request->course);
        });

    if ($request->filled('year') && $request->year !== 'all') {
        if (strpos($request->year, '-') !== false) {
            $endYear = explode('-', $request->year)[1];
            $query->where('end_year', $endYear);
        } else {
            $query->where('end_year', $request->year);
        }
    }

    if ($request->filled('employment') && $request->employment !== 'all') {
        $query->whereHas('employment', function ($q) use ($request) {
            $q->where('currently_employed', $request->employment);
        });
    }

    $alumni = $query->with('employment')->paginate(10)->withQueryString();
    
    $alumni->through(function ($user) {
        $email = str_ends_with($user->email ?? '', '@temp.alumniconnect.local') ? null : $user->email;
        return [
            'id' => $user->id,
            'student_id' => $user->student_id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'suffix' => $user->suffix,
            'name' => trim("{$user->first_name} {$user->middle_name} {$user->last_name} {$user->suffix}"),
            'email' => $email,
            'contact_number' => $user->contact_number,
            'course' => $user->courses,
            'department' => $user->department,
            'start_year' => $user->start_year,
            'end_year' => $user->end_year,
            'semester' => $user->semester,
            'year' => ($user->start_year && $user->end_year)
                ? "{$user->start_year}-{$user->end_year}"
                : ($user->end_year ?? 'N/A'),
            'avatar' => $user->profile_picture,
            'status' => $user->status,
            'survey_status' => 'Not Completed',
            'employment_status' => $user->employment?->currently_employed === 'Yes' ? 'Employed' : 'Unemployed',
        ];
    });

    return Inertia::render('Coordinator/CoordinatorAlumni', [
        'alumni' => $alumni,
        'filters' => array_merge($request->only(['search', 'year', 'course', 'employment']), ['status' => $status]),
        'counts' => $counts,
    ]);
}

    /**
     * UPDATE ALUMNI INFORMATION (Coordinator)
     */
    public function update(Request $request, $id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);

        $validated = $request->validate([
            'student_id'     => 'required|string|max:50|unique:users,student_id,' . $user->id,
            'first_name'     => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'middle_name'    => 'nullable|string|max:100',
            'suffix'         => 'nullable|string|max:50',
            'department'     => 'required|string|max:100',
            'courses'        => 'required|string|max:100',
            'start_year'     => 'nullable|integer|min:1970|max:2100',
            'end_year'       => 'nullable|integer|min:1970|max:2100',
            'semester'       => 'nullable|string|max:50',
            'email'          => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'contact_number' => 'nullable|string|max:50',
        ]);

        $user->update($validated);

        return back()->with('success', 'Alumni information updated successfully.');
    }

    /**
     * ARCHIVE ALUMNI (Coordinator)
     */
    public function archive($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $user->update(['status' => 'archived']);

        return back()->with('success', "{$user->first_name} {$user->last_name} has been archived.");
    }

    /**
     * RESTORE ARCHIVED ALUMNI (Coordinator)
     */
    public function restore($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $user->update(['status' => 'active']);

        return back()->with('success', "{$user->first_name} {$user->last_name} has been restored.");
    }

    /**
     * PERMANENTLY DELETE ALUMNI (Coordinator)
     */
    public function destroy($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $name = "{$user->first_name} {$user->last_name}";

        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();

        return back()->with('success', "{$name} was permanently deleted.");
    }

    public function show($id)
    {
        $user = User::with(['employment', 'employmentHistory' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return Inertia::render('Coordinator/CoordinatorViewProfile', [
            'user' => $user
        ]);
    }

    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = User::findOrFail($id);

        Mail::to($user->email)->send(
            new AlumniBroadcastEmail(
                $request->subject,
                $request->message,
                'coordinator'
            )
        );

        return back()->with(
            'success',
            'Email sent successfully to '.$user->first_name.' '.$user->last_name
        );
    }

    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'message'     => 'required|string',
            'send_all'    => 'nullable|boolean',
            'user_ids'    => 'required_without:send_all|nullable|array',
            'user_ids.*'  => 'exists:users,id',

            // batching
            'offset'      => 'nullable|integer|min:0',
            'batch_size'  => 'nullable|integer|min:1|max:20',
        ]);

        $offset = $request->offset ?? 0;
        $batchSize = $request->batch_size ?? 10;

        if ($request->boolean('send_all')) {
            $ids = User::where('user_role', 'alumna')
                ->where('status', '!=', 'archived')
                ->whereNotNull('email')
                ->where('email', 'not like', '%@temp.alumniconnect.local')
                ->pluck('id')
                ->toArray();
        } else {
            $ids = $request->user_ids ?? [];
        }

        // Get only the next batch
        $batchIds = array_slice($ids, $offset, $batchSize);

        $users = User::whereIn('id', $batchIds)->get();

        $sent = 0;
        $failed = [];

        foreach ($users as $user) {
            try {

                Mail::to($user->email)->send(
                    new AlumniBroadcastEmail(
                        $request->subject,
                        $request->message,
                        'coordinator'
                    )
                );

                $sent++;

                // small pause to avoid rate limits
                usleep(500000); // 0.5 second

            } catch (\Throwable $e) {

                $failed[] = [
                    'email' => str_ends_with($user->email ?? '', '@temp.alumniconnect.local') ? null : $user->email,
                    'error' => $e->getMessage(),
                ];

                \Log::error("Bulk mail failed to {$user->email}: ".$e->getMessage());
            }
        }

        $nextOffset = $offset + count($batchIds);

        return response()->json([
            'finished' => $nextOffset >= count($ids),

            'next_offset' => $nextOffset,

            'processed' => $nextOffset,

            'total' => count($ids),

            'sent' => $sent,

            'failed' => $failed,
        ]);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');

        if (!$handle) {
            $msg = 'Unable to read the uploaded CSV file. Please try again.';
            if ($request->wantsJson()) return response()->json(['success' => false, 'message' => $msg], 422);
            return back()->with('error', $msg);
        }

        // Auto-detect delimiter and strip BOM if present
        $firstLine = fgets($handle);
        rewind($handle);

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $delimiter = ',';
        if (substr_count($firstLine, ';') > substr_count($firstLine, ',')) {
            $delimiter = ';';
        } elseif (substr_count($firstLine, "\t") > substr_count($firstLine, ',')) {
            $delimiter = "\t";
        }

        // Read header row
        $rawHeader = fgetcsv($handle, 0, $delimiter);
        if (!$rawHeader) {
            fclose($handle);
            $msg = 'The uploaded CSV file is empty.';
            if ($request->wantsJson()) return response()->json(['success' => false, 'message' => $msg], 422);
            return back()->with('error', $msg);
        }

        // Normalize header columns
        $headerMap = [];
        foreach ($rawHeader as $index => $col) {
            $col = preg_replace('/^\xEF\xBB\xBF/', '', $col);
            $col = preg_replace('/[\x00-\x1F\x7F]/u', '', $col);
            $normalized = strtolower(trim($col));
            $clean = str_replace([' ', '_', '-'], '', $normalized);

            if (in_array($clean, ['lastname', 'last', 'surname'])) {
                $headerMap['last_name'] = $index;
            } elseif (in_array($clean, ['firstname', 'first', 'givenname'])) {
                $headerMap['first_name'] = $index;
            } elseif (in_array($clean, ['middlename', 'middle'])) {
                $headerMap['middle_name'] = $index;
            } elseif (in_array($clean, ['suffix', 'nameextension', 'extension', 'ext', 'extname'])) {
                $headerMap['suffix'] = $index;
            } elseif (in_array($clean, ['studentid', 'idnumber', 'id', 'studentno', 'studentnumber'])) {
                $headerMap['student_id'] = $index;
            } elseif (in_array($clean, ['department', 'dept', 'college'])) {
                $headerMap['department'] = $index;
            } elseif (in_array($clean, ['program', 'course', 'courses', 'degree'])) {
                $headerMap['courses'] = $index;
            } elseif (in_array($clean, ['schoolyear', 'sy', 'year', 'yeargraduated', 'batch', 'academicyear', 'ay'])) {
                $headerMap['school_year'] = $index;
            } elseif (in_array($clean, ['semester', 'sem', 'semestergraduated', 'term'])) {
                $headerMap['semester'] = $index;
            }
        }

        // Required columns. Every cell must be filled in.
        // For Middle Name and Suffix, write "*" or "N/A" if the student has none.
        $requiredFields = [
            'last_name'   => 'Last Name',
            'first_name'  => 'First Name',
            'middle_name' => 'Middle Name',
            'suffix'      => 'Suffix',
            'student_id'  => 'Student ID',
            'department'  => 'Department',
            'courses'     => 'Program',
            'school_year' => 'School Year',
            'semester'    => 'Semester',
        ];

        // Values that mean "none" for optional name parts (saved as empty)
        $noneValue = function ($value) {
            $value = trim((string) $value);
            return in_array(strtolower($value), ['*', 'n/a'], true) ? null : $value;
        };

        $missingHeaders = array_values(array_diff_key($requiredFields, $headerMap));
        if (!empty($missingHeaders)) {
            fclose($handle);
            $msg = 'Invalid CSV format. Missing required column(s): ' . implode(', ', $missingHeaders) . '. Please use the official template.';
            if ($request->wantsJson()) return response()->json(['success' => false, 'message' => $msg], 422);
            return back()->with('error', $msg);
        }

        // First pass: read all rows and make sure no required field is empty.
        // If any row is incomplete, the whole upload is rejected and nothing is saved.
        $rows = [];
        $validationErrors = [];
        $rowNumber = 1;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            // Skip completely empty rows
            if (!array_filter($row, fn ($v) => trim((string) $v) !== '')) {
                continue;
            }

            $missing = [];
            foreach ($requiredFields as $field => $label) {
                if (trim((string) ($row[$headerMap[$field]] ?? '')) === '') {
                    $missing[] = $label;
                }
            }

            if (!empty($missing)) {
                $hint = array_intersect($missing, ['Middle Name', 'Suffix'])
                    ? ' (use "*" or "N/A" if none)'
                    : '';
                $validationErrors[] = "Row {$rowNumber}: Missing " . implode(', ', $missing) . $hint . '.';
            }

            $rows[$rowNumber] = $row;
        }

        fclose($handle);

        if (empty($rows)) {
            $msg = 'The uploaded CSV file has no student records.';
            if ($request->wantsJson()) return response()->json(['success' => false, 'message' => $msg], 422);
            return back()->with('error', $msg);
        }

        if (!empty($validationErrors)) {
            $msg = 'Upload rejected. ' . count($validationErrors) . ' row(s) have empty required fields. No records were imported. Please complete the missing data and upload again.';
            if ($request->wantsJson()) {
                return response()->json([
                    'success'       => false,
                    'rejected'      => true,
                    'message'       => $msg,
                    'created_count' => 0,
                    'updated_count' => 0,
                    'errors'        => $validationErrors,
                ], 422);
            }
            return back()->with('error', $msg);
        }

        $created = 0;
        $updated = 0;
        $errors = [];

        try {
            foreach ($rows as $rowNumber => $row) {

                $studentId  = trim($row[$headerMap['student_id']] ?? '');
                $lastName   = trim($row[$headerMap['last_name']] ?? '');
                $firstName  = trim($row[$headerMap['first_name']] ?? '');
                $middleName = $noneValue($row[$headerMap['middle_name']] ?? '');
                $suffix     = $noneValue($row[$headerMap['suffix']] ?? '');
                $department = isset($headerMap['department']) ? trim($row[$headerMap['department']] ?? '') : null;
                $courses    = isset($headerMap['courses']) ? trim($row[$headerMap['courses']] ?? '') : null;

                $rawSchoolYear = isset($headerMap['school_year']) ? trim($row[$headerMap['school_year']] ?? '') : '';
                $rawSemester   = isset($headerMap['semester']) ? trim($row[$headerMap['semester']] ?? '') : '';

                $startYear = null;
                $endYear   = null;
                if (!empty($rawSchoolYear)) {
                    if (str_contains($rawSchoolYear, '-')) {
                        $yParts = explode('-', $rawSchoolYear);
                        $startYear = !empty($yParts[0]) && is_numeric(trim($yParts[0])) ? (int) trim($yParts[0]) : null;
                        $endYear   = !empty($yParts[1]) && is_numeric(trim($yParts[1])) ? (int) trim($yParts[1]) : null;
                    } elseif (is_numeric($rawSchoolYear)) {
                        $endYear   = (int) $rawSchoolYear;
                        $startYear = $endYear - 1;
                    }
                }

                $semester = null;
                if (!empty($rawSemester)) {
                    $semLower = strtolower(trim($rawSemester));
                    if (str_contains($semLower, '1') || str_contains($semLower, 'first')) {
                        $semester = '1st Semester';
                    } elseif (str_contains($semLower, '2') || str_contains($semLower, 'second')) {
                        $semester = '2nd Semester';
                    } elseif (str_contains($semLower, '3') || str_contains($semLower, 'third')) {
                        $semester = '3rd Semester';
                    } elseif (str_contains($semLower, 'summer') || str_contains($semLower, 'mid')) {
                        $semester = 'Summer';
                    } else {
                        $semester = trim($rawSemester);
                    }
                }

                if (empty($studentId) || empty($lastName) || empty($firstName)) {
                    $errors[] = "Row {$rowNumber}: Missing student ID, first name, or last name.";
                    continue;
                }

                try {
                    $user = User::where('student_id', $studentId)->first();

                    if ($user) {
                        $updateData = [
                            'last_name'   => $lastName,
                            'first_name'  => $firstName,
                            'middle_name' => $middleName,
                            'suffix'      => $suffix,
                            'department'  => $department ?: $user->department,
                            'courses'     => $courses ?: $user->courses,
                        ];
                        if ($startYear) $updateData['start_year'] = $startYear;
                        if ($endYear)   $updateData['end_year']   = $endYear;
                        if ($semester)  $updateData['semester']   = $semester;

                        $user->update($updateData);
                        $updated++;
                    } else {
                        // Safe temporary credentials so strict non-nullable MySQL constraints never fail
                        $cleanId = preg_replace('/[^a-zA-Z0-9]/', '', $studentId);
                        $tempEmail = "student_{$cleanId}@temp.alumniconnect.local";
                        $tempPassword = \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(24));

                        User::create([
                            'student_id'  => $studentId,
                            'last_name'   => $lastName,
                            'first_name'  => $firstName,
                            'middle_name' => $middleName,
                            'suffix'      => $suffix,
                            'email'       => $tempEmail,
                            'password'    => $tempPassword,
                            'department'  => $department ?: null,
                            'courses'     => $courses ?: null,
                            'start_year'  => $startYear,
                            'end_year'    => $endYear,
                            'semester'    => $semester,
                            'user_role'   => 'alumna',
                            'status'      => 'active',
                        ]);
                        $created++;
                    }
                } catch (\Illuminate\Database\QueryException $qe) {
                    \Log::error("CSV import row {$rowNumber} query error: " . $qe->getMessage());

                    if (str_contains($qe->getMessage(), "Unknown column 'student_id'")) {
                        $dbMsg = "Database update required: 'student_id' column is missing in table 'users'. Please run the SQL command in phpMyAdmin.";
                        if ($request->wantsJson()) return response()->json(['success' => false, 'message' => $dbMsg], 422);
                        return back()->with('error', $dbMsg);
                    }

                    $errors[] = "Row {$rowNumber} (Student ID: {$studentId}): Could not be saved.";
                }
            }

        } catch (\Throwable $e) {
            \Log::error("CSV import general error: " . $e->getMessage());

            $cleanMessage = "Failed to import CSV file. Please check your file formatting and ensure your database columns are up to date.";
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $cleanMessage], 422);
            }
            return back()->with('error', $cleanMessage);
        }

        if ($created === 0 && $updated === 0 && count($errors) > 0) {
            $failMsg = "No records were imported. " . count($errors) . " row(s) had errors.";
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $failMsg,
                    'created_count' => 0,
                    'updated_count' => 0,
                    'errors' => $errors,
                ], 422);
            }
            return back()->with('error', $failMsg);
        }

        $msg = "Import completed successfully! {$created} added, {$updated} updated.";
        if (count($errors) > 0) {
            $msg .= " (" . count($errors) . " row(s) skipped)";
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $msg,
                'created_count' => $created,
                'updated_count' => $updated,
                'errors' => $errors,
            ]);
        }

        return back()->with('success', $msg);
    }

    public function downloadSampleCsv()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="student_import_template.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['lastname', 'firstname', 'middlename', 'suffix', 'student id', 'department', 'program', 'school year', 'semester']);
            fputcsv($file, ['Dela Cruz', 'Juan', 'Santos', 'Jr.', '22-3333-444', 'CECT', 'BSIT', '2025-2026', '1st Semester']);
            fputcsv($file, ['Reyes', 'Maria', 'N/A', '*', '22-4444-555', 'CECT', 'BSCS', '2025-2026', '2nd Semester']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}