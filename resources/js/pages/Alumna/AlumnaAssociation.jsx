import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "../../lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/AlumnaAssociation_Components";
import graduationBg from "@/assets/graduation-bg.jpg";

/* ── icon ─────────────────────────────────────────────────── */
const IconTeam = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AlumnaAssociation() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[480px] sm:h-[520px] flex items-center overflow-hidden">

        <img
          src={graduationBg}
          alt="Alumni Association"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark-left gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-blue-600/20" />

        {/* left-aligned text */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 py-16">
          <div className="max-w-xl">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight uppercase drop-shadow-lg">
              Alumni Association
            </h1>

            {/* yellow accent bar */}
            <div className="w-12 h-1 bg-yellow-400 rounded my-4" />

            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-sm">
              Meet the dedicated officers driving our alumni association forward.
              Together, we strengthen connections and create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. INTRO / LEADERSHIP
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#EEF4FB] py-14 sm:py-16 px-6 sm:px-10 relative overflow-hidden">

        {/* decorative dot grids */}
        <DotGrid className="absolute top-4 left-4 opacity-30" />
        <DotGrid className="absolute bottom-4 right-4 opacity-30" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-2">
            Our Leadership
          </p>
          {/* blue underline accent */}
          <div className="w-10 h-0.5 bg-blue-500 mx-auto mb-4" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001D4A] mb-4">
            Guided by Passion. Driven by Purpose.
          </h2>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Our alumni association is led by passionate individuals committed to fostering connections
            and strengthening our academic community.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. DEPARTMENTS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#EEF4FB] pb-16">
        {departments.length > 0 ? (
          departments.map((dept, index) => (
            <DepartmentSection key={index} {...dept} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-12">No departments available</p>
        )}
      </section>

    </div>
  );
}

/* ── tiny dot-grid decoration ─────────────────────────────── */
function DotGrid({ className = "" }) {
  return (
    <div className={`grid grid-cols-8 gap-2 ${className}`}>
      {Array.from({ length: 48 }).map((_, i) => (
        <span key={i} className="w-1 h-1 rounded-full bg-blue-400 block" />
      ))}
    </div>
  );
}

AlumnaAssociation.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
