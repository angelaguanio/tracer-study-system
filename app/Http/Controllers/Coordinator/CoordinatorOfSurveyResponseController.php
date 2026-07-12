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
    public function index(Request $request)
    {
        $sort = $request->get('sort', 'newest');
    
        $base = Survey::withCount('sections')
            ->with('creator')
            ->has('responses'); // Only surveys with at least one response
    
        if ($sort === 'oldest') {
            $base->oldest();
        } else {
            $base->latest();
        }
    
        $surveys = (clone $base)
            ->whereNull('archived_at')
            ->paginate(5)
            ->through(function ($survey) {
                return [
                    'id'             => $survey->id,
                    'title'          => $survey->title,
                    'status'         => $survey->status,
                    'sections_count' => $survey->sections_count,
                    'created_at'     => $survey->created_at,
                    'created_by'     => $survey->creator
                        ? trim($survey->creator->first_name . ' ' . $survey->creator->last_name)
                        : 'Unknown',
                ];
            })
            ->withQueryString();
    
        $archivedSurveys = (clone $base)
            ->whereNotNull('archived_at')
            ->paginate(5, ['*'], 'archived_page')
            ->through(function ($survey) {
                return [
                    'id'             => $survey->id,
                    'title'          => $survey->title,
                    'status'         => $survey->status,
                    'sections_count' => $survey->sections_count,
                    'created_at'     => $survey->created_at,
                    'created_by'     => $survey->creator
                        ? trim($survey->creator->first_name . ' ' . $survey->creator->last_name)
                        : 'Unknown',
                ];
            })
            ->withQueryString();
    
        return Inertia::render('Coordinator/CoordinatorSurveyResponseIndex', [
            'surveys'         => $surveys,
            'archivedSurveys' => $archivedSurveys,
            'filters' => [
                'sort' => $sort,
            ],
        ]);
    }
    /**
     * PAGE 2: Survey Responses (Main Page)
     */
    public function show(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $completedUserIds = Response::where('survey_id', $survey->id)
        ->pluck('user_id')
        ->toArray();

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

        // UPDATED YEAR FILTERING LOGIC
        if ($request->filled('year') && $request->year !== 'all') {
            // I-handle ang "2017-2018" format
            if (strpos($request->year, '-') !== false) {
                // Kunin ang "2018" mula sa "2017-2018" para i-match sa DB column
                $endYear = explode('-', $request->year)[1];
                $query->where('end_year', $endYear); // Siguraduhin na 'end_year' ang column mo
            } else {
                // Fallback para sa single year input
                $query->where('end_year', $request->year);
            }
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        $users->getCollection()->transform(function ($user) use ($completedUserIds) {
            
            return [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'status' => in_array($user->id, $completedUserIds) ? 'completed' : 'incomplete',
                'course' => $user->courses ?? '-',
                'year' => ($user->start_year && $user->end_year) 
                            ? "{$user->start_year}-{$user->end_year}" 
                            : ($user->end_year ?? 'N/A'),
                'avatar' => $user->profile_picture,
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
     * PAGE 3: Completed User Response View
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
     * PAGE 4: NOT COMPLETED VIEW (FIXED INERTIA COMPONENT PATH STRING)
     */
    public function notComplete($surveyId, $userId)
    {
        $survey = Survey::findOrFail($surveyId);
        $user = User::findOrFail($userId);

        // FIXED: Added trailing "d" to point directly to CoordinatorSurveyResponseViewNotCompleted.jsx
        return Inertia::render('Coordinator/CoordinatorSurveyResponseViewNotCompleted', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ],
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * DELETE RESPONSE
     */
    public function destroy($surveyId, $userId)
    {
        Response::where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->delete();

        return redirect()->back();
    }
}