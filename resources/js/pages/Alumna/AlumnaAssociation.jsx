import React from "react";
import AlumnaLayout from "../../layouts/alumna-layout";
import elementaryBg from "../../assets/elementary-bg.jpg";

export default function AlumnaAssociation() {
  return (
    <AlumnaLayout>
      {/* MAIN CONTAINER */}
      <div className="min-h-screen bg-gray-50 pt-16">
        
        {/* PAGE TITLE */}
        <div className="text-center py-4 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-800">
            ALUMNI ASSOCIATION
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-blue-800 mt-1">
            LIST OF OFFICERS
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div className="relative w-full h-[400px] md:h-[550px] mb-10">
          <img
            src={elementaryBg}
            alt="Elementary Department"
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold">
              ELEMENTARY DEPARTMENT
            </h2>
            <p className="text-lg md:text-2xl mt-2">
              Located across the Wesley Divinity School Apartment.
            </p>
          </div>
        </div>

        {/* OFFICERS LIST */}
        <div className="px-5 py-8 text-center">
          <h3 className="text-3xl font-bold mb-5">OFFICERS</h3>

          <div className="max-h-[300px] overflow-y-auto border rounded-lg p-5 bg-white shadow-md mx-auto w-full md:w-1/2">
            <ul className="space-y-2 text-lg">
              <li>President</li>
              <li>Vice President</li>
              <li>Secretary</li>
              <li>Treasurer</li>
              <li>Auditor</li>
              <li>PRO</li>
            </ul>
          </div>
        </div>

      </div>
    </AlumnaLayout>
  );
}
