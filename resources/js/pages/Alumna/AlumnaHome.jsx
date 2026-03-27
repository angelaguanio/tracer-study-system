import React from 'react';
import AlumnaLayout from '../../layouts/alumna-layout';
import alumniHomeImg from '../../assets/alumni_homepage.jpg';

import { Zap, MessageSquare, CircleCheckBig, Users } from 'lucide-react';

export default function AlumnaHome() {
  return (
    <AlumnaLayout>
      <div className="bg-white -mt-6 md:-mt-4">

        {/* HERO SECTION */}
        <section
          className="relative w-screen h-[450px] flex items-center"
          style={{
            backgroundImage: `url(${alumniHomeImg})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 34%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(6,51,167,0.7) 0%, rgba(0,0,0,0.3) 70%)',
            }}
          ></div>

          {/* Text */}
          <div className="relative z-20 px-6 md:px-12 max-w-[700px] text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Stay Connected <br />
              With Your Alumni <br />
              Community
            </h1>

            <p className="text-white text-lg md:text-xl">
              Share experiences, discover opportunities, and build lasting
              relationships with fellow alumni from our institution.
            </p>
          </div>
        </section>

        {/* WELCOME */}
        <section className="border-t border-gray-200 py-10 px-6 text-center">
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

            {/* Header */}
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-2">
              Latest Announcements
            </h2>
            <p className="text-gray-500 mb-10">
              Stay updated with important news and events
            </p>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* CARD 1 */}
              <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col">
                <div
                  className="w-full h-[150px] rounded-xl mb-6"
                  style={{ background: 'linear-gradient(to bottom, #A8F0FF, #999999)' }}
                ></div>
                <p className="text-[#0042A8] text-sm mb-4">March 2025</p>
                <h3 className="text-lg font-semibold text-[#0042A8] mb-4">
                  Annual Alumni Homecoming 2025
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Join us for our biggest alumni reunion event of the year with networking, keynotes, and celebrations.
                </p>
                <span className="text-[#014F86] font-medium cursor-pointer transition hover:underline hover:translate-x-1 text-center mt-auto">
                  Read More →
                </span>
              </div>

              {/* CARD 2 */}
              <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col">
                <div
                  className="w-full h-[150px] rounded-xl mb-6"
                  style={{ background: 'linear-gradient(to bottom, #A8F0FF, #999999)' }}
                ></div>
                <p className="text-[#0042A8] text-sm mb-4">April 2025</p>
                <h3 className="text-lg font-semibold text-[#0042A8] mb-4">
                  Professional Development Webinar
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Learn from industry leaders on emerging trends, career growth strategies, and navigating new opportunities.
                </p>
                <span className="text-[#014F86] font-medium cursor-pointer transition hover:underline hover:translate-x-1 text-center mt-auto">
                  Read More →
                </span>
              </div>

              {/* CARD 3 */}
              <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col">
                <div
                  className="w-full h-[150px] rounded-xl mb-6"
                  style={{ background: 'linear-gradient(to bottom, #A8F0FF, #999999)' }}
                ></div>
                <p className="text-[#0042A8] text-sm mb-4">May 2025</p>
                <h3 className="text-lg font-semibold text-[#0042A8] mb-4">
                  Mentorship Program Launch
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Participate in our new mentorship initiative connecting experienced alumni with current students and recent graduates.
                </p>
                <span className="text-[#014F86] font-medium cursor-pointer transition hover:underline hover:translate-x-1 text-center mt-auto">
                  Read More →
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* WHY JOIN SECTION */}
        <section className="border-t border-gray-200 px-6 py-12">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D4A] mb-4">
              Why Join Alumni Connect?
            </h2>
            <p className="text-gray-600 mb-10">
              Unlock exclusive benefits and opportunities for personal and professional growth.
            </p>

            {/* Boxes */}
            <div className="grid md:grid-cols-4 gap-6">
              
              {/* Box 1: Network */}
              <div className="border rounded-2xl p-8 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col items-center">
                <Zap className="text-5xl mb-4 text-[#0042A8]" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Network</h3>
                <p className="text-gray-600 text-sm text-center">
                  Connect with thousands of alumni worldwide
                </p>
              </div>

              {/* Box 2: Opportunities */}
              <div className="border rounded-2xl p-8 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col items-center">
                <MessageSquare className="text-5xl mb-4 text-[#0042A8]" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Opportunities</h3>
                <p className="text-gray-600 text-sm text-center">
                  Access exclusive job postings and partnerships
                </p>
              </div>

              {/* Box 3: Engage */}
              <div className="border rounded-2xl p-8 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col items-center">
                <CircleCheckBig className="text-5xl mb-4 text-[#0042A8]" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Engage</h3>
                <p className="text-gray-600 text-sm text-center">
                  Participate in discussions and events
                </p>
              </div>

              {/* Box 4: Grow */}
              <div className="border rounded-2xl p-8 shadow-sm hover:shadow-md transition transform hover:scale-105 flex flex-col items-center">
                <Users className="text-5xl mb-4 text-[#0042A8]" />
                <h3 className="text-lg font-semibold text-[#0042A8] mb-2">Grow</h3>
                <p className="text-gray-600 text-sm text-center">
                  Enhance your career and personal development
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </AlumnaLayout>
  );
}