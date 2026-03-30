import React from 'react'
import SidebarCoord from '../components/sidebar-coord'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../components/ui/sidebar"
import HeaderCoord from '../components/header-coord'
import { LayoutDashboard, Bell, NotebookPen, CircleUserRound, LayoutList, FileChartColumn, ChartNoAxesCombined } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function CoordinatorLayout({children}) {
  const navItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href:"/coordinator/dashboard",
      icon: LayoutDashboard
    },
    {
      id: "announcement",
      name: "Announcement",
      href:"/coordinator/announcement",
      icon: Bell
    },
    {
      id: "alumni",
      name: "Alumni",
      href:"/coordinator/alumni",
      icon: CircleUserRound
    },
    {
      id: "surveys",
      name: "Surveys",
      href:"/coordinator/surveys",
      icon: NotebookPen
    },
    {
      id: "survey-response",
      name: "Survey Response",
      href:"/coordinator/survey-response",
      icon: FileChartColumn
    },
    {
      id: "analytics",
      name: "Analytics",
      href:"/coordinator/analytics",
      icon: ChartNoAxesCombined
    }
  ]
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <SidebarCoord navItems={navItems}/>
          <SidebarInset>
            <HeaderCoord navItems={navItems}/>
              <main className="flex-1 flex items-center justify-center p-4 bg-app-bg">
                  {children}
                </main>
          </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
    </ThemeProvider>
  )
}

