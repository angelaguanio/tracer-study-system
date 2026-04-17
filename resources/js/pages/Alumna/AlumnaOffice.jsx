import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { AlumnaOfficeSection } from "@/components/ui/AlumnaOfficeComponents";
import { officeData } from "../../lib/AlumnaOfficeDatalist";

function AlumnaOffice() {
  return (
    <div className="min-h-screen pt-20">

      {/* PAGE TITLE */}
      <div className="text-center pb-20">
        <h1 className="text-4xl md:text-7xl font-bold text-blue-800 font-inria">
          ALUMNI AFFAIRS
        </h1>
        <p className="text-xl md:text-2xl text-blue-700 mt-2">
          LIST OF OFFICERS
        </p>
      </div>

      {/* OFFICE SECTION */}
      <AlumnaOfficeSection {...officeData} />

    </div>
  );
}

export default AlumnaOffice;

AlumnaOffice.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;