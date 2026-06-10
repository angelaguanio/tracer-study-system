"use client";

import React from "react";

export default function AdminAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { id, title, details, image, created_at, status, revision_note } = announcement;

  const isRevise = status === "revise";

  // FORMAT DATE
  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">

      {/* ================= LEFT SIDE (MAIN CONTENT) ================= */}
      <div className="flex-1 space-y-6">

        {/* TITLE + DATE + ACTIONS (HEADER ROW) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">

          {/* LEFT: TITLE + DATE */}
          <div className="text-center lg:text-left w-[80%]">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
              {title}
            </h1>

            <p className="text-gray-600">
              {formattedDate}
            </p>
          </div>

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
        {isRevise && revision_note && (
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

    </div>
  );
}