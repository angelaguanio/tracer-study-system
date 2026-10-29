import { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";
import cectBuilding from "@/assets/cect_building.webp";
import graduationBg from "@/assets/grad_pic.webp";
import triangleBg from "@/assets/triangle.svg";
import triangle2Bg from "@/assets/triangle2.svg";
import peopleImg from "@/assets/people.svg";
import {Heart, Handshake, Trophy, Scale, Sparkles } from 'lucide-react';

/* ── icon helpers ─────────────────────────────────────────── */
const IconPeople = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);
const IconChart = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 10"/>
  </svg>
);
const IconHandshake = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l3-3 2 2 4-4m-1 9H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3"/>
  </svg>
);
const IconTarget = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
  </svg>
);
const IconEye = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);
const IconGrad = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.25a12.083 12.083 0 01-9 0 12.083 12.083 0 01-9-3.194 12.083 12.083 0 012.84-2.578L12 14z"/>
  </svg>
);

/* ── purpose cards ────────────────────────────────────────── */
const purposes = [
  { Icon: IconPeople,   title: "Connect Alumni",         desc: "Maintain a lifelong connection between the college and its alumni community." },
  { Icon: IconChart,    title: "Track Career Growth",    desc: "Gather relevant data on graduates' employment and industry experience." },
  { Icon: IconHandshake,title: "Alumni Engagement",      desc: "Provide a platform for alumni involvement, events, and opportunities to collaborate with the institution." },
];

/* ── core values ──────────────────────────────────────────── */
const coreValues = [
  { emoji: <Heart/>,  en: "COMPASSION",    fil: "Malasakit",     desc: "We express profound empathy through selfless acts of service to alleviate suffering, promote understanding, and cultivate kindness in our interactions with living beings and the environment transcending boundaries of cultural differences.",                  border: "border-red-400"   },
  { emoji: <Handshake/> ,  en: "HARMONY",       fil: "Pagkakaisa",    desc: "We ardently cultivate a collaborative spirit, cherishing diverse perspectives that enrich our academic landscape. We embody interdisciplinary synergy that dismantles academic boundaries, fostering an environment where ideas converge for innovation. Rooted in Christian values and traditions, we thrive on principles of integrity and mutual respect in creating an inclusive academic community.",                       border: "border-yellow-400"},
  { emoji: <Scale/>,  en: "ACCOUNTABILITY",fil: "Pananagutan",   desc: "We ensure responsibility for all actions, behaviors, performance, and their consequences, and demonstrate stewardship in utilizing both tangible and intangible resources. We uphold integrity in fulfilling our roles and capacities as models of servant leadership.",             border: "border-blue-400"  },
  { emoji: <Sparkles/>,  en: "SPIRITUALITY",  fil: "Espiritwalidad",desc: "We live by the principles of ecumenism and interfaith dialogues as part of our spiritual formation with great dependence on the graces flowing from God. We live a life ruled by social holiness in accordance with His mission and teachings until we are formed in Him.",                 border: "border-cyan-400"  },
  { emoji: <Trophy/>,  en: "EXCELLENCE",    fil: "Husay",         desc: "We strive for greatness through a relentless commitment to the highest standards across all aspects of academic and institutional life reflected in the active pursuit of scholarly distinction by undertaking knowledge-generation endeavors, cultivation of critical thinking, and fostering an environment that encourages continuous improvement and development.",         border: "border-orange-400"},
];

