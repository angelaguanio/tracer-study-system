import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "@/lib/alumnaassociation_datalist";
import { DepartmentSection } from "@/components/AlumnaAssociation_Components";

function AlumnaAssociation() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-10">
      
      {/* PAGE TITLE */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-800">
          ALUMNI ASSOCIATION
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-blue-700 mt-2">
          LIST OF OFFICERS
        </p>
      </div>

      {/* DEPARTMENTS */}
      <div className="space-y-8 sm:space-y-10 md:space-y-12">
        {departments.map((dept, index) => (
          <DepartmentSection key={index} {...dept} />
        ))}
      </div>

    </div>
  );
}

export default AlumnaAssociation;

// Wrap in AlumnaLayout
AlumnaAssociation.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;