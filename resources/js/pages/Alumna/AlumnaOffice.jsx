import React from 'react'
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniOffice from '../../assets/alumni_office.jpg';

export default function AlumnaOffice() {
  return (
    <>

      {/* HEADER SECTION */}
      <div className='flex flex-col w-full'>
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
          className="flex items-center justify-center h-[550px] bg-cover bg-center"
          style={{ backgroundImage: `url(${alumniOffice})` }}
        >
          <h2 className="text-6xl font-semibold text-white">
            ALUMNI OFFICE
          </h2>
        </div>

        {/* OFFICERS SECTION */}
        <div className="bg-[#F3F7FA] py-16">

          {/* WHITE CONTAINER */}
          <div className="bg-white max-w-8xl mx-auto py-16 px-6 shadow-sm -mt-10 rounded-2xl">

            <div className="max-w-2xl mx-auto flex flex-col gap-10">

              {/* CARD 1 */}
              <div className="bg-[#F3F7FA] rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#001D4A] text-white rounded-full text-xl font-bold">
                  DIR.
                </div>
                <h3 className="mt-4 font-semibold text-[#45556C] uppercase">
                  Director, Office for Alumni Affairs
                </h3>
                <p className="mt-2 text-sm text-[#45556C]">
                  Mr. Joept G. Portana, Ph.D, LPT
                </p>
                <p className="text-sm text-gray-500">
                  jgportana@wesleyan.edu.ph
                </p>
              </div>

              {/* CARD 2 */}
              <div className="bg-[#F3F7FA] rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#001D4A] text-white rounded-full text-xl font-bold">
                  S
                </div>
                <h3 className="mt-4 font-semibold text-[#45556C] uppercase">
                  Staff, Office for Alumni Affairs
                </h3>
                <p className="mt-2 text-sm text-[#45556C]">
                  Ms. Quennie Rose P. Herrera, MPA, LPT
                </p>
                <p className="text-sm text-gray-500">
                  alumni@wesleyan.edu.ph
                </p>
              </div>

              {/* CARD 3 */}
              <div className="bg-[#F3F7FA] rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#001D4A] text-white rounded-full text-xl font-bold">
                  S
                </div>
                <h3 className="mt-4 font-semibold text-[#45556C] uppercase">
                  Staff, Office for Alumni Affairs
                </h3>
                <p className="mt-2 text-sm text-[#45556C]">
                  Mr. Mark Sam E. Antonio
                </p>
                <p className="text-sm text-gray-500">
                  mseantonio@wesleyan.edu.ph
                </p>
              </div>

            </div>

          </div>
        </div>

      </AlumnaLayout>
    </>
  )
}
      {/* BODY SECTION */}
      <div
        className="flex items-center justify-center h-96 md:h-[550px] bg-cover bg-center"
        style={{ backgroundImage: `url(${alumniOffice})` }}
      >
        <h2 className="text-3xl md:text-6xl font-semibold text-white text-center px-4">
          ALUMNI OFFICE
        </h2>
      </div>
    </div>
    </>
  )
}

AlumnaOffice.layout = page => <AlumnaLayout>{page}</AlumnaLayout>
