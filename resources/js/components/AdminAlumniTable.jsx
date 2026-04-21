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
  const lastPage = alumni?.last_page || 1;
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
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const badgeColor = (course) => {
    if (course === "BSIT") return "bg-blue-100 text-blue-600";
    if (course === "BSCpE") return "bg-yellow-100 text-yellow-600";
    if (course === "BSECE") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
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
    <div className="flex-1 overflow-x-auto">

      {/* TABLE */}
      <Table className="min-w-[750px] w-full">

        {/* HEADER */}
        <TableHeader className="sticky top-0 bg-[#EAF5FF] z-10">
          <TableRow>
            <TableHead className="w-12 text-center">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
            </TableHead>

            <TableHead className="text-center">Alumni</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Year Graduated</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {alumni?.data?.map((item) => (
            <TableRow
              key={item.id}
              className={`hover:bg-gray-50 h-[64px] ${
                selectedIds.includes(item.id) ? "bg-blue-50" : ""
              }`}
            >
              {/* CHECKBOX */}
              <TableCell className="text-center">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => onToggleOne(item.id)}
                />
              </TableCell>

              {/* NAME + AVATAR */}
              <TableCell className="text-center">
                <div className="relative flex items-center">

                  {/* AVATAR */}
                  <div className="absolute left-0 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                    {getInitials(item.name)}
                  </div>

                  {/* NAME CENTER */}
                  <div className="w-full text-center pl-10">
                    <span className="font-medium">{item.name}</span>
                  </div>

                </div>
              </TableCell>

              {/* COURSE */}
              <TableCell className="text-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${badgeColor(item.course)}`}
                >
                  {item.course}
                </span>
              </TableCell>

              {/* YEAR */}
              <TableCell className="text-center text-gray-600">
                {item.year}
              </TableCell>

              {/* ACTIONS (FIXED TAG ERROR HERE) */}
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border border-[#9ECEFF] text-[#155DFC] hover:bg-blue-50"
                  onClick={() =>
                    router.visit(route("admin.alumni.show", item.id))
                  }
                >
                  View Profile
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() =>
                    onSendEmail({
                      id: item.id,
                      name: item.name,
                      email: item.email,
                    })
                  }
                >
                  Send Email
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY ROWS */}
          {alumni?.data?.length < rowsPerPage &&
            Array.from({
              length: rowsPerPage - (alumni?.data?.length || 0),
            }).map((_, i) => (
              <TableRow key={i} className="h-[64px]">
                <TableCell colSpan={5} />
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">

          {/* PREV */}
          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* NUMBERS */}
          {paginationItems.map((item, i) =>
            item === "..." ? (
              <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition ${
                  currentPage === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            onClick={() =>
              currentPage < lastPage && goToPage(currentPage + 1)
            }
            disabled={currentPage === lastPage}
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}