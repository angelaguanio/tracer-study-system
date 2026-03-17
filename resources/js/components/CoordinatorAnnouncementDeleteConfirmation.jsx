import { X } from "lucide-react";
import { useEffect } from "react";

export default function CoordinatorAnnouncementDeleteConfirmation({ onClose }) {

//   // auto close after 1.2s
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose?.();
//     }, 1200);

//     return () => clearTimeout(timer);
//   }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Green Check */}
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl">✓</span>
        </div>

        {/* Text */}
        <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
          Deleted successfully
        </p>

      </div>
    </div>
  );
}