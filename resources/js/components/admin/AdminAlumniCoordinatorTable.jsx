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
    <div className="flex flex-col gap-3 w-full h-full min-h-0">

      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto w-full border border-gray-100">
        <Table className="w-full table-fixed min-w-[900px]">

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
                  <TableCell className="text-left pl-8">
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

      {/* ================= MOBILE VIEW (CARD LIST) ================= */}
      <div className="block md:hidden space-y-3 w-full overflow-y-auto pr-0.5">
        {data?.length > 0 ? (
          data.map((c) => (
            <div key={`mobile-${c.id}`} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-3">
              
              {/* SECTION 1: Avatar, Name, at Status sa iisang row */}
              <div className="flex items-center justify-between border-b border-gray-50 pb-2 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {getInitials(c.first_name, c.last_name)}
                  </div>
                  <span className="font-semibold text-gray-900 truncate">
                    {c.first_name} {c.last_name}
                  </span>
                </div>
                
                {/* Dito inilipat ang Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                    c.status === "inactive" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Active"}
                </span>
              </div>

              {/* SECTION 2: Email, Department, Program, Year */}
              <div className="text-xs space-y-1.5 text-gray-600 bg-gray-50/50 p-2.5 rounded-lg">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Email:</span>
                  <span className="truncate max-w-[200px] font-medium text-gray-800">{c.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department:</span>
                  <span className="font-medium text-gray-800">{c.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Program:</span>
                  <span className="font-medium text-gray-800 truncate max-w-[180px]">{c.courses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year:</span>
                  <span className="font-medium text-gray-800">
                    {c.start_year && c.end_year ? `${c.start_year} - ${c.end_year}` : "No Year"}
                  </span>
                </div>
              </div>

              {/* SECTION 3: Iisang section para sa mga Button Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-blue-500 text-blue-600 flex items-center justify-center gap-1 text-xs h-9"
                  onClick={() => router.visit(`/admin/alumni-coordinators/${c.id}`)}
                >
                  <Eye size={14} /> View
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-green-500 text-green-600 flex items-center justify-center gap-1 text-xs h-9"
                  onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={14} /> Edit
                </Button>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 bg-white rounded-xl shadow">
            No records found.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start mt-1 pb-2">
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronLeft size={16} />
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
            onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}