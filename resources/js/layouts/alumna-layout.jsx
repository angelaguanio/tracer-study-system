import React from 'react'
import NavbarAlumni from '../components/navbar-alumni'

export default function AlumnaLayout({children}) {
  return (
    <>
    <div className='min-h-screen bg-app-bg'>
      <NavbarAlumni>
          {children}     
      </NavbarAlumni>
    </div>
    </>
  )
}
