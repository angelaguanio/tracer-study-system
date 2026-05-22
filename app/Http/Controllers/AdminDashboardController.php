<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Inquiries;
use App\Models\Announcement;
use App\Models\Employment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $error = null;
        
        // Calculate overview metrics with caching and error handling
        $metrics = $this->calculateOverviewMetricsWithCache();
        
        // Calculate survey analytics with error handling
        $surveyAnalytics = $this->calculateSurveyAnalyticsWithErrorHandling();
        
        // Calculate employment distribution with error handling
        $employmentDistribution = $this->calculateEmploymentDistributionWithErrorHandling();

        // Get recent activity with error handling
        $recentActivity = $this->getRecentActivityWithErrorHandling();

        return Inertia::render('Admin/AdminDashboard', [
            'error' => $error,
            'metrics' => $metrics,
            'survey_analytics' => $surveyAnalytics,
            'employment_distribution' => $employmentDistribution,
            'recent_inquiries' => $recentActivity['recent_inquiries'],
            'recent_announcements' => $recentActivity['recent_announcements'],
            'recent_responses' => $recentActivity['recent_responses'],
        ]);
    }

    /**
     * Calculate overview metrics with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateOverviewMetricsWithCache(): array
    {
        try {
            return Cache::remember('admin_dashboard_metrics', 300, function () {
                return $this->calculateOverviewMetrics();
            });
        } catch (\Exception $e) {
            Log::error('Dashboard overview metrics calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'overview_metrics',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return default values for all metrics
            return [
                'total_alumni' => 'N/A',
                'active_surveys' => 'N/A',
                'completed_responses' => 'N/A',
                'pending_inquiries' => 'N/A',
                'pending_announcements' => 'N/A',
                'employed_alumni' => 'N/A',
                'unemployed_alumni' => 'N/A',
            ];
        }
    }

    /**
     * Calculate overview metrics for admin dashboard.
     * 
     * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
     */
    private function calculateOverviewMetrics(): array
    {
        // 1.1: Total alumni count where user_role='alumna'
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // 1.2: Active surveys count where status='active'
        $activeSurveys = Survey::where('status', 'active')->count();

        // 1.3: Completed responses count (distinct user-survey pairs with submitted_at not null)
        $completedResponses = DB::table(DB::raw('(SELECT DISTINCT user_id, survey_id FROM responses WHERE submitted_at IS NOT NULL) as distinct_responses'))
            ->count();

        // 1.4: Pending inquiries count where status='pending' and recipient_type='admin'
        $pendingInquiries = Inquiries::where('status', 'pending')
            ->where('recipient_type', 'admin')
            ->count();

        // 1.5: Pending announcements count where status='pending'
        $pendingAnnouncements = Announcement::where('status', 'pending')->count();

        // 1.6: Employed alumni count (currently_employed = 'Yes')
        $employedAlumni = Employment::where('currently_employed', 'Yes')->count();

        // 1.7: Unemployed alumni count (currently_employed = 'No')
        $unemployedAlumni = Employment::where('currently_employed', 'No')->count();

        return [
            'total_alumni' => $totalAlumni,
            'active_surveys' => $activeSurveys,
            'completed_responses' => $completedResponses,
            'pending_inquiries' => $pendingInquiries,
            'pending_announcements' => $pendingAnnouncements,
            'employed_alumni' => $employedAlumni,
            'unemployed_alumni' => $unemployedAlumni,
        ];
    }

    /**
     * Calculate survey analytics with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateSurveyAnalyticsWithErrorHandling(): array
    {
        try {
            return Cache::remember('admin_dashboard_survey_analytics', 300, function () {
                return $this->calculateSurveyAnalytics();
            });
        } catch (\Exception $e) {
            Log::error('Dashboard survey analytics calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'survey_analytics',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return empty array on failure
            return [];
        }
    }

    /**
     * Calculate survey analytics aggregation.
     * Track ALL surveys (active and inactive) since only one can be active at a time.
     * 
     * Requirements: 2.1, 2.2, 2.3, 2.4
     */
    private function calculateSurveyAnalytics(): array
    {
        // Get total alumni count for completion rate calculation
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // Query ALL surveys (not just active ones)
        $allSurveys = Survey::orderBy('created_at', 'desc')->get();

        $surveyAnalytics = [];

        foreach ($allSurveys as $survey) {
            // 2.2: Calculate completed responses per survey (distinct users with submitted_at not null)
            $completedResponses = Response::where('survey_id', $survey->id)
                ->whereNotNull('submitted_at')
                ->distinct('user_id')
                ->count('user_id');

            // 2.3: Calculate in-progress responses per survey
            // Users with drafts but no submission
            $inProgressResponses = DB::table('survey_drafts')
                ->where('survey_id', $survey->id)
                ->whereNotExists(function ($query) use ($survey) {
                    $query->select(DB::raw(1))
                        ->from('responses')
                        ->whereColumn('responses.user_id', 'survey_drafts.user_id')
                        ->where('responses.survey_id', $survey->id)
                        ->whereNotNull('responses.submitted_at');
                })
                ->distinct('user_id')
                ->count('user_id');

            // 2.4: Calculate completion rate as (completed / total_alumni) * 100
            $completionRate = $totalAlumni > 0 
                ? ($completedResponses / $totalAlumni) * 100 
                : 0.0;

            $surveyAnalytics[] = [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'total_responses' => $completedResponses + $inProgressResponses,
                'completed_responses' => $completedResponses,
                'in_progress_responses' => $inProgressResponses,
                'completion_rate' => (float) round($completionRate, 2),
            ];
        }

        return $surveyAnalytics;
    }

    /**
     * Calculate employment distribution with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateEmploymentDistributionWithErrorHandling(): array
    {
        try {
            return Cache::remember('admin_dashboard_employment_distribution', 300, function () {
                return $this->calculateEmploymentDistribution();
            });
        } catch (\Exception $e) {
            Log::error('Dashboard employment distribution calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'employment_distribution',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return default values on failure
            return [
                'employed' => 'N/A',
                'unemployed' => 'N/A',
                'employed_percentage' => 0.0,
                'unemployed_percentage' => 0.0,
            ];
        }
    }

    /**
     * Calculate employment distribution aggregation.
     * 
     * Requirements: 3.1, 3.2, 3.3, 3.4
     */
    private function calculateEmploymentDistribution(): array
    {
        // Count employed alumni (currently_employed = 'Yes')
        $employed = Employment::where('currently_employed', 'Yes')->count();

        // Count unemployed alumni (currently_employed = 'No')
        $unemployed = Employment::where('currently_employed', 'No')->count();

        // Calculate total for percentage calculation
        $total = $employed + $unemployed;

        // Calculate percentages for each category
        $employedPercentage = $total > 0 ? ($employed / $total) * 100 : 0.0;
        $unemployedPercentage = $total > 0 ? ($unemployed / $total) * 100 : 0.0;

        return [
            'employed' => $employed,
            'unemployed' => $unemployed,
            'employed_percentage' => round($employedPercentage, 2) + 0.0,
            'unemployed_percentage' => round($unemployedPercentage, 2) + 0.0,
        ];
    }

    /**
     * Get recent activity with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function getRecentActivityWithErrorHandling(): array
    {
        try {
            return Cache::remember('admin_dashboard_recent_activity', 300, function () {
                return $this->getRecentActivity();
            });
        } catch (\Exception $e) {
            Log::error('Dashboard recent activity query failed', [
                'user_id' => auth()->id(),
                'metric' => 'recent_activity',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return empty arrays on failure
            return [
                'recent_inquiries' => [],
                'recent_announcements' => [],
                'recent_responses' => [],
            ];
        }
    }

    /**
     * Get recent activity queries.
     * 
     * Requirements: 4.1, 4.2, 4.3
     */
    private function getRecentActivity(): array
    {
        // 4.1: Query 5 most recent inquiries ordered by created_at DESC with eager loading of alumni relationship
        $recentInquiries = Inquiries::with('alumni')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'title' => $inquiry->title,
                    'sender_name' => $inquiry->alumni 
                        ? $inquiry->alumni->first_name . ' ' . $inquiry->alumni->last_name 
                        : 'Unknown',
                    'created_at' => $inquiry->created_at->format('M d, Y'),
                ];
            })
            ->toArray();

        // 4.2: Query 5 most recent pending announcements ordered by created_at DESC with eager loading of author relationship
        $recentAnnouncements = Announcement::with('author')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'author_name' => $announcement->author 
                        ? $announcement->author->first_name . ' ' . $announcement->author->last_name 
                        : 'Unknown',
                    'created_at' => $announcement->created_at->format('M d, Y'),
                    'status' => $announcement->status,
                ];
            })
            ->toArray();

        // 4.3: Query 5 most recent survey responses ordered by submitted_at DESC with eager loading of user and survey relationships
        $recentResponses = Response::with(['user', 'survey'])
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->limit(5)
            ->get()
            ->unique(function ($response) {
                return $response->user_id . '-' . $response->survey_id;
            })
            ->take(5)
            ->map(function ($response) {
                return [
                    'survey_id' => $response->survey_id,
                    'user_id' => $response->user_id,
                    'alumna_name' => $response->user 
                        ? $response->user->first_name . ' ' . $response->user->last_name 
                        : 'Unknown',
                    'survey_title' => $response->survey ? $response->survey->title : 'Unknown Survey',
                    'submitted_at' => $response->submitted_at->format('M d, Y'),
                ];
            })
            ->values()
            ->toArray();

        return [
            'recent_inquiries' => $recentInquiries,
            'recent_announcements' => $recentAnnouncements,
            'recent_responses' => $recentResponses,
        ];
    }
}
