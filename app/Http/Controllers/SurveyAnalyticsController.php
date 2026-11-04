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

    public function tracerStudyIndex(Request $request)
    {
        $this->authorize('viewAnalytics', Survey::class);

        $base = Survey::withCount('sections')
            ->where('type', 'Tracer Study')
            ->has('responses');

        $surveys = (clone $base)
            ->whereNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'page')
            ->through(fn ($s) => [
                'id'             => $s->id,
                'title'          => $s->title,
                'status'         => $s->status,
                'sections_count' => $s->sections_count,
                'type'           => $s->type,
                'archived_at'    => $s->archived_at,
            ])
            ->withQueryString();

        $archivedSurveys = (clone $base)
            ->whereNotNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'archived_page')
            ->through(fn ($s) => [
                'id'             => $s->id,
                'title'          => $s->title,
                'status'         => $s->status,
                'sections_count' => $s->sections_count,
                'type'           => $s->type,
                'archived_at'    => $s->archived_at,
            ])
            ->withQueryString();

        $latestActiveTracerId = Survey::tracerStudy()
            ->where('status', 'active')
            ->whereNull('archived_at')
            ->latest()
            ->value('id');

        return Inertia::render('Admin/AnalyticsIndex', [
            'surveys'         => $surveys,
            'archivedSurveys' => $archivedSurveys,
            'type'            => 'tracer',
            'latestTracerId'  => $latestActiveTracerId,
        ]);
    }

    public function alumniFormsIndex(Request $request)
    {
        $this->authorize('viewAnalytics', Survey::class);

        $base = Survey::withCount('sections')
            ->where('type', 'Alumni Forms')
            ->has('responses');

        $surveys = (clone $base)
            ->whereNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'page')
            ->through(fn ($s) => [
                'id'             => $s->id,
                'title'          => $s->title,
                'status'         => $s->status,
                'sections_count' => $s->sections_count,
                'type'           => $s->type,
                'archived_at'    => $s->archived_at,
            ])
            ->withQueryString();

        $archivedSurveys = (clone $base)
            ->whereNotNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'archived_page')
            ->through(fn ($s) => [
                'id'             => $s->id,
                'title'          => $s->title,
                'status'         => $s->status,
                'sections_count' => $s->sections_count,
                'type'           => $s->type,
                'archived_at'    => $s->archived_at,
            ])
            ->withQueryString();

        return Inertia::render('Admin/AnalyticsIndex', [
            'surveys'         => $surveys,
            'archivedSurveys' => $archivedSurveys,
            'type'            => 'alumni-forms',
        ]);
    }

    public function coordinatorIndex(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isCoordinator()) {
            abort(403, 'Only coordinators can access this analytics page.');
        }

        $base = Survey::withCount(['sections', 'responses'])
            ->where('created_by', $user->id)
            ->whereHas('responses');

        $surveys = (clone $base)
            ->whereNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'page')
            ->withQueryString();

        $archivedSurveys = (clone $base)
            ->whereNotNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'archived_page')
            ->withQueryString();

        return Inertia::render('Coordinator/CoordinatorAnalyticsIndex', [
            'surveys'         => $surveys,
            'archivedSurveys' => $archivedSurveys,
        ]);
    }

    public function latestTracerStudyAnalytics()
    {
        $this->authorize('viewAnalytics', Survey::class);

        $latestTracer = Survey::tracerStudy()
            ->whereNull('archived_at')
            ->has('responses')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$latestTracer) {
            return back()->with('error', 'No active tracer studies with responses found.');
        }

        return redirect()->route('admin.analytics.show', $latestTracer->id);
    }

    public function show(Survey $survey, Request $request)
    {
        $this->authorize('viewAnalytics', Survey::class);

        $yearGraduated = $request->query('year_graduated');
        $semester      = $request->query('semester');

        $latestYear = (int) date('Y') - 1;
        $validYears = [];
        for ($y = $latestYear; $y >= 1990; $y--) {
            $validYears[] = "{$y}-" . ($y + 1);
        }
        $applyYear     = $yearGraduated && in_array($yearGraduated, $validYears);
        $applySemester = $semester && in_array($semester, ['1st Semester', '2nd Semester', '3rd Semester', 'Summer']);

        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order'),
            ]),
        ]);

        // --- Base respondent user IDs (filtered) ---
        $respondentQuery = Response::where('survey_id', $survey->id)
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) => $u->where(function($u2) use ($yearGraduated) {
                [$startY, $endY] = explode('-', $yearGraduated);
                $u2->where('start_year', (int)$startY)->where('end_year', (int)$endY);
            })))
            ->when($applySemester, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('semester', $semester)
            ));

        $respondentIds = (clone $respondentQuery)->distinct('user_id')->pluck('user_id');
        $totalRespondents = $respondentIds->count();

        // --- 1. Descriptive Statistics & Alumni Population ---
        $respondents = User::whereIn('id', $respondentIds)->with('employment')->get();

        // Total registered alumni in the alumni list (filtered by year/semester if selected)
        $populationUsers = User::where('user_role', 'alumna')
            ->where('status', 'active')
            ->when($applyYear, function ($q) use ($yearGraduated) {
                [$startY, $endY] = explode('-', $yearGraduated);
                $q->where('start_year', (int) $startY)->where('end_year', (int) $endY);
            })
            ->when($applySemester, fn($q) => $q->where('semester', $semester))
            ->get();

        $totalPopulation = $populationUsers->count();

        // Threshold rules for statistical reliability & privacy protection
        $minSuppress = 5;  // Suppress point estimates when subgroup n < 5
        $minFlag     = 10; // Flag estimates as low-sample caution when 5 <= n < 10

        $degreeDistribution = $respondents->groupBy('courses')
            ->map(fn($g) => $g->count())->sortDesc()->toArray();

        // Group by start_year-end_year pair since there's no year_graduated column
        $yearDistribution = $respondents->map(fn($u) => $u->start_year && $u->end_year
                ? "{$u->start_year}-{$u->end_year}" : null)
            ->filter()
            ->countBy()
            ->sortKeys()
            ->toArray();

        // --- 1A. Per-Course Sample-Size Target (Slovin's Formula, e = 0.05) & Progress ---
        $baseCourses = ['BSIT', 'BSCS', 'BSCpE', 'BSEcE'];
        $allCourses = collect($baseCourses)
            ->merge($populationUsers->pluck('courses')->filter())
            ->merge($respondents->pluck('courses')->filter())
            ->unique()
            ->values();

        $sampleTargets = [];
        $populationByCourse = [];
        foreach ($allCourses as $courseCode) {
            $popCount  = $populationUsers->where('courses', $courseCode)->count();
            $respCount = $respondents->where('courses', $courseCode)->count();

            if ($popCount === 0 && $respCount === 0) {
                continue;
            }

            // Slovin's finite population sample size target: n = ceil(N / (1 + N * e^2)), e = 0.05
            $marginOfError = 0.05;
            $targetSample  = $popCount > 0
                ? (int) ceil($popCount / (1 + ($popCount * ($marginOfError ** 2))))
                : $respCount;

            $progressPct  = $targetSample > 0 ? round(($respCount / $targetSample) * 100, 1) : 0;
            $responseRate = $popCount > 0 ? round(($respCount / $popCount) * 100, 1) : 0;
            $notAnswered  = max(0, $popCount - $respCount);
            $isSuppressed = $respCount < $minSuppress;
            $isFlagged    = !$isSuppressed && ($respCount < $minFlag || ($targetSample >= $minSuppress && $progressPct < 50));

            $status = 'in_progress';
            if ($targetSample > 0 && $respCount >= $targetSample) {
                $status = 'met';
            } elseif ($isSuppressed) {
                $status = 'suppressed';
            } elseif ($isFlagged) {
                $status = 'flagged';
            }

            $sampleTargets[] = [
                'course'        => $courseCode,
                'population'    => $popCount,
                'target'        => $targetSample,
                'respondents'   => $respCount,
                'progress_pct'  => $progressPct,
                'response_rate' => $responseRate,
                'suppressed'    => $isSuppressed,
                'flagged'       => $isFlagged,
                'status'        => $status,
            ];

            $populationByCourse[] = [
                'course'       => $courseCode,
                'total_alumni' => $popCount,
                'answered'     => $respCount,
                'not_answered' => $notAnswered,
                'turnout_pct'  => $responseRate,
                'suppressed'   => $isSuppressed,
                'flagged'      => $isFlagged,
            ];
        }

        // --- 1B. Respondent vs. Registered Alumni Population Comparison Report ---
        $popYears = $populationUsers->map(fn($u) => $u->start_year && $u->end_year ? "{$u->start_year}-{$u->end_year}" : null)
            ->merge($respondents->map(fn($u) => $u->start_year && $u->end_year ? "{$u->start_year}-{$u->end_year}" : null))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        $populationByYear = [];
        foreach ($popYears as $yr) {
            [$sy, $ey] = explode('-', $yr);
            $popYrCount  = $populationUsers->filter(fn($u) => (string) $u->start_year === $sy && (string) $u->end_year === $ey)->count();
            $respYrCount = $respondents->filter(fn($u) => (string) $u->start_year === $sy && (string) $u->end_year === $ey)->count();
            $populationByYear[] = [
                'year'         => $yr,
                'total_alumni' => $popYrCount,
                'answered'     => $respYrCount,
                'not_answered' => max(0, $popYrCount - $respYrCount),
                'turnout_pct'  => $popYrCount > 0 ? round(($respYrCount / $popYrCount) * 100, 1) : 0,
                'suppressed'   => $respYrCount < $minSuppress,
                'flagged'      => $respYrCount >= $minSuppress && $respYrCount < $minFlag,
            ];
        }

        $populationComparison = [
            'total_alumni'       => $totalPopulation,
            'total_answered'     => $totalRespondents,
            'total_not_answered' => max(0, $totalPopulation - $totalRespondents),
            'overall_turnout'    => $totalPopulation > 0 ? round(($totalRespondents / $totalPopulation) * 100, 1) : 0,
            'by_course'          => $populationByCourse,
            'by_year'            => $populationByYear,
        ];

        // --- Helper: get answers for a question label keyword ---
        $getAnswersForQuestion = function(string $keyword) use ($survey, $respondentIds) {
            return Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', "%{$keyword}%"))
                ->pluck('answer_value');
        };

        // --- 2. Employment Analysis ---
        // Find employment status from "Are you currently employed?" question specifically
        $employmentAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%currently employed%'))
            ->pluck('answer_value', 'user_id');

        $employedKeywords   = ['yes', 'employed', 'permanent', 'probationary', 'contractual', 'part-time', 'self-employed'];
        $unemployedKeywords = ['unemployed', 'not employed', 'no job', 'no'];

        $employedCount   = 0;
        $unemployedCount = 0;
        $employmentBreakdown = [];

        foreach ($employmentAnswers as $ans) {
            $lower = strtolower(trim($ans ?? ''));
            $isEmployed = false;
            
            // Check if answer indicates employment
            foreach ($employedKeywords as $kw) {
                if (str_contains($lower, $kw)) { 
                    $isEmployed = true; 
                    break; 
                }
            }

            if ($isEmployed) {
                $employedCount++;
            } else {
                $unemployedCount++;
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

        $salaryCount = $salaryAnswers->count();
        $salaryStats = $salaryCount > 0 ? [
            'min'        => $salaryCount >= $minSuppress ? $salaryAnswers->min() : null,
            'max'        => $salaryCount >= $minSuppress ? $salaryAnswers->max() : null,
            'average'    => $salaryCount >= $minSuppress ? round($salaryAnswers->avg(), 2) : null,
            'count'      => $salaryCount,
            'suppressed' => $salaryCount < $minSuppress,
            'flagged'    => $salaryCount >= $minSuppress && $salaryCount < $minFlag,
        ] : null;

        // Industry/company type (exclude placeholders like *, N/A, None)
        $industryAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%industry%')->orWhere('label', 'like', '%current employment%'))
            ->pluck('answer_value')
            ->filter(fn($v) => !in_array(strtolower(trim((string) $v)), ['', '*', 'n/a', 'na', 'none', '-', 'unemployed']));

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
            $uCount = $users->count();
            $degreeVsEmployment[] = [
                'degree'          => $degree ?: 'Unknown',
                'total'           => $uCount,
                'employed'        => $empCount,
                'employment_rate' => $uCount > 0 ? round(($empCount / $uCount) * 100, 1) : 0,
                'suppressed'      => $uCount < $minSuppress,
                'flagged'         => $uCount >= $minSuppress && $uCount < $minFlag,
            ];
        }

        // --- 5. Trend Analysis by year ---
        $trendByYear = [];
        $allYears = $respondents->map(fn($u) => $u->start_year && $u->end_year
                ? "{$u->start_year}-{$u->end_year}" : null)
            ->filter()->unique()->sort()->values();

        foreach ($allYears as $yr) {
            [$sy, $ey] = explode('-', $yr);
            $yrUserIds = $respondents->filter(fn($u) => (string)$u->start_year === $sy && (string)$u->end_year === $ey)->pluck('id');
            $yrEmpAnswers = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $yrUserIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', '%currently employed%'))
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

            $yrCount = $yrUserIds->count();
            $trendByYear[] = [
                'year'            => $yr,
                'total'           => $yrCount,
                'employed'        => $yrEmpCount,
                'employment_rate' => $yrCount > 0 ? round(($yrEmpCount / $yrCount) * 100, 1) : 0,
                'section_scores'  => $yrSectionScores,
                'suppressed'      => $yrCount < $minSuppress,
                'flagged'         => $yrCount >= $minSuppress && $yrCount < $minFlag,
            ];
        }

        // --- 6. Job-to-Course Relevance Capture & Scoring ---
        // Evaluates ONLY whether the graduate's job title and industry match their respective degree program
        $positionAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%position%')->orWhere('label', 'like', '%job title%'))
            ->pluck('answer_value', 'user_id');

        $companyNameAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%current employment%')->orWhere('label', 'like', '%name of company%'))
            ->pluck('answer_value', 'user_id');

        $companyNatureAnswers = Response::where('survey_id', $survey->id)
            ->whereIn('user_id', $respondentIds)
            ->whereHas('question', fn($q) => $q->where('label', 'like', '%nature of company%')->orWhere('label', 'like', '%industry%'))
            ->pluck('answer_value', 'user_id');

        // Course-specific keywords and labels
        $courseDomainConfig = [
            'BSIT' => [
                'related_label'     => 'IT Related',
                'not_related_label' => 'Not IT Related',
                'keywords'          => [
                    'software', 'developer', 'programmer', 'web', 'system', 'network', 'data', 'database',
                    'it ', 'it-', 'information technology', 'technical support', 'tech support', 'helpdesk',
                    'cyber', 'security', 'cloud', 'qa', 'quality assurance', 'tester', 'ui', 'ux', 'designer',
                    'frontend', 'backend', 'fullstack', 'devops', 'analyst', 'computer', 'multimedia', 'ict',
                    'application', 'erp', 'sap', 'digital', 'technology', 'tech', 'instructor', 'professor',
                ],
            ],
            'BSCS' => [
                'related_label'     => 'CS Related',
                'not_related_label' => 'Not CS Related',
                'keywords'          => [
                    'software', 'developer', 'programmer', 'web', 'system', 'network', 'data', 'database',
                    'it ', 'information technology', 'computer science', 'technical support', 'tech support',
                    'cyber', 'security', 'cloud', 'qa', 'quality assurance', 'ai', 'machine learning',
                    'frontend', 'backend', 'fullstack', 'devops', 'analyst', 'computer', 'research', 'algorithm',
                    'application', 'technology', 'tech', 'instructor', 'professor',
                ],
            ],
            'BSCpE' => [
                'related_label'     => 'CpE Related',
                'not_related_label' => 'Not CpE Related',
                'keywords'          => [
                    'computer', 'engineer', 'engineering', 'hardware', 'embedded', 'firmware', 'robotics',
                    'iot', 'microcontroller', 'circuit', 'semiconductor', 'automation', 'network', 'system',
                    'software', 'developer', 'programmer', 'it ', 'information technology', 'technical support',
                    'tech support', 'data', 'cloud', 'cyber', 'qa', 'quality assurance', 'analyst', 'telecom',
                    'electronics', 'technology', 'tech', 'cad', 'r&d', 'instructor', 'professor',
                ],
            ],
            'BSEcE' => [
                'related_label'     => 'EcE Related',
                'not_related_label' => 'Not EcE Related',
                'keywords'          => [
                    'electronics', 'electronic', 'ece', 'telecom', 'telecommunications', 'broadcast', 'rf',
                    'radio', 'signal', 'network', 'semiconductor', 'hardware', 'circuit', 'instrumentation',
                    'automation', 'control', 'embedded', 'engineer', 'engineering', 'technical', 'technician',
                    'maintenance', 'power', 'manufacturing', 'system', 'it ', 'software', 'technology', 'tech',
                    'instructor', 'professor',
                ],
            ],
        ];

        $defaultDomainConfig = [
            'related_label'     => 'Course Related',
            'not_related_label' => 'Not Course Related',
            'keywords'          => [
                'software', 'developer', 'programmer', 'engineer', 'it ', 'information technology',
                'system', 'network', 'data', 'web', 'cyber', 'cloud', 'database', 'support',
                'technical', 'computer', 'electronics', 'telecom', 'hardware', 'qa', 'quality assurance',
                'analyst', 'devops', 'ui', 'ux', 'designer', 'frontend', 'backend', 'fullstack',
                'technology', 'tech', 'ict', 'instructor', 'professor',
            ],
        ];

        $cleanField = function (?string $val): string {
            $trimmed = trim((string) $val);
            return in_array(strtolower($trimmed), ['', '*', 'n/a', 'na', 'none', '-', 'unemployed']) ? '' : $trimmed;
        };

        $relevantCount    = 0;
        $notRelevantCount = 0;
        $courseRelevanceMap = [];
        $relevantJobsAgg    = [];
        $notRelevantJobsAgg = [];

        foreach ($respondents as $u) {
            $empAns = strtolower(trim($employmentAnswers[$u->id] ?? ($u->employment?->currently_employed ?? '')));
            $isEmp  = false;
            foreach ($employedKeywords as $kw) {
                if (str_contains($empAns, $kw)) { $isEmp = true; break; }
            }
            if (!$isEmp) {
                continue;
            }

            $courseCode = $u->courses ?: 'Unknown';
            $cfg = $courseDomainConfig[$courseCode] ?? $defaultDomainConfig;

            $posRaw     = $cleanField($positionAnswers[$u->id] ?? '') ?: $cleanField($u->employment?->position ?? '');
            $natureRaw  = $cleanField($companyNatureAnswers[$u->id] ?? '');
            $compRaw    = $cleanField($companyNameAnswers[$u->id] ?? '') ?: $cleanField($u->employment?->company_name ?? '');

            $industryOrCompany = $natureRaw ?: $compRaw;
            $combinedLower = strtolower(trim($posRaw . ' ' . $natureRaw . ' ' . $compRaw));

            if ($combinedLower === '') {
                continue;
            }

            $isRelevant = false;
            foreach ($cfg['keywords'] as $kw) {
                if (str_contains($combinedLower, $kw)) {
                    $isRelevant = true;
                    break;
                }
            }

            if ($isRelevant) {
                $relevantCount++;
            } else {
                $notRelevantCount++;
            }

            $displayPosition = $posRaw ?: 'Unspecified Role';
            $displayIndustry = $industryOrCompany ?: 'Unspecified Industry';
            $jobKey = strtolower($courseCode . '|' . $displayPosition . '|' . $displayIndustry);

            $jobEntry = [
                'position' => $displayPosition,
                'industry' => $displayIndustry,
                'company'  => $compRaw ?: $displayIndustry,
                'course'   => $courseCode,
                'label'    => $isRelevant ? $cfg['related_label'] : $cfg['not_related_label'],
                'count'    => 1,
            ];

            if ($isRelevant) {
                if (isset($relevantJobsAgg[$jobKey])) {
                    $relevantJobsAgg[$jobKey]['count']++;
                } else {
                    $relevantJobsAgg[$jobKey] = $jobEntry;
                }
            } else {
                if (isset($notRelevantJobsAgg[$jobKey])) {
                    $notRelevantJobsAgg[$jobKey]['count']++;
                } else {
                    $notRelevantJobsAgg[$jobKey] = $jobEntry;
                }
            }

            $courseRelevanceMap[$courseCode][] = [
                'relevant' => $isRelevant,
            ];
        }

        $evalCount = $relevantCount + $notRelevantCount;
        $relevantJobsList    = array_values($relevantJobsAgg);
        $notRelevantJobsList = array_values($notRelevantJobsAgg);
        usort($relevantJobsList, fn($a, $b) => $b['count'] <=> $a['count']);
        usort($notRelevantJobsList, fn($a, $b) => $b['count'] <=> $a['count']);

        $relevanceByCourse = [];
        foreach ($allCourses as $courseCode) {
            $items  = $courseRelevanceMap[$courseCode] ?? [];
            $cCount = count($items);
            if ($cCount === 0 && $respondents->where('courses', $courseCode)->count() === 0) {
                continue;
            }
            $cfg = $courseDomainConfig[$courseCode] ?? $defaultDomainConfig;
            $cRelevant    = count(array_filter($items, fn($i) => $i['relevant']));
            $cNotRelevant = $cCount - $cRelevant;
            $cRelRate     = $cCount > 0 ? round(($cRelevant / $cCount) * 100, 1) : 0;

            $relevanceByCourse[] = [
                'course'             => $courseCode,
                'evaluated'          => $cCount,
                'relevant_count'     => $cRelevant,
                'not_relevant_count' => $cNotRelevant,
                'relevant_rate'      => $cCount >= $minSuppress ? $cRelRate : null,
                'related_label'      => $cfg['related_label'],
                'not_related_label'  => $cfg['not_related_label'],
                'suppressed'         => $cCount < $minSuppress,
                'flagged'            => $cCount >= $minSuppress && $cCount < $minFlag,
            ];
        }

        $jobRelevance = [
            'evaluated_count'    => $evalCount,
            'relevant_count'     => $relevantCount,
            'not_relevant_count' => $notRelevantCount,
            'relevant_rate'      => $evalCount >= $minSuppress && $evalCount > 0 ? round(($relevantCount / $evalCount) * 100, 1) : null,
            'not_relevant_rate'  => $evalCount >= $minSuppress && $evalCount > 0 ? round(($notRelevantCount / $evalCount) * 100, 1) : null,
            'suppressed'         => $evalCount < $minSuppress,
            'flagged'            => $evalCount >= $minSuppress && $evalCount < $minFlag,
            'method_summary'     => 'Based on whether the graduate’s job title and industry match their respective degree program.',
            'relevant_jobs'      => $relevantJobsList,
            'not_relevant_jobs'  => $notRelevantJobsList,
            'by_course'          => $relevanceByCourse,
        ];

        $thresholdRules = [
            'min_suppress'       => $minSuppress,
            'min_flag'           => $minFlag,
            'overall_suppressed' => $totalRespondents < $minSuppress,
            'overall_flagged'    => $totalRespondents >= $minSuppress && $totalRespondents < $minFlag,
            'suppressed_courses' => collect($sampleTargets)->where('suppressed', true)->pluck('course')->values()->all(),
            'flagged_courses'    => collect($sampleTargets)->where('flagged', true)->pluck('course')->values()->all(),
        ];

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
            ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea'])
                                               ->where('label', 'not like', '%mobile number%'))
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
            'survey'               => $survey,
            'sections'             => $survey->sections,
            'analytics'            => array_values($questionsMap),
            'totalRespondents'     => $totalRespondents,
            'sectionSummary'       => $sectionSummary,
            'descriptive'          => [
                'degree_distribution' => $degreeDistribution,
                'year_distribution'   => $yearDistribution,
            ],
            'sampleTargets'        => $sampleTargets,
            'populationComparison' => $populationComparison,
            'jobRelevance'         => $jobRelevance,
            'thresholdRules'       => $thresholdRules,
            'employment'           => [
                'rate'        => $employmentRate,
                'employed'    => $employedCount,
                'unemployed'  => $unemployedCount,
                'breakdown'   => $employmentBreakdown,
                'salary'      => $salaryStats,
                'industry'    => $industryBreakdown,
            ],
            'likertGroups'         => $likertGroups,
            'crossAnalysis'        => [
                'section_vs_employment' => $sectionVsEmployment,
                'section_vs_salary'     => $sectionVsSalary,
                'degree_vs_employment'  => $degreeVsEmployment,
            ],
            'trendByYear'          => $trendByYear,
            'textAnalysis'         => $textAnalysis,
            'filters'              => compact('yearGraduated', 'semester'),
        ]);
    }

    /**
     * Employment Location Analytics
     * Compares home address vs company location to determine local vs external employment
     */
    public function employmentLocationAnalytics()
    {
        $this->authorize('viewAnalytics', Survey::class);

        // Get all employed alumni with location and address data
        $employedUsers = User::where('user_role', 'alumna')
            ->whereHas('employment', function($q) {
                $q->whereNotNull('location')
                  ->where('location', '!=', '');
            })
            ->with(['employment', 'address'])
            ->get();

        $cityDistribution = [];
        $detailedData = [];

        foreach ($employedUsers as $user) {
            $companyLocation = strtolower(trim($user->employment->location));
            $homeAddress = $user->address?->full_address ?? ($user->address ? strtolower(trim($user->address)) : '');

            $companyCity = $this->extractCity($companyLocation);

            // Prioritize structured city from addresses table if available
            if (!empty($user->address?->city)) {
                $homeCity = $user->address->city;
            } else {
                $homeCity = $homeAddress ? $this->extractCity($homeAddress) : 'Unknown';
                if ($homeCity === 'Unknown' && $homeAddress) {
                    $homeCity = ucwords($homeAddress);
                }
            }

            if (!isset($cityDistribution[$companyCity])) {
                $cityDistribution[$companyCity] = ['city' => $companyCity, 'count' => 0];
            }
            $cityDistribution[$companyCity]['count']++;

            $detailedData[] = [
                'name'           => $user->first_name . ' ' . $user->last_name,
                'home_city'      => $homeCity,
                'company_city'   => $companyCity,
                'company_name'   => $user->employment->company_name,
                'start_year'     => $user->start_year,
                'end_year'       => $user->end_year,
                'year_graduated' => ($user->start_year && $user->end_year)
                                     ? "{$user->start_year}-{$user->end_year}" : null,
                'course'         => $user->courses,
            ];
        }

        $totalEmployed = count($detailedData);

        usort($cityDistribution, fn($a, $b) => $b['count'] <=> $a['count']);

        return Inertia::render('Admin/EmploymentLocationAnalytics', [
            'summary' => [
                'total_employed' => $totalEmployed,
                'total_cities'   => count($cityDistribution),
            ],
            'cityDistribution' => $cityDistribution,
            'detailedData'     => $detailedData,
        ]);
    }

    public function downloadEmploymentLocationCsv(Request $request)
    {
        $this->authorize('viewAnalytics', Survey::class);

        $employmentData = User::where('user_role', 'alumna')
            ->has('employment')
            ->with(['employment', 'profile'])
            ->get();

        $cityFilter = $request->query('city');

        $filename = 'employment_location_report_' . date('Y-m-d') . '.csv';
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($employmentData, $cityFilter) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, ['Employment Location Report']);
            fputcsv($file, ['Generated On', date('Y-m-d H:i:s')]);
            if ($cityFilter && $cityFilter !== 'all') {
                fputcsv($file, ['Filter (City)', $cityFilter]);
            }
            fputcsv($file, []);

            fputcsv($file, ['Name', 'Program', 'Year Graduated', 'Home City', 'Company Name', 'Workplace City']);

            foreach ($employmentData as $user) {
                $rawCompany = $user->employment->company_address ?? '';
                $companyCity = $rawCompany ? $this->extractCity($rawCompany) : 'Unknown';
                if ($companyCity === 'Unknown' && $rawCompany) {
                    $companyCity = ucwords($rawCompany);
                }

                if ($cityFilter && $cityFilter !== 'all' && strcasecmp($companyCity, $cityFilter) !== 0) {
                    continue;
                }

                $homeAddress = $user->profile?->current_address ?? $user->profile?->permanent_address ?? '';
                $homeCity = $homeAddress ? $this->extractCity($homeAddress) : 'Unknown';
                if ($homeCity === 'Unknown' && $homeAddress) {
                    $homeCity = ucwords($homeAddress);
                }

                $gradYear = ($user->start_year && $user->end_year)
                    ? "{$user->start_year}-{$user->end_year}"
                    : '';

                fputcsv($file, [
                    $user->first_name . ' ' . $user->last_name,
                    $user->courses ?? '',
                    $gradYear,
                    $homeCity,
                    $user->employment->company_name ?? '',
                    $companyCity,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Normalize address by removing barangay prefixes and common noise
     */
    private function normalizeAddress(string $address): string
    {
        $address = strtolower(trim($address));

        // Remove barangay prefixes (case-insensitive)
        $barangayPrefixes = [
            'barangay ',
            'brgy. ',
            'brgy ',
            'bgy. ',
            'bgy ',
            'bgry. ',
            'bgry ',
        ];

        foreach ($barangayPrefixes as $prefix) {
            if (str_starts_with($address, $prefix)) {
                $address = substr($address, strlen($prefix));
                break;
            }
        }

        // Remove multiple spaces
        $address = preg_replace('/\s+/', ' ', $address);

        return trim($address);
    }

    /**
     * Extract city name from address string
     */
    private function extractCity(string $address): string
    {
        // Normalize address first (remove barangay prefixes)
        $address = $this->normalizeAddress($address);

        // Comprehensive list of cities and municipalities
        $cities = [
            // Nueva Ecija cities
            'cabanatuan city', 'cabanatuan',
            'gapan city', 'gapan',
            'san jose city', 'san jose',
            'nueva ecija',
            // Metro Manila
            'quezon city', 'manila', 'makati city', 'makati', 'taguig city', 'taguig',
            'pasig city', 'pasig', 'mandaluyong city', 'mandaluyong',
            'san juan city', 'san juan', 'caloocan city', 'caloocan',
            'malabon city', 'malabon', 'navotas city', 'navotas',
            'valenzuela city', 'valenzuela', 'marikina city', 'marikina',
            'pasay city', 'pasay', 'paranaque city', 'paranaque',
            'las pinas city', 'las pinas', 'muntinlupa city', 'muntinlupa',
            'pateros',
            // Pampanga
            'angeles city', 'angeles', 'clark', 'san fernando city', 'san fernando',
            'pampanga',
            // Other major cities
            'cebu city', 'cebu', 'davao city', 'davao',
            'baguio city', 'baguio', 'iloilo city', 'iloilo', 'bacolod city', 'bacolod',
            // Provinces
            'bulacan', 'tarlac', 'pangasinan', 'bataan', 'zambales',
            'laguna', 'cavite', 'rizal', 'batangas',
        ];

        // Check for city matches (prioritize longer matches first)
        usort($cities, fn($a, $b) => strlen($b) - strlen($a));

        foreach ($cities as $city) {
            if (str_contains($address, $city)) {
                return ucwords($city);
            }
        }

        // Fallback: extract first significant word after removing common prefixes
        $words = array_filter(
            explode(' ', $address),
            fn($w) => strlen($w) > 3 && !in_array($w, ['city', 'street', 'road', 'avenue', 'subdivision', 'subd', 'village', 'phase', 'block', 'lot'])
        );

        return ucwords($words[0] ?? 'Unknown');
    }

    /**
     * Download survey analytics as CSV
     */
    public function downloadAnalytics(Survey $survey, Request $request)
    {
        $this->authorize('viewAnalytics', Survey::class);

        // Get the same data as the show method
        $yearGraduated = $request->query('year_graduated');
        $semester      = $request->query('semester');

        $latestYear = (int) date('Y') - 1;
        $validYears = [];
        for ($y = $latestYear; $y >= 1990; $y--) {
            $validYears[] = "{$y}-" . ($y + 1);
        }
        $applyYear     = $yearGraduated && in_array($yearGraduated, $validYears);
        $applySemester = $semester && in_array($semester, ['1st Semester', '2nd Semester', '3rd Semester', 'Summer']);

        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order'),
            ]),
        ]);

        $respondentQuery = Response::where('survey_id', $survey->id)
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) => $u->where(function($u2) use ($yearGraduated) {
                [$startY, $endY] = explode('-', $yearGraduated);
                $u2->where('start_year', (int)$startY)->where('end_year', (int)$endY);
            })))
            ->when($applySemester, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('semester', $semester)
            ));

        $respondentIds = (clone $respondentQuery)->distinct('user_id')->pluck('user_id');
        $totalRespondents = $respondentIds->count();
        $respondents = User::whereIn('id', $respondentIds)->get();

        // Prepare CSV content
        $filename = 'survey_analytics_' . $survey->id . '_' . date('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($survey, $totalRespondents, $respondents, $respondentIds) {
            $file = fopen('php://output', 'w');

            // Survey Header
            fputcsv($file, ['Survey Analytics Report']);
            fputcsv($file, ['Survey Title', $survey->title]);
            fputcsv($file, ['Generated On', date('Y-m-d H:i:s')]);
            fputcsv($file, ['Total Respondents', $totalRespondents]);
            fputcsv($file, []);

            // Degree Distribution
            fputcsv($file, ['Degree Distribution']);
            fputcsv($file, ['Degree', 'Count', 'Percentage']);
            $degreeDistribution = $respondents->groupBy('courses')->map(fn($g) => $g->count())->sortDesc();
            foreach ($degreeDistribution as $degree => $count) {
                $pct = $totalRespondents > 0 ? round(($count / $totalRespondents) * 100, 1) : 0;
                fputcsv($file, [$degree ?: 'Unknown', $count, $pct . '%']);
            }
            fputcsv($file, []);

            // Year Distribution
            fputcsv($file, ['Year Graduated Distribution']);
            fputcsv($file, ['Year', 'Count', 'Percentage']);
            $yearDistribution = $respondents
                ->map(fn($u) => ($u->start_year && $u->end_year) ? "{$u->start_year}-{$u->end_year}" : null)
                ->filter()->countBy()->sortKeys();
            foreach ($yearDistribution as $year => $count) {
                $pct = $totalRespondents > 0 ? round(($count / $totalRespondents) * 100, 1) : 0;
                fputcsv($file, [$year, $count, $pct . '%']);
            }
            fputcsv($file, []);

            // Employment Analysis
            $employmentAnswers = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', '%currently employed%'))
                ->pluck('answer_value', 'user_id');

            $employedKeywords   = ['yes', 'employed', 'permanent', 'probationary', 'contractual', 'part-time', 'self-employed'];
            $unemployedKeywords = ['unemployed', 'not employed', 'no job', 'no'];

            $employedCount = 0;
            $unemployedCount = 0;
            foreach ($employmentAnswers as $ans) {
                $lower = strtolower(trim($ans ?? ''));
                $isEmployed = false;
                foreach ($employedKeywords as $kw) {
                    if (str_contains($lower, $kw)) { $isEmployed = true; break; }
                }
                $isEmployed ? $employedCount++ : $unemployedCount++;
            }

            $employmentRate = $totalRespondents > 0 ? round(($employedCount / $totalRespondents) * 100, 1) : 0;

            fputcsv($file, ['Employment Statistics']);
            fputcsv($file, ['Metric', 'Value']);
            fputcsv($file, ['Employment Rate', $employmentRate . '%']);
            fputcsv($file, ['Employed', $employedCount]);
            fputcsv($file, ['Unemployed', $unemployedCount]);
            fputcsv($file, []);

            // Salary Statistics
            $salaryAnswers = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->where('label', 'like', '%salary%')->orWhere('label', 'like', '%income%'))
                ->pluck('answer_value')
                ->map(fn($v) => is_numeric($v) ? (float)$v : null)
                ->filter()
                ->values();

            if ($salaryAnswers->count() > 0) {
                fputcsv($file, ['Salary Statistics']);
                fputcsv($file, ['Metric', 'Value']);
                fputcsv($file, ['Minimum Salary', number_format($salaryAnswers->min(), 2)]);
                fputcsv($file, ['Maximum Salary', number_format($salaryAnswers->max(), 2)]);
                fputcsv($file, ['Average Salary', number_format($salaryAnswers->avg(), 2)]);
                fputcsv($file, ['Respondents with Salary Data', $salaryAnswers->count()]);
                fputcsv($file, []);
            }

            // Likert Scale Analysis
            foreach ($survey->sections as $section) {
                $scale = $section->likert_scale ?? [];
                if (empty($scale)) continue;

                $scoreMap = [];
                foreach ($scale as $i => $label) {
                    $scoreMap[strtolower(trim($label))] = $i + 1;
                }
                $maxScore = count($scale);

                fputcsv($file, ['Section: ' . $section->title]);
                fputcsv($file, ['Question', 'Average Score', 'Max Score', 'Response Count']);

                foreach ($section->questions as $question) {
                    $answers = Response::where('survey_id', $survey->id)
                        ->whereIn('user_id', $respondentIds)
                        ->where('question_id', $question->id)
                        ->pluck('answer_value');

                    $scores = $answers->map(function($a) use ($scoreMap) {
                        $normalized = strtolower(trim(preg_replace('/\s+/', ' ', $a ?? '')));
                        if (isset($scoreMap[$normalized])) return $scoreMap[$normalized];
                        foreach ($scoreMap as $key => $score) {
                            if (str_contains($normalized, $key) || str_contains($key, $normalized)) {
                                return $score;
                            }
                        }
                        return null;
                    })->filter()->values();

                    if ($scores->count() > 0) {
                        fputcsv($file, [
                            $question->label,
                            round($scores->avg(), 2),
                            $maxScore,
                            $scores->count()
                        ]);
                    }
                }
                fputcsv($file, []);
            }

            // Question Responses
            fputcsv($file, ['Question Response Summary']);
            fputcsv($file, ['Section', 'Question', 'Answer', 'Count']);

            $chartQuery = Response::where('survey_id', $survey->id)
                ->whereIn('user_id', $respondentIds)
                ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea'])
                                                   ->where('label', 'not like', '%mobile number%'))
                ->select('question_id', 'answer_value', DB::raw('COUNT(*) as count'))
                ->groupBy('question_id', 'answer_value')
                ->with('question.section')
                ->get();

            foreach ($chartQuery as $row) {
                $question = $row->question;
                if (!$question) continue;
                fputcsv($file, [
                    $question->section?->title ?? 'N/A',
                    $question->label,
                    $row->answer_value,
                    $row->count
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
