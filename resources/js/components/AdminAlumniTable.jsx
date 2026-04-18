import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { router } from "@inertiajs/react";

export default function AdminAlumniTable({ alumni }) {
  const badgeColor = (course) => {
    if (course === "BSIT") return "bg-blue-100 text-blue-600";
    if (course === "BSCpE") return "bg-yellow-100 text-yellow-600";
    if (course === "BSECE") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-[500px] overflow-hidden">

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <Table className="min-w-[700px] w-full">

          <TableHeader className="sticky top-0 bg-[#EAF5FF] z-10">
            <TableRow>
              <TableHead className="text-center px-6">Alumni</TableHead>
              <TableHead className="text-center px-6">Course</TableHead>
              <TableHead className="text-center px-6">Year Graduated</TableHead>
              <TableHead className="text-center px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {alumni?.data?.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 h-[64px]">

                <TableCell className="px-6">
                  <div className="flex items-center w-full relative">

                    <div className="absolute left-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold text-sm">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="w-full text-center">
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <span className={`px-3 py-1 text-xs rounded-full ${badgeColor(item.course)}`}>
                    {item.course}
                  </span>
                </TableCell>

                <TableCell className="text-center text-gray-600">
                  {item.year}
                </TableCell>

                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border border-[#9ECEFF] text-[#155DFC]"
                    onClick={() => router.visit(route('admin.alumni.show', item.id))}
                  >
                    View Profile
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => router.visit(route('admin.alumni.email.form', item.id))}
                  >
                    Send Email
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* CLEAN PAGINATION (NO BORDER) */}
      <div className="p-3 flex justify-end pr-4 bg-white">
        <div className="flex flex-wrap gap-1">
          {alumni?.links?.map((link, index) => (
            <button
              key={index}
              dangerouslySetInnerHTML={{ __html: link.label }}
              disabled={!link.url}
              onClick={() =>
                link.url &&
                router.visit(link.url, {
                  preserveState: true,
                  preserveScroll: true,
                })
              }
              className={`px-3 py-1 text-sm rounded-md transition ${
                link.active
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              } ${!link.url && "opacity-50 cursor-not-allowed"}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}