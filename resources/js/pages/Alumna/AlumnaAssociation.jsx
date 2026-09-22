import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AlumnaLayout from "@/layouts/alumna-layout";
import { departments } from "../../lib/AlumnaAssociation_Datalist";
import { DepartmentSection } from "@/components/alumna/AlumnaAssociation_Components";
import cectBg from "@/assets/cect_bg_clean.webp";

/* ── icon ─────────────────────────────────────────────────── */
const IconTeam = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AlumnaAssociation({ featuredAlumni = [] }) {
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
      <Head>
        <link rel="preload" as="image" href={cectBg} />
      </Head>
      
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
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 z-10">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight drop-shadow-2xl mb-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <span className="text-[#8AD1F7]">Alumni </span>
            <span className="text-white">Association</span>
          </h1>
          <p className={`text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Meet the dedicated officers driving our alumni association forward. Together, we strengthen connections and create lasting impact.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════
            1.5. TOGGLE SWITCH
        ═══════════════════════════════════════════════════════ */}
        <div className="w-full relative z-20 px-6 pt-16 pb-8">
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
        </div>

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

      {/* ═══════════════════════════════════════════════════════
          3. FEATURED ALUMNI (Solid Background)
      ═══════════════════════════════════════════════════════ */}
      {featuredAlumni.length > 0 && (
        <section className="relative z-20 w-full bg-app-bg py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            
            {/* Titles */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                Wesleyan Footprints: Stories that inspire
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Celebrating the Journey, Achievements, and Wesleyan Impact on our Graduates
              </p>
            </div>

            {/* Carousel / Grid */}
            <div className="w-full flex flex-wrap justify-center gap-6 pb-4">
              {featuredAlumni.slice(0, 3).map((alumnus) => (
                <div 
                  key={alumnus.id} 
                  className="w-full max-w-[350px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 relative group cursor-pointer"
                >
                  <div className="relative w-full h-72 shrink-0">
                    {alumnus.image && alumnus.image.length > 0 ? (
                      <img 
                        src={alumnus.image[0]} 
                        alt={alumnus.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    {/* Gradient Blend */}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white from-20% via-white/50 via-70% to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="px-5 pb-5 pt-1 flex flex-col bg-white relative z-10 -mt-8">
                    <h3 className="text-lg font-black text-gray-900 mb-1 line-clamp-1 tracking-tight">
                      {alumnus.title}
                    </h3>
                    
                    <div 
                      className="text-gray-600 text-xs prose prose-sm line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: alumnus.details }} 
                    />
                    
                    <div className="w-full mt-1">
                      <Link href={`/alumna/featured-alumni/${alumnus.id}`} className="w-full block">
                        <button className="w-full bg-blue-btn text-white hover:bg-gray-800 transition-colors py-2.5 rounded-full font-semibold text-xs shadow-md cursor-pointer text-center">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Link */}
            {featuredAlumni.length > 3 && (
              <div className="mt-3">
                <Link href="/alumna/featured-alumni" className="text-slate-600 hover:text-slate-900 text-sm font-semibold underline underline-offset-4 transition-colors">
                  See More
                </Link>
              </div>
            )}

          </div>
        </section>
      )}
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
