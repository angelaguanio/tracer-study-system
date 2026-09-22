import React, { useState } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link, router } from '@inertiajs/react';
import { ImageOff, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function AlumnaFeaturedAlumni({ featuredAlumni }) {

  const [renderKey] = useState(0);

  const list = featuredAlumni?.data ?? [];
  const currentPage = featuredAlumni?.current_page ?? 1;
  const lastPage = featuredAlumni?.last_page ?? 1;

  return (
    <div className="min-h-[calc(100vh-80px)] w-full relative flex flex-col items-center bg-app-bg">

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
            Wesleyan Footprints: Stories that Inspire
          </h1>
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-5"></div>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Celebrating the Journey, Achievements, and Wesleyan Impact on our Graduates.
          </p>
        </div>

        {list.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-10 md:p-16 w-full max-w-[700px] flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Star size={40} className="text-blue-300" />
            </div>
            <h2 className="text-[#0B2545] text-2xl font-bold mb-3">
              No featured alumni yet
            </h2>
            <p className="text-gray-500 text-[15px] mb-6">
              Check back later for featured alumni stories and highlights.
            </p>
          </div>

        ) : (
          <div className="flex flex-col gap-12 w-full">
            {/* CARDS CONTAINER */}
            <div key={renderKey} className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full mx-auto">
              {list.map((alumnus, index) => (
                <div
                  key={alumnus.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => router.get(`/alumna/featured-alumni/${alumnus.id}`)}
                  className="bg-white rounded-2xl shadow-md border border-gray-100/60 overflow-hidden flex flex-col w-full max-w-[350px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both relative"
                >
                  {/* IMAGE with gradient blend */}
                  <div className="relative w-full h-72 shrink-0">
                    {alumnus.image && (Array.isArray(alumnus.image) ? alumnus.image.length > 0 : alumnus.image) ? (
                      <img
                        src={Array.isArray(alumnus.image) ? alumnus.image[0] : alumnus.image}
                        alt={alumnus.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <ImageOff size={40} className="text-slate-300" />
                      </div>
                    )}
                    {/* Gradient Blend */}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white from-20% via-white/50 via-70% to-transparent pointer-events-none" />
                  </div>

                  {/* CONTENT */}
                  <div className="px-5 pb-5 pt-1 flex flex-col bg-white relative z-10 -mt-8">
                    <h3 className="text-[#0B2545] text-base font-black mb-1 line-clamp-1 tracking-tight">
                      {alumnus.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: alumnus.details }}
                    />

                    <div className="w-full mt-1">
                      <Link 
                        href={`/alumna/featured-alumni/${alumnus.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full block"
                      >
                        <button className="w-full bg-blue-btn text-white hover:bg-gray-800 transition-colors py-2.5 rounded-full font-semibold text-xs shadow-md cursor-pointer text-center">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {lastPage > 1 && (
              <Pagination className="mt-8 mb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          router.get('/alumna/featured-alumni', { page: currentPage - 1 }, { preserveState: true, preserveScroll: true });
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
                            router.get('/alumna/featured-alumni', { page }, { preserveState: true, preserveScroll: true });
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
                          router.get('/alumna/featured-alumni', { page: currentPage + 1 }, { preserveState: true, preserveScroll: true });
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

AlumnaFeaturedAlumni.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
