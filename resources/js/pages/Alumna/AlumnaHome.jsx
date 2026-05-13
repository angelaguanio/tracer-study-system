import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import alumniHomeImg from '../../assets/alumni_homepage.jpg';
import { Link } from '@inertiajs/react';

import { ReceiptText, Megaphone, Brain, LibraryBig, ArrowRight, ImageOff } from 'lucide-react';

// Card Component
function AnnouncementCard({ id, date, title, description, image }) {

  // kahit array ang image, gagana pa rin
  const imgSrc = Array.isArray(image)
    ? image[0] // first image lang ipapakita sa card
    : image;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-md transition hover:scale-105 flex flex-col h-[420px]">      
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
      <p className="text-gray-600 text-sm mb-4 h-[50px] overflow-hidden">{description}</p>

      <Link href={`/alumna/announcement/${id}`}>
        <button className="w-full bg-[#014F86] text-white py-3 rounded-lg font-semibold hover:bg-[#013A63] transition mt-auto">
          Read More
        </button>
      </Link>

    </div>
  );
}

export default function AlumnaHome({ announcements }) {
  return (
    
      <div className="bg-white -mt-6 md:-mt-4 overflow-x-hidden w-full">

        {/* HERO SECTION */}
        <section
          className="relative w-screen h-[450px] flex items-center overflow-hidden"
          style={{
            backgroundImage: `url(${alumniHomeImg})`,
            backgroundSize: '115%',
            backgroundPosition: '10% 42%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(6,51,167,0.7) 0%, rgba(0,0,0,0.3) 70%)',
            }}
          ></div>

          <div className="relative z-20 px-6 md:px-12 max-w-[700px]">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stay Connected <br />
              With Your Alumni <br />
              Community
            </h1>
            <p className="text-white text-lg md:text-xl">
              Reconnect with fellow graduates, explore new opportunities, <br />
              and participate in our tracer survey to help improve the <br /> 
              future of our institution.
            </p>

            <Link
              href="/alumna/questionnaire"
              className="inline-flex mt-6 items-center gap-2 bg-white text-[#013A63] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition shadow-sm"
            >
              Take the Survey
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* WELCOME */}
        <section className="border-t border-gray-200 py-20 px-6 text-center">
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
        <section className="border-t border-gray-200 px-6 py-12">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-2">
              Latest Announcements
            </h2>
            <p className="text-gray-500 mb-10">
              Stay updated with important news and events
            </p>

            <div className="grid md:grid-cols-3 gap-6">
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
                <p className="col-span-3 text-center text-gray-500">
                  No announcements available
                </p>
              )}
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section className="border-t border-gray-200 px-6 py-12">
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