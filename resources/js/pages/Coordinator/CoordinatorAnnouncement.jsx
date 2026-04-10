import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementCard from "@/components/CoordinatorAnnouncementCard";
import { Plus } from "lucide-react";

import homecomingImg from "@/assets/homecoming.png";
import assemblyImg from "@/assets/general-assembly.png";

import { Link } from "@inertiajs/react";

export default function CoordinatorAnnouncement({ announcements }) {

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Announcements
        </h1>
      </div>

      {/* INFO BANNER */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            📢
          </div>

          <p className="text-gray-600">
            Create, edit, or remove announcements to keep everyone informed.
          </p>
        </div>

        <Link
          href="/coordinator/announcement/create"
          className="flex items-center justify-center gap-2 bg-[#008236] hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          <Plus size={18} />
          Add Announcement
        </Link>

      </div>

      {/* TABLE */}
      <CoordinatorAnnouncementCard announcements={announcements} />

    </div>
  );
}

CoordinatorAnnouncement.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);  