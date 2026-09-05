import React, { useEffect, useState, useRef } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniHomeImg from '../../assets/cect_home_new.webp';
import editFileIcon from '../../assets/edit-file.webp';
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


// Announcement Card Component (Updated for new design)
function AnnouncementCard({ id, date, title, description, image }) {
  const imgSrc = Array.isArray(image) ? image[0] : image;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-[400px] w-full max-w-[340px]">      
      {imgSrc ? (
        <img
          src={imgSrc}
          className="w-full h-[160px] object-cover rounded-2xl mb-5"
          alt={title}
        />
      ) : (
        <div className="w-full h-[160px] rounded-2xl mb-5 bg-blue-50/50 flex items-center justify-center border border-blue-100">
          <ImageOff size={48} className="text-[#007AD7]" />
        </div>
      )}

      <p className="text-[#005AAA] text-xs font-semibold uppercase tracking-wider mb-3">{date}</p>
      <h3 className="text-lg font-bold text-[#001D4A] mb-3 line-clamp-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{description}</p>

      <Link href={`/alumna/announcement/${id}`} className="mt-auto">
        <button className="w-full bg-[#005AAA] text-white py-3 rounded-xl font-medium hover:bg-[#003C87] transition-colors shadow-md">
          Read More
        </button>
      </Link>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg h-[280px] w-full max-w-[260px] flex flex-col items-center justify-center text-center p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5 text-[#005AAA]">
            {Icon && <Icon size={32} />}
        </div>
        <h3 className="text-lg font-bold text-[#001D4A] mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
      <div className="w-full overflow-x-hidden bg-white min-h-screen pb-20">
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
          <div className="absolute inset-0 bg-black/60 lg:bg-black/20 z-10" />

          {/* Curved SVG Divider at the bottom */}
          <div className="absolute bottom-0 w-full z-20 pointer-events-none transform translate-y-px">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[80px] lg:h-[180px]">
                <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" fill="#003C87" />
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
                        Keep your alumni information updated, stay informed with university announcements, and remain connected with the Wesleyan University-Philippines community.
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
                background: 'linear-gradient(to bottom, #003C87 0%, #005AAA 21%, #007AD7 37%, #009AFB 56%, #00B9FF 80%, #00D8EF 100%)' 
            }}
        >
            <div className="max-w-[1400px] mx-auto">
                <FadeInSection delay={100} className="text-center mb-16 space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        Latest Announcements
                    </h2>
                    <p className="text-blue-100/90 text-lg">
                        Stay informed about important university news, events, and updates.
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
                        <p className="text-blue-100 mt-2">Please check back later.</p>
                    </div>
                )}
                </FadeInSection>
            </div>
        </section>

        {/* FEATURES SECTION (White Background) */}
        <section className="w-full px-6 py-20 lg:py-28 bg-white relative">
            {/* Soft decorative gradient blurs in background (optional, adds modern feel) */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-50 rounded-full blur-3xl opacity-50 translate-y-1/2 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <FadeInSection delay={100} className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#003C87] tracking-tight">
                        Everything You Need to Stay Connected
                    </h2>
                </FadeInSection>

                <FadeInSection delay={200} className="flex flex-wrap justify-center gap-6 lg:gap-8">
                    <FeatureCard 
                        title="Update Your Profile"
                        description="Keep your personal, academic, and employment information current."
                        icon={User}
                    />
                    <FeatureCard 
                        title="Alumni Forms"
                        description="Complete available forms and questionnaires."
                        icon={FileText}
                    />
                    <FeatureCard 
                        title="Stay Informed"
                        description="Access important university announcements and updates."
                        icon={Bell}
                    />
                    <FeatureCard 
                        title="Share Your Updates"
                        description="Help maintain accurate and up-to-date alumni records."
                        icon={Share2}
                    />
                </FadeInSection>
            </div>
        </section>

        {/* CTA BANNER SECTION */}
        <section className="w-full px-6 py-10 lg:py-16 bg-white">
            <div className="max-w-[1100px] mx-auto">
                <div 
                    className="rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-10 lg:p-16 gap-10"
                    style={{ 
                        background: 'linear-gradient(to right, #003C87 0%, #005AAA 35%, #007AD7 71%, #009AFB 100%)' 
                    }}
                >
                    {/* Decorative blurred circles inside the banner */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

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
                        <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                            Keep Your Alumni Profile Updated
                        </h2>
                        <p className="text-blue-100 text-lg max-w-lg">
                            Keep your information current and stay connected with Wesleyan University-Philippines.
                        </p>
                        
                        <div className="pt-2">
                            <Link
                                href="/alumna/profile"
                                className="inline-flex items-center gap-2 bg-white text-[#005AAA] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
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