import React, { useEffect } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link, router } from '@inertiajs/react';
import { ImageOff } from "lucide-react";
import echo from "@/echo";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AlumnaAnnouncements({ announcements }) {

  // Realtime: reload the first page when a new announcement is published
  useEffect(() => {
    const channel = echo.channel('announcements');
    channel.listen('.announcement.published', () => {
      router.reload({ only: ['announcements'] });
    });
    return () => {
      echo.leaveChannel('announcements');
    };
  }, []);

  const list = announcements?.data ?? [];

  const currentPage = announcements?.current_page ?? 1;
  const lastPage = announcements?.last_page ?? 1;

  return (
    <div className="min-h-screen w-screen bg-sky-50">
      
      {/* CENTER CONTAINER */}
      <div className="w-full max-w-[1400px] mx-auto px-6 py-10">

        <h2 className="text-[#7B7B7B] text-2xl font-semibold py-3 mb-5 text-center">
         Announcements
        </h2>

        {list.length === 0 ? (
          <p className="text-center text-gray-500 p-10">
            No announcements available
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-[1200px] w-full mx-auto px-2">
              {list.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[360px] sm:h-[390px] lg:h-[410px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer w-full"
                >
                  
                  {/* IMAGE */}
                  {ann.image && (Array.isArray(ann.image) ? ann.image.length > 0 : ann.image) ? (
                    <img
                      src={Array.isArray(ann.image) ? ann.image[0] : ann.image}
                      alt={ann.title}
                      className="w-full h-40 sm:h-44 md:h-52 lg:h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center">
                      <ImageOff size={80} className="text-blue-800" />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-[#0042A8] text-lg font-bold mb-2 line-clamp-1 break-words">
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

            {/* PAGE INDICATOR (SHADCN) */}
            {lastPage > 1 && (
              <Pagination className="mt-8 mb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          router.get('/alumna/announcements', { page: currentPage - 1 }, { preserveState: true, preserveScroll: true });
                        }
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== page) {
                            router.get('/alumna/announcements', { page }, { preserveState: true, preserveScroll: true });
                          }
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < lastPage) {
                          router.get('/alumna/announcements', { page: currentPage + 1 }, { preserveState: true, preserveScroll: true });
                        }
                      }}
                      className={currentPage === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

AlumnaAnnouncements.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;