<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
                'pending_inquiries' => 'N/A',
                'pending_announcements' => 'N/A',
            ];
        }
    }

    /**
     * Calculate overview metrics for admin dashboard.
     * 
     * Requirements: 1.1, 1.2, 1.3, 1.4
     */
    private function calculateOverviewMetrics(): array
    {
        // 1.1: Total alumni count where user_role='alumna'
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // 1.2: Active surveys count where status='active'
        $activeSurveys = Survey::where('status', 'active')->count();

        // 1.3: Pending inquiries count where status='pending' and recipient_type='admin'
        $pendingInquiries = Inquiries::where('status', 'pending')
            ->where('recipient_type', 'admin')
            ->count();

        // 1.4: Pending announcements count where status='pending'
        $pendingAnnouncements = Announcement::where('status', 'pending')->count();

        return [
            'total_alumni' => $totalAlumni,
            'active_surveys' => $activeSurveys,
            'pending_inquiries' => $pendingInquiries,
            'pending_announcements' => $pendingAnnouncements,
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
     * Track ONLY the tracer study survey completion rates.
     * 
     * Requirements: 2.1, 2.2, 2.3, 2.4
     */
    private function calculateSurveyAnalytics(): array
    {
        // Get total alumni count for completion rate calculation
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // Get only the tracer study survey
        $tracerStudySurvey = Survey::where('is_tracer_study', true)
            ->where('status', 'active')
            ->first();

        if (!$tracerStudySurvey || $totalAlumni === 0) {
            return [
                'completed' => 0,
                'not_completed' => $totalAlumni,
                'completed_percentage' => 0.0,
                'not_completed_percentage' => 100.0,
            ];
        }

        // Calculate completed responses for tracer study survey
        $completedResponses = Response::where('survey_id', $tracerStudySurvey->id)
            ->whereNotNull('submitted_at')
            ->distinct('user_id')
            ->count('user_id');

        // Calculate not completed
        $notCompleted = $totalAlumni - $completedResponses;

        // Calculate percentages
        $completedPercentage = ($completedResponses / $totalAlumni) * 100;
        $notCompletedPercentage = ($notCompleted / $totalAlumni) * 100;

        return [
            'completed' => $completedResponses,
            'not_completed' => $notCompleted,
            'completed_percentage' => round($completedPercentage, 2),
            'not_completed_percentage' => round($notCompletedPercentage, 2),
        ];
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
        // Get total alumni count
        $totalAlumni = User::where('user_role', 'alumna')->count();
        
        // Count employed alumni (currently_employed = 'Yes')
        $employed = Employment::where('currently_employed', 'Yes')->count();

        // Count unemployed alumni (currently_employed = 'No')
        $unemployed = Employment::where('currently_employed', 'No')->count();
        
        // Count alumni without employment records (assume they haven't provided employment info)
        $noEmploymentData = $totalAlumni - ($employed + $unemployed);
        
        // For chart purposes, treat alumni without employment data as a separate category
        // or include them in unemployed if you prefer
        $unemployed += $noEmploymentData;

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
