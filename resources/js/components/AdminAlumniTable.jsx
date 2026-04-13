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

export default function CoordinatorAlumniTable({ alumni }) {
  const badgeColor = (course) => {
    if (course === "BSIT") return "bg-blue-100 text-blue-600";
    if (course === "BSCpE") return "bg-yellow-100 text-yellow-600";
    if (course === "BSECE") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-[500px] overflow-hidden">

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">

        <Table className="min-w-[700px] w-full">

          {/* HEADER */}
          <TableHeader className="sticky top-0 bg-[#EAF5FF] z-10">
            <TableRow>
              <TableHead className="text-center px-6">Alumni</TableHead>
              <TableHead className="text-center px-6">Course</TableHead>
              <TableHead className="text-center px-6">Year Graduated</TableHead>
              <TableHead className="text-center px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {alumni?.data?.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 h-[64px]"
              >

                {/* ✅ ALUMNI FIXED */}
                <TableCell className="px-6">
                  <div className="flex items-center w-full relative">

                    {/* AVATAR (LEFT) */}
                    <div className="absolute left-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
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

                    {/* NAME (CENTERED) */}
                    <div className="w-full text-center">
                      <span className="font-medium text-gray-800 leading-tight">
                        {item.name}
                      </span>
                    </div>

                  </div>
                </TableCell>

                {/* COURSE */}
                <TableCell className="px-6 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${badgeColor(
                      item.course
                    )}`}
                  >
                    {item.course}
                  </span>
                </TableCell>

                {/* YEAR */}
                <TableCell className="px-6 text-center text-gray-600">
                  {item.year}
                </TableCell>

                {/* ACTION */}
                <TableCell className="px-6 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[1px] border-[#9ECEFF] bg-white text-[#155DFC] hover:bg-[#F0F8FF]"
                    onClick={() => router.visit(`/alumni/${item.id}`)}
                  >
                    View Profile
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 p-4 border-t bg-white">
        {alumni?.links?.map((link, i) => (
          <Button
            key={i}
            size="sm"
            variant={link.active ? "default" : "outline"}
            disabled={!link.url}
            onClick={() => link.url && router.visit(link.url)}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>

    </div>
  );
}