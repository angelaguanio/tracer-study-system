import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link, router } from '@inertiajs/react';
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

export default function AlumnaAnnouncements({ announcements }) {

  const list = announcements?.data ?? [];

  const currentPage = announcements?.current_page ?? 1;
  const lastPage = announcements?.last_page ?? 1;

  return (
    <div className="min-h-screen w-screen bg-sky-50">
      
      {/* CENTER CONTAINER */}
      <div className="w-full max-w-[1400px] mx-auto px-6 py-10">

        <h2 className="text-[#7B7B7B] text-xl font-semibold mb-6 text-center">
          News & Announcements
        </h2>

        {list.length === 0 ? (
          <p className="text-center text-gray-500 p-10">
            No announcements available
          </p>
        ) : (
          <div className="relative flex items-center gap-4">
            
            {/* LEFT ARROW */}
            <button
              disabled={currentPage === 1}
              onClick={() =>
                router.get(
                  '/alumna/announcements',
                  { page: currentPage - 1 },
                  { preserveState: true, preserveScroll: true }
                )
              }
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 shadow-md
                        hover:bg-gray-100 hover:border-gray-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            {/* CARDS GRID */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-3">
              {list.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[320px] sm:h-[350px] md:h-[380px] lg:h-[420px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                >
                  
                  {/* IMAGE */}
                  {ann.image && (Array.isArray(ann.image) ? ann.image.length > 0 : ann.image) ? (
                    <img
                      src={Array.isArray(ann.image) ? ann.image[0] : ann.image}
                      alt={ann.title}
                      className="w-full h-36 sm:h-40 md:h-48 lg:h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center">
                      <ImageOff size={80} className="text-blue-800" />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-[#0042A8] text-base font-bold mb-2 line-clamp-1 break-words">
                        {ann.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-3 break-words">
                        {ann.details}
                      </p>
                    </div>

                    <Link href={`/alumna/announcement/${ann.id}`}>
                      <button className="w-full cursor-pointer bg-[#014F86] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#013A63] transition">
                        Read more
                      </button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <button
              disabled={currentPage === lastPage}
              onClick={() =>
                router.get(
                  '/alumna/announcements',
                  { page: currentPage + 1 },
                  { preserveState: true, preserveScroll: true }
                )
              }
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 shadow-md
                        hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>

          </div>
        )}

        {/* PAGE INDICATOR */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() =>
                  router.get(
                    '/alumna/announcements',
                    { page },
                    { preserveState: true, preserveScroll: true }
                  )
                }
                className={`w-2 h-2 rounded-full transition ${
                  currentPage === page
                    ? "bg-[#014F86] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;