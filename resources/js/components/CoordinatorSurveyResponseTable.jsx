import React from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function CoordinatorSurveyResponseTable({
  responses,
  onDelete,
  surveyId,
}) {
  const currentPage = responses?.current_page || 1;
  const lastPage = responses?.last_page || 1;
  const rowsPerPage = 10;
  const responseData = responses?.data || [];

  const goToPage = (p) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", p);

    router.get(
      window.location.pathname,
      Object.fromEntries(params),
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  const getPaginationItems = () => {
    if (lastPage <= 4) return Array.from({ length: lastPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", lastPage];
    if (currentPage >= lastPage - 2)
      return [1, "...", lastPage - 2, lastPage - 1, lastPage];

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      lastPage,
    ];
  };

  const paginationItems = getPaginationItems();

  const handleView = (res) => {
    if (!res?.id || !surveyId) return;

    const currentSurveyId = surveyId || res.survey_id || res.survey_form_id;
    if (!currentSurveyId) return;

    const url =
      res.status === "completed"
        ? `/coordinator/survey-response/${currentSurveyId}/${res.id}`
        : `/coordinator/survey-response/${currentSurveyId}/${res.id}/not-complete`;

    router.get(url);
  };

  const getInitials = (name = "") => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 w-full flex-1 min-h-0">
      
      {/* Outer Main Container Card */}
      <div className="rounded-xl shadow bg-white border border-gray-100 overflow-hidden flex flex-col w-full flex-1 min-h-0">
        
        {/* FIXED HEADER ROW - Added right padding to align perfectly with scrollable container */}
        <div className="w-full bg-[#70CAFF] h-12 flex items-center text-center text-gray-800 font-semibold text-sm select-none border-b border-gray-100 pr-[17px]">
          <div className="w-[32%] text-center">Alumni</div>
          <div className="w-[17%] text-center">Status</div>
          <div className="w-[17%] text-center">Course</div>
          <div className="w-[17%] text-center">Year</div>
          <div className="w-[17%] text-center">Action</div>
        </div>

        {/* SCROLLABLE ROWS BODY - Converted to strict vertical scrolling div elements */}
        <div className="w-full flex-1 min-h-0 overflow-y-scroll overflow-x-hidden">
          <div className="w-full flex flex-col">
            {responseData.length > 0 ? (
              responseData.map((res) => {
                const rawImage = res.avatar || res.profile_picture;
                const imageSrc = rawImage && (rawImage.startsWith('http') || rawImage.startsWith('/storage/'))
                  ? rawImage
                  : rawImage 
                    ? `/storage/${rawImage}` 
                    : null;

                return (
                  <div
                    key={res.id}
                    className="h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center w-full text-center"
                  >
                    {/* ALUMNI CELL WITH ABSOLUTE OFFSET ALIGNMENT */}
                    <div className="w-[32%] flex items-center justify-center">
                      <div className="relative w-full flex items-center px-4">
                        
                        {/* Profile Picture fixed to the left side of the cell */}
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={res.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                const parent = e.target.parentElement;
                                if (parent) parent.innerText = getInitials(res.name);
                              }}
                            />
                          ) : (
                            <span>{getInitials(res.name)}</span>
                          )}
                        </div>

                        {/* Name Text centered freely inside the cell */}
                        <div className="w-full text-center">
                          <span className="font-medium text-gray-800 ml-[-36px] truncate block">
                            {res.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS CELL */}
                    <div className="w-[17%] flex items-center justify-center">
                      <span
                        className={`px-3 py-1 text-[11px] font-semibold rounded-full tracking-wide ${
                          res.status === "completed"
                            ? "bg-green-100 text-green-600 border border-green-200"
                            : "bg-red-100 text-red-600 border border-red-200"
                        }`}
                      >
                        {res.status === "completed" ? "Completed" : "Not Completed"}
                      </span>
                    </div>

                    {/* COURSE CELL */}
                    <div className="w-[17%] text-gray-600 font-medium flex items-center justify-center">
                      {res.course ?? "-"}
                    </div>

                    {/* YEAR CELL */}
                    <div className="w-[17%] text-gray-600 font-medium flex items-center justify-center">
                      {res.year ?? "-"}
                    </div>

                    {/* ACTION CELL */}
                    <div className="w-[17%] flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleView(res)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-all text-sm font-medium shadow-sm cursor-pointer"
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[64px] flex items-center justify-center w-full text-gray-500">
                No records found.
              </div>
            )}

            {/* Dynamic empty rows up to 10 entries */}
            {Array.from({ length: Math.max(0, rowsPerPage - responseData.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-[64px] border-b border-gray-50/50 flex items-center w-full">
                <div className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED PAGINATION LOWER PANEL */}
      <div className="flex justify-start mt-1 pb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationItems.map((item, i) =>
              item === "..." ? (
                <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-medium transition-all cursor-pointer ${
                    currentPage === item
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
    </div>
  );
}