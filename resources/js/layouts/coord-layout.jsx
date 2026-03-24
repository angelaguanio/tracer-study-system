import React from 'react'
import SidebarCoord from '../components/sidebar-coord'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import HeaderCoord from '../components/header-coord'
import { LayoutDashboard, Bell,CircleUserRound, LayoutList, FileChartColumn, ChartNoAxesCombined } from 'lucide-react';

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
      id: "questionnaire",
      name: "Questionnaire",
      href:"/coordinator/questionnaire",
      icon: LayoutList
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
    <SidebarProvider>
      <SidebarCoord navItems={navItems}/>
        <SidebarInset>
          <HeaderCoord navItems={navItems}/>
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
              </main>
        </SidebarInset> 
    </SidebarProvider>
  )
}

