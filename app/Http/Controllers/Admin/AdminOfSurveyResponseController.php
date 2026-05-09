<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOfSurveyResponseController extends Controller
{
    /**
     * PAGE 1: Listahan ng lahat ng Surveys
     */
    public function index()
    {
        $surveys = Survey::withCount('sections')
            ->latest()
            ->get()
            ->map(function ($survey) {
                return [
                    'id' => $survey->id,
                    'title' => $survey->title,
                    'status' => $survey->status,
                    'sections_count' => $survey->sections_count,
                    'created_at' => $survey->created_at,
                ];
            });

        return Inertia::render('Admin/AdminSurveyResponseIndex', [
            'surveys' => $surveys
        ]);
    }

    /**
     * PAGE 2: FIX PARA SA ERROR MO
     * Ito ang hinahanap ng route: /admin/survey-response/{id}
     */
    public function show(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $query = User::where('user_role', 'alumna');

        // Search Filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        $users->getCollection()->transform(function ($user) use ($survey) {
            $hasResponse = Response::where('survey_id', $survey->id)
                ->where('user_id', $user->id)
                ->exists();

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
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ]
        ]);
    }

    /**
     * PAGE 3: View ng sagot ng Completed User
     */
    public function viewUserResponse($surveyId, $userId)
    {
        $user = User::findOrFail($userId);
        
        $responses = Response::with(['question'])
            ->where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->get();

        return Inertia::render('Admin/AdminSurveyResponseView', [
            'response' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
                'answers' => $responses->map(function ($r) {
                    return [
                        'question' => $r->question->label ?? 'No question',
                        'answer' => $r->answer_value ?? '-',
                    ];
                }),
            ],
        ]);
    }

    /**
     * PAGE 4: View para sa Not Completed
     */
    public function notComplete($surveyId, $userId)
    {
        return Inertia::render('Admin/AdminSurveyResponseViewNotComplete');
    }

    /**
     * ACTION: Delete Response
     */
    public function destroy($surveyId, $userId)
    {
        Response::where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->delete();

        return redirect()->back();
    }
}