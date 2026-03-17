import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementCard from "@/components/CoordinatorAnnouncementCard";
import { Plus } from "lucide-react";

import homecomingImg from "@/assets/homecoming.png";
import assemblyImg from "@/assets/general-assembly.png";

export default function CoordinatorAnnouncement() {

  const announcements = [
    {
      id: 1,
      title: "CECT ALUMNI HOMECOMING 2025",
      image: homecomingImg,
    },
    {
      id: 2,
      title: "CECT ALUMNI GENERAL ASSEMBLY",
      image: assemblyImg,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="hidden">Announcement</h1>
      </div>

      {/* Info Banner */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left side */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full shrink-0">
            <span className="text-blue-600 text-xl">📢</span>
          </div>

          <p className="text-gray-600 text-sm sm:text-base">
            Create, edit, or remove announcements to keep everyone informed.
          </p>
        </div>

        {/* Button */}
        <button className="flex items-center justify-center gap-2 bg-[#008236] hover:bg-green-700 text-white px-4 py-2 rounded-md transition w-full sm:w-auto">
          <Plus size={18} />
          Add Announcement
        </button>

      </div>

      {/* Table Wrapper */}
      <div className="overflow-hidden rounded-md shadow-sm">

        {/* Table Header */}
        <div className="bg-sky-300 text-black font-semibold grid grid-cols-1 sm:grid-cols-2 p-4 gap-2">
          <span className="text-base sm:text-xl font-bold">
            Announcement
          </span>

          <span className="text-base sm:text-xl sm:text-right">
            Actions
          </span>
        </div>

        {/* Announcement List */}
        <div className="bg-white divide-y">
          {announcements.map((announcement) => (
            <CoordinatorAnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>

      </div>

    </div>
  );
}

CoordinatorAnnouncement.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);