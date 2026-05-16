import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const rowsPerPage = 6;
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

  // SMART PAGINATION GENERATOR LOGIC
  const renderPageNumbers = () => {
    const pages = [];
    
    for (let pageNum = 1; pageNum <= lastPage; pageNum++) {
      // Always display the First Page, Last Page, Current Page, and its adjacent left and right neighbors
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
      // Insert a "..." divider if there are skipped pages in between
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
    <div className="flex flex-col gap-3">
      <div className="rounded-xl shadow overflow-hidden bg-white border border-gray-100">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-[#70CAFF] h-12 hover:bg-[#70CAFF]">
                <TableHead className="w-[40%] text-left text-gray-800 font-semibold pl-6">Alumni</TableHead>
                <TableHead className="w-[20%] text-center text-gray-800 font-semibold">Course</TableHead>
                <TableHead className="w-[20%] text-center text-gray-800 font-semibold">Year</TableHead>
                <TableHead className="w-[20%] text-center text-gray-800 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alumniData.length > 0 ? (
                alumniData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-blue-500 overflow-hidden border border-gray-100 flex items-center justify-center text-white font-bold text-xs">
                          {item.avatar ? (
                            <img 
                              src={item.avatar} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span>{getInitials(item.name)}</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800 truncate">{item.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(item.course)}`}>
                        {item.course ?? "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-gray-600 font-medium">
                      {item.year}
                    </TableCell>

                    <TableCell className="text-center">
                      <button
                        onClick={() => onView && onView(item.id)}
                        className="relative z-50 inline-flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-all text-sm font-medium mx-auto shadow-sm cursor-pointer"
                      >
                        <Eye size={14} /> View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-[64px]">
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No alumni found.
                  </TableCell>
                </TableRow>
              )}

              {/* Maintains table height consistent when rows are less than 6 */}
              {Array.from({ length: Math.max(0, rowsPerPage - alumniData.length) }).map((_, i) => (
                <TableRow key={`empty-${i}`} className="h-[64px] border-b border-gray-50">
                  <TableCell colSpan={4} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* DYNAMIC PAGINATION CONTROLS - Displayed only if total pages exceed 1 */}
      {lastPage > 1 && (
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-1">
            {/* Previous Page Button */}
            <button
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Dynamic List of Pages (1, 2, 3...) */}
            {renderPageNumbers()}
            
            {/* Next Page Button */}
            <button
              onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}