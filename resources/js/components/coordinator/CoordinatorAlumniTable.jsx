import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Eye, Mail, Pencil, Archive, RotateCcw, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { router } from "@inertiajs/react";

export default function CoordinatorAlumniTable({
  alumni,
  selectedIds = [],
  onToggleOne,
  onToggleAll,
  allSelected = false,
  onSendEmail,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  isArchivedView = false,
}) {
  const currentPage = alumni?.current_page ?? 1;
  const lastPage = alumni?.last_page ?? 1;

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
      case "BSEcE":
        return "bg-purple-100 text-purple-600";
      case "BSCS":
        return "bg-teal-100 text-teal-600";
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
    <div className="flex flex-col gap-3 flex-1 min-h-0 h-full w-full">
      
      {/* ================= DESKTOP VIEW (TABLE - WALANG BINAGO) ================= */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 rounded-xl shadow overflow-hidden bg-white border border-gray-100">
        <div className="overflow-x-auto shrink-0">
          <Table className="w-full table-fixed min-w-[800px]">
            <colgroup>
              <col className="w-12" />
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[15%]" />
              <col className="w-[23%]" />
            </colgroup>
            <TableHeader>
              <TableRow className="bg-[#009AFB] h-12 hover:bg-[#009AFB] border-b border-[#009AFB]">
                <TableHead className="w-12 text-center bg-[#009AFB]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                    className="bg-white h-5 w-5 shadow-sm"
                  />
                </TableHead>
                <TableHead className="w-[30%] text-left text-white font-semibold pl-4 bg-[#009AFB]">
                  Alumni
                </TableHead>
                <TableHead className="w-[14%] text-center text-white font-semibold bg-[#009AFB]">
                  Course
                </TableHead>
                <TableHead className="w-[14%] text-center text-white font-semibold bg-[#009AFB]">
                  Year
                </TableHead>
                <TableHead className="w-[15%] text-center text-white font-semibold bg-[#009AFB]">
                  Employment Status
                </TableHead>
                <TableHead className="w-[23%] text-center text-white font-semibold bg-[#009AFB]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <Table className="w-full table-fixed min-w-[800px]">
            <colgroup>
              <col className="w-12" />
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[15%]" />
              <col className="w-[23%]" />
            </colgroup>
            <TableBody>
              {alumniData.map((item) => (
                <TableRow
                  key={item.id}
                  className={`h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedIds.includes(item.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <TableCell className="w-12 text-center">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => onToggleOne(item.id)}
                      className="bg-white h-5 w-5 shadow-sm"
                    />
                  </TableCell>

                  <TableCell className="w-[30%] pl-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-semibold overflow-hidden border border-gray-100">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name || "avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(item.name)
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-gray-800 truncate">
                          {item.name ?? "Unknown"}
                        </span>
                        {item.student_id && (
                          <span className="text-[11px] text-gray-400 font-normal">
                            ID: {item.student_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[14%] text-center">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(item.course)}`}>
                      {item.course ?? "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="w-[14%] text-center text-gray-600 font-medium">
                    {item.year ?? "N/A"}
                  </TableCell>

                  <TableCell className="w-[15%] text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      item.employment_status === 'Employed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.employment_status ?? 'N/A'}
                    </span>
                  </TableCell>

                  <TableCell className="w-[23%] text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1 text-xs"
                        onClick={() => router.visit(route("coordinator.alumni.show", item.id))}
                        title="View Profile"
                      >
                        <Eye size={13} /> View
                      </Button>

                      {!isArchivedView && onEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 border-amber-500 text-amber-600 hover:bg-amber-50 flex items-center gap-1 text-xs"
                          onClick={() => onEdit(item)}
                          title="Edit Information"
                        >
                          <Pencil size={13} /> Edit
                        </Button>
                      )}

                      {!isArchivedView && onSendEmail && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-1 text-xs"
                          onClick={() => onSendEmail({ id: item.id, name: item.name, email: item.email })}
                          title="Send Email"
                        >
                          <Mail size={13} /> Email
                        </Button>
                      )}

                      {!isArchivedView && onArchive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 border-gray-300 text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 flex items-center gap-1 text-xs"
                          onClick={() => onArchive(item)}
                          title="Archive Record"
                        >
                          <Archive size={13} />
                        </Button>
                      )}

                      {isArchivedView && onRestore && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 border-emerald-500 text-emerald-600 hover:bg-emerald-50 flex items-center gap-1 text-xs"
                          onClick={() => onRestore(item)}
                          title="Restore Record"
                        >
                          <RotateCcw size={13} /> Restore
                        </Button>
                      )}

                      {isArchivedView && onDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-1 text-xs"
                          onClick={() => onDelete(item)}
                          title="Delete Permanently"
                        >
                          <Trash2 size={13} /> Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {alumniData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-[64px] text-center text-gray-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden flex-1 overflow-y-auto space-y-3 pb-2">
        {alumniData.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <Checkbox
              id="select-all-mobile"
              checked={allSelected}
              onCheckedChange={onToggleAll}
              className="bg-white h-5 w-5 shadow-sm"
            />
            <label htmlFor="select-all-mobile" className="text-xs font-semibold text-gray-700 select-none">
              Select All Alumni
            </label>
          </div>
        )}

        {alumniData.map((item) => (
          <div
            key={`mobile-${item.id}`}
            className={`p-4 rounded-xl shadow-sm border transition-colors flex flex-col gap-3 ${
              selectedIds.includes(item.id) ? "bg-blue-50/70 border-blue-200" : "bg-white border-gray-100"
            }`}
          >
            <div className="flex flex-col gap-3">
              
              {/* Row 1: Checkbox + Avatar + Pangalan */}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => onToggleOne(item.id)}
                  className="bg-white h-5 w-5 shadow-sm shrink-0"
                />

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center text-[11px] font-semibold overflow-hidden border border-gray-100">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name || "avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(item.name)
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {item.name ?? "Unknown"}
                    </p>
                    {item.student_id && (
                      <span className="text-[11px] text-gray-400 font-normal">
                        ID: {item.student_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* MOBILE ROW 2: EMPLOYMENT, COURSE & YEAR */}
              <div className="px-2 flex flex-col gap-1.5 text-xs ">
                {/* Employment Status Row */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-800 font-medium">Employment:</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    item.employment_status === 'Employed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.employment_status ?? 'N/A'}
                  </span>
                </div>
                {/* Course Row */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-800 font-medium">Course:</span>
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor(item.course)}`}>
                      {item.course ?? "N/A"}
                  </span>
                </div>
                
                {/* Year Row */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-800 font-medium">Year:</span>
                  <span className="text-gray-800 font-normal">{item.year ?? "N/A"}</span>
                </div>
              </div>

            </div>

            {/* Bottom Row: Actions Buttons */}
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2.5 text-xs border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-1"
                onClick={() => router.visit(route("coordinator.alumni.show", item.id))}
              >
                <Eye size={12} /> View
              </Button>

              {!isArchivedView && onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs border-amber-500 text-amber-600 hover:bg-amber-50 flex items-center justify-center gap-1"
                  onClick={() => onEdit(item)}
                >
                  <Pencil size={12} /> Edit
                </Button>
              )}

              {!isArchivedView && onSendEmail && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs border-green-500 text-green-600 hover:bg-green-50 flex items-center justify-center gap-1"
                  onClick={() => onSendEmail({ id: item.id, name: item.name, email: item.email })}
                >
                  <Mail size={12} /> Email
                </Button>
              )}

              {!isArchivedView && onArchive && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs border-gray-300 text-gray-600 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center gap-1"
                  onClick={() => onArchive(item)}
                  title="Archive"
                >
                  <Archive size={12} />
                </Button>
              )}

              {isArchivedView && onRestore && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs border-emerald-500 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-1"
                  onClick={() => onRestore(item)}
                >
                  <RotateCcw size={12} /> Restore
                </Button>
              )}

              {isArchivedView && onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 size={12} /> Delete
                </Button>
              )}
            </div>
          </div>
        ))}

        {alumniData.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
            No records found.
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-start mt-1 pb-2">
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
            onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
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