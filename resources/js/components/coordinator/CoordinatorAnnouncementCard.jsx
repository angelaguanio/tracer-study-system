"use client";

import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CoordinatorAnnouncementDeletePrompt from "./CoordinatorAnnouncementDeletePromptandConfirmation";
import { router } from "@inertiajs/react";

export default function CoordinatorAnnouncementCard({ announcements, onDeleteSuccess }) {

  const tableData = Array.isArray(announcements)
    ? announcements
    : announcements?.data ?? [];

  // BASE ROUTE (KEEP CONSISTENT)
  const baseUrl = "/coordinator/announcement";

  // FIXED NAVIGATION ONLY
  const handleView = (id) => {
    router.get(`${baseUrl}/${id}`, {}, {
      preserveState: false,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleEdit = (id) => {
    router.get(`${baseUrl}/${id}/edit`, {}, {
      preserveState: false,
      preserveScroll: true,
      replace: true,
    });
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Announcement",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 flex-shrink-0 rounded-md flex items-center justify-center overflow-hidden">

                {data.image ? (
                  <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#2859C5]">
                    <ImageOff size={40} />
                  </div>
                )}

              </div>

              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                {data.title}
              </h2>

            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: "Created On",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);

        return (
          <div className="flex flex-col items-center justify-center text-center leading-tight">
            <div className="text-sm text-gray-800 font-medium">
              {date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.original.updated_at);

        return (
          <div className="flex flex-col items-center justify-center text-center leading-tight">
            <div className="text-sm text-gray-800 font-medium">
              {date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original;

        const isApproved = data.status === "approved";
        const isRejected = data.status === "rejected";
        const isAdmin = data.user_role === "admin";

        return (
          <div className="flex gap-2 flex-wrap sm:flex-nowrap justify-end items-center w-full">

            {/* VIEW ALWAYS */}
            <button
              onClick={() => handleView(data.id)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition w-full sm:w-auto"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">View</span>
            </button>

            {/* EDIT + DELETE RULES */}
            {(!isApproved && !isRejected && !isAdmin) && (
              <>
                <button
                  onClick={() => handleEdit(data.id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#008236] bg-[#DBFCE7] text-[#008236] hover:bg-[#008236]/10 transition w-full sm:w-auto"
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <CoordinatorAnnouncementDeletePrompt
                  announcementId={data.id}
                  onSuccess={onDeleteSuccess}
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E70813] bg-[#FF9E9E] text-[#E70813] hover:bg-[#E70813]/10 w-full sm:w-auto"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </CoordinatorAnnouncementDeletePrompt>
              </>
            )}

          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
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
                <TableHead
                  key={header.id}
                  className={`p-4 font-bold text-black text-sm sm:text-base ${
                    header.id === "actions"
                      ? "text-right pr-30"
                      : header.id === "created_at"
                      ? "text-center px-20"
                      : header.id === "updated_at"
                      ? "text-center px-20"
                      : ""
                  }`}
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`p-4 ${cell.column.id === "actions" ? "text-right" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center p-6" colSpan={columns.length}>
                No announcements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    </div>
  );
}