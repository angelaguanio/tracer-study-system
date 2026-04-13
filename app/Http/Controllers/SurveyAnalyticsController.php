<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Survey;
use App\Models\User;
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

        $yearGraduated = $request->query('year_graduated');
        $from          = $request->query('from');
        $to            = $request->query('to');

        $validYears = ['2018','2019','2020','2021','2022','2023','2024','2025'];
        $applyYear  = $yearGraduated && in_array($yearGraduated, $validYears);

        // Load survey with sections + questions
        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order'),
            ]),
        ]);

        // --- Base respondent user IDs (filtered) ---
        $respondentQuery = Response::where('survey_id', $survey->id)
            ->when($from, fn($q) => $q->where('submitted_at', '>=', $from))
            ->when($to,   fn($q) => $q->where('submitted_at', '<=', $to))
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('year_graduated', $yearGraduated)
            ));

        $respondentIds = (clone $respondentQuery)->distinct('user_id')->pluck('user_id');
        $totalRespondents = $respondentIds->count();

        // --- 1. Descriptive Statistics ---
        $respondents = User::whereIn('id', $respondentIds)->get();

        $degreeDistribution = $respondents->groupBy('courses')
            ->map(fn($g) => $g->count())->sortDesc()->toArray();

        $yearDistribution = $respondents->groupBy('year_graduated')
            ->map(fn($g) => $g->count())->sortKeys()->toArray();

        // --- Helper: get answers for a question label keyword ---
        $getAnswersForQuestion = function(string $keyword) use ($survey, $respondentIds) {
            return Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', "%{$keyword}%"))
                ->pluck('answer_value');
        };

        // --- 2. Employment Analysis ---
        // Find employment status question (looks for "employ" in label)
        $employmentAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%employ%'))
            ->pluck('answer_value', 'user_id');

        $employedKeywords   = ['employed', 'permanent', 'probationary', 'contractual', 'part-time', 'self-employed'];
        $unemployedKeywords = ['unemployed', 'not employed', 'no job'];

        $employedCount   = 0;
        $unemployedCount = 0;
        $employmentBreakdown = [];

        foreach ($employmentAnswers as $ans) {
            $lower = strtolower(trim($ans ?? ''));
            $isUnemployed = false;
            foreach ($unemployedKeywords as $kw) {
                if (str_contains($lower, $kw)) { $isUnemployed = true; break; }
            }
            // Also treat bare "no" as unemployed
            if ($lower === 'no') $isUnemployed = true;

            if ($isUnemployed) {
                $unemployedCount++;
            } else {
                $employedCount++;
            }
            $employmentBreakdown[$ans] = ($employmentBreakdown[$ans] ?? 0) + 1;
        }

        arsort($employmentBreakdown);

        $employmentRate = $totalRespondents > 0
            ? round(($employedCount / $totalRespondents) * 100, 1)
            : 0;

        // Salary analysis — find number-type question with "salary" in label
        $salaryAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%salary%')->orWhere('label', 'like', '%income%'))
            ->pluck('answer_value')
            ->map(fn($v) => is_numeric($v) ? (float)$v : null)
            ->filter()
            ->values();

        $salaryStats = $salaryAnswers->count() > 0 ? [
            'min'     => $salaryAnswers->min(),
            'max'     => $salaryAnswers->max(),
            'average' => round($salaryAnswers->avg(), 2),
            'count'   => $salaryAnswers->count(),
        ] : null;

        // Industry/company type
        $industryAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%industry%')->orWhere('label', 'like', '%company%'))
            ->pluck('answer_value');

        $industryBreakdown = $industryAnswers->countBy()->sortDesc()->toArray();

        // --- 3. Grouped Likert Analysis ---
        $likertGroups = [];

        foreach ($survey->sections as $section) {
            $scale = $section->likert_scale ?? [];
            if (empty($scale)) continue;

            // Build score map: position in array = score (1-based)
            $scoreMap = [];
            foreach ($scale as $i => $label) {
                $scoreMap[strtolower(trim($label))] = $i + 1;
            }
            $maxScore = count($scale);

            $questionScores = [];
            foreach ($section->questions as $question) {
                $answers = Response::where('survey_id', $survey->id)
                    ->whereIn('user_id', $respondentIds)
                    ->where('question_id', $question->id)
                    ->pluck('answer_value');

                $scores = $answers->map(function($a) use ($scoreMap) {
                    $normalized = strtolower(trim(preg_replace('/\s+/', ' ', $a ?? '')));
                    // Try exact match first, then partial match
                    if (isset($scoreMap[$normalized])) return $scoreMap[$normalized];
                    foreach ($scoreMap as $key => $score) {
                        if (str_contains($normalized, $key) || str_contains($key, $normalized)) {
                            return $score;
                        }
                    }
                    return null;
                })->filter()->values();

                if ($scores->count() > 0) {
                    $questionScores[] = [
                        'question_id' => $question->id,
                        'label'       => $question->label,
                        'avg_score'   => round($scores->avg(), 2),
                        'max_score'   => $maxScore,
                        'count'       => $scores->count(),
                    ];
                }
            }

            if (!empty($questionScores)) {
                usort($questionScores, fn($a, $b) => $b['avg_score'] <=> $a['avg_score']);
                $sectionAvg = count($questionScores) > 0
                    ? round(array_sum(array_column($questionScores, 'avg_score')) / count($questionScores), 2)
                    : 0;

                $likertGroups[] = [
                    'section_id'    => $section->id,
                    'section_title' => $section->title,
                    'avg_score'     => $sectionAvg,
                    'max_score'     => $maxScore,
                    'questions'     => $questionScores,
                    'strongest'     => $questionScores[0] ?? null,
                    'weakest'       => end($questionScores) ?: null,
                ];
            }
        }

        // --- 4. Cross Analysis ---
        // Skills score vs employment status
        $crossAnalysis = [];

        // Get likert scores per user per section
        $userSectionScores = [];
        foreach ($survey->sections as $section) {
            $scale = $section->likert_scale ?? [];
            if (empty($scale)) continue;
            $scoreMap = [];
            foreach ($scale as $i => $label) {
                $scoreMap[strtolower(trim($label))] = $i + 1;
            }

            $sectionResponses = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('section_id', $section->id))
                ->get(['user_id', 'answer_value']);

            foreach ($sectionResponses->groupBy('user_id') as $userId => $userResponses) {
                $scores = $userResponses->map(function($r) use ($scoreMap) {
                    $normalized = strtolower(trim(preg_replace('/\s+/', ' ', $r->answer_value ?? '')));
                    if (isset($scoreMap[$normalized])) return $scoreMap[$normalized];
                    foreach ($scoreMap as $key => $score) {
                        if (str_contains($normalized, $key) || str_contains($key, $normalized)) return $score;
                    }
                    return null;
                })->filter()->values();
                if ($scores->count() > 0) {
                    $userSectionScores[$userId][$section->title] = round($scores->avg(), 2);
                }
            }
        }

        // Cross: section score vs employment status
        $sectionVsEmployment = [];
        foreach ($survey->sections as $section) {
            if (empty($section->likert_scale)) continue;
            $groups = ['Employed' => [], 'Unemployed' => []];
            foreach ($userSectionScores as $userId => $sectionScores) {
                if (!isset($sectionScores[$section->title])) continue;
                $empAns = strtolower($employmentAnswers[$userId] ?? '');
                $isEmp  = false;
                foreach ($employedKeywords as $kw) {
                    if (str_contains($empAns, $kw)) { $isEmp = true; break; }
                }
                $groups[$isEmp ? 'Employed' : 'Unemployed'][] = $sectionScores[$section->title];
            }
            $sectionVsEmployment[] = [
                'section'            => $section->title,
                'employed_avg'       => count($groups['Employed'])   > 0 ? round(array_sum($groups['Employed'])   / count($groups['Employed']),   2) : null,
                'unemployed_avg'     => count($groups['Unemployed']) > 0 ? round(array_sum($groups['Unemployed']) / count($groups['Unemployed']), 2) : null,
            ];
        }

        // Cross: section score vs salary
        $sectionVsSalary = [];
        foreach ($survey->sections as $section) {
            if (empty($section->likert_scale)) continue;
            $pairs = [];
            foreach ($userSectionScores as $userId => $sectionScores) {
                if (!isset($sectionScores[$section->title])) continue;
                $sal = Response::where('survey_id', $survey->id)
                    ->where('user_id', $userId)
                    ->whereHas('question', fn($q) => $q->where('label', 'like', '%salary%')->orWhere('label', 'like', '%income%'))
                    ->value('answer_value');
                if (is_numeric($sal)) {
                    $pairs[] = ['score' => $sectionScores[$section->title], 'salary' => (float)$sal];
                }
            }
            if (!empty($pairs)) {
                $sectionVsSalary[] = [
                    'section' => $section->title,
                    'pairs'   => $pairs,
                    'avg_score'  => round(array_sum(array_column($pairs, 'score'))  / count($pairs), 2),
                    'avg_salary' => round(array_sum(array_column($pairs, 'salary')) / count($pairs), 2),
                ];
            }
        }

        // Cross: degree vs employment rate
        $degreeVsEmployment = [];
        foreach ($respondents->groupBy('courses') as $degree => $users) {
            $empCount = 0;
            foreach ($users as $u) {
                $ans = strtolower($employmentAnswers[$u->id] ?? '');
                foreach ($employedKeywords as $kw) {
                    if (str_contains($ans, $kw)) { $empCount++; break; }
                }
            }
            $degreeVsEmployment[] = [
                'degree'          => $degree ?: 'Unknown',
                'total'           => $users->count(),
                'employed'        => $empCount,
                'employment_rate' => $users->count() > 0 ? round(($empCount / $users->count()) * 100, 1) : 0,
            ];
        }

        // --- 5. Trend Analysis by year ---
        $trendByYear = [];
        $allYears = $respondents->pluck('year_graduated')->unique()->sort()->values();

        foreach ($allYears as $yr) {
            $yrUserIds = $respondents->where('year_graduated', $yr)->pluck('id');
            $yrEmpAnswers = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $yrUserIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', '%employ%'))
                ->pluck('answer_value', 'user_id');

            $yrEmpCount = 0;
            foreach ($yrEmpAnswers as $ans) {
                $lower = strtolower($ans ?? '');
                foreach ($employedKeywords as $kw) {
                    if (str_contains($lower, $kw)) { $yrEmpCount++; break; }
                }
            }

            $yrSectionScores = [];
            foreach ($survey->sections as $section) {
                $scale = $section->likert_scale ?? [];
                if (empty($scale)) continue;
                $scoreMap = [];
                foreach ($scale as $i => $label) {
                    $scoreMap[strtolower(trim($label))] = $i + 1;
                }
                $answers = Response::where('survey_id', $survey->id)
                    ->whereIn('user_id', $yrUserIds)
                    ->whereHas('question', fn($q) => $q->where('section_id', $section->id))
                    ->pluck('answer_value');
                $scores = $answers->map(function($a) use ($scoreMap) {
                    $normalized = strtolower(trim(preg_replace('/\s+/', ' ', $a ?? '')));
                    if (isset($scoreMap[$normalized])) return $scoreMap[$normalized];
                    foreach ($scoreMap as $key => $score) {
                        if (str_contains($normalized, $key) || str_contains($key, $normalized)) return $score;
                    }
                    return null;
                })->filter();
                if ($scores->count() > 0) {
                    $yrSectionScores[$section->title] = round($scores->avg(), 2);
                }
            }

            $trendByYear[] = [
                'year'            => $yr,
                'total'           => $yrUserIds->count(),
                'employed'        => $yrEmpCount,
                'employment_rate' => $yrUserIds->count() > 0 ? round(($yrEmpCount / $yrUserIds->count()) * 100, 1) : 0,
                'section_scores'  => $yrSectionScores,
            ];
        }

        // --- 7. Text Response Analysis ---
        $textAnalysis = [];
        foreach ($survey->sections as $section) {
            foreach ($section->questions as $question) {
                if (!in_array($question->type, ['text', 'textarea'])) continue;
                $answers = Response::where('survey_id', $survey->id)
                    ->whereIn('user_id', $respondentIds)
                    ->where('question_id', $question->id)
                    ->pluck('answer_value')
                    ->filter()
                    ->values();

                if ($answers->isEmpty()) continue;

                // Word frequency
                $words = [];
                foreach ($answers as $ans) {
                    $tokens = preg_split('/\s+/', strtolower(preg_replace('/[^a-zA-Z\s]/', '', $ans)));
                    $stopwords = ['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','i','my','we','it','that','this','be','have','has','had','not','no','so','as','by','do','did','if','up','out','can','will','just','from','they','their','our','your','you','he','she','his','her','its','been','also','more','than','about','what','how','when','where','who','which','there','then','than','into','over','after','before','all','any','some','would','could','should','may','might','must','shall'];
                    foreach ($tokens as $w) {
                        if (strlen($w) > 3 && !in_array($w, $stopwords)) {
                            $words[$w] = ($words[$w] ?? 0) + 1;
                        }
                    }
                }
                arsort($words);
                $topWords = array_slice($words, 0, 20, true);

                $textAnalysis[] = [
                    'question_id'    => $question->id,
                    'question_label' => $question->label,
                    'section_title'  => $section->title,
                    'response_count' => $answers->count(),
                    'top_keywords'   => $topWords,
                    'sample_answers' => $answers->take(3)->values()->toArray(),
                ];
            }
        }

        // --- Per-question chart data (non-likert) ---
        $chartQuery = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea']))
            ->select('question_id', 'answer_value', DB::raw('COUNT(*) as count'))
            ->groupBy('question_id', 'answer_value')
            ->with('question.section')
            ->get();

        $questionsMap = [];
        foreach ($chartQuery as $row) {
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
                    'data'          => [],
                ];
            }
            $questionsMap[$qid]['data'][] = [
                'label' => $row->answer_value,
                'value' => (int) $row->count,
            ];
        }

        $sectionSummary = $survey->sections->map(function ($section) use ($survey, $respondentIds) {
            $count = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('section_id', $section->id))
                ->distinct('user_id')->count('user_id');
            return ['section_id' => $section->id, 'title' => $section->title, 'response_count' => $count];
        })->values()->all();

        return Inertia::render('Admin/SurveyAnalytics', [
            'survey'              => $survey,
            'sections'            => $survey->sections,
            'analytics'           => array_values($questionsMap),
            'totalRespondents'    => $totalRespondents,
            'sectionSummary'      => $sectionSummary,
            'descriptive'         => [
                'degree_distribution' => $degreeDistribution,
                'year_distribution'   => $yearDistribution,
            ],
            'employment'          => [
                'rate'        => $employmentRate,
                'employed'    => $employedCount,
                'unemployed'  => $unemployedCount,
                'breakdown'   => $employmentBreakdown,
                'salary'      => $salaryStats,
                'industry'    => $industryBreakdown,
            ],
            'likertGroups'        => $likertGroups,
            'crossAnalysis'       => [
                'section_vs_employment' => $sectionVsEmployment,
                'section_vs_salary'     => $sectionVsSalary,
                'degree_vs_employment'  => $degreeVsEmployment,
            ],
            'trendByYear'         => $trendByYear,
            'textAnalysis'        => $textAnalysis,
            'filters'             => compact('yearGraduated', 'from', 'to'),
        ]);
    }
}
