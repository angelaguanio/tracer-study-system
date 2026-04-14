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
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[600px]">
          
          {/* HEADER */}
          <TableHeader>
            <TableRow className="bg-[#EAF5FF]">
              <TableHead className="text-center">Alumni</TableHead>
              <TableHead className="text-center">Course</TableHead>
              <TableHead className="text-center">Year Graduated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {alumni?.data?.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                
                {/* ✅ ALUMNI COLUMN (CENTERED OUTSIDE, LEFT INSIDE) */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    
                    <div className="flex items-center gap-3 w-[220px]">
                      
                      {/* Avatar */}
                      <img
                        src={item.avatar ? item.avatar : "/default-avatar.png"}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />

                      {/* Name */}
                      <span className="font-medium text-gray-800 truncate">
                        {item.name}
                      </span>

                    </div>

                  </div>
                </TableCell>

                {/* COURSE */}
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${badgeColor(item.course)}`}
                  >
                    {item.course}
                  </span>
                </TableCell>

                {/* YEAR */}
                <TableCell className="text-center text-gray-600">
                  {item.year}
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-center">
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
      <div className="flex justify-end gap-2 p-4">
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