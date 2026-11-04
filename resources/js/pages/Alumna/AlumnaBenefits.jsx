import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import { benefitsData } from '@/lib/AlumnaBenefitsData';
import heroBg from '@/assets/cect_home_new.webp';
import { 
  Building2, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Briefcase
} from 'lucide-react';

export default function AlumnaBenefits() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { hero, benefits, footer } = benefitsData;

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <Head title="Alumni Benefits & Privileges" />

      {/* ═══════════════════════════════════════════════════════
          FIXED HERO BACKGROUND WITH THEME OVERLAY
      ═══════════════════════════════════════════════════════ */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 theme-hero-overlay" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          1. HERO HEADER
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 z-10">
        <div className={`max-w-4xl mx-auto flex flex-col items-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm backdrop-blur-md"
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              color: 'var(--theme-text-on-primary)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <span>{hero.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wide uppercase drop-shadow-2xl mb-4">
            {hero.title}
          </h1>

          {/* Theme Accent Underline */}
          <div 
            className={`w-16 h-1 mx-auto mb-6 rounded-full transition-all duration-1000 delay-200 transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
            style={{ background: 'var(--theme-primary)' }}
          />

          <p className="text-white/95 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl drop-shadow-md mb-6">
            {hero.subtitle}
          </p>

          <p 
            className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-4 py-1.5 rounded-md backdrop-blur-sm"
            style={{ 
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'var(--theme-text-on-primary)',
              borderLeft: '3px solid var(--theme-primary)'
            }}
          >
            {hero.prompt}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. BENEFITS CARDS GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 pb-24">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {benefits.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className={`group relative bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{
                    transitionDelay: `${150 + index * 80}ms`
                  }}
                >
                  {/* Top Header Row with Icon & Tag */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                          background: 'var(--theme-gradient)',
                          color: 'var(--theme-text-on-primary)'
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <span 
                        className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs text-center"
                        style={{
                          background: 'color-mix(in srgb, var(--theme-primary) 10%, #ffffff)',
                          color: 'var(--theme-primary)',
                          borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)'
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-(--theme-primary) transition-colors leading-snug mb-2.5">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* How to Avail / Participate Callout */}
                  <div 
                    className="rounded-xl p-3.5 border transition-colors"
                    style={{
                      background: 'color-mix(in srgb, var(--theme-primary) 4%, #f8fafc)',
                      borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, #e2e8f0)'
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-(--theme-primary)" />
                      <span className="text-xs font-bold tracking-wide uppercase text-(--theme-primary)">
                        {item.howToAvail.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-normal">
                      {item.howToAvail.instruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════
              3. STAY CONNECTED CALL-TO-ACTION BANNER
          ═══════════════════════════════════════════════════════ */}
          <div 
            className={`mt-12 sm:mt-16 bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 md:p-12 border border-white/80 shadow-2xl transition-all duration-1000 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="max-w-3xl mx-auto text-center">
              <span 
                className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-2xs"
                style={{
                  background: 'color-mix(in srgb, var(--theme-primary) 12%, #ffffff)',
                  color: 'var(--theme-primary)'
                }}
              >
                Lifelong Connection
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {footer.heading}
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {footer.message}
              </p>

              <p className="text-xs sm:text-sm font-semibold text-(--theme-primary) mb-8">
                {footer.contactNote}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href={route('alumna.office')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{
                    background: 'var(--theme-gradient)',
                    color: 'var(--theme-text-on-primary)'
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Alumni Office</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href={route('alumna.announcements')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 shadow-2xs transition-all transform hover:-translate-y-0.5"
                >
                  <Megaphone className="w-4 h-4 text-gray-600" />
                  <span>Announcements</span>
                </Link>

                <Link
                  href={route('alumna.updates')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 shadow-2xs transition-all transform hover:-translate-y-0.5"
                >
                  <Briefcase className="w-4 h-4 text-gray-600" />
                  <span>Update Career Status</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

AlumnaBenefits.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
