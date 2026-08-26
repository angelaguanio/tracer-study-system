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
} from "lucide-react";
import { Toaster } from "sonner";
import { usePage } from "@inertiajs/react";
import ChatWidget from "../components/chat/ChatWidget";
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;

   const navItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href:"/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      id: "announcement",
      name: "Announcements",
      href:"/admin/announcement",
      icon: Bell
    },
    {
      id: "inquiries",
      name: "Inquiries",
      href:"/admin/inquiries",
      icon: Mail
    },
    {
      id: "surveys",
      name: "Forms and Surveys",
      href:"/admin/forms-and-surveys",
      icon: NotebookPen
    },
    {
      id: "survey-response",
      name: "Survey Response",
      href:"/admin/survey-response",
      icon: FileChartColumn
    },
    {
      id: "analytics",
      name: "Analytics",
      href:"/admin/analytics",
      icon: ChartNoAxesCombined
    },
    {
      id: "alumni",
      name: "Alumni",
      href:"/admin/alumni",
      icon: CircleUserRound
    },
    {
      id: "alumni-coordinator",
      name: "Alumni Coordinator",
      href: "/admin/alumni-coordinators",
      icon: UsersRound
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