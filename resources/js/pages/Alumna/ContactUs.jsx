import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact_us_new.webp';
import inquireImg from '../../assets/inquire.svg';
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
    <div className="flex flex-col w-full min-h-screen bg-app-bg overflow-x-hidden">
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
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, color-mix(in srgb, var(--theme-primary, #15803d) 85%, black) 100%)' }}
        />

        {/* Text content */}
        <div 
          ref={heroRef}
          className={`relative z-20 w-full max-w-5xl px-6 transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl mb-4 ">
            Have questions, concerns, or suggestions?
          </h1>
          <div className={`w-12 h-1 mx-auto mb-6 transition-all duration-1000 delay-200 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ background: 'var(--theme-primary)' }} />
          <p className={`text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg transition-all duration-1000 delay-300 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            We're here to help. Connect with the Alumni Office through any of our available contact channels.
          </p>
        </div>
      </section>

      {/* ── GET IN TOUCH ─────────────────────────────────────── */}
      <section className="relative w-full py-20 px-6 sm:px-10 lg:px-20 bg-app-bg">
        <div className="max-w-7xl mx-auto relative z-10" ref={cardsRef}>

          {/* Section header */}
          <div className={`text-center mb-16 transition-all duration-700 transform ${cardsVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--theme-primary)' }}>
              COMMUNICATION CHANNELS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">Get in Touch</h2>
            <div className="w-16 h-1 mx-auto rounded-full mb-6" style={{ background: 'var(--theme-primary)' }} />
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
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
                  className={`flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:-translate-y-2 hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform ${cardsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  {/* Icon circle */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xs"
                    style={{ 
                      background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                      color: 'var(--theme-primary)' 
                    }}
                  >
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>

                  {item.isLink ? (
                    <a
                      href={item.href}
                      className="font-semibold text-sm hover:underline leading-snug mb-2 transition-colors break-all"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="font-semibold text-sm leading-snug mb-2 text-slate-800">{item.content}</p>
                  )}

                  <p className="text-slate-500 text-xs leading-relaxed mt-auto pt-2">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-app-bg pb-24 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto" ref={ctaRef}>
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
            
            <div 
              className={`flex-1 max-w-xl transition-all duration-1000 transform ${ctaVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-slate-900">
                Need to Submit an Inquiry?
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 font-medium">
                Submit an inquiry through the portal and track our responses in one place. Our personnel will respond as soon as possible during office hours.
              </p>
              <div className="mt-2 flex justify-start">
                <Link
                  href={route('alumna.inquiries.index')}
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-95 hover:-translate-y-0.5"
                  style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
                >
                  Go to My Inquiries
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className={`flex-1 flex justify-center transition-all duration-1000 delay-200 transform ${ctaVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              {/* Illustration */}
              <div className="shrink-0 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 select-none drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
                <img src={inquireImg} alt="Inquire Illustration" className="w-full h-full object-contain" />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
