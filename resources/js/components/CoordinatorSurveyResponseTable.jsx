import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function CoordinatorSurveyResponseTable({
  responses,
  onDelete,
  surveyId,
}) {
  const currentPage = responses?.current_page || 1;
  const lastPage = responses?.last_page || 1;

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

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  const paginationItems = getPaginationItems();

  const handleView = (res) => {
    if (!res?.id || !surveyId) return;

    // Route to the correct survey response view depending on completion status.
    const isCompleted = res.status === "completed";

    router.visit(
      route(
        isCompleted
          ? "coordinator.survey-response.view"
          : "coordinator.survey-response.not-complete",
        surveyId,
        res.id
      )
    );
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="h-[500px] overflow-y-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-[#70CAFF] sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-center font-bold text-gray-800">Alumni</TableHead>
              <TableHead className="text-center font-bold text-gray-800">Status</TableHead>
              <TableHead className="text-center font-bold text-gray-800">Course</TableHead>
              <TableHead className="text-center font-bold text-gray-800">Year</TableHead>
              <TableHead className="text-center font-bold text-gray-800">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {responses?.data?.length > 0 ? (
              responses.data.map((res) => {
                console.log("Response Data for", res.name, ":", res);

                return (
                  <TableRow key={res.id} className="hover:bg-gray-50 h-[60px]">
                    <TableCell className="text-left">
                      <div className="flex items-center gap-3 px-6">
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden border border-gray-100">
                          {res.profile_picture ? (
                            <img 
                              src={`/storage/${res.profile_picture}`} 
                              alt={res.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If path is wrong or 404, hide image and show initials
                                e.target.style.display = 'none';
                                e.target.parentElement.innerText = getInitials(res.name);
                              }}
                            />
                          ) : (
                            getInitials(res.name)
                          )}
                        </div>
                        
                        <span className="font-medium text-gray-800 whitespace-nowrap">
                          {res.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-3 py-1 text-[11px] font-semibold rounded-full tracking-wide ${
                          res.status === "completed"
                            ? "bg-green-100 text-green-600 border border-green-200"
                            : "bg-red-100 text-red-600 border border-red-200"
                        }`}
                      >
                        {res.status === "completed" ? "Completed" : "Not Completed"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-gray-600">{res.course ?? "-"}</TableCell>
                    <TableCell className="text-center text-gray-600">{res.year ?? "-"}</TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(res)}
                          className="border-[#9ECEFF] text-[#155DFC] hover:bg-blue-50 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => onDelete(res)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {lastPage > 1 && (
        <div className="flex justify-end mt-4 px-4 pb-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationItems.map((item, i) =>
              item === "..." ? (
                <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
              ) : (
                <button
                  key={i}
                  onClick={() => goToPage(item)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
                    currentPage === item
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}