import React from "react";
import NavbarAlumni from "../../components/navbar-alumni";
import elementaryBg from "../../assets/elementary-bg.jpg";

export default function AlumnaAssociation() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <NavbarAlumni />

      {/* PAGE TITLE */}
      <div className="text-center py-10 px-5">
        <h1 className="text-[80px] font-bold text-blue-800">ALUMNI ASSOCIATION</h1>
        <p className="text-[40px] font-bold text-blue-800 mt-2">LIST OF OFFICERS</p>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative w-full h-[600px] mb-10">
        <img
          src={elementaryBg}
          alt="Elementary Department"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h2 className="text-[70px] font-bold">ELEMENTARY DEPARTMENT</h2>
          <p className="text-[30px] mt-2">
            Located across the Wesley Divinity School Apartment.
          </p>
        </div>
      </div>

      {/* OFFICERS LIST — SCROLLABLE */}
      <div className="px-5 py-5 text-center">
        <h3 className="text-3xl font-bold mb-5">OFFICERS</h3>
        {/* Scrollable box with fixed height */}
        <div className="max-h-[300px] overflow-y-auto border rounded-lg p-5 bg-white shadow-md mx-auto w-full md:w-1/2">
          <ul className="list-none leading-[2.2] text-lg">
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
  );
}
