import React from 'react'
import SidebarCoord from '../components/sidebar-coord'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../components/ui/sidebar"
import HeaderCoord from '../components/header-coord'
import { LayoutDashboard, Bell, NotebookPen, CircleUserRound, LayoutList, FileChartColumn, ChartNoAxesCombined } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { usePage } from '@inertiajs/react';
import ChatWidget from '../components/chat/ChatWidget';

export default function CoordinatorLayout({children}) {
  const { auth } = usePage().props;
  const navItemsCoord = [
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
    }
  ]
  console.log('passing:', navItemsCoord.length, navItemsCoord)
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <SidebarCoord navItemsCoord={navItemsCoord}/>
          <SidebarInset>
            <HeaderCoord navItemsCoord={navItemsCoord}/>
              <main className="flex-1 flex items-center justify-center p-4 bg-app-bg">
                  {children}
                </main>
          </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
      <ChatWidget user={auth.user} />
    </ThemeProvider>
  )
}

