import React from "react";

export function DepartmentSection({ title, subtitle, bg, groups, officers }) {
  return (
    <div className="mb-20">

      {/* ================= HERO (FULL WIDTH SAME AS MAIN) ================= */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 mb-16">

        <section className="relative w-full h-[320px] md:h-[420px]">

          {/* IMAGE BACKGROUND */}
          <img
            src={bg}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/50" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

            <h1 className="text-white text-3xl md:text-6xl font-extrabold tracking-wide">
              {title}
            </h1>

            <p className="text-white mt-3 text-sm md:text-lg max-w-2xl opacity-90">
              {subtitle}
            </p>

          </div>

        </section>
      </div>

      {/* ================= OFFICERS (WIDER FIXED) ================= */}
      <div className="max-w-7xl mx-auto mt-10 px-4 md:px-6 pb-20">

        {groups ? (
          <div className="space-y-12">

            {groups.map((group, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-10"
              >

                <h3 className="text-2xl font-bold text-[#001D4A] text-center mb-8">
                  {group.name}
                </h3>

                {/* GRID MAS MALUWAG */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                  {group.officers.map((officer, i) => (
                    <OfficerCard
                      key={i}
                      role={officer.role}
                      name={officer.name}
                    />
                  ))}

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {officers?.map((officer, i) => (
                <OfficerCard
                  key={i}
                  role={officer.role}
                  name={officer.name}
                />
              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ================= OFFICER CARD ================= */
export function OfficerCard({ role, name }) {

  const getInitials = (role) => {
    const r = role?.toLowerCase();

    if (r?.includes("vice president")) return "VP";
    if (r?.includes("president")) return "P";
    if (r?.includes("auditor")) return "AUD";
    if (r?.includes("treasurer")) return "T";
    if (r?.includes("secretary")) return "SC";
    if (r?.includes("pro")) return "PRO";

    return "O";
  };

  return (
    <div
      className="
        flex items-center gap-4 
        bg-[#F3F7FA] border border-gray-200 
        rounded-xl shadow-sm 
        hover:shadow-md hover:-translate-y-1 
        transition-all duration-300 
        p-4 w-full
      "
    >

      {/* AVATAR */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
        style={{ backgroundColor: "#001D4A" }}
      >
        {getInitials(role)}
      </div>

      {/* TEXT */}
      <div>
        <h4 className="text-sm md:text-base font-bold text-[#001D4A]">
          {role}
        </h4>

        <p className="text-xs md:text-sm text-gray-600">
          {name}
        </p>
      </div>

    </div>
  );
}