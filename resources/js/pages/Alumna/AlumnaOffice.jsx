import React from 'react'
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';
import NavbarAlumni from '../../components/navbar-alumni';

import alumniOffice from '../../assets/alumni_office.jpg';

export default function AlumnaOffice() {
  return (
    <>
      <AlumnaLayout>

        {/* HEADER SECTION */}
        <div className="bg-white py-12 text-center">
          <h1 className="text-6xl font-bold text-blue-900">
            ALUMNI AFFAIRS
          </h1>
          <p className="mt-4 text-4xl font-medium text-blue-900">
            LIST OF OFFICERS
          </p>
        </div>

        {/* BODY SECTION */}
        <div
          className="flex items-center justify-center h-[550px] bg-cover bg-center"
          style={{ backgroundImage: `url(${alumniOffice})` }}
        >
          <h2 className="text-6xl font-semibold text-white">
            ALUMNI OFFICE
          </h2>
        </div>

      </AlumnaLayout>
    </>
  )
}
