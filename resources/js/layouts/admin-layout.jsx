import React from 'react'
import SidebarAdmin from '../components/sidebar-admin'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../components/ui/sidebar"
import HeaderAdmin from '../components/header-admin'
import { LayoutDashboard, Bell, NotebookPen, CircleUserRound, FileChartColumn, ChartNoAxesCombined } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function AdminLayout({children}) {
  const navItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href:"/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      id: "announcement",
      name: "Announcement",
      href:"/admin/announcement",
      icon: Bell
    },
    {
      id: "alumni-coordinator",
      name: "Alumni Coordinator",
      href: "/admin/alumni-coordinators",
      icon: UsersRound
    },
    {
      id: "alumni",
      name: "Alumni",
      href:"/admin/alumni",
      icon: CircleUserRound
    },
    {
      id: "surveys",
      name: "Surveys",
      href:"/admin/surveys",
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
    }
  ]
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <SidebarAdmin navItems={navItems}/>
          <SidebarInset>
            <HeaderAdmin navItems={navItems}/>
              <main className="flex-1 flex items-center justify-center p-4 bg-app-bg">
                  {children}
                </main>
          </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
    </ThemeProvider>
  )
}

