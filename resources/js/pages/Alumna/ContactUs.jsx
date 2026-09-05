import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact.webp';
import { Link, Head } from '@inertiajs/react';

const contactInfo = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    content: 'alumni@wesleyan.edu.ph',
    description: 'Send us an email and we\'ll get back to you.',
    href: 'mailto:alumni@wesleyan.edu.ph',
    isLink: true,
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'Address',
    content: 'Mabini Extension, Cabanatuan City, Philippines 3100',
    description: 'Visit us in person.',
    isLink: false,
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone',
    content: '(044) 960-7110 to 14 local 109',
    description: 'Call us during office hours.',
    href: 'tel:044-960-7110',
    isLink: true,
  },
  {
    id: 'hours',
    icon: Clock,
    title: 'Office Hours',
    content: 'Mon – Fri: 8:00 AM – 5:00 PM',
    description: 'Saturday – Sunday: Closed',
    isLink: false,
  },
];

export default function ContactUs() {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const ctaRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(false);
    setCardsVisible(false);
    setCtaVisible(false);

    let observer;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.target === heroRef.current && entry.isIntersecting) setHeroVisible(true);
          if (entry.target === cardsRef.current && entry.isIntersecting) setCardsVisible(true);
          if (entry.target === ctaRef.current && entry.isIntersecting) setCtaVisible(true);
        });
      }, { threshold: 0.15 });

      if (heroRef.current) observer.observe(heroRef.current);
      if (cardsRef.current) observer.observe(cardsRef.current);
      if (ctaRef.current) observer.observe(ctaRef.current);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F4F9FC] overflow-x-hidden">
      <Head>
        <link rel="preload" as="image" href={contact} />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center z-10"
        style={{ backgroundImage: `url(${contact})` }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 bg-[#001D4A]/30"
          style={{ background: 'linear-gradient(to bottom, rgba(0, 30, 70, 0.4) 0%, rgba(0, 40, 90, 0.6) 50%, rgba(0, 60, 135, 0.8) 80%, #003C87 100%)' }}
        />

        {/* Text content */}
        <div 
          ref={heroRef}
          className={`relative z-20 w-full max-w-5xl px-6 transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl mb-4 ">
            Have questions, concerns, or suggestions?
          </h1>
          <div className={`w-12 h-1 bg-[#00C2FF] mx-auto mb-6 transition-all duration-1000 delay-200 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} />
          <p className={`text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg transition-all duration-1000 delay-300 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            We're here to help. Connect with the Alumni Office through any of our available contact channels.
          </p>
        </div>
      </section>

      {/* ── GET IN TOUCH ─────────────────────────────────────── */}
      <section 
        className="relative w-full py-24 px-6 sm:px-10 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #003C87 0%, #00316F 50%, #00224D 100%)' }}
      >
        <div className="max-w-7xl mx-auto relative z-10" ref={cardsRef}>

          {/* Section header */}
          <div className={`text-center mb-16 transition-all duration-700 transform ${cardsVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-md">Get in Touch</h2>
            <div className="w-12 h-1 bg-[#00C2FF] mx-auto mb-6" />
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Find our email, phone number, office location, and office hours below.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:-translate-y-3 hover:bg-white/20 hover:shadow-2xl hover:border-white/40 cursor-pointer transition-all duration-500 transform ${cardsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Icon circle */}
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 text-white shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>

                  {item.isLink ? (
                    <a
                      href={item.href}
                      className="text-[#8AD1F7] font-medium text-sm hover:text-white hover:underline leading-snug mb-2"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-[#8AD1F7] font-medium text-sm leading-snug mb-2">{item.content}</p>
                  )}

                  <p className="text-white/70 text-xs leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-[#F4F9FC] py-24 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto" ref={ctaRef}>
          <div className="bg-white rounded-[40px] shadow-2xl border border-blue-50 p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
            
            <div 
              className={`flex-1 max-w-xl transition-all duration-1000 transform ${ctaVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
              <h2 className="text-[#305C8C] text-xl md:text-2xl lg:text-3xl font-bold mb-6">Need to Submit an Inquiry?</h2>
              <p className="text-[#4A6482] text-sm md:text-base leading-relaxed mb-8 font-medium">
                Submit an inquiry through the portal and track our responses in one place. Our personnel will respond as soon as possible during office hours.
              </p>
              <div className="mt-2 flex justify-start">
                <Link
                  href={route('alumna.inquiries.index')}
                  className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#1648C0] text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Go to My Inquiries
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className={`flex-1 flex justify-center transition-all duration-1000 delay-200 transform ${ctaVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              {/* Illustration */}
              <div className="shrink-0 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 select-none drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
                <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="20" y="72" width="100" height="36" rx="8" fill="#1A56DB" />
                  <rect x="20" y="82" width="100" height="12" rx="0" fill="#1648C0" />
                  <rect x="44" y="82" width="52" height="8" rx="4" fill="#2563EB" opacity="0.4" />
                  <ellipse cx="72" cy="42" rx="28" ry="22" fill="#1A56DB" />
                  <text x="72" y="50" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold">?</text>
                  <ellipse cx="104" cy="54" rx="14" ry="11" fill="#93C5FD" opacity="0.85" />
                  <circle cx="99" cy="55" r="2" fill="#1E40AF" />
                  <circle cx="104" cy="55" r="2" fill="#1E40AF" />
                  <circle cx="109" cy="55" r="2" fill="#1E40AF" />
                  <path d="M30 38 L32 34 L34 38 L38 40 L34 42 L32 46 L30 42 L26 40 Z" fill="#93C5FD" opacity="0.7" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;