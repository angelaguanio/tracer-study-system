import React from "react";

export default function CoordinatorAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { title, details, image, created_at } = announcement;

  // Format date nicely
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

      {/* LEFT SIDE: TITLE + DATE ABOVE IMAGE */}
      <div className="flex flex-col items-center md:items-start space-y-4">

        {/* TITLE + DATE */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
            {title}
          </h1>
          <p className="text-gray-600">
            {formattedDate}
          </p>
        </div>

        {/* IMAGE */}
        {image && (
          <div className="flex justify-center w-full">
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-100 w-auto h-auto object-contain rounded-md shadow"            />
          </div>
        )}

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