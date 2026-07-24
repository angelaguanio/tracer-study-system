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

    return Inertia::render('Admin/AdminSurveyResponseIndex', [
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
            // Kunin ang "2018" mula sa "2017-2018"
            // Note: Siguraduhin na ang column name sa DB ay tugma (e.g., 'end_year' o 'year_graduated')
            $endYear = explode('-', $request->year)[1];
            $query->where('end_year', $endYear); 
        } else {
            // Fallback
            $query->where('end_year', $request->year);
        }
    }

    // STATUS FILTER
    if ($request->filled('status') && $request->status !== 'all') {
        if ($request->status === 'completed') {
            $query->whereIn('id', $completedUserIds);
        } else {
            $query->whereNotIn('id', $completedUserIds);
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

    return Inertia::render('Admin/AdminSurveyResponse', [
        'responses' => $users,
        'filters' => $request->only(['search', 'course', 'year', 'status', 'page']),
        'survey' => [
            'id' => $survey->id,
            'title' => $survey->title,
        ]
    ]);
}   
    /**
     * PAGE 3: Completed User Response View
     */
    public function viewUserResponse($surveyId, $userId)
    {
        $survey = Survey::with('sections.questions')->findOrFail($surveyId);
        
        // Eager load the employment relationships
       $user = User::with([
            'employment',
            'employmentHistory' => function($query) {
                // Ensure only the columns needed by the frontend are serialized,
                // so Coordinator/Admin “Range” fields are present.
                $query->orderBy('employment_start_year', 'desc')
                  ->select([
                    'id',
                    'user_id',
                    'currently_employed',
                    'company_name',
                    'position',
                    'employment_type',
                    'location',
                    'monthly_salary',
                    'unemployment_reason',
                    'employment_start_year',
                    'employment_end_year',
                    'is_present',
                    'created_at',
                ]);
            }
        ])->findOrFail($userId);

        $responses = Response::with(['question.section'])
            ->where('survey_id', $surveyId)
            ->where('user_id', $userId)
            ->get();

        // GROUP RESPONSES BY SECTION
        $sections = $survey->sections->map(function ($section) use ($responses) {

            $answers = $responses->filter(function ($response) use ($section) {
                return optional($response->question)->section_id === $section->id;
            })->map(function ($r) {
                $raw = $r->answer_value ?? '-';
                $decoded = json_decode($raw, true);
                $answer = is_array($decoded)
                    ? implode(', ', $decoded)
                    : $raw;
                return [
                    'question' => $r->question->label ?? 'No question',
                    'answer'   => $answer,
                ];
            })->values();

            return [
                'section_title' => $section->title,
                'answers' => $answers,
            ];
        });

        return Inertia::render('Admin/AdminSurveyResponseView', [
            'response' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
                'sections' => $sections,
            ],
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name), // Dagdag para sa uniform template naming
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'contact_number' => $user->contact_number,
                'address' => $user->address,
                'courses' => $user->courses,
                'course' => $user->courses, // Fallback alias para sa frontend single property
                'year_graduated' => $user->year_graduated, 
                'semester_graduated' => $user->semester_graduated,
                'employment' => $user->employment,
                'employment_history' => $user->employmentHistory,
            ],
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ]
        ]);
    }

    /**
     * PAGE 4: NOT COMPLETED VIEW
     */
    public function notComplete($surveyId, $userId)
    {
        $survey = Survey::findOrFail($surveyId);
        
        // Eager load the employment relationships here too
        $user = User::with([
            'employment',
            'employmentHistory' => function($query) {
                // Ensure only the columns needed by the frontend are serialized,
                // so Coordinator/Admin “Range” fields are present.
                $query->orderBy('employment_start_year', 'desc')
                  ->select([
                    'id',
                    'user_id',
                    'currently_employed',
                    'company_name',
                    'position',
                    'employment_type',
                    'location',
                    'monthly_salary',
                    'unemployment_reason',
                    'employment_start_year',
                    'employment_end_year',
                    'is_present',
                    'created_at',
                ]);
            }
        ])->findOrFail($userId);


        return Inertia::render('Admin/AdminSurveyResponseViewNotComplete', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
            ],
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'contact_number' => $user->contact_number,
                'address' => $user->address,
                'courses' => $user->courses,
                'course' => $user->courses, // Fallback alias para sa frontend single property
                'year_graduated' => $user->year_graduated, 
                'semester_graduated' => $user->semester_graduated,
                'employment' => $user->employment,
                'employment_history' => $user->employmentHistory,
            ]
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