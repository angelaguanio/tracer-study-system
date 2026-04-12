import React from "react";
import AlumnaLayout from "@/layouts/alumna-layout";

export default function AlumnaAnnouncementView({ announcement }) {
  return (
    <div className="min-h-screen w-full">

      <div className="px-4 sm:px-6 md:px-10 py-6 max-w-4xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
          {announcement?.title}
        </h1>

        {/* DATE */}
        <p className="text-gray-600 mb-6">
          {announcement?.created_at
            ? `${new Date(announcement.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • ${new Date(
                announcement.created_at
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
        </p>

        {/* IMAGE (ONLY IF AVAILABLE) */}
        {announcement?.image && (
          <div className="w-full mb-6 overflow-hidden rounded-xl border">
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
          {announcement?.details}
        </div>

      </div>
    </div>
  );
}

AlumnaAnnouncementView.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);