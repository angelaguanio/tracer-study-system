import React from "react";
import { Calendar } from "lucide-react";

export default function CoordinatorFeaturedAlumniViewCard({ featuredAlumni }) {
  if (!featuredAlumni) return null;

  const { title, details, image, created_at, status, revision_note } = featuredAlumni;
  const isRevise = status?.toLowerCase() === "revise" || status?.toLowerCase() === "rejected" || Boolean(revision_note);

  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="w-full space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] break-words leading-tight tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Calendar size={16} className="text-slate-400" />
          <p>{formattedDate}</p>
        </div>
      </div>

      {Array.isArray(image) && image.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 w-full my-6">
          {image.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={title}
              className="max-h-[500px] w-auto max-w-full object-contain rounded-2xl shadow-md border"
            />
          ))}
        </div>
      ) : typeof image === "string" && image ? (
        <div className="flex justify-center w-full my-6">
          <img
            src={image}
            alt={title}
            className="max-h-[500px] w-auto max-w-full object-contain rounded-2xl shadow-md border"
          />
        </div>
      ) : null}

      <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
        {details?.includes("<") ? (
          <div dangerouslySetInnerHTML={{ __html: details }} className="prose max-w-none text-slate-700" />
        ) : (
          details?.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))
        )}
      </div>

      {isRevise && revision_note && (
        <div className="mt-4 rounded-xl border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow-sm w-full">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Revision Note
          </h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            {revision_note}
          </p>
        </div>
      )}
    </div>
  );
}
