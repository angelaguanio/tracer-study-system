"use client";

import { Eye, Pencil, Trash2, ImageOff, Ellipsis } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CoordinatorAnnouncementDeletePrompt from "./AdminAnnouncementDeletePromptandConfirmation";
import { router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function AdminAnnouncementCard({ announcements, onDeleteSuccess }) {

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

              {/* IMAGE FIX HERE */}
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

              {/* TITLE */}
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                {data.title}
              </h2>

            </div>
          </div>
        );
      },
    },

    /* CREATED ON */
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
    
    /* UPDATED AT */
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

        const isPending = data.status === "pending";

        const [open, setOpen] = useState(false);
        const ref = useRef(null);

        useEffect(() => {
          function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
              setOpen(false);
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
          <div className="flex items-center justify-end w-full relative" ref={ref}>

            {/* VIEW / PREVIEW */}
            <div className="flex items-center">
              <button
                onClick={() => router.get(`/admin/announcement/${data.id}`)}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl border transition
                  ${isPending
                    ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
                    : "border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10"
                  }`}
              >
                <Eye size={16} />
                <span className="hidden sm:inline">
                  {isPending ? "Review" : "View"}
                </span>
              </button>
            </div>

            {/* RIGHT SIDE: MENU */}
            <div className="flex items-center ml-2">

              {!isPending && (
                <>
                  {/* DOTS */}
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                  >
                    <Ellipsis size={18} />
                  </button>

                  {/* DROPDOWN */}
                  {open && (
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-50 py-1 min-w-max">

                      <button
                        onClick={() => {
                          setOpen(false);
                          router.get(`/admin/announcement/${data.id}/edit`);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-[#008236] w-full"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <CoordinatorAnnouncementDeletePrompt
                        announcementId={data.id}
                        onSuccess={() => {
                          setOpen(false);
                          onDeleteSuccess && onDeleteSuccess();
                        }}
                      >
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-[#E70813] w-full"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </CoordinatorAnnouncementDeletePrompt>

                    </div>
                  )}
                </>
              )}

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
                <TableHead
                  key={header.id}
                  className={`p-4 font-bold text-black text-sm sm:text-base ${
                    header.id === "actions"
                      ? "text-right pr-12"
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