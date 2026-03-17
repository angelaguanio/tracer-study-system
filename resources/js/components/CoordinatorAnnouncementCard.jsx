import { Eye, Pencil, Trash2 } from "lucide-react";
import CoordinatorAnnouncementDeletePrompt from "@/components/CoordinatorAnnouncementDeletePrompt";

export default function CoordinatorAnnouncementCard({ announcement }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 sm:p-6 border-b last:border-none">

      {/* Left Side */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

        <img
          src={announcement.image}
          alt={announcement.title}
          className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md"
        />

        <h2 className="font-bold text-base sm:text-lg md:text-xl text-gray-800">
          {announcement.title}
        </h2>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">

        {/* View */}
        <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10 w-full sm:w-auto">
          <Eye size={16} />
          <span className="hidden sm:inline">View</span>
        </button>

        {/* Edit */}
        <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#008236] bg-[#DBFCE7] text-[#008236] hover:bg-[#008236]/10 w-full sm:w-auto">
          <Pencil size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>

        {/* ✅ DELETE BUTTON WITH MODAL */}
        <CoordinatorAnnouncementDeletePrompt onConfirm={() => handleDelete(announcement.id)}>
<button className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#E70813] bg-[#FF9E9E] text-[#E70813] hover:bg-[#E70813]/10 w-full sm:w-auto">
    <Trash2 size={16} />
    <span className="hidden sm:inline">Delete</span>
  </button>
</CoordinatorAnnouncementDeletePrompt>

      </div>

    </div>
  );
}