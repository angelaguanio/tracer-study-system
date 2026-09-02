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
    <div className="flex flex-col items-center gap-y-4 sm:gap-y-12 w-full pt-4">
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
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 w-full mt-2 sm:mt-0">
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

  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center text-center px-6 py-8 w-full max-w-[280px]">
      {/* TOP BADGE */}
      <div className={`absolute top-0 -translate-y-1/2 px-6 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
        {officer.role}
      </div>

      {/* AVATAR */}
      <div className="relative w-20 h-20 mb-4">
        <div className="w-full h-full rounded-full overflow-hidden">
          <AvatarGeneric />
        </div>
        {level === "president" && (
          <div className="absolute bottom-0 right-0 bg-[#1258D6] text-white p-1.5 rounded-full border-2 border-white">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
      </div>

      {/* TEXT */}
      <h3 className="text-[#001D4A] font-bold text-sm sm:text-base leading-snug">
        {officer.name}
      </h3>
      
      {/* YELLOW ACCENT */}
      <div className="w-8 h-[2px] bg-yellow-400 rounded-full mt-3" />
    </div>
  );
}
