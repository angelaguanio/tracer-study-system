import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function AdminAlumniCoordinatorTable({ coordinators, onEdit }) {

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-[600px] overflow-hidden">

      {/* TABLE WRAPPER */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">

        <Table className="min-w-[800px] w-full">

          {/* HEADER */}
          <TableHeader className="sticky top-0 bg-[#EAF5FF] z-10">
            <TableRow className="h-[56px]">

              <TableHead className="text-center px-8">
                Name
              </TableHead>

              <TableHead className="text-center px-8">
                Email
              </TableHead>

              <TableHead className="text-center px-8">
                Department
              </TableHead>

              <TableHead className="text-center px-8">
                Actions
              </TableHead>

            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {coordinators?.data?.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 h-[72px]"
              >

                {/* NAME */}
                <TableCell className="text-center font-medium text-gray-800">
                  {item.first_name} {item.last_name}
                </TableCell>

                {/* EMAIL */}
                <TableCell className="text-center text-gray-600">
                  {item.email}
                </TableCell>

                {/* DEPARTMENT */}
                <TableCell className="text-center text-gray-600">
                  {item.department || "N/A"}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-center">

                  <div className="flex justify-center gap-2">

                    {/* VIEW */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-600 flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </Button>

                    {/* EDIT */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-600 flex items-center gap-1"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-600 flex items-center gap-1"
                      onClick={() =>
                        router.delete(`/admin/alumni-coordinators/${item.id}`)
                      }
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>

                  </div>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>

    </div>
  );
}