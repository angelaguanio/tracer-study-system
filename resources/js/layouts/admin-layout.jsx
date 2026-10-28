import React from "react";
import SidebarAdmin from "../components/sidebar-admin";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import HeaderAdmin from "../components/header-admin";
import {
  LayoutDashboard,
  Bell,
  NotebookPen,
  UsersRound,
  CircleUserRound,
  Mail,
  FileChartColumn,
  ChartNoAxesCombined,
  Star,
  GraduationCap,
  Settings,
} from "lucide-react";
import { Toaster } from "sonner";
import { usePage } from "@inertiajs/react";
import ChatWidget from "../components/chat/ChatWidget";
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;

    const navItems = [
    {
      id: "general",
      name: "General",
      icon: LayoutDashboard,
      subItems: [
        {
          name: "Dashboard",
          href: route('admin.dashboard')
        },
        {
          name: "Announcements",
          href: route('admin.announcement.index')
        },
        {
          name: "Inquiries",
          href: route('admin.inquiries.index')
        }
      ]
    },
    {
      id: "survey-management",
      name: "Survey Management",
      icon: NotebookPen,
      subItems: [
        {
          name: "Forms and Surveys",
          href: route('admin.surveys.index')
        },
        {
          name: "Survey Responses",
          href: route('admin.survey-response.index')
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: ChartNoAxesCombined,
      subItems: [
        {
          name: "Tracer Study",
          href: route('admin.analytics.tracer')
        },
        {
          name: "Alumni Forms",
          href: route('admin.analytics.alumni-forms')
        },
        {
          name: "Employment Location",
          href: route('admin.analytics.employment-location')
        }
      ]
    },
    {
      id: "alumni",
      name: "Alumni",
      icon: CircleUserRound,
      subItems: [
        {
          name: "Alumni Directory",
          href: route('admin.alumni.index')
        },
        {
          name: "Featured Alumni",
          href: route('admin.featured-alumni.index')
        }
      ]
    },
    {
      id: "alumni-coordinator",
      name: "Alumni Coordinator",
      href: route('admin.alumni-coordinators.index'),
      icon: UsersRound
    },
    {
      id: "programs",
      name: "Program Management",
      href: route('admin.programs.index'),
      icon: GraduationCap
    },
    {
      id: "settings",
      name: "Settings",
      href: route('admin.theme-settings.index'),
      icon: Settings
    }
  ]

  return (
    <>
      <SidebarProvider>
         <SidebarAdmin navItems={navItems}/>
          <SidebarInset className="max-h-screen flex flex-col overflow-hidden">
            <HeaderAdmin navItems={navItems}/>
              <main className="flex-1 min-h-0 flex items-start justify-center p-4 bg-app-bg overflow-y-auto">
                  {children}
                </main>
          </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
      <ChatWidget user={auth.user} />
      <GlobalOfflineOverlay />
    </>
  );
}