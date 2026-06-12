/* ===================== DEPARTMENT SECTION ===================== */
export function DepartmentSection({ title, subtitle, bg, groups, officers }) {
  return (
    <div className="w-full">

      {/* ── full-width image banner ── */}
      <div className="w-full relative h-[260px] sm:h-[340px]">
        <img
          src={bg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── officer cards ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {groups ? (
          groups.map((group, idx) => (
            <GroupCard key={idx} group={group} />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <OfficerGrid officers={officers} />
          </div>
        )}
      </div>

    </div>
  );
}

/* ── single group card (e.g. ECE / IT) ── */
function GroupCard({ group }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <h3 className="text-blue-600 text-sm sm:text-base font-extrabold tracking-widest uppercase text-center mb-2">
        {group.name}
      </h3>
      {/* blue underline accent */}
      <div className="w-10 h-0.5 bg-blue-500 mx-auto mb-6" />
      <OfficerGrid officers={group.officers} />
    </div>
  );
}

/* ── responsive officer grid ── */
function OfficerGrid({ officers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {officers?.map((officer, i) => (
        <OfficerCard key={i} role={officer.role} name={officer.name} />
      ))}
    </div>
  );
}

/* ── officer card ── */
export function OfficerCard({ role, name }) {
  const getInitials = (role) => {
    const r = role?.toLowerCase();
    if (r?.includes("vice president")) return "VP";
    if (r?.includes("president"))      return "P";
    if (r?.includes("auditor"))        return "AUD";
    if (r?.includes("treasurer"))      return "T";
    if (r?.includes("secretary"))      return "SC";
    if (r?.includes("pro"))            return "PRO";
    return "O";
  };

  return (
    <div className="flex items-center gap-4 bg-[#F3F7FA] border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4">
      {/* avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
        style={{ backgroundColor: "#001D4A" }}
      >
        {getInitials(role)}
      </div>
      {/* text */}
      <div className="min-w-0">
        <p className="text-[#001D4A] font-bold text-sm leading-snug">{role}</p>
        <p className="text-gray-500 text-sm mt-0.5">{name}</p>
      </div>
    </div>
  );
}
