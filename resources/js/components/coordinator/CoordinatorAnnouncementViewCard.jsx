import React from "react";
import { router } from "@inertiajs/react";
import { Pencil, RefreshCw } from "lucide-react";

export default function CoordinatorAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { id, title, details, image, created_at, status, revision_note } = announcement;

  const isPending = status === "pending";
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
    <div className="w-full space-y-6">

      {/* HEADER */}
      <div className="w-full flex items-center justify-between gap-3">

        {/* TITLE + DATE (LEFT) */}
        <div className="flex flex-col w-[80%]">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            {title}
          </h1>

          <p className="text-gray-600 text-sm">
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
                className="max-w-[250px] max-h-60 object-contain rounded-md shadow"
              />
            ))}
          </div>
        ) : typeof image === "string" ? (
          <div className="flex justify-center w-full">
            <img src={image} className="max-w-[250px] rounded shadow" />
          </div>
        ) : null}

      {/* DESCRIPTION (FULL WIDTH) */}
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
  );
}