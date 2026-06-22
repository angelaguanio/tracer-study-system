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
    <div className="w-full flex flex-col gap-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

        {/* TITLE + DATE */}
        <div className="text-center lg:text-left w-full lg:w-[80%]">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800 mb-1 break-words">
            {title}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base">
            {formattedDate}
          </p>
        </div>

      </div>

      {/* ================= IMAGE ================= */}
      {Array.isArray(image) && image.length > 0 ? (
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
          {image.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full sm:w-[45%] lg:w-[250px] max-h-[250px] object-contain rounded-md shadow"
            />
          ))}
        </div>
      ) : typeof image === "string" ? (
        <div className="flex justify-center lg:justify-start w-full">
          <img
            src={image}
            className="w-full sm:w-auto max-w-[250px] rounded shadow"
          />
        </div>
      ) : null}

      {/* ================= DESCRIPTION ================= */}
      <div className="text-gray-800 leading-relaxed text-justify text-sm sm:text-base space-y-4">
        {details.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {/* ================= REVISION NOTE ================= */}
      {isRevise && revision_note && (
        <div className="mt-2 rounded-xl border-l-4 border-yellow-400 bg-white p-4 shadow-sm w-full">

          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Revision Note
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {revision_note}
          </p>

        </div>
      )}

    </div>
  );
}