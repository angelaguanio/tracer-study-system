import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniHomeImg from '../../assets/cect_home.png';
import { Link } from '@inertiajs/react';
import usePolling from '@/hooks/usePolling';

import { ReceiptText, Megaphone, Brain, LibraryBig, ArrowRight, ImageOff } from 'lucide-react';

// Card Component
function AnnouncementCard({ id, date, title, description, image }) {

  // kahit array ang image, gagana pa rin
  const imgSrc = Array.isArray(image)
    ? image[0] // first image lang ipapakita sa card
    : image;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-md transition hover:scale-105 flex flex-col h-[420px] w-full max-w-[350px]">      
      {imgSrc ? (
        <img
          src={imgSrc}
          className="w-full h-[150px] object-cover rounded-xl mb-6"
        />
      ) : (
        // ADDED ICON
        <div className="w-full h-[150px] rounded-xl mb-6 flex items-center justify-center">
          <ImageOff size={80} className="text-[#2859C5]" />
        </div>
      )}

      <p className="text-[#0042A8] text-sm mb-4">{date}</p>
      <h3 className="text-lg font-semibold text-[#0042A8] mb-4">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-[50px] line-clamp-2 truncate">{description}</p>

      <Link href={`/alumna/announcement/${id}`}>
        <button className="w-full bg-[#014F86] text-white py-3 rounded-lg font-semibold hover:bg-[#013A63] transition mt-auto cursor-pointer">
          Read More
        </button>
      </Link>

    </div>
  );
}

export default function AlumnaHome({ announcements }) {

  usePolling({
    interval: 5000,
    only: ['announcements'],
});

  return (
    
      <div className="bg-white -mt-6 md:-mt-4 overflow-x-hidden w-full">

        {/* HERO SECTION */}
        <section
              className="relative h-[600px] bg-cover bg-no-repeat bg-[position:65%_center] md:bg-[position:45%_center] lg:bg-[position:10%_42%]"
              style={{
                backgroundImage: `url(${alumniHomeImg}`,
              }}
        >
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(6,51,167,0.85) 0%, rgba(0,0,0,0.2) 70%)",
            }}
          />

          <div className="relative z-20 h-full flex items-center">
              <div className="px-6 sm:px-10 md:px-20 max-w-xl lg:max-w-[680px] space-y-3">
            <h1 className="text-2xl md:text-6xl font-bold text-white leading-tight">
              Stay Connected <br />
              With Your Alumni <br />
              Community
            </h1>
            <p className="text-blue-100 text-md md:text-xl leading-relaxed">
              Reconnect with fellow graduates, explore new opportunities,
              and participate in our tracer survey to help improve the
              future of our institution.
            </p>

            <div>
              <Link
                href="/alumna/questionnaire"
                className="inline-flex items-center gap-2 bg-white text-[#013A63] px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-200 transition shadow-sm"
              >
                Take the Survey
                <ArrowRight size={16} />
              </Link>
            </div>
            </div>
          </div>
        </section>

        {/* WELCOME */}
        <section className="border-t border-gray-200 py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-4">
              Welcome to Alumni Connect
            </h2>
            <p className="text-gray-600 text-lg">
              We're delighted to have you here. Our platform brings together
              alumni, students, and faculty to foster meaningful connections
              and unlock new opportunities for professional growth and
              lifelong learning.
            </p>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="px-6 py-16" style={{ background: 'linear-gradient(135deg, #001D4A 0%, #0042A8 60%, #014F86 100%)' }}>
          <div className="max-w-full mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-white/10 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                News & Updates
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Latest Announcements
              </h2>
              <p className="text-blue-200">
                Stay updated with important news and events
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    id={announcement.id}
                    date={new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                    title={announcement.title}
                    description={announcement.details}
                    image={announcement.image}
                  />
                ))
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 gap-3">
                  <Megaphone size={48} className="text-white/30" />
                  <p className="text-white/50 text-sm">No announcements available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section className="border-t border-gray-200 px-6 py-24">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-4">
              Why Join Alumni Connect?
            </h2>
            <p className="text-gray-600 mb-10">
              Unlock exclusive benefits and opportunities for personal and professional growth.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white border rounded-2xl p-8 hover:shadow-md transition hover:scale-105 flex flex-col items-center text-center">
                <ReceiptText size={40} className="text-[#0042A8] mb-4" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Track</h3>
                <p className="text-gray-600 text-sm">
                  Participate in tracer studies and update <br /> your academic and employment information
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-8 hover:shadow-md transition hover:scale-105 flex flex-col items-center text-center">
                <Megaphone size={40} className="text-[#0042A8] mb-4" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Announcements</h3>
                <p className="text-gray-600 text-sm">
                  Stay informed with official updates, surveys, and university notices
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-8 hover:shadow-md transition hover:scale-105 flex flex-col items-center text-center">
                <Brain size={40} className="text-[#0042A8] mb-4" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Insights</h3>
                <p className="text-gray-600 text-sm">
                  Contribute data that helps improve programs and institutional planning
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-8 hover:shadow-md transition hover:scale-105 flex flex-col items-center text-center">
                <LibraryBig size={40} className="text-[#0042A8] mb-4" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Records</h3>
                <p className="text-gray-600 text-sm">
                  Maintain accurate and up-to-date alumni profiles for future reference
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="w-full bg-[#013A63]">
          <div className="max-w-4xl mx-auto text-center text-white py-20 px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Connected as a Graduate
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Contribute to institutional development by updating your records and responding to tracer study surveys.
            </p>
            <Link
              href="/alumna/profile"
              className="bg-gray-200 text-[#013A63] px-6 py-3 rounded-lg font-semibold hover:bg-white transition inline-flex items-center gap-2"
            >
              Proceed to Profile
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    
  );
}

AlumnaHome.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);