export default function AlumnaAbout() {
  const { system_settings } = usePage().props;
  const appName = system_settings?.app_name || 'ALUMNI CONNECT';

  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const coreValuesRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [coreValuesVisible, setCoreValuesVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(false);
    setMissionVisible(false);
    setVisionVisible(false);
    setCoreValuesVisible(false);

    let observer;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.target === heroRef.current && entry.isIntersecting) setHeroVisible(true);
          if (entry.target === missionRef.current && entry.isIntersecting) setMissionVisible(true);
          if (entry.target === visionRef.current && entry.isIntersecting) setVisionVisible(true);
          if (entry.target === coreValuesRef.current && entry.isIntersecting) setCoreValuesVisible(true);
        });
      }, { threshold: 0.15 });

      if (heroRef.current) observer.observe(heroRef.current);
      if (missionRef.current) observer.observe(missionRef.current);
      if (visionRef.current) observer.observe(visionRef.current);
      if (coreValuesRef.current) observer.observe(coreValuesRef.current);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Head>
        <link rel="preload" as="image" href={graduationBg} />
      </Head>

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden">
        <img
          src={graduationBg}
          alt="Graduates"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, color-mix(in srgb, var(--theme-primary, #15803d) 85%, black) 100%)'
          }}
        />
        
        <div 
          ref={heroRef}
          className={`relative z-10 w-full max-w-5xl px-6 text-center mt-20 transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight md:whitespace-nowrap tracking-wide text-shadow uppercase">
            {appName}
          </h1>
          <p className="text-white/95 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            Strengthening connections between the College of Engineering and Computer Technology graduates and the institution.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. MISSION & VISION & CORE VALUES WRAPPER
      ═══════════════════════════════════════════════════════ */}
      <div style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--theme-primary, #15803d) 85%, black) 0%, #0f172a 100%)' }}>
      <section className="py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col gap-12">
          
          {/* Mission */}
          <div 
            ref={missionRef}
            className={`flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 transition-all duration-1000 transform ${missionVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
          >
            {/* Text Side */}
            <div className="flex-1 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl shadow-xs flex items-center justify-center shrink-0"
                  style={{ 
                    background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                    color: 'var(--theme-primary)' 
                  }}
                >
                  <IconTarget />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Mission</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "To promote transformative leadership evidenced through good governance;",
                  "To develop highly-skilled, highly motivated, and conscientious learners;",
                  "To produce competent and virtuous learners equipped with state-of-the-art facilities;",
                  "To foster successful and sustainable partnerships locally and internationally in instruction and research;",
                  "To be at the forefront in conducting innovative research relevant to nation-building.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div 
                      className="mt-1 w-5 h-5 rounded-full shadow-xs flex items-center justify-center shrink-0"
                      style={{ 
                        background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                        color: 'var(--theme-primary)' 
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Image Side (Angled Cut) */}
            <div 
              className="hidden md:block w-[40%] bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${cectBuilding})`,
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' 
              }}
            />
            {/* Mobile Image */}
            <div 
              className="md:hidden h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${cectBuilding})` }}
            />
          </div>

          {/* Vision */}
          <div 
            ref={visionRef}
            className={`flex flex-col-reverse md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 transition-all duration-1000 transform ${visionVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
          >
            {/* Image Side (Angled Cut) */}
            <div 
              className="hidden md:block w-[40%] bg-cover bg-center relative"
              style={{ 
                backgroundImage: `url(${graduationBg})`,
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' 
              }}
            >
               <div className="absolute inset-0 bg-primary/10" />
            </div>
            
            {/* Text Side */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl shadow-xs flex items-center justify-center shrink-0"
                  style={{ 
                    background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                    color: 'var(--theme-primary)' 
                  }}
                >
                  <IconEye />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Vision</h2>
              </div>
              <blockquote className="relative px-6 py-2">
                <span 
                  className="absolute top-0 left-0 text-5xl font-serif leading-none select-none opacity-40"
                  style={{ color: 'var(--theme-primary)' }}
                >
                  "
                </span>
                <p className="text-slate-800 text-xl leading-relaxed italic relative z-10 px-4 font-medium">
                  Wesleyan University-Philippines is a globally competitive institution that embodies Wesleyan
                  spirituality in providing transformative education.
                </p>
                <span 
                  className="absolute bottom-[-20px] right-0 text-5xl font-serif leading-none select-none opacity-40"
                  style={{ color: 'var(--theme-primary)' }}
                >
                  "
                </span>
              </blockquote>
            </div>
            
            {/* Mobile Image */}
            <div 
              className="md:hidden h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${graduationBg})` }}
            />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. CORE VALUES — dark navy bg, icon cards in a row
      ═══════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:py-16 sm:px-10">
        <div className="max-w-8xl mx-auto">

          {/* heading */}
          <div 
            ref={coreValuesRef}
            className={`text-center mb-10 transition-all duration-1000 transform ${coreValuesVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
          >
            <p 
              className="text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-sm"
              style={{ color: 'color-mix(in srgb, var(--theme-primary) 40%, white)' }}
            >
              What We Stand For
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {coreValues.map(({ emoji, en, fil, desc, border }, index) => (
              <div
              key={en}
              className={`group relative flex flex-col items-center text-center text-white gap-2
                bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-700 transform ${coreValuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                w-full shadow-lg backdrop-blur-sm overflow-hidden`}
              style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" 
                  style={{ filter: 'drop-shadow(0 0 8px var(--theme-primary))' }}
                />
                <span 
                  className="text-4xl p-6 rounded-2xl shadow-inner mb-2"
                  style={{ background: 'color-mix(in srgb, var(--theme-primary) 25%, rgba(255,255,255,0.15))' }}
                >
                  {emoji}
                </span>
                <h4 className='font-extrabold text-lg sm:text-base lg:text-lg tracking-wide leading-tight'>{en}</h4>
                <p className="text-sm lg:text-[15px] opacity-90">({fil})</p>
                <p className="text-xs sm:text-sm lg:text-[14px] leading-relaxed opacity-95 text-white/90">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
      </div>

    </div>
  );
}

AlumnaAbout.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
