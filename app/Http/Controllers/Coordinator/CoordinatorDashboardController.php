<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Announcement;
use App\Models\Inquiries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CoordinatorDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $error = null;
        
        // Calculate coordinator-specific metrics with caching and error handling
        $metrics = $this->calculateCoordinatorMetricsWithCache();

        // Calculate survey overview with error handling
        $surveyOverview = $this->calculateSurveyOverviewWithErrorHandling();

        // Calculate announcement distribution and recent announcements
        $announcementDistribution = $this->calculateAnnouncementDistributionWithErrorHandling();

        // Calculate alumni distribution by year and course
        $alumniByYear = $this->getAlumniByYearWithErrorHandling();
        $alumniByCourse = $this->getAlumniByCourseWithErrorHandling();

        // Get recent activity with error handling
        $recentActivity = $this->getRecentActivityWithErrorHandling();

        return Inertia::render('Coordinator/CoordinatorDashboard', [
            'error' => $error,
            'metrics' => $metrics,
            'survey_overview' => $surveyOverview,
            'announcement_distribution' => $announcementDistribution,
            'recent_inquiries' => $recentActivity['recent_inquiries'],
            'recent_announcements' => $recentActivity['recent_announcements'],
            'recent_responses' => $recentActivity['recent_responses'],
            'alumni_by_year' => $alumniByYear,
            'alumni_by_course' => $alumniByCourse,
        ]);
    }

    /**
     * Calculate coordinator-specific metrics with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateCoordinatorMetricsWithCache(): array
    {
        try {
            $userId = auth()->id();
            return Cache::remember("coordinator_dashboard_metrics_{$userId}", 300, function () {
                return $this->calculateCoordinatorMetrics();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard metrics calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'coordinator_metrics',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return default values for all metrics
            return [
                'total_alumni' => 'N/A',
                'pending_inquiries' => 'N/A',
                'my_pending_announcements' => 'N/A',
            ];
        }
    }

    /**
     * Calculate coordinator-specific metrics.
     * 
     * Requirements: 6.1, 6.2, 6.3
     */
    private function calculateCoordinatorMetrics(): array
    {
        $userId = auth()->id();

        // 6.1: Total alumni count where user_role='alumna'
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // 6.2: Pending inquiries count where status='pending' and recipient_id=auth()->id()
        $pendingInquiries = Inquiries::where('status', 'pending')
            ->where('recipient_id', $userId)
            ->count();

        // 6.3: My pending announcements where user_id=auth()->id() and status='pending'
        $myPendingAnnouncements = Announcement::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        return [
            'total_alumni' => $totalAlumni,
            'pending_inquiries' => $pendingInquiries,
            'my_pending_announcements' => $myPendingAnnouncements,
        ];
    }

    /**
     * Calculate survey overview with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateSurveyOverviewWithErrorHandling(): array
    {
        try {
            return Cache::remember('coordinator_dashboard_survey_overview', 300, function () {
                return $this->calculateSurveyOverview();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard survey overview calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'survey_overview',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return empty array on failure
            return [];
        }
    }

    /**
     * Calculate survey overview aggregation.
     * 
     * Requirements: 7.1, 7.2, 7.3, 7.4
     */
    private function calculateSurveyOverview(): array
    {
        // Get total alumni count for completion rate calculation
        $totalAlumni = User::where('user_role', 'alumna')->count();

        // Query ALL surveys (not just active ones)
        $allSurveys = Survey::orderBy('created_at', 'desc')->get();

        $surveyOverview = [];

        foreach ($allSurveys as $survey) {
            // 7.3: Calculate completed responses per survey (distinct users with submitted_at not null)
            $completedResponses = Response::where('survey_id', $survey->id)
                ->whereNotNull('submitted_at')
                ->distinct('user_id')
                ->count('user_id');

            // 7.4: Calculate in-progress responses per survey
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

            // 7.2: Calculate completion rate as (completed / total_alumni) * 100
            $completionRate = $totalAlumni > 0 
                ? ($completedResponses / $totalAlumni) * 100 
                : 0.0;

            $surveyOverview[] = [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'total_responses' => $completedResponses + $inProgressResponses,
                'completed_responses' => $completedResponses,
                'in_progress_responses' => $inProgressResponses,
                'completion_rate' => (float) round($completionRate, 2),
                'created_at' => $survey->created_at,
            ];
        }

        return $surveyOverview;
    }

    /**
     * Calculate announcement distribution with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function calculateAnnouncementDistributionWithErrorHandling(): array
    {
        try {
            $userId = auth()->id();
            return Cache::remember("coordinator_dashboard_announcement_distribution_{$userId}", 300, function () {
                return $this->calculateAnnouncementDistribution();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard announcement distribution calculation failed', [
                'user_id' => auth()->id(),
                'metric' => 'announcement_distribution',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return default values on failure
            return [
                'pending' => 'N/A',
                'approved' => 'N/A',
                'rejected' => 'N/A',
            ];
        }
    }

    /**
     * Calculate announcement distribution by status for current user.
     * 
     * Requirements: 8.1
     */
    private function calculateAnnouncementDistribution(): array
    {
        $userId = auth()->id();

        // Query announcement counts by status for current user
        $pending = Announcement::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        $approved = Announcement::where('user_id', $userId)
            ->where('status', 'approved')
            ->count();

        $rejected = Announcement::where('user_id', $userId)
            ->where('status', 'rejected')
            ->count();

        return [
            'pending' => $pending,
            'approved' => $approved,
            'rejected' => $rejected,
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
            $userId = auth()->id();
            return Cache::remember("coordinator_dashboard_recent_activity_{$userId}", 300, function () {
                return $this->getRecentActivity();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard recent activity query failed', [
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
     * Get recent activity data.
     * 
     * Requirements: 8.2, 8.3, 8.4
     */
    private function getRecentActivity(): array
    {
        $userId = auth()->id();

        // 8.2: Query 5 most recent inquiries directed to this coordinator ordered by created_at DESC with eager loading of alumni relationship
        $recentInquiries = Inquiries::with('alumni')
            ->where('recipient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
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

        // 8.3: Query 5 most recent announcements created by current user ordered by created_at DESC
        $recentAnnouncements = Announcement::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get(['id', 'title', 'status', 'created_at'])
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'author_name' => auth()->user()->first_name . ' ' . auth()->user()->last_name,
                    'status' => $announcement->status,
                    'created_at' => $announcement->created_at->format('M d, Y'),
                ];
            })
            ->toArray();

        // 8.4: Query 5 most recent survey responses ordered by submitted_at DESC with eager loading of user and survey relationships
        $recentResponses = Response::with(['user', 'survey'])
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->limit(3)
            ->get()
            ->unique(function ($response) {
                return $response->user_id . '-' . $response->survey_id;
            })
            ->take(3)
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

    /**
     * Get alumni distribution by year with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function getAlumniByYearWithErrorHandling(): array
    {
        try {
            return Cache::remember('coordinator_dashboard_alumni_by_year', 300, function () {
                return $this->getAlumniByYear();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard alumni by year query failed', [
                'user_id' => auth()->id(),
                'metric' => 'alumni_by_year',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return empty array on failure
            return [];
        }
    }

    /**
     * Query alumni grouped by year_graduated with counts.
     * Shows all graduation years.
     * 
     * Requirements: 9.2, 9.4
     */
    private function getAlumniByYear(): array
    {
        // Query alumni grouped by year_graduated with counts
        // Show all years
        $alumniByYear = User::where('user_role', 'alumna')
            ->whereNotNull('year_graduated')
            ->select('year_graduated', DB::raw('count(*) as count'))
            ->groupBy('year_graduated')
            ->orderBy('year_graduated', 'asc')
            ->get();

        return $alumniByYear->map(function ($item) {
            return [
                'year' => (int) $item->year_graduated,
                'count' => (int) $item->count,
            ];
        })->toArray();
    }

    /**
     * Get alumni distribution by course with caching and error handling.
     * Cache for 5 minutes (300 seconds).
     * 
     * Requirements: 10.1, 13.4, 15.1, 15.2
     */
    private function getAlumniByCourseWithErrorHandling(): array
    {
        try {
            return Cache::remember('coordinator_dashboard_alumni_by_course', 300, function () {
                return $this->getAlumniByCourse();
            });
        } catch (\Exception $e) {
            Log::error('Coordinator dashboard alumni by course query failed', [
                'user_id' => auth()->id(),
                'metric' => 'alumni_by_course',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return empty array on failure
            return [];
        }
    }

    /**
     * Query alumni grouped by courses with counts.
     * 
     * Requirements: 9.3
     */
    private function getAlumniByCourse(): array
    {
        // Query alumni grouped by courses with counts
        $alumniByCourse = User::where('user_role', 'alumna')
            ->whereNotNull('courses')
            ->where('courses', '!=', '')
            ->select('courses', DB::raw('count(*) as count'))
            ->groupBy('courses')
            ->orderBy('count', 'desc')
            ->get();

        return $alumniByCourse->map(function ($item) {
            return [
                'course' => $item->courses,
                'count' => (int) $item->count,
            ];
        })->toArray();
    }
}
