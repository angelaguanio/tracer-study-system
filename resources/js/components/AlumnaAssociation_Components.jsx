import React from "react";

/* ===================== COMPONENTS ===================== */

export function DepartmentSection({ title, subtitle, bg, groups }) {
  return (
    <div className="mb-20">
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

export function OfficerCard({ role }) {
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
