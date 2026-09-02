import { useState, useEffect } from "react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "../../lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/alumna/AlumnaAssociation_Components";
import cectBg from "@/assets/cect_bg_clean.png";

/* ── icon ─────────────────────────────────────────────────── */
const IconTeam = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AlumnaAssociation() {
  const [activeProgram, setActiveProgram] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeDept, setFadeDept] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setFadeDept(false);
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setFadeDept(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleProgramSwitch = (idx) => {
    setFadeDept(false);
    setTimeout(() => {
      setActiveProgram(idx);
      setFadeDept(true);
    }, 200); // Wait for fade out before switching content
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      
      {/* ═══════════════════════════════════════════════════════
          FIXED BACKGROUND
      ═══════════════════════════════════════════════════════ */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cectBg})` }}
      >
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-blue-900/60 bg-gradient-to-t from-[#003C87] to-[#003C87]/30" />
      </div>

      <div className="relative z-10 w-full flex flex-col">
        {/* ═══════════════════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="relative w-full flex flex-col items-center text-center px-6 pt-32 pb-8 mt-10">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight drop-shadow-2xl mb-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <span className="text-[#8AD1F7]">Guided by Passion.</span><br/>
            <span className="text-white">Driven by Purpose.</span>
          </h1>
          <p className={`text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg mb-20 transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Meet the dedicated officers driving our alumni association forward. Together, we strengthen connections and create lasting impact.
          </p>

          {/* Toggle Switch */}
          <div className={`flex bg-[#234371] rounded-full shadow-lg max-w-2xl w-full mx-auto relative z-20 transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Sliding Background */}
            <div 
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] rounded-full transition-transform duration-300 ease-out shadow-md z-0"
              style={{ transform: `translateX(${activeProgram * 100}%)` }}
            />

            <button
              onClick={() => handleProgramSwitch(0)}
              className={`flex-1 py-3 px-2 sm:px-4 text-sm sm:text-base transition-colors duration-300 rounded-full cursor-pointer active:scale-95 focus:outline-none relative z-10 ${
                activeProgram === 0 ? "text-white font-medium" : "text-white/80 hover:text-white font-normal hover:bg-white/5"
              }`}
            >
              Electronics & Computer<br className="hidden sm:block" /> Engineering Program
            </button>
            <button
              onClick={() => handleProgramSwitch(1)}
              className={`flex-1 py-3 px-2 sm:px-4 text-sm sm:text-base transition-colors duration-300 rounded-full cursor-pointer active:scale-95 focus:outline-none relative z-10 ${
                activeProgram === 1 ? "text-white font-medium" : "text-white/80 hover:text-white font-normal hover:bg-white/5"
              }`}
            >
              Information Technology<br className="hidden sm:block" /> Program
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. DEPARTMENTS
        ═══════════════════════════════════════════════════════ */}
        <section className={`pb-16 relative z-10 transition-all duration-500 transform ${fadeDept ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          {departments[activeProgram] ? (
            <DepartmentSection {...departments[activeProgram]} />
          ) : (
            <p className="text-center text-gray-500 py-12">No department selected</p>
          )}
        </section>

      </div>
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
