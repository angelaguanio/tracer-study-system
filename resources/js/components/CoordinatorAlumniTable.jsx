import React from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

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
      if (pageNum === 1 || pageNum === lastPage || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
        pages.push(
          <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-medium transition-all ${currentPage === pageNum ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"}`}>
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
    <div className="flex flex-col h-full w-full gap-3">
      
      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      <div className="hidden md:block rounded-xl shadow bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#70CAFF]">
            <tr className="h-12 text-gray-800">
              <th className="text-center font-semibold pl-8">Name</th>
              <th className="text-center font-semibold">Course</th>
              <th className="text-center font-semibold">Year</th>
              <th className="text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alumniData.length > 0 ? (
              alumniData.map((item) => (
                <tr key={item.id} className="h-[64px] hover:bg-gray-50 transition-colors">
                 <td className="px-4 h-[64px]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(item.name)
                      )}
                    </div>
                    <span className="flex-1 text-center text-sm font-medium text-gray-800">{item.name}</span>
                  </div>
                </td>
                  <td className="text-center">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(item.course)}`}>
                      {item.course ?? "N/A"}
                    </span>
                  </td>
                  <td className="text-center text-gray-600 font-medium">{item.year ?? "—"}</td>
                  <td className="text-center">
                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 gap-1" onClick={() => onView && onView(item.id)}>
                      <Eye size={14} /> View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No alumni found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW (CARD LIST) ================= */}
      <div className="block md:hidden space-y-3 w-full">
        {alumniData.length > 0 ? (
          alumniData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-2">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(item.name)
                  )}
                </div>
                <span className="font-semibold text-gray-900">{item.name}</span>
              </div>
              <div className="text-xs space-y-2 text-gray-600 bg-gray-50/50 p-2.5 rounded-lg">
                <div className="flex justify-between"><span className="text-gray-400">Course:</span> <span className={`px-2 py-0.5 rounded-full font-bold ${badgeColor(item.course)}`}>{item.course}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Year:</span> <span className="font-medium text-gray-800">{item.year}</span></div>
              </div>
              <Button size="sm" variant="outline" className="w-full border-blue-500 text-blue-600 gap-1" onClick={() => onView && onView(item.id)}>
                <Eye size={14} /> View
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-white rounded-xl shadow text-gray-500">No alumni found.</div>
        )}
      </div>
     

      {/* PAGINATION */}
      <div className="flex items-center gap-1">
        <div className="flex items-center justify-start py-2 border-t border-gray-100">
        <button onClick={() => currentPage > 1 && goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white disabled:opacity-40"><ChevronLeft size={16} /></button>
        {renderPageNumbers()}
        <button onClick={() => currentPage < lastPage && goToPage(currentPage + 1)} disabled={currentPage === lastPage} className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
      </div>
    </div>
  );
}