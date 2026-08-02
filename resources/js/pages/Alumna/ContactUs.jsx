import { Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact.jpg';
import { Link } from '@inertiajs/react';

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
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#EEF4FB]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${contact})` }}
      >
        {/* Gradient overlay — same as AlumnaHome */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to right, rgba(6,51,167,0.85) 0%, rgba(0,0,0,0.2) 70%)' }}
        />

        {/* Text content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="px-6 sm:px-10 md:px-20 max-w-xl lg:max-w-[680px] space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-sm">
              Have questions, concerns, or suggestions?
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              We're here to help. Connect with the Alumni Office through any of our available contact channels.
            </p>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ─────────────────────────────────────── */}
      <section className="w-full bg-white px-6 sm:px-10 lg:px-20 py-14">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#001D4A] mb-2">Get in Touch</h2>
            {/* Blue underline accent */}
            <div className="w-10 h-0.5 bg-blue-500 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Find our email, phone number, office location, and office hours below.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center p-6 bg-[#EEF4FB] rounded-xl border border-blue-100 hover:shadow-md transition-shadow gap-3"
                >
                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>

                  <h3 className="text-base font-bold text-[#001D4A]">{item.title}</h3>

                  {item.isLink ? (
                    <a
                      href={item.href}
                      className="text-blue-600 font-medium text-sm hover:underline leading-snug"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-blue-600 font-medium text-sm leading-snug">{item.content}</p>
                  )}

                  <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="w-full bg-[#EEF4FB] px-6 sm:px-10 lg:px-20 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center gap-10 px-10 py-12 sm:py-14">

            {/* Illustration */}
            <div className="shrink-0 flex items-center justify-center w-48 h-48 sm:w-52 sm:h-52 select-none">
              {/* Simple inline SVG illustration — inbox with speech bubbles */}
              <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Inbox tray */}
                <rect x="20" y="72" width="100" height="36" rx="8" fill="#1A56DB" />
                <rect x="20" y="82" width="100" height="12" rx="0" fill="#1648C0" />
                <rect x="44" y="82" width="52" height="8" rx="4" fill="#2563EB" opacity="0.4" />
                {/* Main speech bubble */}
                <ellipse cx="72" cy="42" rx="28" ry="22" fill="#1A56DB" />
                <text x="72" y="50" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold">?</text>
                {/* Small speech bubble */}
                <ellipse cx="104" cy="54" rx="14" ry="11" fill="#93C5FD" opacity="0.85" />
                <circle cx="99" cy="55" r="2" fill="#1E40AF" />
                <circle cx="104" cy="55" r="2" fill="#1E40AF" />
                <circle cx="109" cy="55" r="2" fill="#1E40AF" />
                {/* Sparkle */}
                <path d="M30 38 L32 34 L34 38 L38 40 L34 42 L32 46 L30 42 L26 40 Z" fill="#93C5FD" opacity="0.7" />
              </svg>
            </div>

            {/* Text + CTA */}
            <div className="flex flex-col gap-3 flex-1 text-center sm:text-left">
      
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#001D4A]">
                Need to Submit an Inquiry?
              </h2>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg">
                Submit an inquiry through the portal and track our responses in one place. Our personnel will respond as soon as possible during office hours.
              </p>

              <div className="mt-2 flex justify-center sm:justify-start">
                <Link
                  href={route('alumna.inquiries.index')}
                  className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#1648C0] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Go to My Inquiries
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;