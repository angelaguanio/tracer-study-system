import React from "react";

export default function CoordinatorAnnouncementViewCard({ announcement }) {
  if (!announcement) return null;

  const { title, details, image, created_at, status, revision_note } = announcement;

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

      {/* REVISION NOTE DISPLAY */}
          {status === "revise" && revision_note && (
            <div className="text-xs text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md mt-2 w-fit">
              Reason: {revision_note}
            </div>
          )}

    </div>
  );
}