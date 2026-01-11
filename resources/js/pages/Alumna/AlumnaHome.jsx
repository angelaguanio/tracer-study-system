



import React from 'react'
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';
import NavbarAlumni from '../../components/navbar-alumni';

import alumniOffice from '../../assets/alumni_office.jpg';

export default function AlumnaHome() {
  return (
    <>
      <NavbarAlumni>

        {/* HEADER SECTION */}
        <div className="bg-white py-10 text-center">
          <h1 className="text-5xl font-bold text-blue-900">
            ALUMNI AFFAIRS
          </h1>
          <p className="mt-4 text-3xl font-medium text-blue-900">
            LIST OF OFFICERS
          </p>
        </div>

        {/* BODY SECTION */}
        <div className="flex items-center justify-center h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url(${alumniOffice})` }}
        >

        </div>

      </NavbarAlumni>
    </>
  )
}


