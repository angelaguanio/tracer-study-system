import React from 'react';
import CoordinatorLayout from "@/layouts/coord-layout";
import MetricCard from '@/components/dashboard/MetricCard';
import ChartWidget from '@/components/dashboard/ChartWidget';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import QuickActionButton from '@/components/dashboard/QuickActionButton';
import { Users, FileText, Clock, Plus, Eye, AlertCircle, GraduationCap, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import usePolling from '@/hooks/usePolling';

/**
 * CoordinatorDashboard Component
 * 
 * Main coordinator dashboard page displaying role-specific metrics
 * 
 * @param {object} metrics - Coordinator-specific metrics
 * @param {array} survey_overview - Survey response overview
 * @param {object} announcement_distribution - Announcement status distribution
 * @param {array} recent_inquiries - Recent inquiries list
 * @param {array} recent_announcements - Recent announcements list
 * @param {array} recent_responses - Recent survey responses list
 * @param {array} alumni_by_year - Alumni grouped by graduation year
 * @param {array} alumni_by_course - Alumni grouped by course
 * @param {string} error - Error message if data loading failed
 */
export default function CoordinatorDashboard({ 
  metrics = {}, 
  survey_overview = [],
  announcement_distribution = {},
  recent_inquiries = [],
  recent_announcements = [],
  recent_responses = [],
  alumni_by_year = [],
  alumni_by_course = [],
  error 
})


{

  usePolling({
    interval: 10000,
    only: [
        'metrics',
        'survey_overview',
        'announcement_distribution',
        'recent_inquiries',
        'recent_announcements',
        'recent_responses',
        'alumni_by_year',
        'alumni_by_course',
    ],
});

  return (
    <div className="flex w-full min-h-screen ">
      <div className="w-full space-y-8 p-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-blue-800 font-inter">
            Coordinator Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your activities, track alumni, and monitor announcements
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive px-6 py-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm underline hover:no-underline"
              >
                Retry loading data
              </button>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="Total Alumni" 
              value={metrics.total_alumni} 
              icon={Users}
              color="blue"
            />
            <MetricCard 
              title="Pending Inquiries" 
              value={metrics.pending_inquiries} 
              icon={FileText}
              color="orange"
            />
            <MetricCard 
              title="Pending Announcements" 
              value={metrics.my_pending_announcements} 
              icon={Clock}
              color="yellow"
            />
          </div>
        </div>



        {/* Analytics Section */}
        <div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget 
              title="Survey Response Overview" 
              description="Track response rates for active surveys"
              data={survey_overview}
              type="progress"
              height={350}
              emptyMessage="No active surveys to display"
            />
            <ChartWidget 
              title="My Announcements Status" 
              description="Distribution of your announcement statuses"
              data={announcement_distribution}
              type="pie"
              height={350}
              emptyMessage="No announcements created yet"
            />
          </div>
        </div>

        <Separator />

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <RecentActivityList 
              title="Recent Inquiries" 
              items={recent_inquiries}
              linkPattern="/coordinator/inquiries"
              emptyMessage="No recent inquiries"
            />
            <RecentActivityList 
              title="My Recent Announcements" 
              items={recent_announcements}
              linkPattern="/coordinator/announcement/{id}"
              emptyMessage="No recent announcements"
              showAuthor={false}
            />
            <RecentActivityList 
              title="Recent Survey Responses" 
              items={recent_responses}
              linkPattern="/coordinator/survey-response/{survey_id}/{user_id}"
              emptyMessage="No recent responses"
            />
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3 bg-white p-6 rounded-xl shadow">
            <QuickActionButton 
              label="Create Announcement" 
              href="/coordinator/announcement/create" 
              icon={Plus}
              variant="default"
            />
            <QuickActionButton 
              label="View Alumni" 
              href="/coordinator/alumni" 
              icon={Eye}
              variant="outline"
            />
            <QuickActionButton 
              label="View Survey Responses" 
              href="/coordinator/survey-response" 
              icon={FileText}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CoordinatorDashboard.layout = page => <CoordinatorLayout>{page}</CoordinatorLayout>;
