import React from "react";
import AlumnaLayout from "@/Layouts/alumna-layout";
import { Card, CardContent } from "@/Components/ui/card";

export default function AlumnaAnnouncementView() {
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
        CECT ALUMNI HOMECOMING 2025
      </h1>
      <p className="text-gray-600 mb-6">February 20, 2025 • 8:11 PM</p>

      {/* Announcement Image / Banner */}
      <Card className="w-full mb-6">
        <CardContent className="h-64 sm:h-80 md:h-96 bg-gradient-to-b from-sky-200 to-gray-300 flex items-center justify-center">
          <div className="text-gray-400">Image Placeholder</div>
        </CardContent>
      </Card>

      {/* Announcement Content */}
      <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
        The College of Engineering and Computer Technology (CECT) of Wesleyan
        University-Philippines is pleased to announce the upcoming CECT Alumni
        Homecoming 2025, which will be held on March 15, 2025 (Saturday), at
        6:00 PM at the Wesleyan University-Philippines Gymnasium, Cabanatuan
        City.
      </div>
    </div>
  );
}

AlumnaAnnouncementView.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;