import React, { useEffect, useState, useRef } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniHomeImg from '../../assets/bg_test_1.webp';
import editFileIcon from '../../assets/user.webp';
import accSvg from '../../assets/acc.svg';
import clipboardSvg from '../../assets/clipboard.svg';
import notifSvg from '../../assets/notif.svg';
import shareSvg from '../../assets/share.svg';
import { Link, Head } from '@inertiajs/react';
import echo from '@/echo';
import UpdateProfileBanner from '@/components/alumna/UpdateProfileBanner';

import { ArrowRight, ImageOff, User, FileText, Bell, Share2 } from 'lucide-react';

// Fade In Animation Wrapper
function FadeInSection({ children, delay = 0, className = "" }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    setVisible(false);
    let observer;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(domRef.current);
          }
        });
      }, { threshold: 0.1 });
      
      if (domRef.current) {
          observer.observe(domRef.current);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}


// Announcement Card Component (Updated for premium design)
function AnnouncementCard({ id, date, title, description, image }) {
  const imgSrc = Array.isArray(image) ? image[0] : image;

  return (
    <div className="group bg-white rounded-[2rem] p-5 shadow-lg border border-slate-200/80 hover:border-slate-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col h-[430px] w-full max-w-[340px] relative overflow-hidden">      
      {/* Decorative Blur */}
      <div 
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-0" 
        style={{ background: 'var(--theme-primary)' }}
      />

      <div className="overflow-hidden rounded-2xl mb-5 relative z-10 border border-gray-50 shadow-sm">
          {imgSrc ? (
            <img
              src={imgSrc}
              className="w-full h-[180px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              alt={title}
            />
          ) : (
            <div className="w-full h-[180px] bg-slate-50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
              <ImageOff size={48} className="text-slate-300 drop-shadow-sm" />
            </div>
          )}
      </div>

      <div className="flex-1 flex flex-col relative z-10 px-2">
          <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--theme-primary)' }}></div>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>{date}</p>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{description}</p>
      </div>

      <Link href={`/alumni/announcement/${id}`} className="mt-auto relative z-10 px-2 pb-1">
        <button 
          className="w-full py-3.5 rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer"
          style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
        >
          Read More
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon: Icon, imgSrc }) {
  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-xl overflow-hidden h-full min-h-[320px] w-full flex flex-col items-center justify-start text-center p-8 pt-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 z-10">

        {/* Decorative Bubble Backgrounds */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none z-0 flex items-center justify-center opacity-70">
            {/* Top left large bubble */}
            <div 
              className="absolute -top-2 -left-6 w-24 h-24 rounded-full blur-[3px] opacity-40 group-hover:scale-110 group-hover:-translate-x-1 transition-transform duration-700" 
              style={{ background: 'var(--theme-primary)' }}
            />
            {/* Right medium bubble */}
            <div 
              className="absolute top-10 -right-6 w-20 h-20 rounded-full blur-[2px] opacity-30 group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-700 delay-75" 
              style={{ background: 'var(--theme-secondary)' }}
            />
            {/* Bottom left small bubble */}
            <div 
              className="absolute bottom-4 left-0 w-12 h-12 rounded-full blur-[2px] opacity-40 group-hover:scale-125 transition-transform duration-700 delay-100" 
              style={{ background: 'var(--theme-primary)' }}
            />
        </div>

        {/* Icon (No Container) */}
        <div className="relative shrink-0 z-10 h-40 w-40 flex items-center justify-center mt-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            {Icon && <Icon size={72} strokeWidth={1.75} style={{ color: 'var(--theme-primary)' }} className="drop-shadow-md" />}
            {imgSrc && <img src={imgSrc} alt={title} className="w-40 h-40 object-contain drop-shadow-xl" />}
        </div>
        
        <div className="flex flex-col flex-1 justify-start w-full mt-6">
            <h3 className="relative z-10 text-xl font-extrabold text-slate-900 mb-3 group-hover:text-primary transition-colors">{title}</h3>
            <p className="relative z-10 text-gray-500 text-sm leading-relaxed text-center">{description}</p>
        </div>
    </div>
  );
}

