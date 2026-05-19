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

  const renderPageNumbers = () => {
    const pages = [];
    for (let pageNum = 1; pageNum <= lastPage; pageNum++) {
      if (pageNum === 1 || pageNum === lastPage || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
        pages.push(
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-medium transition-all cursor-pointer ${
              currentPage === pageNum ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            }`}
          >
            {pageNum}
          </button>
        );
      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
        pages.push(<span key={`dots-${pageNum}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">...</span>);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl shadow-sm overflow-hidden bg-white border border-gray-100">
        <div className="overflow-x-auto">
          {/* Ginamit ang table-auto para sumunod ang width sa ikli ng content */}
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow className="bg-[#70CAFF] h-12 hover:bg-[#70CAFF]">
                {/* Binabaan ang width ng Alumni para lumapit ang Course column */}
                <TableHead className="w-[30%] text-left text-gray-800 font-semibold pl-8">Alumni</TableHead>
                <TableHead className="w-[15%] text-left text-gray-800 font-semibold">Course</TableHead>
                <TableHead className="w-[15%] text-center text-gray-800 font-semibold">Year</TableHead>
                <TableHead className="w-[20%] text-center text-gray-800 font-semibold pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alumniData.length > 0 ? (
                alumniData.map((item) => (
                  <TableRow key={item.id} className="h-[64px] border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500 overflow-hidden border border-gray-100 flex items-center justify-center text-white font-bold text-xs">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{getInitials(item.name)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">{item.name}</span>
                      </div>
                    </TableCell>

                    {/* Naka-text-left para dikit sa name, imbes na center */}
                    <TableCell className="text-left">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${badgeColor(item.course)}`}>
                        {item.course ?? "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-gray-600 font-medium">
                      {item.year}
                    </TableCell>

                    <TableCell className="text-center pr-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView && onView(item.id)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white gap-2 h-9 px-4 transition-all"
                      >
                        <Eye size={16} />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">No alumni records found.</TableCell>
                </TableRow>
              )}

              {/* Maintains consistency in row spacing */}
              {Array.from({ length: Math.max(0, rowsPerPage - alumniData.length) }).map((_, i) => (
                <TableRow key={`empty-${i}`} className="h-[64px] border-b border-transparent">
                  <TableCell colSpan={4} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {lastPage > 1 && (
        <div className="flex justify-end mt-2">
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
      )}
    </div>
  );
}