import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CoordinatorAnnouncementCard({ announcement }) {
  return (
    <div className="flex items-center justify-between p-6 border-b last:border-none">

      {/* Left Side */}
      <div className="flex items-center gap-6">
        <img
          src={announcement.image}
          alt={announcement.title}
          className="w-24 h-24 object-cover rounded-md"
        />

        <h2 className="font-bold text-lg md:text-xl text-gray-800">
            {announcement.title}
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">

        {/* View */}
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#9ECEFF] text-[#2859C5] bg-transparent hover:bg-[#9ECEFF]/10 transition">
          <Eye size={16} />
          View
        </button>

        {/* Edit */}
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#008236] bg-[#DBFCE7] text-[#008236]  hover:bg-[#008236]/10 transition">
          <Pencil size={16} />
          Edit
        </button>

        {/* Delete */}
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E70813] bg-[#FF9E9E] text-[#E70813]  hover:bg-[#E70813]/10 transition">
          <Trash2 size={16} />
          Delete
        </button>

      </div>

    </div>
  );
}