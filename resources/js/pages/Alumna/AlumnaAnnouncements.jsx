import React from 'react';
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';
import NavbarAlumni from "../../components/navbar-alumni";
import AlumnaLayout from '../../layouts/alumna-layout';

export default function AlumnaAnnouncements() {
  return (
    <>
      <AlumnaLayout>
         <div className="min-h-screen bg-sky-50 p-8">
      {/* Page Title */}
      <h2 className="text-[#7B7B7B] text-lg font-semibold mb-6">
        Recent Announcements
      </h2>

      {/* Card */}
      <div className="max-w-8xl min-h-[500px] bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Image */}
        <div className="h-90 bg-gradient-to-b from-[#A8F0FF] to-[#999999]" />

        {/* Content */}
        <div className="p-6">
          <h3 className="text-[#0042A8] text-xl font-bold mb-3">
          CECT ALUMNI HOMECOMING 2025
          </h3>

          <p className="text-[#000000] text-xl leading-relaxed mb-6">
            Reconnect, reminisce, and celebrate with your fellow CECT graduates!
            Join us for an evening filled with fun, nostalgia, and exciting
            performances. Let’s relive the memories and strengthen our Wesleyan
            bond once again.
          </p>

          {/* Button */}
          <button className="w-full bg-[#014F86] text-white py-3 rounded-lg font-semibold hover:bg-[#013A63] transition">
          Read more
          </button> 
        </div>
      </div>
    </div>
      </AlumnaLayout>
    </>
  );
}
