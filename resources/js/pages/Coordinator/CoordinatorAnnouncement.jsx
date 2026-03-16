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
    <div className="min-h-screen w-full bg-[#f0faff] p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="hidden">Announcement</h1>
      </div>

      {/* Info Banner */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">

        {/* Left side: icon + text */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-blue-600 text-xl">📢</span>
          </div>

          <p className="text-gray-600">
            Create, edit, or remove announcements to keep everyone informed.
          </p>
        </div>

        {/* Right side: Add Announcement button */}
        <button className="flex items-center gap-2 bg-[#008236] hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
          <Plus size={18} />
          Add Announcement
        </button>

      </div>

      {/* Table Header + Announcement List Wrapper */}
      <div className="overflow-hidden rounded-md shadow-sm">

        {/* Table Header */}
        <div className="bg-sky-300 text-black font-semibold grid grid-cols-2 p-4">
          <span className="text-xl ml-10 font-bold">Announcement</span>
          <span className=" text-xl ml-160 pr-4">Actions</span>
        </div>

        {/* Announcement List */}
        <div className="bg-white">
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