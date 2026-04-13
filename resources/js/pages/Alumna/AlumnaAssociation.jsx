import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "../../lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/AlumnaAssociation_Components";

function AlumnaAssociation() {
  return (
    <div className=" w-full bg-white mb-20">

      {/* ================= HERO (MATCH DepartmentSection STYLE) ================= */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 mb-16">

        <section className="relative w-full h-[320px] md:h-[420px]">

          {/* Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #6FCFFF 0%, #0072B4 45%, #00338C 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

            <h1 className="text-white text-3xl md:text-6xl font-extrabold tracking-wide">
              ALUMNI ASSOCIATION
            </h1>

            <p className="text-white mt-3 text-sm md:text-lg max-w-2xl opacity-90">
              Meet the dedicated officers driving our alumni association forward.
              Together, we strengthen connections and create lasting impact.
            </p>

          </div>

        </section>
      </div>

      {/* ================= CONTENT ================= */}
      <section className="w-full bg-gray-50 py-12 md:py-16">

        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">

          {departments.map((dept, index) => (
            <div key={`${dept.title}-${index}`} className="w-full">
              <DepartmentSection {...dept} />
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default AlumnaAssociation;

/* Layout wrapper */
AlumnaAssociation.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);