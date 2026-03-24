import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "@/lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/AlumnaAssociation_Components";

function AlumnaAssociation() {
  return (
    <div className="min-h-screen pt-20">
      {/* PAGE TITLE */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-800">
          ALUMNI ASSOCIATION
        </h1>
        <p className="text-xl md:text-2xl text-blue-700 mt-2">
          LIST OF OFFICERS
        </p>
      </div>

      {/* DEPARTMENTS */}
      {departments.map((dept, index) => (
        <DepartmentSection key={index} {...dept} />
      ))}
    </div>
  );
}

export default AlumnaAssociation;

// Wrap in AlumnaLayout
AlumnaAssociation.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
