import { useState, useEffect } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      
      {/* ═══════════════════════════════════════════════════════
          FIXED BACKGROUND
      ═══════════════════════════════════════════════════════ */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${officeData.bg})` }}
      >
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-blue-900/60 bg-gradient-to-t from-[#003C87] to-[#003C87]/30" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 z-10">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-widest uppercase drop-shadow-2xl mb-4 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <span className="text-white">Alumni Affairs</span>
        </h1>
        {/* blue underline accent */}
        <div className={`w-12 h-1 bg-[#00C2FF] mx-auto mb-6 transition-all duration-1000 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} />
        <p className={`text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          The Office for Alumni Affairs is committed to building strong relationships with our graduates and fostering a lifelong connection with the university.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. STAFF CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 pb-20 px-6 sm:px-10">
        <div className={`max-w-5xl mx-auto flex flex-col items-center gap-y-12 transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Section Header */}
          <div className="text-center w-full mb-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-widest uppercase drop-shadow-lg mb-4">
              ALUMNI OFFICE PERSONNEL
            </h2>
            <div className="w-12 h-1 bg-[#00C2FF] mx-auto mb-4" />
            <p className="text-white/95 text-base sm:text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
              Dedicated professionals working to strengthen alumni engagement and support the university community.
            </p>
          </div>

          {/* Director Row */}
          <div className="flex justify-center w-full">
            {staff
              .filter((p) => p.role.includes("Director"))
              .map((person, i) => (
                <div
                  key={`dir-${i}`}
                  className="relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center text-center px-6 py-8 w-full max-w-[280px]"
                >
                  {/* TOP BADGE */}
                  <div className="absolute top-0 -translate-y-1/2 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1258D6] text-white">
                    DIRECTOR
                  </div>

                  {/* AVATAR */}
                  <div className="relative w-24 h-24 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {person.gender === "female" ? <AvatarFemale /> : <AvatarMale />}
                    </div>
                    {/* Star badge for Director */}
                    <div className="absolute bottom-0 right-0 bg-[#1258D6] text-white p-1.5 rounded-full border-2 border-white">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>

                  {/* TEXT */}
                  <h3 className="text-[#001D4A] font-bold text-base sm:text-lg">
                    {person.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{person.role}</p>

                  {/* YELLOW ACCENT */}
                  <div className="w-10 h-[2px] bg-yellow-400 rounded-full my-4" />

                  {/* EMAIL */}
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-1.5 text-[#1258D6] font-medium text-xs sm:text-sm hover:underline"
                  >
                    <IconMail />
                    {person.email}
                  </a>
                </div>
              ))}
          </div>

          {/* Staff Row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 w-full">
            {staff
              .filter((p) => !p.role.includes("Director"))
              .map((person, i) => (
                <div
                  key={`staff-${i}`}
                  className="relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center text-center px-6 py-8 w-full max-w-[280px]"
                >
                  {/* TOP BADGE */}
                  <div className="absolute top-0 -translate-y-1/2 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFC107] text-[#001D4A]">
                    STAFF
                  </div>

                  {/* AVATAR */}
                  <div className="relative w-24 h-24 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {person.gender === "female" ? <AvatarFemale /> : <AvatarMale />}
                    </div>
                  </div>

                  {/* TEXT */}
                  <h3 className="text-[#001D4A] font-bold text-base sm:text-lg">
                    {person.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{person.role}</p>

                  {/* YELLOW ACCENT */}
                  <div className="w-10 h-[2px] bg-yellow-400 rounded-full my-4" />

                  {/* EMAIL */}
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-1.5 text-[#1258D6] font-medium text-xs sm:text-sm hover:underline"
                  >
                    <IconMail />
                    {person.email}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}

AlumnaOffice.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
