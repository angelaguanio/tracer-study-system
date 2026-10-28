/* ===================== DEPARTMENT SECTION ===================== */
export function DepartmentSection({ title, subtitle, bg, groups, officers }) {
  return (
    <div className="w-full">



      {/* ── officer cards ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-10 space-y-8">
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

/* ── generic avatar ── */
const AvatarGeneric = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
    <circle cx="40" cy="40" r="40" fill="#EEF4FB" />
    <circle cx="40" cy="30" r="14" fill="#C5D8F0" />
    <path d="M12 72c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#C5D8F0" />
  </svg>
);

/* ── single group card (e.g. ECE / IT) ── */
function GroupCard({ group }) {
  return (
    <div className="w-full mb-16">
      <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold tracking-widest uppercase text-center mb-4 drop-shadow-lg">
        {group.name}
      </h3>
      {/* cyan underline accent */}
      <div className="w-10 h-0.5 bg-[#00C2FF] mx-auto mb-10" />
      <OfficerHierarchyGrid officers={group.officers} />
    </div>
  );
}

/* ── hierarchical officer grid ── */
function OfficerHierarchyGrid({ officers }) {
  const president = officers?.find(o => o.role.toLowerCase() === 'president');
  const vp = officers?.find(o => o.role.toLowerCase() === 'vice president');
  const others = officers?.filter(o => {
    const r = o.role.toLowerCase();
    return r !== 'president' && r !== 'vice president';
  });

  return (
    <div className="flex flex-col items-center gap-y-8 sm:gap-y-12 w-full pt-4">
      {/* Level 1: President */}
      {president && (
        <div className="flex justify-center w-full">
          <AssociationOfficerCard officer={president} level="president" />
        </div>
      )}

      {/* Level 2: VP */}
      {vp && (
        <div className="flex justify-center w-full">
          <AssociationOfficerCard officer={vp} level="vp" />
        </div>
      )}

      {/* Level 3: Others */}
      {others && others.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 w-full mt-2 sm:mt-0">
          {others.map((officer, i) => (
            <AssociationOfficerCard key={i} officer={officer} level="staff" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── officer card with new design ── */
export function AssociationOfficerCard({ officer, level }) {
  const badgeColor = "bg-[#1258D6] text-white";

  const isPresident = level === "president";
  const isVp = level === "vp";

  const cardMaxWidth = isPresident
    ? "max-w-[330px] sm:max-w-[360px] px-6 py-9"
    : isVp
    ? "max-w-[310px] sm:max-w-[330px] px-6 py-8"
    : "max-w-[290px] sm:max-w-[310px] px-6 py-8";

  const avatarSize = isPresident
    ? "w-36 h-36 sm:w-44 sm:h-44"
    : isVp
    ? "w-32 h-32 sm:w-40 sm:h-40"
    : "w-32 h-32 sm:w-36 sm:h-36";

  const titleSize = isPresident
    ? "text-base sm:text-lg md:text-xl font-bold"
    : "text-sm sm:text-base md:text-lg font-bold";

  return (
    <div className={`relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center text-center w-full ${cardMaxWidth}`}>
      {/* TOP BADGE */}
      <div className={`absolute top-0 -translate-y-1/2 px-6 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}>
        {officer.role}
      </div>

      {/* AVATAR */}
      <div className={`relative ${avatarSize} mb-5 mt-2`}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-100 shadow-md ring-4 ring-blue-50/80">
          {officer.img ? (
            <img src={officer.img} alt={officer.name} className="w-full h-full object-cover object-top" />
          ) : (
            <AvatarGeneric />
          )}
        </div>
      </div>

      {/* TEXT */}
      <h3 className={`text-[#001D4A] leading-snug px-2 ${titleSize}`}>
        {officer.name}
      </h3>
      
      {/* YELLOW ACCENT */}
      <div className="w-10 h-[3px] bg-yellow-400 rounded-full mt-3.5" />
    </div>
  );
}
