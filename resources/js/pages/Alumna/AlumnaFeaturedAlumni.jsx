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

      {/* Bottom Left Corner Wave */}
      <div className="absolute bottom-0 left-0 w-[50vw] max-w-[600px] pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 500 500" preserveAspectRatio="xMinYMax slice" className="w-full h-auto opacity-90 drop-shadow-2xl">
          {/* Secondary Swoosh */}
          <path fill="var(--theme-secondary, #60A5FA)" fillOpacity="0.5" d="M0,200 C200,280 300,450 500,500 L0,500 Z" />
          {/* Primary Swoosh */}
          <path fill="var(--theme-primary, #005AAA)" fillOpacity="0.8" d="M0,350 C180,390 280,480 450,500 L0,500 Z" />
        </svg>
      </div>

      {/* Bottom Right Corner Wave */}
      <div className="absolute bottom-0 right-0 w-[50vw] max-w-[600px] pointer-events-none z-0 flex items-end justify-end">
        <svg viewBox="0 0 500 500" preserveAspectRatio="xMaxYMax slice" className="w-full h-auto opacity-90 drop-shadow-2xl">
          {/* Secondary Swoosh */}
          <path fill="var(--theme-secondary, #60A5FA)" fillOpacity="0.6" d="M0,500 C150,480 300,300 500,150 L500,500 Z" />
          {/* Primary Swoosh */}
          <path fill="var(--theme-primary, #005AAA)" fillOpacity="0.85" d="M150,500 C280,490 380,420 500,300 L500,500 Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

        <div className="text-center mb-16 max-w-5xl mx-auto font-inter">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px opacity-40" style={{ background: 'var(--theme-primary)' }}></div>
            <span className="uppercase font-bold tracking-[0.2em] text-sm" style={{ color: 'var(--theme-primary)' }}>Alumni Stories</span>
            <div className="w-16 h-px opacity-40" style={{ background: 'var(--theme-primary)' }}></div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[45px] font-playfair font-bold text-[#001D4A] mb-6 leading-[1.2]">
            Wesleyan Footprints: Stories that Inspire,<br className="hidden md:block" /> 
            <span style={{ color: 'var(--theme-primary)' }}>Achieve, and Create a Brighter Tomorrow</span>
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl max-w-3xl mx-auto">
            Discover the journeys, achievements, and lasting impact of our graduates who continue to make a difference in their communities and beyond.
          </p>
        </div>

        {list.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-10 md:p-16 w-full max-w-[700px] flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'color-mix(in srgb, var(--theme-primary) 12%, white)' }}>
              <Star size={40} style={{ color: 'var(--theme-primary)' }} />
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
                  onClick={() => router.get(`/alumni/featured-alumni/${alumnus.id}`)}
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
                  <div className="px-5 pb-5 pt-1 flex flex-col bg-white relative z-10 -mt-8 font-inter">
                    <h3 className="text-[#0B2545] text-base font-black mb-1 line-clamp-1 tracking-tight">
                      {alumnus.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: alumnus.details }}
                    />

                    <div className="w-full mt-1">
                      <Link 
                        href={`/alumni/featured-alumni/${alumnus.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full block"
                      >
                        <button 
                          className="w-full py-2.5 rounded-full font-semibold text-xs shadow-md cursor-pointer text-center hover:opacity-90 transition-opacity"
                          style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
                        >
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
                          router.get('/alumni/featured-alumni', { page: currentPage - 1 }, { preserveState: true, preserveScroll: true });
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
                            router.get('/alumni/featured-alumni', { page }, { preserveState: true, preserveScroll: true });
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
                          router.get('/alumni/featured-alumni', { page: currentPage + 1 }, { preserveState: true, preserveScroll: true });
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
