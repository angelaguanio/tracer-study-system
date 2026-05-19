import React from 'react'
import SidebarAdmin from '../components/sidebar-admin'
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"
import HeaderAdmin from '../components/header-admin'
import { LayoutDashboard, Bell, CircleUserRound, FileChartColumn } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { usePage } from '@inertiajs/react';
import ChatWidget from '../components/chat/ChatWidget';

export default function CoordinatorLayout({ children }) {
  const { auth } = usePage().props;
  
  const navItems = [
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
      id: "alumni",
      name: "Alumni",
      href: "/coordinator/alumni",
      icon: CircleUserRound
    },
    {
      id: "survey-response",
      name: "Survey Response",
      href: "/coordinator/survey-response",
      icon: FileChartColumn
    }
  ];

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <SidebarAdmin navItems={navItems} />
        {/* Added flex utilities and overflow hidden to trap layout size */}
        <SidebarInset className="max-h-screen flex flex-col overflow-hidden">
          <HeaderAdmin navItems={navItems} />
          {/* Changed overflow handle to let only the child pages scroll scrollable */}
          <main className="flex-1 min-h-0 flex items-start justify-center p-4 bg-app-bg overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" duration={1000} />
      <ChatWidget user={auth.user} />
    </ThemeProvider>
  )
}