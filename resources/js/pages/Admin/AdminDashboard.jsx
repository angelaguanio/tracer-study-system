import React from 'react';
import AdminLayout from "@/layouts/admin-layout";
import MetricCard from '@/components/dashboard/MetricCard';
import ChartWidget from '@/components/dashboard/ChartWidget';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import QuickActionButton from '@/components/dashboard/QuickActionButton';
import { Users, FileText, Mail, Bell, Plus, Eye, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * AdminDashboard Component
 * 
 * Main admin dashboard page displaying system-wide metrics and analytics
 */
export default function AdminDashboard({ 
  metrics = {}, 
  survey_analytics = [], 
  employment_distribution = {},
  recent_inquiries = [],
  recent_announcements = [],
  recent_responses = [],
  error 
}) {
  return (
    <div className="flex w-screen min-h-screen">
      <div className="w-full space-y-8 p-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-blue-800 font-inter">
            Welcome, Admin!
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor system health, track activity, and manage your alumni network
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
              icon={Mail}
              color="orange"
            />
            <MetricCard 
              title="Pending Announcements" 
              value={metrics.pending_announcements} 
              icon={Bell}
              color="yellow"
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget 
              title="Tracer Study Survey Completion" 
              description="Percentage of alumni who have completed the tracer study survey"
              data={survey_analytics}
              type="pie"
              height={350}
              emptyMessage="No tracer study survey available"
            />
            <ChartWidget 
              title="Employment Distribution" 
              description="Current employment status of alumni"
              data={employment_distribution}
              type="pie"
              height={350}
              emptyMessage="No employment data available"
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
          <div className="grid gap-6 lg:grid-cols-3">
            <RecentActivityList 
              title="Recent Inquiries" 
              items={recent_inquiries}
              linkPattern="/admin/inquiries"
              emptyMessage="No recent inquiries"
            />
            <RecentActivityList 
              title="Pending Announcements" 
              items={recent_announcements}
              linkPattern="/admin/announcement/{id}"
              emptyMessage="No pending announcements"
            />
            <RecentActivityList 
              title="Recent Survey Responses" 
              items={recent_responses}
              linkPattern="/admin/survey-response/{survey_id}/{user_id}"
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
              label="Create Survey" 
              href="/admin/surveys" 
              icon={Plus}
              variant="default"
            />
            <QuickActionButton 
              label="Create Announcement" 
              href="/admin/announcement/create" 
              icon={Plus}
              variant="default"
            />
            <QuickActionButton 
              label="View All Inquiries" 
              href="/admin/inquiries" 
              icon={Eye}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

AdminDashboard.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);