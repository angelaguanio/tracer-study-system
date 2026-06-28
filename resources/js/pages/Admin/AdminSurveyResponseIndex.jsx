import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminSurveyResponseIndex({ surveys = [] }) {
  const currentList = surveys.data ?? [];

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">
          Survey Responses
        </h2>
        <p className="text-sm text-gray-500">
          Review survey submissions
        </p>
      </div>

      {/* EMPTY STATE */}
      {currentList.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
          No surveys found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">

          {currentList.map((survey) => (
            /* BINAGO NA PARENT DESIGN:
               - Mobile: 'flex-col gap-4' para bumaba ang button at magkaroon ng space.
               - Desktop ('md:'): Babalik sa orihinal na 'flex-row items-center justify-between'.
            */
            <div
              key={survey.id}
              className="bg-white border rounded-lg p-5 sm:p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between min-h-[120px]"
            >

              {/* LEFT CONTENT AREA */}
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-800 text-base truncate">
                  {survey.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${
                      survey.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {survey.status === "active" ? "Active" : "Inactive"}
                  </span>

                  <span className="truncate">
                    {survey.sections_count} sections ·{" "}
                    {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Created by: <span className="font-medium text-gray-600">{survey.created_by}</span>
                </p>
              </div>

              {/* BUTTON DESIGN:
                 - Mobile: 'w-full text-center py-2.5' para malaki at madaling i-click sa ilalim.
                 - Desktop ('md:'): Babalik sa fix style na 'md:w-auto md:py-1.5'.
              */}
              <button
                onClick={() =>
                  router.get(`/admin/survey-response/${survey.id}`)
                }
                className="w-full text-center md:w-auto border border-blue-400 hover:bg-blue-300/70 cursor-pointer text-blue-600 px-3 py-2.5 md:py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                View Survey Response
              </button>

            </div>
          ))}

        {/* Pagination */}
        {surveys.last_page > 1 && (
            <div className="flex justify-start items-center mt-6">
                <Pagination className="justify-start">
                    <PaginationContent>

                        {/* Previous */}
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (surveys.current_page > 1) {
                                        router.get(
                                            route("admin.survey-response.index"),
                                            {
                                                page: surveys.current_page - 1,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            }
                                        );
                                    }
                                }}
                                className={`h-9 transition-colors ${
                                    surveys.current_page === 1
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                }`}
                            />
                        </PaginationItem>

                        {/* Pages */}
                        {Array.from(
                            { length: surveys.last_page },
                            (_, i) => i + 1
                        )
                            .filter((page) => {
                                const current = surveys.current_page;

                                return (
                                    page === 1 ||
                                    page === surveys.last_page ||
                                    (page >= current - 1 &&
                                        page <= current + 1)
                                );
                            })
                            .map((page, index, arr) => {
                                const prevPage = arr[index - 1];

                                return (
                                    <PaginationItem key={page}>
                                        {prevPage &&
                                            page - prevPage > 1 && (
                                                <PaginationEllipsis />
                                            )}

                                        <PaginationLink
                                            href="#"
                                            isActive={
                                                surveys.current_page === page
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();

                                                router.get(
                                                    route(
                                                        "admin.survey-response.index"
                                                    ),
                                                    {
                                                        page,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        replace: true,
                                                    }
                                                );
                                            }}
                                            className={`h-9 w-9 p-0 transition-colors ${
                                                surveys.current_page === page
                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white"
                                                    : "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                            }`}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                        {/* Next */}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (
                                        surveys.current_page <
                                        surveys.last_page
                                    ) {
                                        router.get(
                                            route("admin.survey-response.index"),
                                            {
                                                page:
                                                    surveys.current_page + 1,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            }
                                        );
                                    }
                                }}
                                className={`h-9 transition-colors ${
                                    surveys.current_page ===
                                    surveys.last_page
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                }`}
                            />
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>
        )}
        </div>
      )}

    </div>
  );
}

AdminSurveyResponseIndex.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);