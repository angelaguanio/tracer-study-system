import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link } from '@inertiajs/react';

export default function AlumnaAnnouncements({ announcements }) {
  return (
    <div className="min-h-screen bg-sky-50 p-8">
      
      <h2 className="text-[#7B7B7B] text-lg font-semibold mb-6">
        Recent Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 p-10">
          No announcements available
        </p>
      ) : (
        announcements.map((ann) => (
          <div key={ann.id} className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
            
            {/* Image */}
            {ann.image && (
              <img
                src={ann.image}
                alt={ann.title}
                className="w-full h-80 object-cover"
              />
            )}

            {/* Content */}
            <div className="p-6">
              <h3 className="text-[#0042A8] text-xl font-bold mb-3">
                {ann.title}
              </h3>

              <p className="text-[#000000] text-lg leading-relaxed mb-6">
                {ann.details}
              </p>

              {/* READ MORE */}
              <Link href={`/alumna/announcement/${ann.id}`}>
                <button className="w-full bg-[#014F86] text-white py-3 rounded-lg font-semibold hover:bg-[#013A63] transition">
                  Read more
                </button>
              </Link>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;