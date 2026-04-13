import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementCard from "@/components/CoordinatorAnnouncementCard";
import { Plus, X, Check } from "lucide-react"; 
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CoordinatorAnnouncement({ announcements }) {
  const [showSuccess, setShowSuccess] = useState(false);

  // auto-hide modal after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Announcements</h1>
      </div>

      {/* INFO BANNER */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">📢</div>
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
      <CoordinatorAnnouncementCard
        announcements={announcements}
        onDeleteSuccess={() => setShowSuccess(true)} 
      />

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
          <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center h-60">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            {/* GREEN CIRCLE WITH CHECK */}
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={28} className="text-white stroke-[3]" />
            </div>
            <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
              Deleted successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

CoordinatorAnnouncement.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);