import React from "react";
import { X, Check } from "lucide-react";

export default function CoordinatorAnnouncementEditUpdate({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
      <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center h-60">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        {/* GREEN CIRCLE WITH CHECK */}
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <Check size={28} className="text-white stroke-[3]" />
        </div>

        <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
          Updated successfully
        </p>
      </div>
    </div>
  );
}