"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { router } from "@inertiajs/react";

const statusStyle = {
  approved: "bg-green-100 text-green-700 border border-green-200",
  pending:  "bg-yellow-100 text-yellow-700 border border-yellow-200",
  revise:   "bg-red-100 text-red-700 border border-red-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

export default function AdminFeaturedAlumniCard({ featuredAlumni, onDeleteSuccess }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
              {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Featured Alumni",
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
        const statusKey = status?.toLowerCase();
        const displayStatus = (statusKey === 'rejected' || statusKey === 'revise') ? 'revise' : status;
        return (
          <span className={`inline-block px-4 py-2 rounded-full text-xs font-medium capitalize ${statusStyle[statusKey] ?? 'bg-gray-100 text-gray-600'}`}>
            {displayStatus}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="pl-4">Action</span>,
      cell: ({ row }) => (
        <button
          onClick={() => router.get(`/${import.meta.env.VITE_ADMIN_PORTAL_PREFIX}/featured-alumni/${row.original.id}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border cursor-pointer border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition text-sm"
        >
          <Eye size={15} />
          View
        </button>
      ),
    },
  ];

  const table = useReactTable({ data: featuredAlumni, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div
      className={
        isMobile
          ? "h-full"
          : "rounded-md border bg-white shadow-sm h-full flex flex-col overflow-hidden"
      }
    >
      {/* DESKTOP TABLE */}
      {!isMobile && (
        <Table className="w-full" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "50%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>

        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-[#009AFB] hover:bg-[#009AFB] border-b border-[#009AFB]">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="py-4 px-4 text-left text-sm font-semibold text-white bg-[#009AFB]"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
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
              <TableCell colSpan={columns.length} className="h-64 text-center text-gray-400 text-sm">
                No featuredAlumni found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )}

      {/* MOBILE CARDS */}
      {isMobile && (
        <div className="p-3 space-y-3">
          {featuredAlumni.length ? (
            featuredAlumni.map((item) => {
              const d = new Date(item.created_at);

              return (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
                >
                  {/* Date */}
                  <div className="flex flex-col leading-tight">
                    <span className="text-[15px] font-medium text-gray-800">
                      {d.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-sm text-gray-400">
                      {d.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-[15px] font-medium text-gray-800">
                    {item.title}
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusStyle[item.status?.toLowerCase()] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {(item.status?.toLowerCase() === 'rejected' || item.status?.toLowerCase() === 'revise') ? 'revise' : item.status}
                    </span>

                    <button
                      onClick={() =>
                        router.get(`/${import.meta.env.VITE_ADMIN_PORTAL_PREFIX}/featured-alumni/${item.id}`)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition text-sm"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex items-center justify-center text-center text-gray-400 text-sm">
              No featuredAlumni found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}