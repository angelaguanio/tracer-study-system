import React from 'react'
import SidebarCoord from '../components/sidebar-coord'
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"
import HeaderCoord from '../components/header-coord'
import { LayoutDashboard, Bell, CircleUserRound, FileChartColumn, Mail, FileText, BarChart2 } from 'lucide-react';
import { Toaster } from 'sonner';
import { usePage } from '@inertiajs/react';
import ChatWidget from '../components/chat/ChatWidget';
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function CoordinatorLayout({ children }) {
  const { auth } = usePage().props;
  
  const navItemsCoord = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/coordinator/dashboard",
      icon: LayoutDashboard
    },
    {
      id: "announcement",
      name: "Announcements",
      href: "/coordinator/announcement",
      icon: Bell
    },
    {
      id: "inquiries",
      name: "Inquiries",
      href:"/coordinator/inquiries",
      icon: Mail
    },
    {
      id: "surveys",
      name: "Forms and Surveys",
      href: "/coordinator/forms-and-surveys",
      icon: FileText
    },    
    {
      id: "survey-response",
      name: "Survey Response",
      href: "/coordinator/survey-response",
      icon: FileChartColumn
    },
    {
      id: "analytics",
      name: "Analytics",
      href: "/coordinator/analytics",
      icon: BarChart2
    },
    {
      id: "alumni",
      name: "Alumni",
      href: "/coordinator/alumni",
      icon: CircleUserRound
    },
  ];

  return (
    <>
      <SidebarProvider>
          <SidebarCoord navItemsCoord={navItemsCoord}/>
          <SidebarInset className="max-h-screen flex flex-col overflow-hidden">
            <HeaderCoord navItemsCoord={navItemsCoord}/>
              <main className="flex-1 min-h-0 flex items-start justify-center p-4 bg-app-bg overflow-y-auto">
                  {children}
                </main>
          </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
      <ChatWidget user={auth.user} />
      <GlobalOfflineOverlay />
    </>
  )
}