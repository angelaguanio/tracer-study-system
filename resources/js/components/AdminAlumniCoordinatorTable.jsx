import { router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminAlumniCoordinatorTable({
  data,
  meta,
  setEditing,
  setShowForm,
}) {

  const getInitials = (first, last) => {
    return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
  };

  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  const goToPage = (page) => {
    router.visit(`/admin/alumni-coordinators?page=${page}`, {
      preserveScroll: true,
      preserveState: true,
    });
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

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* FIXED: Isang container na lang at tinanggal ang hiwalay na flex heights para sa scrollbar */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Table className="w-full table-fixed">

          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[22%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
          </colgroup>

          {/* HEADER */}
          <TableHeader className="bg-[#70CAFF]">
            <TableRow className="h-[56px]">
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Alumni Coordinator
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Email
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Department
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Program
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Year
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {data?.length > 0 ? (
              data.map((c) => (
                <TableRow
                  key={c.id}
                  className="h-[70px] border-b hover:bg-gray-50"
                >
                  {/* NAME - FIXED AVATAR LEFT */}
                  <TableCell className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                        {getInitials(c.first_name, c.last_name)}
                      </div>
                      <span className="truncate max-w-[140px]">
                        {c.first_name} {c.last_name}
                      </span>
                    </div>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell className="text-center text-gray-600 truncate whitespace-nowrap">
                    {c.email}
                  </TableCell>

                  {/* DEPT */}
                  <TableCell className="text-center whitespace-nowrap">
                    {c.department}
                  </TableCell>

                  {/* PROGRAM */}
                  <TableCell className="text-center truncate whitespace-nowrap">
                    {c.courses}
                  </TableCell>

                  {/* YEAR */}
                  <TableCell className="text-center whitespace-nowrap">
                    {c.start_year && c.end_year
                      ? `${c.start_year} - ${c.end_year}`
                      : "No Year"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === "inactive"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.status
                        ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
                        : "Active"}
                    </span>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 flex items-center gap-1"
                        onClick={() =>
                          router.visit(`/admin/alumni-coordinators/${c.id}`)
                        }
                      >
                        <Eye size={14} />
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 flex items-center gap-1"
                        onClick={() => {
                          setEditing(c);
                          setShowForm(true);
                        }}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start">
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center rounded border bg-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {paginationItems.map((item, index) =>
            item === "..." ? (
              <div key={index} className="w-9 text-center text-gray-400">
                ...
              </div>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 rounded border text-sm ${
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
            disabled={currentPage === lastPage}
            onClick={() => goToPage(currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center rounded border bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}