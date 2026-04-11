import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'

export default function AlumnaLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarAlumni />

      <main className="flex-1 bg-app-bg px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  )
}