import React from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { router } from "@inertiajs/react";

// HELPER FUNCTIONS
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const badgeColor = (course) => {
  switch (course) {
    case "BSIT": return "bg-blue-100 text-blue-600";
    case "BSCpE": return "bg-yellow-100 text-yellow-600";
    case "BSECE": return "bg-purple-100 text-purple-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function CoordinatorAlumniTable({ alumni, onView }) {
  const currentPage = alumni?.current_page ?? 1;
  const lastPage = alumni?.last_page ?? 1;
  const alumniData = alumni?.data ?? [];

  const goToPage = (page) => {
    if (!page || page === "...") return;
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let pageNum = 1; pageNum <= lastPage; pageNum++) {
      if (
        pageNum === 1 ||
        pageNum === lastPage ||
        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-medium transition-all cursor-pointer ${
              currentPage === pageNum
                ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            }`}
          >
            {pageNum}
          </button>
        );
      }
      else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
        pages.push(
          <span key={`dots-${pageNum}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-3 w-full flex-1 min-h-0 h-full">
      
      {/* Outer Main Container Card */}
      <div className="rounded-xl shadow bg-white border border-gray-100 overflow-hidden flex flex-col w-full flex-1 min-h-0">
        
        {/* FIXED HEADER ROW */}
        <div className="w-full bg-[#70CAFF] h-12 flex items-center text-center text-gray-800 font-semibold text-sm select-none border-b border-gray-100 pr-[17px] shrink-0">
          <div className="w-[40%] text-center">Alumni</div>
          <div className="w-[20%] text-center">Course</div>
          <div className="w-[20%] text-center">Year</div>
          <div className="w-[20%] text-center">Actions</div>
        </div>

        {/* SCROLLABLE ROWS BODY */}
        <div className="w-full flex-1 min-h-0 overflow-y-scroll overflow-x-hidden">
          <div className="w-full flex flex-col">
            {alumniData.length > 0 ? (
              alumniData.map((item) => (
                <div
                  key={item.id}
                  className="h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center w-full text-center"
                >
                  {/* ALUMNI CELL */}
                  <div className="w-[40%] flex items-center justify-center">
                    <div className="relative w-full flex items-center px-4">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                        {item.avatar ? (
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { 
                              e.target.style.display = 'none'; 
                              const parent = e.target.parentElement;
                              if (parent) parent.innerText = getInitials(item.name);
                            }}
                          />
                        ) : (
                          <span>{getInitials(item.name)}</span>
                        )}
                      </div>
                      <div className="w-full text-center">
                        <span className="font-medium text-gray-800 ml-[-36px]">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-[20%] flex items-center justify-center">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(item.course)}`}>
                      {item.course ?? "N/A"}
                    </span>
                  </div>

                  <div className="w-[20%] text-gray-600 font-medium flex items-center justify-center">
                    {item.year}
                  </div>

                  <div className="w-[20%] flex items-center justify-center">
                    <button
                      onClick={() => onView && onView(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-all text-sm font-medium shadow-sm cursor-pointer"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[64px] flex items-center justify-center w-full text-gray-500">
                No alumni found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start mt-1 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          
          {renderPageNumbers()}
          
          <button
            onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}