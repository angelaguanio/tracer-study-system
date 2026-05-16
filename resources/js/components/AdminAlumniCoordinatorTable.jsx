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
  const paginationBtnClass = "w-9 h-9 flex items-center justify-center text-sm rounded-md shadow-sm transition-all";

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-full overflow-hidden relative">
      
      {/* TABLE SECTION */}
      <div className="flex-1 overflow-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader className="bg-[#70CAFF] hover:bg-transparent">
            <TableRow className="h-[56px]">
              <TableHead className="text-left font-semibold px-8 text-gray-700">Alumni</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Course</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id} className="h-[70px] hover:bg-gray-50 border-b border-gray-100">
                {/* ALUMNI COLUMN */}
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

                {/* STATUS COLUMN WITH PILL BADGE */}
                <TableCell className="text-center">
                  <span className={`inline-flex px-4 py-1 rounded-full text-xs font-medium border ${
                    item.status === 'Completed' 
                      ? 'bg-green-100 text-green-600 border-green-200' 
                      : 'bg-red-100 text-red-600 border-red-200'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>

                {/* COURSE COLUMN */}
                <TableCell className="text-center text-gray-600">
                  {item.course}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="p-4 flex justify-end bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center">
          
          {/* PREVIOUS */}
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className={`${paginationBtnClass} ${
              currentPage === 1 ? "opacity-40 cursor-not-allowed text-gray-400" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* PAGE NUMBERS */}
          {paginationItems.map((item, index) =>
            item === "..." ? (
              <div key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </div>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(item)}
                className={`${paginationBtnClass} ${
                  currentPage === item
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            disabled={currentPage === lastPage}
            onClick={() => goToPage(currentPage + 1)}
            className={`${paginationBtnClass} ${
              currentPage === lastPage ? "opacity-40 cursor-not-allowed text-gray-400" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}