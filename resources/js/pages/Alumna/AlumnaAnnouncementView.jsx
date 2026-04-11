import React from "react";
import AlumnaLayout from "@/Layouts/alumna-layout";
import { Card, CardContent } from "@/Components/ui/card";

export default function AlumnaAnnouncementView({ announcement }) {
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
        {announcement?.title}
      </h1>

      {/* DATE (dot separator + time) */}
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

      {/* Announcement Image / Banner */}
      <Card className="w-full mb-6">
        <CardContent className="h-64 sm:h-80 md:h-96 bg-gradient-to-b from-sky-200 to-gray-300 flex items-center justify-center">
          {announcement?.image ? (
            <img
              src={announcement.image}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">Image Placeholder</div>
          )}
        </CardContent>
      </Card>

      {/* Announcement Content */}
      <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
        {announcement?.details}
      </div>
    </div>
  );
}

AlumnaAnnouncementView.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);