import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function CoordinatorAnnouncementDeletePrompt({ children }) {

  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const confirmDelete = () => {
    console.log("Deleted!");
    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={openModal} className="w-full sm:w-auto">
        {children}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50 px-4">

          {/* Modal Box */}
          <div className="bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6">

            {/* Header */}
            <div className="flex items-start sm:items-center gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="text-red-600" size={22} />
              </div>

              <h2 className="text-base sm:text-lg font-semibold">
                Are you sure?
              </h2>
            </div>

            {/* Message */}
            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
              This will permanently delete this announcement.
              <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
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