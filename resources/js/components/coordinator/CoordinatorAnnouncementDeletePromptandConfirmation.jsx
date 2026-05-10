import { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import { router } from "@inertiajs/react";

export default function CoordinatorAnnouncementDeletePromptandConfirmation({ children, announcementId, onSuccess }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const confirmDelete = () => {
    if (!announcementId) return;

    router.delete(`/admin/announcement/${announcementId}`, {
      onSuccess: () => {
        setOpen(false); 
        if (onSuccess) onSuccess(); 
      },
      onError: (error) => console.error("Delete failed:", error),
    });
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={openModal} className="w-full sm:w-auto cursor-pointer">
        {children}
      </div>

      {/* DELETE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6">
            <div className="flex items-start sm:items-center gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="text-red-600" size={22} />
              </div>
              <h2 className="text-base sm:text-lg font-semibold">Are you sure?</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed text-left">
              This will permanently delete this announcement.
              <br />
              This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button 
                onClick={closeModal} 
                className="w-full sm:w-auto px-4 py-2 rounded-md border bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}