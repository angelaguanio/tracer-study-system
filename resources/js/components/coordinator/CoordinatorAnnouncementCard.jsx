"use client";

import { Eye, Pencil, Trash2, ImageOff, Ellipsis } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CoordinatorAnnouncementDeletePrompt from "./CoordinatorAnnouncementDeletePromptandConfirmation";
import { router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function CoordinatorAnnouncementCard({ announcements, onDeleteSuccess }) {

  const tableData = Array.isArray(announcements)
    ? announcements
    : announcements?.data ?? [];

  const baseUrl = "/coordinator/announcement";

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

  const ActionCell = ({ data }) => {
    const isPending = data.status === "pending";
    const isApproved = data.status === "approved";
    const isRejected = data.status === "rejected";
    const isAdmin = data.user_role === "admin";

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="flex items-center justify-end w-full relative" ref={ref}>

        <button
          onClick={() => handleView(data.id)}
          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl border transition
            ${isPending
              ? "border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10"
              : isApproved
                ? "border-green-400 text-green-600 hover:bg-green-100"
                : "border-red-400 text-red-600 hover:bg-red-100"
            }`}
        >
          <Eye size={16} />
          <span className="hidden sm:inline">
            {isPending ? "View" : "Preview"}
          </span>
        </button>

        {isPending && !isAdmin && (
          <div className="ml-2 relative">

            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <Ellipsis size={18} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-50 py-1 min-w-max">

                <button
                  onClick={() => {
                    setOpen(false);
                    handleEdit(data.id);
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
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-[#E70813] w-full">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </CoordinatorAnnouncementDeletePrompt>

              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      accessorKey: "title",
      header: () => (
        <div className="text-left w-full">
          Announcement
        </div>
      ),
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
      header: () => (
        <div className="text-center w-full">
          Created On
        </div>
      ),
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
      header: () => (
        <div className="text-center w-full">
          Updated At
        </div>
      ),
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
      header: () => (
        <div className="text-right pr-12 w-full">
          Actions
        </div>
      ),
      cell: ({ row }) => <ActionCell data={row.original} />,
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
                  className="p-4 font-bold text-black text-sm sm:text-base"
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
                  <TableCell key={cell.id} className="p-4">
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