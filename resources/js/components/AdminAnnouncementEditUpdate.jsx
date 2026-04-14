import React from "react";

export default function AdminAnnouncementEditUpdate({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">

      <div className="bg-white w-full max-w-sm sm:max-w-md min-h-[220px] sm:min-h-[250px] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-lg">

        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl sm:text-3xl mb-4">
          ✓
        </div>

        <p className="text-gray-700 font-semibold text-base sm:text-lg">
          Updated successfully
        </p>

      </div>

    </div>
  );
}