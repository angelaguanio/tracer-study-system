<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Survey;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CectSurveyAnalyticsController extends Controller
{
    use AuthorizesRequests;

    public function latestGeneralSurveyAnalytics()
    {
        $user = auth()->user();
        
        if ($user->user_role !== 'admin') {
            abort(403);
        }

        $latestSurvey = Survey::where('is_tracer_study', false)
            ->whereNull('archived_at')
            ->has('responses')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$latestSurvey) {
            return back()->with('error', 'No active general surveys with responses found.');
        }

        return redirect()->route('admin.analytics.cect-show', $latestSurvey->id);
    }

    public function show(Survey $survey, Request $request)
    {
        $user = auth()->user();

        // Admins can view analytics for any survey; coordinators only for their own
        if ($user->user_role === 'coordinator') {
            $this->authorize('update', $survey);
        } elseif ($user->user_role !== 'admin') {
            abort(403);
        }

        abort_if($survey->is_tracer_study, 403, 'Use the tracer study analytics for this survey.');

        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order')->whereNotIn('type', ['subheading']),
            ]),
        ]);

        // ── Filters ─────────────────────────────────────────────────────
        $yearGraduated = $request->query('year_graduated');
        $semester      = $request->query('semester');

        $latestYear = (int) date('Y') - 1;
        $validYears = [];
        for ($y = $latestYear; $y >= 1990; $y--) {
            $validYears[] = "{$y}-" . ($y + 1);
        }
        $applyYear     = $yearGraduated && in_array($yearGraduated, $validYears);
        $applySemester = $semester && in_array($semester, ['1st Semester', '2nd Semester', '3rd Semester', 'Summer']);

        // ── Base respondent IDs (with optional filters) ──────────────────
        $respondentQuery = Response::where('survey_id', $survey->id)
            ->whereNotNull('submitted_at')
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) => $u->where(function ($u2) use ($yearGraduated) {
                [$startY, $endY] = explode('-', $yearGraduated);
                $u2->where('start_year', (int)$startY)->where('end_year', (int)$endY);
            })))
            ->when($applySemester, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('semester', $semester)
            ));

        $respondentIds    = (clone $respondentQuery)->distinct('user_id')->pluck('user_id');
        $totalRespondents = $respondentIds->count();

        // ── Per-question chart data (choice types) ───────────────────────
        $chartRows = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea', 'subheading', 'number']))
            ->select('question_id', 'answer_value', DB::raw('COUNT(*) as count'))
            ->groupBy('question_id', 'answer_value')
            ->with('question.section')
            ->get();

        $questionsMap = [];
        foreach ($chartRows as $row) {
            $question = $row->question;
            if (!$question) continue;
            $qid = $question->id;
            if (!isset($questionsMap[$qid])) {
                $questionsMap[$qid] = [
                    'question_id'   => $qid,
                    'label'         => $question->label,
                    'question_type' => $question->type,
                    'section_id'    => $question->section?->id,
                    'section_title' => $question->section?->title,
                    'display_order' => $question->display_order,
                    'data'          => [],
                    'total'         => 0,
                ];
            }
            $questionsMap[$qid]['data'][] = ['label' => $row->answer_value, 'value' => (int) $row->count];
            $questionsMap[$qid]['total']  += (int) $row->count;
        }

        // ── Number questions ─────────────────────────────────────────────
        foreach ($survey->sections as $section) {
            foreach ($section->questions as $question) {
                if ($question->type !== 'number') continue;
                $answers = Response::where('survey_id', $survey->id)
                    ->whereIn('user_id', $respondentIds)
                    ->where('question_id', $question->id)
                    ->pluck('answer_value')
                    ->map(fn($v) => is_numeric($v) ? (float)$v : null)
                    ->filter()->values();

                if ($answers->isEmpty()) continue;

                $counted = $answers->countBy()->sortKeys();
                $questionsMap[$question->id] = [
                    'question_id'   => $question->id,
                    'label'         => $question->label,
                    'question_type' => 'number',
                    'section_id'    => $section->id,
                    'section_title' => $section->title,
                    'display_order' => $question->display_order,
                    'data'          => array_values($counted->map(fn($c, $v) => ['label' => (string)$v, 'value' => $c])->values()->toArray()),
                    'total'         => $answers->count(),
                    'stats'         => [
                        'min'     => $answers->min(),
                        'max'     => $answers->max(),
                        'average' => round($answers->avg(), 2),
                    ],
                ];
            }
        }

        // ── Text / textarea questions ────────────────────────────────────
        $textQuestions = [];
        $stopwords = ['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','i','my','we','it','that','this','be','have','has','had','not','no','so','as','by','do','did','if','up','out','can','will','just','from','they','their','our','your','you'];
        foreach ($survey->sections as $section) {
            foreach ($section->questions as $question) {
                if (!in_array($question->type, ['text', 'textarea'])) continue;
                $answers = Response::where('survey_id', $survey->id)
                    ->whereIn('user_id', $respondentIds)
                    ->where('question_id', $question->id)
                    ->pluck('answer_value')->filter()->values();

                if ($answers->isEmpty()) continue;

                $words = [];
                foreach ($answers as $ans) {
                    $tokens = preg_split('/\s+/', strtolower(preg_replace('/[^a-zA-Z\s]/', '', $ans)));
                    foreach ($tokens as $w) {
                        if (strlen($w) > 3 && !in_array($w, $stopwords)) {
                            $words[$w] = ($words[$w] ?? 0) + 1;
                        }
                    }
                }
                arsort($words);

                $textQuestions[] = [
                    'question_id'    => $question->id,
                    'label'          => $question->label,
                    'section_title'  => $section->title,
                    'response_count' => $answers->count(),
                    'top_keywords'   => array_slice($words, 0, 15, true),
                    'sample_answers' => $answers->take(3)->toArray(),
                ];
            }
        }

        // ── Section summary ──────────────────────────────────────────────
        $sectionSummary = $survey->sections->map(function ($section) use ($survey, $respondentIds) {
            $count = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('section_id', $section->id))
                ->distinct('user_id')->count('user_id');
            return ['section_id' => $section->id, 'title' => $section->title, 'response_count' => $count];
        })->values()->all();

        $routeName = request()->route()->getName();
        $viewPath  = strpos($routeName, 'coordinator.') === 0
            ? 'Coordinator/CectSurveyAnalytics'
            : 'Admin/CectSurveyAnalytics';

        return Inertia::render($viewPath, [
            'survey'           => $survey,
            'sections'         => $survey->sections,
            'analytics'        => array_values($questionsMap),
            'textAnalysis'     => $textQuestions,
            'totalRespondents' => $totalRespondents,
            'sectionSummary'   => $sectionSummary,
            'filters'          => compact('yearGraduated', 'semester'),
        ]);
    }

    public function download(Survey $survey, Request $request)
    {
        $user = auth()->user();
        if ($user->user_role === 'coordinator') {
            $this->authorize('update', $survey);
        } elseif ($user->user_role !== 'admin') {
            abort(403);
        }

        abort_if($survey->is_tracer_study, 403);

        // Reuse the same filter logic
        $yearGraduated = $request->query('year_graduated');
        $semester      = $request->query('semester');

        $latestYear = (int) date('Y') - 1;
        $validYears = [];
        for ($y = $latestYear; $y >= 1990; $y--) {
            $validYears[] = "{$y}-" . ($y + 1);
        }
        $applyYear     = $yearGraduated && in_array($yearGraduated, $validYears);
        $applySemester = $semester && in_array($semester, ['1st Semester', '2nd Semester', '3rd Semester', 'Summer']);

        $survey->load(['sections.questions']);

        $respondentIds = Response::where('survey_id', $survey->id)
            ->whereNotNull('submitted_at')
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) => $u->where(function ($u2) use ($yearGraduated) {
                [$startY, $endY] = explode('-', $yearGraduated);
                $u2->where('start_year', (int)$startY)->where('end_year', (int)$endY);
            })))
            ->when($applySemester, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('semester', $semester)
            ))
            ->distinct('user_id')->pluck('user_id');

        $filename = 'survey_analytics_' . $survey->id . '_' . date('Y-m-d') . '.csv';
        $headers  = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($survey, $respondentIds) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Survey Analytics Report']);
            fputcsv($file, ['Survey', $survey->title]);
            fputcsv($file, ['Generated', date('Y-m-d H:i:s')]);
            fputcsv($file, ['Total Respondents', $respondentIds->count()]);
            fputcsv($file, []);

            fputcsv($file, ['Section', 'Question', 'Type', 'Answer', 'Count']);

            $rows = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea', 'subheading']))
                ->select('question_id', 'answer_value', DB::raw('COUNT(*) as count'))
                ->groupBy('question_id', 'answer_value')
                ->with('question.section')
                ->get();

            foreach ($rows as $row) {
                $q = $row->question;
                if (!$q) continue;
                fputcsv($file, [
                    $q->section?->title ?? 'N/A',
                    $q->label,
                    $q->type,
                    $row->answer_value,
                    $row->count,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
