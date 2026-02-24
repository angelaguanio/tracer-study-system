import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'

export default function AlumnaLayout({children}) {
  return (
     <div className="flex flex-col min-h-screen">
      <NavbarAlumni />
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  ) 
}
