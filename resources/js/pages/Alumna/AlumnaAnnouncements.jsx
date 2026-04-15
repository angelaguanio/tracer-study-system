import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link } from '@inertiajs/react';
import { ImageOff } from "lucide-react";

export default function AlumnaAnnouncements({ announcements }) {
  return (
    <div className="min-h-screen w-screen bg-sky-50 ">
      
      {/* CENTER CONTAINER */}
      <div className="w-full max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-[#7B7B7B] text-lg font-semibold mb-6 text-center">
          Recent Announcements
        </h2>

        {announcements.length === 0 ? (
          <p className="text-center text-gray-500 p-10">
            No announcements available
          </p>
        ) : (
          <div className="space-y-8 flex flex-col items-center">

            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden"
              >
                
                {/* IMAGE */}
                {ann.image ? (
                  <img
                    src={ann.image}
                    alt={ann.title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-80 flex items-center justify-center text-gray-400">
                    <ImageOff size={100} className="text-[#2859C5]" />
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-[#0042A8] text-xl font-bold mb-3 text-center">
                    {ann.title}
                  </h3>

                  <p className="text-[#000000] text-lg leading-relaxed mb-6 text-center line-clamp-3">
                    {ann.details}
                  </p>

                  <Link href={`/alumna/announcement/${ann.id}`}>
                    <button className="w-full bg-[#014F86] text-white py-3 rounded-lg font-semibold hover:bg-[#013A63] transition">
                      Read more
                    </button>
                  </Link>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;