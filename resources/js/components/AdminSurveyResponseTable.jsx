import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function AdminSurveyResponseTable({
  responses,
  page,
  setPage,
  onDelete,
}) {
  const handleView = (res) => {
    router.visit(`/admin/survey-response/${res.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      {/* TABLE */}
      <div className="h-[500px] overflow-y-auto">

        <Table className="w-full">

          {/* HEADER */}
          <TableHeader className="bg-[#70CAFF] sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-center py-4">Alumni</TableHead>
              <TableHead className="text-center py-4">Status</TableHead>
              <TableHead className="text-center py-4">Course</TableHead>
              <TableHead className="text-center py-4">Year</TableHead>
              <TableHead className="text-center py-4">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>

            {responses?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  No survey responses found.
                </TableCell>
              </TableRow>
            )}

            {responses?.data?.map((res) => (
              <TableRow key={res.id} className="h-[60px] hover:bg-gray-50">

                {/* ALUMNI */}
                <TableCell className="relative text-center px-6">

                  <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    {res.avatar ? (
                      <img
                        src={res.avatar}
                        alt={res.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold text-sm">
                        {res.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <span className="font-medium text-gray-800">
                    {res.name}
                  </span>

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
                  {res.course}
                </TableCell>

                {/* YEAR */}
                <TableCell className="text-center">
                  {res.year}
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">

                    {/* VIEW BUTTON */}
                    <Button
                      size="sm"
                      onClick={() => handleView(res)}
                      className="flex items-center gap-1 bg-transparent border border-[#9ECEFF] text-[#155DFC] hover:bg-[#eef5ff] px-3 py-1.5 text-xs"
                    >
                      <Eye size={16} className="text-[#155DFC]" />
                      View
                    </Button>

                    {/* DELETE BUTTON */}
                    <Button
                      size="sm"
                      onClick={() => onDelete(res)}
                      className="flex items-center gap-1 bg-[#FF9E9E] border border-[#FF9E9E] text-[#E70813] hover:bg-red-200 px-3 py-1.5 text-xs"
                    >
                      <Trash2 size={16} className="text-[#E70813]" />
                      Delete
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end px-3 py-2 bg-white">

        <div className="flex gap-1">

          {responses?.links?.map((link, i) => (
            <button
              key={i}
              disabled={!link.url}
              onClick={() => {
                if (!link.url) return;

                const url = new URL(link.url);
                const newPage = url.searchParams.get("page");

                setPage(Number(newPage));
              }}
              className={`px-3 py-1 text-sm rounded-md transition ${
                link.active
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}

        </div>

      </div>

    </div>
  );
}