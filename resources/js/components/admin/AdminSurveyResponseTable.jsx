import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function AdminSurveyResponseTable({
  responses,
  surveyId,
}) {
  const currentPage = responses?.current_page || 1;
  const lastPage = responses?.last_page || 1;
  const rowsPerPage = 10;
  const responseData = responses?.data || [];

  const goToPage = (p) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", p);

    router.get(window.location.pathname, 
      Object.fromEntries(params), 
      {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
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

    const url =
      res.status === "completed"
        ? `/admin/survey-response/${surveyId}/${res.id}`
        : `/admin/survey-response/${surveyId}/${res.id}/not-complete`;

    router.get(url);
  };

  const getInitials = (name = "") => {
    const parts = name.split(" ").filter(Boolean);
    if (!parts.length) return "";
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 w-full flex-1 min-h-0">

      {/* ================= DESKTOP VIEW (EKSAKTONG GAYA NG ORIGINAL AT SCREENSHOT) ================= */}
      <div className="hidden md:flex rounded-xl shadow bg-white border border-gray-100 overflow-hidden flex-col w-full flex-1 min-h-0">

        {/* HEADER */}
        <div className="w-full bg-[#70CAFF] h-12 flex items-center text-center text-gray-800 font-semibold text-sm select-none border-b border-gray-100 pr-[17px]">
          <div className="w-[40%] text-center">Alumni</div>
          <div className="w-[20%] text-center">Course</div>
          <div className="w-[20%] text-center">Year</div>
          <div className="w-[20%] text-center">Remarks</div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="w-full flex-1 min-h-0 overflow-y-scroll overflow-x-hidden">
          <div className="w-full flex flex-col">

            {responseData.length > 0 ? (
              responseData.map((res) => (
                <div
                  key={res.id}
                  className="h-[64px] border-b border-gray-100 hover:bg-gray-50 flex items-center w-full text-center"
                >
                  {/* ALUMNI - ORIGINAL SPACING AT ALIGNMENT (IMAGE_89E2ED.PNG) */}
                  <div className="w-[40%] flex items-center justify-center">
                    <div className="relative w-full flex items-center px-4">
                      {/* Mananatili sa kaliwang bahagi ang avatar gaya ng dati */}
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100">
                        {res.avatar ? (
                          <img
                            src={res.avatar}
                            alt={res.name || "avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(res.name)
                        )}
                      </div>

                      {/* Ang name naman ay perpektong nakasentro sa buong kolum */}
                      <div className="w-full text-center">
                        <span className="font-medium text-gray-800 truncate block">
                          {res.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COURSE */}
                  <div className="w-[20%] text-gray-600 flex items-center justify-center truncate px-2">
                    {res.course ?? "-"}
                  </div>

                  {/* YEAR */}
                  <div className="w-[20%] text-gray-600 flex items-center justify-center">
                    {res.year ?? "-"}
                  </div>

                  {/* REMARKS (Acts as View Button) */}
                  <div className="w-[20%] flex items-center justify-center">
                    <button
                      onClick={() => handleView(res)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full cursor-pointer transition-colors ${
                        res.status === "completed"
                          ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                      }`}
                    >
                      {res.status === "completed"
                        ? "Completed"
                        : "Not Completed"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[64px] flex items-center justify-center w-full text-gray-500">
                No records found.
              </div>
            )}

            {/* EMPTY ROWS */}
            {Array.from({ length: Math.max(0, rowsPerPage - responseData.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-[64px] border-b border-gray-50 flex items-center w-full"
              />
            ))}

          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW (RESPONSIVE AT MAGKADIKIT ANG AVATAR AT NAME) ================= */}
      <div className="block md:hidden space-y-3 w-full overflow-y-auto pr-0.5">
        {responseData.length > 0 ? (
          responseData.map((res) => (
            <div key={`mobile-${res.id}`} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-3">
              
              {/* SECTION 1: Avatar at Name (Dito sila magkatabi na may gap-3) */}
              <div className="flex items-center justify-between border-b border-gray-50 pb-2 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100">
                    {res.avatar ? (
                      <img
                        src={res.avatar}
                        alt={res.name || "avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(res.name)
                    )}
                  </div>
                  <span className="font-semibold text-gray-900 truncate">
                    {res.name}
                  </span>
                </div>
                
                <button
                  onClick={() => handleView(res)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 cursor-pointer transition-colors ${
                    res.status === "completed"
                      ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                      : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  }`}
                >
                  {res.status === "completed" ? "Completed" : "Not Completed"}
                </button>
              </div>

              {/* SECTION 2: Course at Year Details */}
              <div className="text-xs space-y-1.5 text-gray-600 bg-gray-50/50 p-2.5 rounded-lg">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Course:</span>
                  <span className="font-medium text-gray-800 truncate max-w-[180px]">{res.course ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year:</span>
                  <span className="font-medium text-gray-800">{res.year ?? "-"}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 bg-white rounded-xl shadow">
            No records found.
          </div>
        )}
      </div>

      {/* ================= PAGINATION STYLES ================= */}
      <div className="flex justify-start mt-1 pb-2">
        <div className="flex items-center gap-1">

          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center border rounded-lg bg-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {paginationItems.map((item, i) =>
            item === "..." ? (
              <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 flex items-center justify-center border rounded-lg text-sm cursor-pointer ${
                  currentPage === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="w-9 h-9 flex items-center justify-center border rounded-lg bg-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}