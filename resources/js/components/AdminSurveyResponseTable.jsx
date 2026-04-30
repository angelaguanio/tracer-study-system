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

export default function AdminSurveyResponseTable({ responses, onDelete }) {

  const currentPage = responses?.current_page || 1;
  const lastPage = responses?.last_page || 1;

  const goToPage = (p) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", p);

    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
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
    if (!res?.id) return;

    const url =
      res.status === "completed"
        ? `/admin/survey-response/${res.id}`
        : `/admin/survey-response/${res.id}/not-complete`;

    router.visit(url);
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="h-[500px] overflow-y-auto">

        <Table className="w-full">

          <TableHeader className="bg-[#70CAFF] sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-center font-bold">Alumni</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">Course</TableHead>
              <TableHead className="text-center font-bold">Year</TableHead>
              <TableHead className="text-center font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {responses?.data?.map((res) => (
              <TableRow key={res.id} className="hover:bg-gray-50 h-[60px]">

                {/* NAME */}
                <TableCell className="text-center">
                  <div className="relative w-full flex items-center">

                    <div className="absolute left-4 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                      {res.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="w-full flex justify-center">
                      <span className="font-medium text-gray-800">
                        {res.name}
                      </span>
                    </div>

                  </div>
                </TableCell>

                {/* STATUS */}
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      res.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {res.status === "completed"
                      ? "Completed"
                      : "Not Completed"}
                  </span>
                </TableCell>

                {/* COURSE */}
                <TableCell className="text-center">
                  {res.course ?? "-"}
                </TableCell>

                {/* YEAR */}
                <TableCell className="text-center">
                  {res.year ?? "-"}
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">

                    <Button
                      size="sm"
                      onClick={() => handleView(res)}
                      className="border border-[#9ECEFF] text-[#155DFC] bg-white hover:bg-blue-50"
                    >
                      <Eye size={16} />
                      View
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => onDelete(res)}
                      className="bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* PAGINATION (UNCHANGED UI) */}
      <div className="flex justify-end mt-4 px-4 pb-4">
        <div className="flex items-center gap-2">

          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {paginationItems.map((item, i) =>
            item === "..." ? (
              <span key={i} className="w-9 h-9 flex items-center justify-center">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                  currentPage === item
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() =>
              currentPage < lastPage && goToPage(currentPage + 1)
            }
            disabled={currentPage === lastPage}
            className="w-9 h-9 flex items-center justify-center rounded-lg border"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}