import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Eye, Pencil, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { router } from "@inertiajs/react";

export default function AdminAlumniTable({
  alumni,
  selectedIds = [],
  onToggleOne,
  onToggleAll,
  allSelected = false,
  onSendEmail,
}) {
  const currentPage = alumni?.current_page ?? 1;
  const lastPage = alumni?.last_page ?? 1;
  const rowsPerPage = 6;

  const goToPage = (page) => {
    if (!page || page === "...") return;

    const params = new URLSearchParams(window.location.search);
    params.set("page", page);

    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getInitials = (name = "") => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const badgeColor = (course) => {
    switch (course) {
      case "BSIT":
        return "bg-blue-100 text-blue-600";
      case "BSCpE":
        return "bg-yellow-100 text-yellow-600";
      case "BSECE":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaginationItems = () => {
    if (lastPage <= 4) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", lastPage];
    }

    if (currentPage >= lastPage - 2) {
      return [1, "...", lastPage - 2, lastPage - 1, lastPage];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  const alumniData = alumni?.data ?? [];

  return (
    <div className="flex flex-col gap-3">
      {/* TABLE */}
      <div className="rounded-xl shadow overflow-hidden bg-white border border-gray-100">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-[#70CAFF] h-12 hover:bg-[#70CAFF]">
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                    className="bg-white h-5 w-5 shadow-sm"
                  />
                </TableHead>

                <TableHead className="w-[35%] text-left text-gray-800 font-semibold pl-4">
                  Alumni
                </TableHead>

                <TableHead className="w-[18%] text-center text-gray-800 font-semibold">
                  Course
                </TableHead>

                <TableHead className="w-[15%] text-center text-gray-800 font-semibold">
                  Year
                </TableHead>

                <TableHead className="w-[24%] text-center text-gray-800 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alumniData.map((item) => (
                <TableRow
                  key={item.id}
                  className={`h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedIds.includes(item.id) ? "bg-blue-50" : ""
                  }`}
                >
                  {/* CHECKBOX */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => onToggleOne(item.id)}
                      className="bg-white h-5 w-5 shadow-sm"
                    />
                  </TableCell>

                  {/* NAME */}
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-semibold overflow-hidden border border-gray-100">
                        {item.avatar ? (
                          <img
                            src={`/storage/${item.avatar}`}
                            alt={item.name || "avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(item.name)
                        )}
                      </div>

                      <span className="font-medium text-gray-800 truncate">
                        {item.name ?? "Unknown"}
                      </span>
                    </div>
                  </TableCell>

                  {/* COURSE */}
                  <TableCell className="text-center">
                    <span
                      className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(
                        item.course
                      )}`}
                    >
                      {item.course ?? "N/A"}
                    </span>
                  </TableCell>

                  {/* YEAR */}
                  <TableCell className="text-center text-gray-600 font-medium">
                    {item.year ?? "N/A"}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                        onClick={() =>
                          router.visit(route("admin.alumni.show", item.id))
                        }
                      >
                        <Eye size={14} /> View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-1"
                        onClick={() =>
                          onSendEmail({
                            id: item.id,
                            name: item.name,
                            email: item.email,
                          })
                        }
                      >
                        <Mail size={14} /> Send Email
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* EMPTY ROWS */}
              {alumniData.length < rowsPerPage &&
                Array.from({
                  length: rowsPerPage - alumniData.length,
                }).map((_, i) => (
                  <TableRow
                    key={`empty-${i}`}
                    className="h-[64px] border-b border-gray-50"
                  >
                    <TableCell colSpan={5} />
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronLeft size={16} />
          </button>

          {getPaginationItems().map((item, i) =>
            item === "..." ? (
              <span key={`dots-${i}`} className="w-9 text-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={item}
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
            onClick={() =>
              currentPage < lastPage && goToPage(currentPage + 1)
            }
            disabled={currentPage === lastPage}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}