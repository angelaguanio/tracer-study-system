import React from "react";
import AlumnaLayout from "../../layouts/alumna-layout";
import elementaryBg from "../../assets/elementary-bg.jpg";
import highschoolBg from "../../assets/highschool-bg.jpg";
import graduateBg from "../../assets/graduate-bg.jpg";
import tourismBg from "../../assets/tourism-management-bg.jpg";
import lawBg from "../../assets/law-bg.jpg";
import nursingBg from "../../assets/nursing-bg.jpg";
import cbaBg from "../../assets/cba-bg.jpg";    
import cectBg from "../../assets/cect-bg.jpg";
import educationBg from "../../assets/education-bg.jpg";
import criminaljusticeBg from "../../assets/criminal-justice-bg.jpg";

/* ===================== DATA ===================== */

const departments = [
  {
    title: "ELEMENTARY DEPARTMENT",
    subtitle: "Wesley Divinity School",
    bg: elementaryBg,
  },
  {
    title: "HIGHSCHOOL DEPARTMENT",
    subtitle: "Wesley Divinity School",
    bg: highschoolBg,
  },
  {
    title: "GRADUATE SCHOOL",
    subtitle: "Wesley Divinity School",
    bg: graduateBg,
  },
  {
    title: "JOHN WESLEY SCHOOL OF LAW AND GOVERNANCE",
    subtitle: "Wesley Divinity School",
    bg: lawBg,
  },
  {
    title: "COLLEGE OF NURSING",
    subtitle: "Wesley Divinity School",
    bg: nursingBg,
  },
  {
    title: "COLLEGE OF ALLIED MEDICAL SCIENCES",
    subtitle: "Wesley Divinity School",
    bg: cectBg,
  },
  {
    title: "COLLEGE OF BUSINESS AND ACCOUNTANCY",
    subtitle: "Wesley Divinity School",
    bg: cbaBg,
  },
  {
    title: "COLLEGE OF ENGINEERING AND TECHNOLOGY",
    subtitle: "Wesley Divinity School",
    bg: cectBg,
    groups: [
      {
        name: "ENGINEERING",
        officers: ["President","Vice President","Secretary","Treasurer","Auditor","PRO"],
      },
      {
        name: "INFORMATION TECHNOLOGY",
        officers: ["President","Vice President","Secretary","Treasurer","Auditor","PRO"],
      },
    ],
  },
  {
    title: "COLLEGE OF ARTS AND SCIENCES",
    subtitle: "Wesley Divinity School",
    bg: cbaBg,
  },
  {
    title: "COLLEGE OF EDUCATION",
    subtitle: "Wesley Divinity School",
    bg: educationBg,
  },
  {
    title: "COLLEGE OF CRIMINAL JUSTICE EDUCATION",
    subtitle: "Wesley Divinity School",
    bg: criminaljusticeBg,
  },
  {
    title: "COLLEGE OF HOSPITALITY AND TOURISM MANAGEMENT",
    subtitle: "Wesley Divinity School",
    bg: tourismBg,
  },
];

/* ===================== MAIN ===================== */

export default function AlumnaAssociation() {
  return (
    <AlumnaLayout>
      <div className="min-h-screen bg-gray-50 pt-20">

        {/* PAGE TITLE */}
        <div className="text-center py-6">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-800">
            ALUMNI ASSOCIATION
          </h1>
          <p className="text-xl md:text-2xl text-blue-700">
            LIST OF OFFICERS
          </p>
        </div>

        {/* ALL DEPARTMENTS */}
        {departments.map((dept, index) => (
          <DepartmentSection key={index} {...dept} />
        ))}

      </div>
    </AlumnaLayout>
  );
}

/* ===================== COMPONENTS ===================== */

function DepartmentSection({ title, subtitle, bg, groups }) {
  return (
    <div className="mb-20">

      {/* HERO IMAGE */}
      <div className="relative w-full h-[260px] md:h-[500px]">
        <img src={bg} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-xl md:text-4xl font-bold tracking-wide">
            {title}
          </h2>
          <p className="text-sm md:text-lg mt-2 opacity-90">
            {subtitle}
          </p>
        </div>
      </div>

      {/* OFFICERS */}
      <div className="max-w-6xl mx-auto mt-6 px-4 pb-20">
        {groups ? (
          <div className="space-y-16">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-blue-800 text-center mb-6">
                  {group.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {group.officers.map((role, i) => (
                    <OfficerCard key={i} role={role} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {["President","Vice President","Secretary","Treasurer","Auditor","PRO"].map((role,i)=>(
                <OfficerCard key={i} role={role} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function OfficerCard({ role }) {
  return (
    <div className="border rounded-lg p-4 text-center hover:shadow-md transition min-w-[140px]">
      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg">
        {role[0]}
      </div>
      <h4 className="font-semibold text-sm md:text-base text-blue-800">
        {role.toUpperCase()}
      </h4>
      <p className="text-sm text-gray-600 mt-1">
        Officer Name
      </p>
    </div>
  );
}
