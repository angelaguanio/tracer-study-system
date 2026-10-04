import React from 'react'
import SidebarCoord from '../components/sidebar-coord'
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"
import HeaderCoord from '../components/header-coord'
import { LayoutDashboard, Bell, CircleUserRound, FileChartColumn, Mail, FileText, BarChart2, Star } from 'lucide-react';
import { Toaster } from 'sonner';
import { usePage } from '@inertiajs/react';
import ChatWidget from '../components/chat/ChatWidget';
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function CoordinatorLayout({ children }) {
  const { auth } = usePage().props;
  
  const navItemsCoord = [
    {
      id: "general",
      name: "General",
      icon: LayoutDashboard,
      subItems: [
        {
          name: "Dashboard",
          href: "/coordinator/dashboard"
        },
        {
          name: "Announcements",
          href: "/coordinator/announcement"
        },
        {
          name: "Inquiries",
          href: "/coordinator/inquiries"
        }
      ]
    },
    {
      id: "survey-management",
      name: "Survey Management",
      icon: FileText,
      subItems: [
        {
          name: "Forms and Surveys",
          href: "/coordinator/forms-and-surveys"
        },
        {
          name: "Survey Responses",
          href: "/coordinator/survey-response"
        }
      ]
    },
    {
      id: "alumni-management",
      name: "Alumni Management",
      icon: CircleUserRound,
      subItems: [
        {
          name: "Alumni Directory",
          href: "/coordinator/alumni"
        },
        {
          name: "Featured Alumni",
          href: "/coordinator/featured-alumni"
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics",
      href: "/coordinator/analytics",
      icon: BarChart2
    }
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