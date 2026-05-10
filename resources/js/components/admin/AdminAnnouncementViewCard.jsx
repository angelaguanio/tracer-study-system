"use client";

import React from "react";
import { router } from "@inertiajs/react";
import { Pencil, Check, X } from "lucide-react";

export default function AdminAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { id, title, details, image, created_at, status } = announcement;

  const isPending = status === "pending";

  // FORMAT DATE
  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // APPROVE FUNCTION
  const handleApprove = () => {
    router.put(`/admin/announcement/${id}/approve`, {}, {
      preserveScroll: true,
      onSuccess: () => router.reload({ preserveScroll: true }),
    });
  };

  // REJECT FUNCTION
  const handleReject = () => {
    router.put(`/admin/announcement/${id}/reject`, {}, {
      preserveScroll: true,
      onSuccess: () => router.reload({ preserveScroll: true }),
    });
  };

  // EDIT FUNCTION
  const handleEdit = () => {
    router.get(`/admin/announcement/${id}/edit`);
  };

  return (
    <div className="w-full space-y-6">

      {/* ================= TITLE + DATE ================= */}
      <div className="flex flex-col items-center md:items-start space-y-3 w-full">

        <div className="text-center md:text-left w-full">

          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
            {title}
          </h1>

          {/* DATE */}
          <p className="text-gray-600">
            {formattedDate}
          </p>

          {/* ================= ACTION BUTTONS ================= */}
          {isPending && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-end">

              {/* EDIT */}
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-green-600 text-green-700 bg-green-100 hover:bg-green-200 transition"
              >
                <Pencil size={16} />
                Edit
              </button>

              {/* APPROVE */}
              <button
                onClick={handleApprove}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-600 text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
              >
                <Check size={16} />
                Approve
              </button>

              {/* REJECT */}
              <button
                onClick={handleReject}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-red-600 text-red-700 bg-red-100 hover:bg-red-200 transition"
              >
                <X size={16} />
                Reject
              </button>

            </div>
          )}

        </div>

        {/* IMAGE */}
        {Array.isArray(image) && image.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {image.map((img, index) => (
              <img
                key={index}
                src={img}
                className="max-w-[250px] max-h-60 object-contain rounded-md shadow"
              />
            ))}
          </div>
        ) : typeof image === "string" ? (
          <div className="flex justify-center w-full">
            <img src={image} className="max-w-[250px] rounded shadow" />
          </div>
        ) : null}

      </div>

      {/* DESCRIPTION (FULL WIDTH) */}
      <div className="text-gray-800 leading-relaxed text-justify text-sm sm:text-base space-y-4">
        {details.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

    </div>
  );
}