export default function AlumnaHome({ announcements: initialAnnouncements }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements ?? []);

  useEffect(() => {
    const channel = echo.channel('announcements');
    channel.listen('.announcement.published', (event) => {
      setAnnouncements(prev => {
        const exists = prev.some(a => a.id === event.id);
        if (exists) return prev;
        return [event, ...prev].slice(0, 3);
      });
    });
    return () => {
      echo.leaveChannel('announcements');
    };
  }, []);

  return (
      <div className="w-full overflow-x-hidden bg-app-bg min-h-screen pb-20">
        <Head>
            <link rel="preload" as="image" href={alumniHomeImg} />
        </Head>
        
        <UpdateProfileBanner />

        {/* HERO SECTION */}
        <section
            className="relative min-h-[500px] lg:min-h-[950px] bg-cover bg-[position:30%_center] lg:bg-center w-full"
            style={{
            backgroundImage: `url(${alumniHomeImg})`,
            }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/30 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#001D4A]/70 lg:via-[#001D4A]/20 lg:to-transparent z-10" />

          {/* Curved SVG Divider at the bottom */}
          <div className="absolute bottom-0 w-full z-20 pointer-events-none transform translate-y-px">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[80px] lg:h-[180px]">
                <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" fill="var(--theme-primary, #15803d)" />
            </svg>
          </div>

          <div className="relative z-20 h-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 pt-[100px] lg:pt-[240px] pb-[80px] lg:pb-[280px] flex items-center">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full">
                {/* Left Content */}
                <FadeInSection delay={200} className="space-y-4 lg:space-y-6 text-center lg:text-left mt-10 lg:mt-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                        Stay Connected <br className="hidden lg:block"/>
                        With Your Alumni <br className="hidden lg:block"/>
                        Community
                    </h1>
                    <p className="text-white/90 text-sm sm:text-lg lg:text-2xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium drop-shadow-md">
                        Keep your alumni information updated, stay informed with university announcements, and remain connected with the University Alumni Office and the College of Engineering and Computer Technology (CECT).
                    </p>
                </FadeInSection>

                {/* Right Content - Empty to let background image show */}
                <div className="hidden lg:block"></div>
             </div>
          </div>
        </section>

        {/* LATEST ANNOUNCEMENTS SECTION */}
        <section 
            className="w-full px-6 py-16 lg:py-24"
            style={{ 
                background: 'var(--theme-gradient, linear-gradient(135deg, #15803d 0%, #166534 100%))' 
            }}
        >
            <div className="max-w-[1400px] mx-auto">
                <FadeInSection delay={100} className="text-center mb-16 space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-text-on-primary)' }}>
                        Latest Announcements
                    </h2>
                    <p className="text-lg opacity-90" style={{ color: 'var(--theme-text-on-primary)' }}>
                        Stay informed about important announcements, events, and updates from the Office of Alumni and College of Engineering and Computer Technology (CECT).
                    </p>
                </FadeInSection>

                <FadeInSection delay={200} className="flex flex-wrap justify-center gap-8">
                {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement.id}
                        id={announcement.id}
                        date={new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                        })}
                        title={announcement.title}
                        description={announcement.details}
                        image={announcement.image}
                    />
                    ))
                ) : (
                    <div className="w-full text-center py-10 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
                        <p className="text-white text-lg font-medium">There are no official announcements at the moment.</p>
                        <p className="text-white/80 mt-2">Please check back later.</p>
                    </div>
                )}
                </FadeInSection>
            </div>
        </section>

        {/* FEATURES SECTION (White Background) */}
        <section className="w-full px-6 py-20 lg:py-28 bg-app-bg relative">
            {/* Soft decorative gradient blurs in background (optional, adds modern feel) */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50 translate-y-1/2 pointer-events-none" />

            <div className="max-w-[1500px] mx-auto relative z-10">
                <FadeInSection delay={100} className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
                        Everything You Need to Stay Connected
                    </h2>
                </FadeInSection>

                <FadeInSection delay={200} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full mx-auto">
                    <FeatureCard 
                        title="Update Your Profile"
                        description="Keep your personal, academic, and employment information accurate and up to date."
                        imgSrc={accSvg}
                    />
                    <FeatureCard 
                        title="Alumni Forms"
                        description="Accomplish and submit the required alumni forms and questionnaires."
                        imgSrc={clipboardSvg}
                    />
                    <FeatureCard 
                        title="Stay Informed"
                        description="Stay updated with important announcements, alumni events, and other relevant updates from the Office of Alumni and College of Engineering and Computer Technology (CECT)."
                        imgSrc={notifSvg}
                    />
                    <FeatureCard 
                        title="Share Your Updates"
                        description="Keep us informed by sharing your latest personal, academic, and professional updates."
                        imgSrc={shareSvg}
                    />
                </FadeInSection>
            </div>
        </section>

        {/* CTA BANNER SECTION */}
        <section className="w-full px-6 py-10 lg:py-16 bg-app-bg">
            <div className="max-w-[1100px] mx-auto">
                <div 
                    className="rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-10 lg:p-16 gap-10"
                    style={{ 
                        background: 'var(--theme-gradient, linear-gradient(135deg, #15803d 0%, #166534 100%))' 
                    }}
                >
                    {/* Decorative blurred circles inside the banner */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                    <FadeInSection delay={200} className="flex-shrink-0 relative z-10">
                        {/* 3D Icon */}
                        <img 
                            src={editFileIcon} 
                            alt="Update Profile" 
                            className="w-48 h-48 lg:w-60 lg:h-60 object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-700 ease-out"
                            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
                        />
                    </FadeInSection>

                    <FadeInSection delay={400} className="flex-1 text-center md:text-left space-y-5 relative z-10">
                        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-text-on-primary)' }}>
                            Keep Your Alumni Profile Updated
                        </h2>
                        <p className="text-lg max-w-lg opacity-90" style={{ color: 'var(--theme-text-on-primary)' }}>
                            Keep your information current and stay connected with the CECT Alumni Community.
                        </p>
                        
                        <div className="pt-2">
                            <Link
                                href="/alumni/profile"
                                className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
                                style={{ color: 'var(--theme-primary)' }}
                            >
                                Update My Profile
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </section>

      </div>
  );
}

AlumnaHome.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);
