import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'
import { Toaster } from 'sonner'
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function AlumnaLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarAlumni />

      <main className="flex-1 flex bg-app-bg">
        {children}
      </main>
      
      <Toaster position="top-center" duration={3000} />
      <GlobalOfflineOverlay />
    </div>
  )
}