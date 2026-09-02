import React, { useEffect } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link, router } from '@inertiajs/react';
import { ImageOff, Bell } from "lucide-react";
import echo from "@/echo";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import megaphoneImg from '@/assets/megaphone.png';

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
    <div className="min-h-[calc(100vh-80px)] w-full relative flex flex-col items-center bg-[#F8FAFC]">
      
      {/* Background Magic UI Dot Pattern */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1.5}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "fill-blue-500/20 absolute inset-0 h-full w-full z-0"
        )}
      />



      {/* Large Bottom Waves (SVG) */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[30vh] md:h-[40vh] opacity-30">
          <path fill="#93C5FD" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[25vh] md:h-[35vh] opacity-50">
           <path fill="#60A5FA" fillOpacity="1" d="M0,96L60,122.7C120,149,240,203,360,202.7C480,203,600,149,720,138.7C840,128,960,160,1080,186.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h1 className="text-[#0B2545] text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Announcements
          </h1>
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-5"></div>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Stay updated with the latest news and important updates from the university and your alumni community.
          </p>
        </div>

        {list.length === 0 ? (
          
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-10 md:p-16 w-full max-w-[700px] flex flex-col items-center text-center">
            
            {/* Megaphone Illustration */}
            <div className="w-full max-w-[280px] mb-6 flex justify-center items-center">
                <img src={megaphoneImg} alt="No Announcements" className="w-full h-auto object-contain drop-shadow-sm" />
            </div>

            <h2 className="text-[#0B2545] text-2xl font-bold mb-3">
              No announcements available
            </h2>
            <p className="text-gray-500 text-[15px] mb-6">
              Check back later for new announcements and updates.
            </p>
          </div>

        ) : (
          <div className="flex flex-col gap-12 w-full">
            {/* CARDS CONTAINER */}
            <div className="flex flex-wrap justify-center gap-8 w-full mx-auto">
              {list.map((ann, index) => (
                <div
                  key={ann.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100/60 overflow-hidden flex flex-col h-[400px] w-full max-w-[350px] md:max-w-[380px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                >
                  
                  {/* IMAGE */}
                  {ann.image && (Array.isArray(ann.image) ? ann.image.length > 0 : ann.image) ? (
                    <img
                      src={Array.isArray(ann.image) ? ann.image[0] : ann.image}
                      alt={ann.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-slate-50 transition-transform duration-500 group-hover:scale-105">
                      <ImageOff size={40} className="text-slate-300" />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1 bg-white relative z-10">
                    <h3 className="text-[#0B2545] text-lg font-bold mb-2 line-clamp-1">
                      {ann.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {ann.details}
                    </p>

                    <Link href={`/alumna/announcement/${ann.id}`} className="mt-auto">
                      <button className="w-full cursor-pointer bg-white text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all">
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