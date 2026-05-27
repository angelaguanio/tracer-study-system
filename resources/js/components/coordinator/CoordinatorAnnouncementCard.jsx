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
        <div className="flex items-center justify-end w-full relative gap-2 min-h-[40px]" ref={ref}>
    
          <div className="flex items-center justify-end gap-2 w-full pr-2">

            {/* VIEW BUTTON (ALL STATUS) */}
            <button
              onClick={() => router.get(`/coordinator/announcement/${data.id}`)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 transition"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">View</span>
            </button>

            {/* 3 DOTS ONLY IF NOT APPROVED */}
            {!isApproved && (
              <div className="relative">
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
                        router.get(`/admin/announcement/${data.id}/edit`);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-[#008236] w-full"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <CoordinatorAnnouncementDeletePrompt
                      announcementId={data.id}
                      onSuccess={() => {
                        setOpen(false);
                        onDeleteSuccess?.();
                      }}
                    >
                      <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-[#E70813] w-full">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </CoordinatorAnnouncementDeletePrompt>

                  </div>
                )}
              </div>
            )}    
          </div>
        </div>
      );
    }

  const columns = [
    /* DATE */
    {
      accessorKey: "created_at",
      header: () => (
        <div className="text-left w-full pl-6">
          Date
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);

        return (
          <div className="flex flex-col items-start justify-start text-left leading-tight pl-3">
            <div className="text-sm text-gray-800 font-medium">
              {date.toLocaleDateString(undefined,{
                year:"numeric",
                month:"short",
                day:"numeric"
              })}
            </div>

            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit"
              })}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "title",
      header: () => (
        <div className="text-left w-full pl-14">
          Announcement
        </div>
      ),
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-h-[70px]">

              <h2 className="font-semibold text-gray-800 text-sm sm:text-base text-center">
                {data.title}
              </h2>

            </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => (
        <div className="text-center w-full">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
              ${
                status === "approved"
                  ? "bg-green-100 text-green-700"
                  : status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "revise"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="text-right w-full">
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
    <div className="rounded-md border bg-white shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <Table className="w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <TableHeader className="sticky top-0 z-10 bg-sky-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-sky-300">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`p-4 font-bold text-black text-sm sm:text-base bg-sky-300 ${
                      header.id === "actions"
                        ? "text-right pr-18"
                        : header.id === "created_at"
                        ? "text-center"
                        : header.id === "updated_at"
                        ? "text-center"
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
                      className={`p-2 ${cell.column.id === "actions" ? "text-right" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center p-4" colSpan={columns.length}>
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}