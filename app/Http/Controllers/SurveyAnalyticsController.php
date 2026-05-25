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
            'locationMigration'   => $this->getLocationMigrationData($respondentIds),
        ]);
    }

    /**
     * Get location migration summary for a specific set of respondent IDs
     * Used to embed migration data directly in the survey analytics view
     */
    private function getLocationMigrationData(\Illuminate\Support\Collection $respondentIds): array
    {
        $users = User::whereIn('id', $respondentIds)
            ->whereHas('employment', function($q) {
                $q->whereNotNull('location')
                  ->where('location', '!=', '');
            })
            ->whereNotNull('address')
            ->where('address', '!=', '')
            ->with('employment')
            ->get();

        $local = 0;
        $external = 0;

        foreach ($users as $user) {
            $isLocal = $this->isSameArea(
                strtolower(trim($user->address)),
                strtolower(trim($user->employment->location))
            );
            $isLocal ? $local++ : $external++;
        }

        $total = $local + $external;

        return [
            'local'              => $local,
            'external'           => $external,
            'total'              => $total,
            'local_percentage'   => $total > 0 ? round(($local / $total) * 100, 1) : 0,
            'external_percentage'=> $total > 0 ? round(($external / $total) * 100, 1) : 0,
        ];
    }

    /**
     * Employment Location Analytics
     * Compares home address vs company location to determine local vs external employment
     */
    public function employmentLocationAnalytics()
    {
        $this->authorize('viewAny', Survey::class);

        // Get all employed alumni with both address and location data
        $employedUsers = User::where('user_role', 'alumna')
            ->whereHas('employment', function($q) {
                $q->whereNotNull('location')
                  ->where('location', '!=', '');
            })
            ->whereNotNull('address')
            ->where('address', '!=', '')
            ->with('employment')
            ->get();

        $localCount = 0;
        $externalCount = 0;
        $cityDistribution = [];
        $detailedData = [];

        foreach ($employedUsers as $user) {
            $homeAddress = strtolower(trim($user->address));
            $companyLocation = strtolower(trim($user->employment->location));

            // Check if same area (now uses normalized addresses internally)
            $isLocal = $this->isSameArea($homeAddress, $companyLocation);

            if ($isLocal) {
                $localCount++;
            } else {
                $externalCount++;
            }

            // Track city distribution (now uses normalized addresses)
            $companyCity = $this->extractCity($companyLocation);
            $homeCity = $this->extractCity($homeAddress);

            if (!isset($cityDistribution[$companyCity])) {
                $cityDistribution[$companyCity] = [
                    'city' => $companyCity,
                    'local' => 0,
                    'external' => 0,
                    'total' => 0,
                ];
            }

            $cityDistribution[$companyCity]['total']++;
            if ($isLocal) {
                $cityDistribution[$companyCity]['local']++;
            } else {
                $cityDistribution[$companyCity]['external']++;
            }

            $detailedData[] = [
                'name' => $user->first_name . ' ' . $user->last_name,
                'home_city' => $homeCity,
                'company_city' => $companyCity,
                'company_name' => $user->employment->company_name,
                'is_local' => $isLocal,
                'year_graduated' => $user->year_graduated,
                'course' => $user->courses,
            ];
        }

        $totalEmployed = $localCount + $externalCount;
        $localPercentage = $totalEmployed > 0 ? round(($localCount / $totalEmployed) * 100, 1) : 0;
        $externalPercentage = $totalEmployed > 0 ? round(($externalCount / $totalEmployed) * 100, 1) : 0;

        // Sort city distribution by total
        usort($cityDistribution, fn($a, $b) => $b['total'] <=> $a['total']);

        // Year-wise breakdown
        $yearBreakdown = [];
        foreach ($detailedData as $record) {
            $year = $record['year_graduated'] ?? 'Unknown';
            if (!isset($yearBreakdown[$year])) {
                $yearBreakdown[$year] = ['year' => $year, 'local' => 0, 'external' => 0, 'total' => 0];
            }
            $yearBreakdown[$year]['total']++;
            if ($record['is_local']) {
                $yearBreakdown[$year]['local']++;
            } else {
                $yearBreakdown[$year]['external']++;
            }
        }
        $yearBreakdown = array_values($yearBreakdown);
        usort($yearBreakdown, fn($a, $b) => $a['year'] <=> $b['year']);

        // Course-wise breakdown
        $courseBreakdown = [];
        foreach ($detailedData as $record) {
            $course = $record['course'] ?? 'Unknown';
            if (!isset($courseBreakdown[$course])) {
                $courseBreakdown[$course] = ['course' => $course, 'local' => 0, 'external' => 0, 'total' => 0];
            }
            $courseBreakdown[$course]['total']++;
            if ($record['is_local']) {
                $courseBreakdown[$course]['local']++;
            } else {
                $courseBreakdown[$course]['external']++;
            }
        }
        $courseBreakdown = array_values($courseBreakdown);

        return Inertia::render('Admin/EmploymentLocationAnalytics', [
            'summary' => [
                'total_employed' => $totalEmployed,
                'local_count' => $localCount,
                'external_count' => $externalCount,
                'local_percentage' => $localPercentage,
                'external_percentage' => $externalPercentage,
            ],
            'cityDistribution' => $cityDistribution,
            'yearBreakdown' => $yearBreakdown,
            'courseBreakdown' => $courseBreakdown,
            'detailedData' => $detailedData,
        ]);
    }

    /**
     * Check if two addresses are in the same area/city
     */
    private function isSameArea(string $address1, string $address2): bool
    {
        // Normalize addresses by removing barangay prefixes
        $address1 = $this->normalizeAddress($address1);
        $address2 = $this->normalizeAddress($address2);

        // Common city/area keywords to check
        $cities = [
            'cabanatuan', 'cabanatuan city', 'manila', 'quezon', 'quezon city', 'makati', 'makati city',
            'taguig', 'taguig city', 'pasig', 'pasig city', 'mandaluyong', 'mandaluyong city',
            'san juan', 'san juan city', 'caloocan', 'caloocan city', 'malabon', 'malabon city',
            'navotas', 'navotas city', 'valenzuela', 'valenzuela city', 'marikina', 'marikina city',
            'pasay', 'pasay city', 'paranaque', 'paranaque city', 'las pinas', 'las pinas city',
            'muntinlupa', 'muntinlupa city', 'pateros', 'cebu', 'cebu city', 'davao', 'davao city',
            'baguio', 'baguio city', 'nueva ecija', 'bulacan', 'pampanga', 'tarlac', 'pangasinan',
            'bataan', 'zambales', 'laguna', 'cavite', 'rizal', 'batangas', 'iloilo', 'bacolod',
        ];

        foreach ($cities as $city) {
            $inAddress1 = str_contains($address1, $city);
            $inAddress2 = str_contains($address2, $city);

            if ($inAddress1 && $inAddress2) {
                return true; // Both contain the same city
            }
        }

        // Fallback: check if they share significant common words (3+ chars)
        // Exclude common address words
        $excludeWords = ['city', 'street', 'road', 'avenue', 'barangay', 'brgy', 'subdivision', 'subd', 'village', 'phase', 'block', 'lot'];
        $words1 = array_filter(explode(' ', $address1), fn($w) => strlen($w) > 3 && !in_array($w, $excludeWords));
        $words2 = array_filter(explode(' ', $address2), fn($w) => strlen($w) > 3 && !in_array($w, $excludeWords));
        $common = array_intersect($words1, $words2);

        return count($common) >= 2; // At least 2 common significant words
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
            'cabanatuan city', 'cabanatuan',
            'quezon city', 'manila', 'makati city', 'makati', 'taguig city', 'taguig',
            'pasig city', 'pasig', 'mandaluyong city', 'mandaluyong',
            'san juan city', 'san juan', 'caloocan city', 'caloocan',
            'malabon city', 'malabon', 'navotas city', 'navotas',
            'valenzuela city', 'valenzuela', 'marikina city', 'marikina',
            'pasay city', 'pasay', 'paranaque city', 'paranaque',
            'las pinas city', 'las pinas', 'muntinlupa city', 'muntinlupa',
            'pateros', 'cebu city', 'cebu', 'davao city', 'davao',
            'baguio city', 'baguio', 'iloilo city', 'iloilo', 'bacolod city', 'bacolod',
            'nueva ecija', 'bulacan', 'pampanga', 'tarlac', 'pangasinan',
            'bataan', 'zambales', 'laguna', 'cavite', 'rizal', 'batangas',
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
        $this->authorize('viewAny', Survey::class);

        // Get the same data as the show method
        $yearGraduated = $request->query('year_graduated');
        $from          = $request->query('from');
        $to            = $request->query('to');

        $validYears = ['2018','2019','2020','2021','2022','2023','2024','2025'];
        $applyYear  = $yearGraduated && in_array($yearGraduated, $validYears);

        $survey->load([
            'sections' => fn($q) => $q->orderBy('display_order')->with([
                'questions' => fn($q) => $q->orderBy('display_order'),
            ]),
        ]);

        $respondentQuery = Response::where('survey_id', $survey->id)
            ->when($from, fn($q) => $q->where('submitted_at', '>=', $from))
            ->when($to,   fn($q) => $q->where('submitted_at', '<=', $to))
            ->when($applyYear, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('year_graduated', $yearGraduated)
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
            $yearDistribution = $respondents->groupBy('year_graduated')->map(fn($g) => $g->count())->sortKeys();
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
                ->whereHas('question', fn($q) => $q->whereNotIn('type', ['text', 'textarea']))
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
