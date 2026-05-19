import { router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSurveyResponseTable({ data, meta }) {
  // Generates initials for the blue avatar circle
  const getInitials = (firstName, lastName) => {
    return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase();
  };

  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  // Updated path to match your screenshot: /admin/survey_response
  const goToPage = (page) => {
    router.visit(`/admin/survey_response?page=${page}`, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const getPaginationItems = () => {
    if (lastPage <= 4) return Array.from({ length: lastPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", lastPage];
    if (currentPage >= lastPage - 2) return [1, "...", lastPage - 2, lastPage - 1, lastPage];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  const paginationItems = getPaginationItems();

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 h-full">

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* Fixed header */}
        <div className="shrink-0">
          <Table className="min-w-[800px] w-full">
            <TableHeader className="bg-[#70CAFF] hover:bg-transparent">
              <TableRow className="h-[56px]">
                <TableHead className="text-left font-semibold px-8 text-gray-700">Alumni</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">Course</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <Table className="min-w-[800px] w-full">
            <TableBody>
              {data?.length > 0 ? data.map((item) => (
                <TableRow key={item.id} className="h-[70px] hover:bg-gray-50 border-b border-gray-100">
                  {/* ALUMNI */}
                  <TableCell>
                    <div className="flex items-center gap-3 pl-4">
                      <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm shrink-0">
                        {getInitials(item.first_name, item.last_name)}
                      </div>
                      <span className="font-medium text-gray-800">
                        {item.first_name} {item.last_name}
                      </span>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center">
                    <span className={`inline-flex px-4 py-1 rounded-full text-xs font-medium border ${
                      item.status === 'Completed'
                        ? 'bg-green-100 text-green-600 border-green-200'
                        : 'bg-red-100 text-red-600 border-red-200'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>

                  {/* COURSE */}
                  <TableCell className="text-center text-gray-600">
                    {item.course}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-[64px] text-center text-gray-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start mt-1 pb-2">
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {paginationItems.map((item, index) =>
            item === "..." ? (
              <div key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </div>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-medium transition ${
                  currentPage === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-gray-50 text-gray-600"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            disabled={currentPage === lastPage}
            onClick={() => goToPage(currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}