"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CoordinatorAnnouncementDeletePrompt from "./CoordinatorAnnouncementDeletePromptandConfirmation"; // import delete modal

export default function CoordinatorAnnouncementCard({ announcements }) {

  const columns = [
    {
      accessorKey: "title",
      header: "Announcement",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <img
                src={data.image}
                alt={data.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                {data.title}
              </h2>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">

              {/* VIEW */}
              <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition w-full sm:w-auto">
                <Eye size={16} />
                <span className="hidden sm:inline">View</span>
              </button>

              {/* EDIT */}
              <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#008236] bg-[#DBFCE7] text-[#008236] hover:bg-[#008236]/10 transition w-full sm:w-auto">
                <Pencil size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              {/* DELETE */}
              <CoordinatorAnnouncementDeletePrompt>
                <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#E70813] bg-[#FF9E9E] text-[#E70813] hover:bg-[#E70813]/10 transition w-full sm:w-auto">
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </CoordinatorAnnouncementDeletePrompt>

            </div>

          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: announcements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-sky-300">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="p-4 font-bold text-black text-sm sm:text-base cursor-default select-none">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center p-6">
                No announcements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}