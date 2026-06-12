import AlumnaLayout from "@/layouts/alumna-layout";
import { officeData } from "@/lib/AlumnaOfficeDatalist";

const { staff } = officeData;

/* ── icons ────────────────────────────────────────────────── */
const IconTeam = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconMail = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

/* ── avatar icons ─────────────────────────────────────────── */
const AvatarMale = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
    <circle cx="40" cy="40" r="40" fill="#EEF4FB" />
    <circle cx="40" cy="30" r="14" fill="#C5D8F0" />
    <path d="M12 72c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#C5D8F0" />
    {/* tie */}
    <path d="M37 52l3 6 3-6-1.5-3h-3L37 52z" fill="#4A7DBF" />
    <rect x="38.5" y="55" width="3" height="8" rx="1" fill="#4A7DBF" />
  </svg>
);
const AvatarFemale = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
    <circle cx="40" cy="40" r="40" fill="#EEF4FB" />
    <circle cx="40" cy="30" r="14" fill="#C5D8F0" />
    <path d="M12 72c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#C5D8F0" />
    {/* collar */}
    <path d="M34 52 Q40 58 46 52" stroke="#4A7DBF" strokeWidth="2" fill="none" />
  </svg>
);

/* ── staff data pulled from lib ───────────────────────────── */

export default function AlumnaOffice() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] flex items-center overflow-hidden">

        <img
          src={officeData.bg}
          alt="Alumni Office"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark-left gradient, lighter right */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-blue-600/30" />

        {/* left-aligned text */}
        <div className="relative z-10 w-full max-w-7xl ml-24 px-6 sm:px-10 py-16">
          <div className="max-w-xl">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg uppercase">
              Alumni Affairs
            </h1>
            <h2 className="text-yellow-300 text-base sm:text-lg md:text-xl font-bold tracking-widest uppercase mt-2 drop-shadow">
              List of Officers
            </h2>

            {/* yellow accent bar */}
            <div className="w-12 h-1 bg-yellow-400 rounded my-4" />

            <p className="text-white/85 lg:text-lg sm:text-base leading-relaxed max-w-sm">
              The Office for Alumni Affairs is committed to building strong relationships with our graduates and
              fostering a lifelong connection with the university.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. TEAM HEADER
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#EEF4FB] py-12 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
            <IconTeam />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#001D4A] uppercase tracking-wider mb-2">
            Alumni Office Team
          </h2>
          {/* blue underline accent */}
          <div className="w-10 h-0.5 bg-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Dedicated professionals working to strengthen alumni engagement and support the university community.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. STAFF CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#EEF4FB] pb-16 px-6 sm:px-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {staff.map((person, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 px-6 py-5"
            >
              {/* avatar */}
              <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden">
                {person.gender === "female" ? <AvatarFemale /> : <AvatarMale />}
              </div>

              {/* text */}
              <div className="min-w-0">
                <h3 className="text-[#001D4A] font-extrabold text-sm sm:text-base uppercase leading-snug">
                  {person.role}
                </h3>
                {/* yellow underline */}
                <div className="w-8 h-0.5 bg-yellow-400 rounded my-2" />
                <p className="text-gray-700 text-sm">{person.name}</p>
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center gap-1.5 text-gray-500 text-xs mt-1 hover:text-blue-600 transition-colors"
                >
                  <IconMail />
                  {person.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

AlumnaOffice.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
