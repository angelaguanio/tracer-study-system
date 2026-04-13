import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "../../lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/AlumnaAssociation_Components";

export default function AlumnaAssociation() {
  return (
    <div className="w-full p-0">

      {/* ================= HERO ================= */}
      <section
        className="relative w-full h-[450px] flex items-center overflow-hidden mb-6"
        style={{
          background:
            "linear-gradient(135deg, #6FCFFF 0%, #0072B4 45%, #00338C 100%)",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(6,51,167,0.7) 0%, rgba(0,0,0,0.3) 70%)",
          }}
        />

        {/* Content (NOW MATCHES NAVBAR WIDTH) */}
        <div className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">

            <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-wide">
              ALUMNI ASSOCIATION
            </h1>

            <p className="text-white mt-4 text-sm md:text-lg opacity-90 max-w-3xl mx-auto">
              Meet the dedicated officers driving our alumni association forward.
              Together, we strengthen connections and create lasting impact.
            </p>

          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="border-t border-gray-200 py-20 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-4">
              Our Leadership
            </h2>

            <p className="text-gray-600 text-lg">
              Our alumni association is led by passionate individuals committed to
              fostering connections and strengthening our academic community.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DEPARTMENTS ================= */}
      <section className="border-t border-gray-200 bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">

          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <DepartmentSection key={index} {...dept} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No departments available
            </p>
          )}

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="w-full bg-[#013A63]">
        <div className="max-w-7xl mx-auto text-center text-white py-20 px-4">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Involved with the Alumni Network
          </h2>

          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Connect with fellow alumni leaders and help shape the future.
          </p>

          <button className="bg-gray-200 text-[#013A63] px-6 py-3 rounded-lg font-semibold hover:bg-white transition">
            Join the Community
          </button>

        </div>
      </section>

    </div>
  );
}

/* Layout wrapper */
AlumnaAssociation.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);