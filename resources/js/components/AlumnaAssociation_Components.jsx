import React from "react";

/* ===================== COMPONENTS ===================== */

export function DepartmentSection({ title, subtitle, bg, groups }) {
  return (
    <div className="mb-12 sm:mb-16 md:mb-20">

      {/* HERO IMAGE */}
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        <img src={bg} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide">
            {title}
          </h2>
          <p className="text-xs sm:text-sm md:text-lg mt-2 opacity-90 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* OFFICERS */}
      <div className="max-w-7xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 pb-12 sm:pb-20">
        {groups ? (
          <div className="space-y-10 sm:space-y-16">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 text-center mb-4 sm:mb-6">
                  {group.name}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {group.officers.map((role, i) => (
                    <OfficerCard key={i} role={role} />
                  ))}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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

export function OfficerCard({ role }) {
  return (
    <div className="flex flex-col items-center border rounded-lg p-3 sm:p-4 hover:shadow-md transition bg-white">

      <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm sm:text-lg">
        {role[0]}
      </div>

      <h4 className="text-xs sm:text-sm md:text-base font-semibold text-blue-800 text-center">
        {role.toUpperCase()}
      </h4>

      <p className="text-[10px] sm:text-xs text-gray-600 mt-1 text-center">
        Officer Name
      </p>

    </div>
  );
}