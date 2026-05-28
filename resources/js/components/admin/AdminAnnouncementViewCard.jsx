"use client";

import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Check, X } from "lucide-react";

export default function AdminAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { id, title, details, image, created_at, status, revision_note } = announcement;

  const isPending = status === "pending";

  const [openModal, setOpenModal] = useState(false);
  const [note, setNote] = useState("");

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

  // OPEN MODAL
  const openReviseModal = () => {
    setOpenModal(true);
  };

  // SUBMIT REVISION
  const submitRevision = () => {
    if (!note.trim()) return;

    router.put(
      `/admin/announcement/${id}/reject`,
      { note },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpenModal(false);
          setNote("");
          router.reload({ preserveScroll: true });
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">

      {/* ================= LEFT SIDE (MAIN CONTENT) ================= */}
      <div className="flex-1 space-y-6">

        {/* TITLE + DATE */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
            {title}
          </h1>

          <p className="text-gray-600">
            {formattedDate}
          </p>

          {/* ACTION BUTTONS */}
          {isPending && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-end">

              <button
                onClick={handleApprove}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-600 text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
              >
                <Check size={16} />
                Approve
              </button>

              <button
                onClick={openReviseModal}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-yellow-600 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition"
              >
                <X size={16} />
                Revise
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
                className="max-w-[250px] max-h-[250px] object-contain rounded-md shadow"
              />
            ))}
          </div>
        ) : typeof image === "string" ? (
          <div className="flex justify-center lg:justify-start w-full">
            <img src={image} className="max-w-[250px] rounded shadow" />
          </div>
        ) : null}

        {/* DESCRIPTION */}
        <div className="text-gray-800 leading-relaxed text-justify text-sm sm:text-base space-y-4">
          {details.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        {/* REVISION NOTE DISPLAY */}
        {status === "revise" && revision_note && (
        <div className="mt-4 rounded-xl border-l-4 border-yellow-400 bg-white p-4 shadow-sm">

          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Revision Note
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {revision_note}
          </p>

        </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-5 rounded-lg shadow-lg">

            <h2 className="text-lg font-semibold mb-3">
              Revision Note
            </h2>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write reason for revision..."
              className="w-full border rounded-md p-3 text-sm h-32 resize-none"
            />

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => {
                  setOpenModal(false);
                  setNote("");
                }}
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={submitRevision}
                className="px-4 py-2 text-sm rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Submit
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}