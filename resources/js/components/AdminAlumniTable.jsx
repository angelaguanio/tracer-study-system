import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const currentPage = alumni?.current_page || 1;
  const lastPage    = alumni?.last_page || 1;
  const rowsPerPage = 6;

  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const badgeColor = (course) => {
    if (course === "BSIT")  return "bg-blue-100 text-blue-600";
    if (course === "BSCpE") return "bg-yellow-100 text-yellow-600";
    if (course === "BSECE") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  const getPaginationItems = () => {
    if (lastPage <= 4) return Array.from({ length: lastPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", lastPage];
    if (currentPage >= lastPage - 2) return [1, "...", lastPage - 2, lastPage - 1, lastPage];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  return (
    <div className="flex flex-col gap-3">

      {/* TABLE WRAPPER — rounded + shadow lives here, not on <Table> */}
      <div className="rounded-xl shadow overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed min-w-[700px]">

            {/* HEADER — no hover, fixed bg */}
            <TableHeader>
              <TableRow className="bg-[#70CAFF] h-12">

                {/* CHECKBOX col */}
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all"
                    className="bg-white h-5 w-5 shadow-sm hover:cursor-pointer"
                  />
                </TableHead>

                {/* Fixed widths keep columns stable across pages */}
                <TableHead className="w-[35%] text-left text-gray-800 font-semibold pl-4">Alumni</TableHead>
                <TableHead className="w-[18%] text-center text-gray-800 font-semibold">Course</TableHead>
                <TableHead className="w-[15%] text-center text-gray-800 font-semibold">Year</TableHead>
                <TableHead className="w-[24%] text-center text-gray-800 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alumni?.data?.map((item) => (
                <TableRow
                  key={item.id}
                  className={`h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedIds.includes(item.id) ? "bg-blue-50 hover:bg-blue-50" : ""
                  }`}
                >
                  {/* CHECKBOX */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => onToggleOne(item.id)}
                      aria-label={`Select ${item.name}`}
                      className="bg-white h-5 w-5 shadow-sm hover:cursor-pointer"
                    />
                  </TableCell>

                  {/* NAME + AVATAR — left-aligned, flush with checkbox column */}
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-semibold">
                        {getInitials(item.name)}
                      </div>
                      <span className="font-medium text-gray-800 truncate">{item.name}</span>
                    </div>
                  </TableCell>

                  {/* COURSE */}
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${badgeColor(item.course)}`}>
                      {item.course}
                    </span>
                  </TableCell>

                  {/* YEAR */}
                  <TableCell className="text-center text-gray-600">
                    {item.year}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border border-[#9ECEFF] text-[#155DFC] hover:bg-blue-50"
                        onClick={() => router.visit(route("admin.alumni.show", item.id))}
                      >
                        View Profile
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => onSendEmail({ id: item.id, name: item.name, email: item.email })}
                      >
                        Send Email
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* EMPTY ROWS — keeps table height stable */}
              {(alumni?.data?.length ?? 0) < rowsPerPage &&
                Array.from({ length: rowsPerPage - (alumni?.data?.length ?? 0) }).map((_, i) => (
                  <TableRow key={`empty-${i}`} className="h-[64px] border-b border-gray-100 hover:bg-transparent">
                    <TableCell colSpan={5} />
                  </TableRow>
                ))}
            </TableBody>

          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1">

          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPaginationItems().map((item, i) =>
            item === "..." ? (
              <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition ${
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
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
