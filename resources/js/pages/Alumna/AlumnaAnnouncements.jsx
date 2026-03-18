import React from 'react';
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';
import NavbarAlumni from "../../components/navbar-alumni";
import AlumnaLayout from '@/layouts/alumna-layout';

export default function AlumnaAnnouncements() {
  return (
    <>
    
    <div className="min-h-screen bg-sky-50 p-4 sm:p-6 md:p-8">
      {/* Page Title */}
      <h2 className="text-[#7B7B7B] text-base sm:text-lg font-semibold mb-4 sm:mb-6">
        Recent Announcements
      </h2>

      {/* Card */}
      <div className="w-full max-w-7xl mx-auto min-h-[400px] sm:min-h-[500px] bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Image */}
        <div className="h-40 sm:h-60 md:h-80 lg:h-96 bg-gradient-to-b from-[#A8F0FF] to-[#999999]" />

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-[#0042A8] text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
            CECT ALUMNI HOMECOMING 2025
          </h3>

          <p className="text-[#000000] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6">
            Reconnect, reminisce, and celebrate with your fellow CECT graduates!
            Join us for an evening filled with fun, nostalgia, and exciting
            performances. Let’s relive the memories and strengthen our Wesleyan
            bond once again.
          </p>

          {/* Button */}
          <button className="w-full bg-[#014F86] text-white px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#013A63] transition">
            Read more
          </button> 
        </div>
      </div>
    </div>

    </>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>