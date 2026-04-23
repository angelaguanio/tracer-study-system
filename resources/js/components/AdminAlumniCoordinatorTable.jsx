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
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminAlumniCoordinatorTable({
  data,
  meta,
  setEditing,
  setShowForm,
  setDeleteTarget,
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
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
  };

  const paginationItems = getPaginationItems();

  //  REMOVED BORDER HERE
  const paginationBtnClass =
    "w-9 h-9 flex items-center justify-center text-sm rounded-md shadow-sm transition-all";

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-full overflow-hidden">

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader className="sticky top-0 bg-[#70CAFF] hover:bg-transparent z-10">
            <TableRow className="h-[56px]">
              <TableHead className="text-center font-semibold px-8">Alumni Coordinator</TableHead>
              <TableHead className="text-center font-semibold">Email</TableHead>
              <TableHead className="text-center font-semibold">Department</TableHead>
              <TableHead className="text-center font-semibold">Course</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((c) => (
              <TableRow key={c.id} className="h-[70px] hover:bg-gray-50">
                <TableCell className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pl-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                      {getInitials(c.first_name, c.last_name)}
                    </div>
                  </div>
                  <div className="w-full text-center">
                    <span className="font-medium text-gray-800">
                      {c.first_name} {c.last_name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center text-gray-600">{c.email}</TableCell>
                <TableCell className="text-center text-gray-700">{c.department}</TableCell>
                <TableCell className="text-center text-gray-700">{c.courses}</TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-600 flex items-center gap-1"
                      onClick={() => router.visit(`/admin/alumni-coordinators/${c.id}`)}
                    >
                      <Eye size={14} /> View
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
                      <Pencil size={14} /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-600 flex items-center gap-1"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION (NO BORDER NOW) */}
      <div className="p-4 flex justify-end bg-white">
        <div className="flex gap-2 items-center">

          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className={`${paginationBtnClass} ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* NUMBERS */}
          {paginationItems.map((item, index) =>
            item === "..." ? (
              <div key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </div>
            ) : (
              <button
                key={item}
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
              currentPage === lastPage
                ? "opacity-40 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}