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
    <div className="flex flex-col gap-3 flex-1 min-h-0 h-full">

      <div className="bg-white rounded-xl shadow flex flex-col flex-1 min-h-0 overflow-hidden">

        <div className="shrink-0">
          <Table className="w-full table-fixed">

            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[24%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[18%]" />
            </colgroup>

            <TableHeader className="bg-[#70CAFF] hover:bg-transparent">
              <TableRow className="h-[56px]">

                <TableHead className="text-center font-semibold text-gray-700">
                  Alumni Coordinator
                </TableHead>

                <TableHead className="text-center font-semibold text-gray-700">
                  Email
                </TableHead>

                <TableHead className="text-center font-semibold text-gray-700">
                  Department
                </TableHead>

                <TableHead className="text-center font-semibold text-gray-700">
                  Program
                </TableHead>

                <TableHead className="text-center font-semibold text-gray-700">
                  Status
                </TableHead>

                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>

              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <Table className="w-full table-fixed border-b">

            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[24%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[18%]" />
            </colgroup>

            <TableBody>
              {data?.length > 0 ? (
                data.map((c) => (
                  <TableRow
                    key={c.id}
                    className="h-[72px] hover:bg-gray-50 border-b border-gray-100"
                  >

                    <TableCell className="text-center">
                      <div className="relative w-full flex items-center px-3">

                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shrink-0 absolute left-3">
                          {getInitials(c.first_name, c.last_name)}
                        </div>

                        <span className="font-medium text-gray-800 w-full text-center truncate">
                          {c.first_name} {c.last_name}
                        </span>

                      </div>
                    </TableCell>

                    <TableCell className="text-center text-gray-600 truncate px-2">
                      {c.email}
                    </TableCell>

                    <TableCell className="text-center text-gray-700">
                      {c.department}
                    </TableCell>

                    <TableCell className="text-center text-gray-700">
                      {c.courses}
                    </TableCell>

                    {/* STATUS FIXED ONLY */}
                    <TableCell className="text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {c.status
                          ? c.status.charAt(0).toUpperCase() +
                            c.status.slice(1)
                          : "Active"}
                      </span>

                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-2 flex-wrap">

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
                  <TableCell
                    colSpan={6}
                    className="h-[64px] text-center text-gray-500"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
      </div>

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
              <div
                key={`dots-${index}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400"
              >
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