import { X, Check } from "lucide-react";

export default function CoordinatorAnnouncementDeleteConfirmation({ onClose }) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Check Icon */}
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <Check size={28} className="text-white stroke-[3]" />
        </div>

        {/* Text */}
        <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
          Deleted successfully
        </p>

      </div>
    </div>
  );
}