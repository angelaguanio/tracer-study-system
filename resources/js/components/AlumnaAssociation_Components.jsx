import React from "react";

/* ===================== COMPONENTS ===================== */

export function DepartmentSection({ title, subtitle, bg, groups }) {
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
      <div className="max-w-6xl mx-auto mt-10 px-4 pb-20">
        {groups ? (
          <div className="space-y-16">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-blue-800 text-center mb-6">
                  {group.name}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {group.officers.map((role, i) => (
                    <OfficerCard key={i} role={role} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
    <div className="flex flex-col items-center border rounded-lg p-4 hover:shadow-md transition bg-white">
      <div className="w-12 h-12 mb-2 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg">
        {role[0]}
      </div>
      <h4 className="text-sm md:text-base font-semibold text-blue-800 text-center">
        {role.toUpperCase()}
      </h4>
      <p className="text-xs text-gray-600 mt-1 text-center">
        Officer Name
      </p>
    </div>
  );
}
