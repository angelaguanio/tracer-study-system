<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Survey;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SurveyAnalyticsController extends Controller
{
    use AuthorizesRequests;

    public function show(Survey $survey, Request $request)
    {
        $this->authorize('viewAny', Survey::class);

        $sectionId     = $request->query('section_id');
        $yearGraduated = $request->query('year_graduated');
        $from          = $request->query('from');
        $to            = $request->query('to');

        // Validate year_graduated: only 2018–2022 are meaningful; "All Years" or absent means no filter
        $validYears = [2018, 2019, 2020, 2021, 2022];
        $applyYear  = $yearGraduated && in_array((int) $yearGraduated, $validYears);

        // Total distinct respondents for this survey (unfiltered by section/date/year)
        $totalRespondents = Response::where('survey_id', $survey->id)
            ->distinct('user_id')
            ->count('user_id');

        // Per-section response summary (unfiltered)
        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order'),
            ]),
        ]);

        $sectionSummary = $survey->sections->map(function ($section) use ($survey) {
            $count = Response::where('survey_id', $survey->id)
                ->whereHas('question', fn($q) => $q->where('section_id', $section->id))
                ->distinct('user_id')
                ->count('user_id');

            return [
                'section_id'     => $section->id,
                'title'          => $section->title,
                'response_count' => $count,
            ];
        })->values()->all();

        // Aggregated analytics query
        $query = Response::where('survey_id', $survey->id)
            ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea']))
            ->when($sectionId, fn($q) => $q->whereHas('question', fn($q2) =>
                $q2->where('section_id', $sectionId)))
            ->when($from, fn($q) => $q->where('submitted_at', '>=', $from))
            ->when($to,   fn($q) => $q->where('submitted_at', '<=', $to));

        if ($applyYear) {
            $query->join('users', 'responses.user_id', '=', 'users.id')
                  ->where('users.year_graduated', (int) $yearGraduated)
                  ->select('responses.question_id', 'responses.answer_value', DB::raw('COUNT(*) as count'));
        } else {
            $query->select('question_id', 'answer_value', DB::raw('COUNT(*) as count'));
        }

        $rows = $query
            ->groupBy('question_id', 'answer_value')
            ->with('question.section')
            ->get();

        // Transform rows into per-question structure
        $questionsMap = [];
        foreach ($rows as $row) {
            $question = $row->question;
            if (!$question) {
                continue;
            }
            $section = $question->section;
            $qid     = $question->id;

            if (!isset($questionsMap[$qid])) {
                $questionsMap[$qid] = [
                    'question_id'   => $qid,
                    'label'         => $question->label,
                    'section_id'    => $section?->id,
                    'section_title' => $section?->title,
                    'data'          => [],
                ];
            }

            $questionsMap[$qid]['data'][] = [
                'label' => $row->answer_value,
                'value' => (int) $row->count,
            ];
        }

        $analytics = array_values($questionsMap);

        return Inertia::render('Coordinator/SurveyAnalytics', [
            'survey'           => $survey,
            'sections'         => $survey->sections,
            'analytics'        => $analytics,
            'totalRespondents' => $totalRespondents,
            'sectionSummary'   => $sectionSummary,
        ]);
    }
}
