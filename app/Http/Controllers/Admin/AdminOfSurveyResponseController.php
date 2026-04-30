<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOfSurveyResponseController extends Controller
{
    /**
     * Display ALL alumna users with correct survey status
     */
    public function index(Request $request)
    {
        $survey = Survey::active()->latest()->first();

        $query = User::where('user_role', 'alumna');

        // SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        // FILTER COURSE
        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // FILTER YEAR
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        $users->getCollection()->transform(function ($user) use ($survey) {

            $hasResponse = false;

            if ($survey) {
                $hasResponse = $user->responses()
                    ->where('survey_id', $survey->id)
                    ->exists();
            }

            return [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'status' => $hasResponse ? 'completed' : 'incomplete',
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ];
        });

        return Inertia::render('Admin/AdminSurveyResponse', [
            'responses' => $users,
            'filters' => $request->only(['search', 'course', 'year']),
        ]);
    }

    /**
     * Show survey answers (SURVEY-BASED, NOT PROFILE-BASED)
     */
    public function show($id)
    {
        $survey = Survey::active()->latest()->first();

        if (!$survey) {
            return redirect()->back();
        }

        $responses = \App\Models\Response::with(['question', 'user'])
            ->where('survey_id', $survey->id)
            ->where('user_id', $id)
            ->get();

        if ($responses->isEmpty()) {
            return redirect()->route('survey-response.not-complete', $id);
        }

        $user = $responses->first()->user;

        return Inertia::render('Admin/AdminSurveyResponseView', [
            'response' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
                'mobile' => $user->contact_number ?? '-',
                'address' => $user->address ?? '-',
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',

                // REAL SURVEY DATA ONLY
                'answers' => $responses->map(function ($r) {
                    return [
                        'question' => $r->question->label ?? 'No question',
                        'answer' => $r->answer_value ?? '-',
                    ];
                })->values(),
            ],
        ]);
    }

    /**
     * Not completed page
     */
    public function notComplete($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/AdminSurveyResponseViewNotComplete', [
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ],
        ]);
    }

    /**
     * Delete responses only (NOT user)
     */
   public function destroy($id)
    {
        // Hanapin ang user, siguruhing alumna ito bago i-delete
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        
        // Delete the user record
        $user->delete();

        /** * Importante: Ang redirect back() ay magpapadala ng updated props sa Inertia.
         * Ang flash message ('success') ay pwedeng basahin sa frontend kung kailangan.
         */
        return redirect()->back()->with('success', 'Deleted successfully');
    }
}