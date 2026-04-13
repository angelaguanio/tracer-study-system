import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'

export default function AlumnaLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarAlumni />

      <main className="flex-1 flex bg-app-bg">
        {children}
      </main>
    </div>
  )
}