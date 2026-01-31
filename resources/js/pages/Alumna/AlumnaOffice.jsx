import React from 'react'
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniOffice from '../../assets/alumni_office.jpg';

export default function AlumnaOffice() {
  return (
    <>

      {/* HEADER SECTION */}
      <div className="bg-white py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
          ALUMNI AFFAIRS
        </h1>
        <p className="mt-2 md:mt-4 text-2xl md:text-4xl font-medium text-blue-900">
          LIST OF OFFICERS
        </p>
      </div>

      {/* BODY SECTION */}
      <div
        className="flex items-center justify-center h-96 md:h-[550px] bg-cover bg-center"
        style={{ backgroundImage: `url(${alumniOffice})` }}
      >
        <h2 className="text-3xl md:text-6xl font-semibold text-white text-center px-4">
          ALUMNI OFFICE
        </h2>
      </div>

    </>
  )
}

AlumnaOffice.layout = page => <AlumnaLayout>{page}</AlumnaLayout>