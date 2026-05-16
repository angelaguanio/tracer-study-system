<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoordinatorOfSurveyResponseController extends Controller
{
    /**
     * PAGE 1: List of Surveys
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

        return Inertia::render('Coordinator/CoordinatorSurveyResponseIndex', [
            'surveys' => $surveys,
        ]);
    }

    /**
     * PAGE 2: Survey Responses (Main Page)
     */
    public function show(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $query = User::where('user_role', 'alumna');

        // SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        // COURSE FILTER
        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // YEAR FILTER
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

        return Inertia::render('Coordinator/CoordinatorSurveyResponse', [
            'responses' => $users,
            'filters' => $request->only(['search', 'course', 'year', 'page']),
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ],
        ]);
    }

    /**
     * PAGE 3: Completed User Response View (WITH SECTION GROUPING FIX)
     */
    public function viewUserResponse($surveyId, $userId)
    {
        $survey = Survey::with('sections.questions')->findOrFail($surveyId);
        $user = User::findOrFail($userId);

        $responses = Response::with(['question.section'])
            ->where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->get();

        // GROUP RESPONSES BY SECTION
        $sections = $survey->sections->map(function ($section) use ($responses) {
            $answers = $responses->filter(function ($response) use ($section) {
                return optional($response->question)->section_id === $section->id;
            })->map(function ($r) {
                return [
                    'question' => $r->question->label ?? 'No question',
                    'answer' => $r->answer_value ?? '-',
                ];
            })->values();

            return [
                'section_title' => $section->title,
                'answers' => $answers,
            ];
        });

        return Inertia::render('Coordinator/CoordinatorSurveyResponseView', [
            'response' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
                'sections' => $sections,
            ],
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ],
        ]);
    }

    /**
     * PAGE 4: NOT COMPLETED VIEW
     */
    public function notComplete($surveyId, $userId)
    {
        $survey = Survey::findOrFail($surveyId);
        $user = User::findOrFail($userId);

        return Inertia::render('Coordinator/CoordinatorSurveyResponseViewNotComplete', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ],
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
            ],
        ]);
    }

    /**
     * DELETE RESPONSE (view-only UI delete)
     */
    public function destroy($surveyId, $userId)
    {
        Response::where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->delete();

        return redirect()->back();
    }
}

