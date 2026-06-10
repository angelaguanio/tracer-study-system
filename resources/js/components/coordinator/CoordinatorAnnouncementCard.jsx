"use client";

import { Eye } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { router } from "@inertiajs/react";

const statusStyle = {
  approved: "bg-green-100 text-green-700 border border-green-200",
  pending:  "bg-yellow-100 text-yellow-700 border border-yellow-200",
  revise:   "bg-red-100 text-red-700 border border-red-200",
};

export default function CoordinatorAnnouncementCard({ announcements, onDeleteSuccess }) {

  const tableData = Array.isArray(announcements) ? announcements : announcements?.data ?? [];

  const columns = [
    {
      accessorKey: "created_at",
      header: () => <span className="pl-4">Date</span>,
      cell: ({ row }) => {
        const d = new Date(row.original.created_at);
        return (
          <div className="flex flex-col leading-tight pl-4">
            <span className="text-[15px] font-medium text-gray-800">
              {d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm text-gray-400">
              {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Announcement",
      cell: ({ row }) => (
        <span className="text-[15px] font-medium text-gray-800 truncate block max-w-full">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: () => <span className="pl-4">Status</span>,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`inline-block px-4 py-2 rounded-full text-xs font-medium capitalize ${statusStyle[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="pl-4">Action</span>,
      cell: ({ row }) => (
        <button
          onClick={() => router.get(`/coordinator/announcement/${row.original.id}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border cursor-pointer border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition text-sm"
        >
          <Eye size={15} />
          View
        </button>
      ),
    },
  ];

  const table = useReactTable({ data: tableData, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="rounded-md border bg-white shadow-sm h-full flex flex-col">
      <Table className="w-full" style={{ tableLayout: 'fixed' }}>
        <colgroup>
            <col style={{ width: '20%' }} />   {/* Date */}
            <col style={{ width: '50%' }} />   {/* Announcement - gets most space */}
            <col style={{ width: '16%' }} />   {/* Status */}
            <col style={{ width: '14%' }} />   {/* Action */}
        </colgroup>

        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-sky-300 hover:bg-sky-300 border-b border-sky-400">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="py-4 px-4 text-left text-sm font-semibold text-gray-700 bg-sky-300"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {tableData.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 px-4 align-middle text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-gray-400 text-sm">
                No announcements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
