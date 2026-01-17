import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'

export default function AlumnaLayout({children}) {
  return (
      <div className='min-h-screen'>
      <NavbarAlumni/>
        <main>{children}</main>
      </div>
  )
}
