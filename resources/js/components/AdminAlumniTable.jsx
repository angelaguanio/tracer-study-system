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

  const getPaginationItems = () => {
    if (lastPage <= 4) return Array.from({ length: lastPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", lastPage];
    if (currentPage >= lastPage - 2) return [1, "...", lastPage - 2, lastPage - 1, lastPage];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const badgeColor = (course) => {
    if (course === "BSIT")  return "bg-blue-100 text-blue-600";
    if (course === "BSCpE") return "bg-yellow-100 text-yellow-600";
    if (course === "BSECE") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-[500px] overflow-hidden">

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto">
        <Table className="min-w-[750px] w-full">

          <TableHeader className="sticky top-0 bg-[#EAF5FF] z-10">
            <TableRow>
              {/* SELECT ALL */}
              <TableHead className="w-12 text-center px-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Select all on this page"
                />
              </TableHead>
              <TableHead className="text-center px-6">Alumni</TableHead>
              <TableHead className="text-center px-6">Course</TableHead>
              <TableHead className="text-center px-6">Year Graduated</TableHead>
              <TableHead className="text-center px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {alumni?.data?.map((item) => (
              <TableRow
                key={item.id}
                className={`hover:bg-gray-50 h-[64px] transition-colors ${
                  selectedIds.includes(item.id) ? "bg-blue-50" : ""
                }`}
              >
                {/* ROW CHECKBOX */}
                <TableCell className="text-center px-4">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => onToggleOne(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>

                {/* ALUMNI NAME */}
                <TableCell className="px-6">
                  <div className="flex items-center w-full relative">
                    <div className="absolute left-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={item.name}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold text-sm">
                          {item.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="w-full text-center">
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
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
                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border border-[#9ECEFF] text-[#155DFC]"
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
                </TableCell>

              </TableRow>
            ))}

            {/* EMPTY ROWS — keeps table height stable */}
            {alumni?.data?.length < rowsPerPage &&
              Array.from({ length: rowsPerPage - alumni.data.length }).map((_, i) => (
                <TableRow key={`empty-${i}`} className="h-[64px]">
                  <TableCell colSpan={5} />
                </TableRow>
              ))}

          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="p-3 flex justify-end pr-4 bg-white">
        <div className="flex flex-wrap gap-1 items-center">

          <button
            disabled={currentPage === 1}
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            className={`px-3 py-1 text-sm border shadow-sm rounded-md transition ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-5" />
          </button>

          {getPaginationItems().map((item, index) =>
            item === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-500">...</span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`px-3 py-1 text-sm border rounded-md shadow-sm transition ${
                  currentPage === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            disabled={currentPage === lastPage}
            onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
            className={`px-3 py-1 text-sm border rounded-md shadow-sm transition ${
              currentPage === lastPage ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-4 h-5" />
          </button>

        </div>
      </div>

    </div>
  );
}
