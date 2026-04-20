import React from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link, router } from '@inertiajs/react';
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

export default function AlumnaAnnouncements({ announcements }) {

  const list = announcements?.data ?? [];

  const currentPage = announcements?.current_page ?? 1;
const lastPage = announcements?.last_page ?? 1;

  return (
    <div className="min-h-screen w-screen bg-sky-50 ">
      
      {/* CENTER CONTAINER */}
      <div className="w-full max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-[#7B7B7B] text-lg font-semibold mb-6 text-center">
          Recent Announcements
        </h2>

        {list.length === 0 ? (
          <p className="text-center text-gray-500 p-10">
            No announcements available
          </p>
        ) : (
          <div className="space-y-8 flex flex-col items-center">

            {list.map((ann) => (
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
        
        {/* PAGINATION */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center gap-1 mt-10">

            {/* PREVIOUS */}
            <button
              disabled={currentPage === 1}
              onClick={() =>
                router.get(
                  '/alumna/announcements',
                  { page: currentPage - 1 },
                  { preserveState: true, preserveScroll: true }
                )
              }
              className="w-12 h-8 flex items-center justify-center rounded-md border
                        hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === lastPage ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, arr) => {
                const prevPage = arr[index - 1];

                return (
                  <div key={page} className="flex items-center gap-1">

                    {prevPage && page - prevPage > 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}

                    <button
                      onClick={() =>
                        router.get(
                          '/alumna/announcements',
                          { page },
                          { preserveState: true, preserveScroll: true }
                        )
                      }
                      className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm transition
                        ${
                          currentPage === page
                            ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>

                  </div>
                );
              })}

            {/* NEXT */}
            <button
              disabled={currentPage === lastPage}
              onClick={() =>
                router.get(
                  '/alumna/announcements',
                  { page: currentPage + 1 },
                  { preserveState: true, preserveScroll: true }
                )
              }
              className="w-12 h-8 flex items-center justify-center rounded-md border
                        hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;