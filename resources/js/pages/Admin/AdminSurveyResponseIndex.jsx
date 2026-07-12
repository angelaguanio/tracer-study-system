import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Archive, ListFilter } from "lucide-react";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import usePolling from '@/hooks/usePolling';

export default function AdminSurveyResponseIndex({ surveys = [], archivedSurveys = [], filters = {} }) {
  const [tab, setTab] = useState("active");
  const [sort, setSort] = useState(filters?.sort || "newest");

  const currentData  = tab === "active" ? surveys : archivedSurveys;
  const currentList  = currentData.data ?? [];
  const isArchivedTab = tab === "archived";
  const pageParam    = tab === "active" ? "page" : "archived_page";

  const goToPage = (page) => {
    router.get(
        route("admin.survey-response.index"),
        {
            [pageParam]: page,
            sort,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        }
    );
};

  useEffect(() => {
    router.get(
        route("admin.survey-response.index"),
        {
            sort,
            page: 1,
            archived_page: 1,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        }
    );
}, [sort]);

usePolling({
  interval: 5000,
  only: ['surveys', 'archivedSurveys'],
});

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">Survey Responses</h2>
        <p className="text-sm text-gray-500">Review survey submissions</p>
      </div>

      <div className="flex items-center justify-between">
        {/* TABS */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit shadow-sm">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === "active" ? "bg-[#008236] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Active
            {(surveys.total ?? 0) > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === "active" ? "bg-white/20" : "bg-gray-100"}`}>
                {surveys.total}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("archived")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              tab === "archived" ? "bg-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Archive size={13} />
            Archived
            {(archivedSurveys.total ?? 0) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "archived" ? "bg-white/20" : "bg-gray-100"}`}>
                {archivedSurveys.total}
              </span>
            )}
          </button>
        </div>

        {/* Sort — icon only, all breakpoints */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`bg-white shadow-sm ${sort !== "newest" ? "ring-2 ring-blue-500" : ""}`}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs">Sort by date</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* LIST */}
      {currentList.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
          {isArchivedTab ? "No archived survey responses." : "No surveys found."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentList.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border rounded-lg p-5 sm:p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between min-h-[120px]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-800 text-base truncate">{survey.title}</h2>
                  {isArchivedTab && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 shrink-0">Archived</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                  <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${
                    survey.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}>
                    {survey.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span className="truncate">
                    {survey.sections_count} sections · {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Created by: <span className="font-medium text-gray-600">{survey.created_by}</span>
                </p>
              </div>
              <button
                onClick={() => router.get(`/admin/survey-response/${survey.id}`)}
                className="w-full text-center md:w-auto border border-blue-400 hover:bg-blue-300/70 cursor-pointer text-blue-600 px-3 py-2.5 md:py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                View Survey Response
              </button>
            </div>
          ))}

          {/* PAGINATION */}
          {currentData.last_page > 1 && (
            <div className="flex justify-start items-center mt-6">
              <Pagination className="justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#"
                      onClick={(e) => { e.preventDefault(); if (currentData.current_page > 1) goToPage(currentData.current_page - 1); }}
                      className={`h-9 transition-colors ${currentData.current_page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer hover:bg-blue-100 hover:text-blue-600"}`}
                    />
                  </PaginationItem>
                  {Array.from({ length: currentData.last_page }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === currentData.last_page || (page >= currentData.current_page - 1 && page <= currentData.current_page + 1))
                    .map((page, index, arr) => (
                      <PaginationItem key={page}>
                        {arr[index - 1] && page - arr[index - 1] > 1 && <PaginationEllipsis />}
                        <PaginationLink href="#" isActive={currentData.current_page === page}
                          onClick={(e) => { e.preventDefault(); goToPage(page); }}
                          className={`h-9 w-9 p-0 transition-colors ${currentData.current_page === page ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white" : "hover:bg-blue-100 hover:text-blue-600"}`}
                        >{page}</PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext href="#"
                      onClick={(e) => { e.preventDefault(); if (currentData.current_page < currentData.last_page) goToPage(currentData.current_page + 1); }}
                      className={`h-9 transition-colors ${currentData.current_page === currentData.last_page ? "pointer-events-none opacity-40" : "cursor-pointer hover:bg-blue-100 hover:text-blue-600"}`}
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

AdminSurveyResponseIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
