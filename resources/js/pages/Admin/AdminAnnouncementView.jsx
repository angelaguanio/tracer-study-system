import AdminLayout from "@/layouts/admin-layout";
import AdminAnnouncementViewCard from "@/components/admin/AdminAnnouncementViewCard";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import AdminAnnouncementDeletePromptandConfirmation from "@/components/admin/AdminAnnouncementDeletePromptandConfirmation";

export default function AdminAnnouncementView({ announcement }) {
  const isPending = announcement?.status === "pending";
  const isApproved = announcement?.status === "approved";

  const [openModal, setOpenModal] = useState(false);
  const [note, setNote] = useState("");

  // APPROVE
  const handleApprove = () => {
    router.put(
      `/admin/announcement/${announcement.id}/approve`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => router.reload({ preserveScroll: true }),
      }
    );
  };

  // SUBMIT REVISION
  const submitRevision = () => {
    if (!note.trim()) return;

    router.put(
      `/admin/announcement/${announcement.id}/reject`,
      { note },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpenModal(false);
          setNote("");
          router.reload({ preserveScroll: true });
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f0faff]">
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* BACK */}
          <Link
            href="/admin/announcement"
            className="inline-flex items-center gap-2 text-base font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </Link>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

            {isPending && (
              <>
                <button
                  onClick={handleApprove}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-green-600 text-green-600 bg-green-50 hover:bg-green-100 cursor-pointer"
                >
                  <Check size={16} />
                  Approve
                </button>

                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-yellow-600 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 cursor-pointer"
                >
                  <X size={16} />
                  Revise
                </button>
              </>
            )}

            {isApproved && (
              <>
                <Link
                  href={`/admin/announcement/${announcement.id}/edit`}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <AdminAnnouncementDeletePromptandConfirmation
                  announcementId={announcement.id}
                  onSuccess={() => router.visit("/admin/announcement")}
                >
                  <button className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-red-600 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </AdminAnnouncementDeletePromptandConfirmation>
              </>
            )}

          </div>
        </div>

        {/* CONTENT */}
        <AdminAnnouncementViewCard announcement={announcement} />

        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-md p-5 rounded-lg shadow-lg">

              <h2 className="text-lg font-semibold mb-3">
                Revision Note
              </h2>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write reason for revision..."
                className="w-full border rounded-md p-3 text-sm h-32 resize-none"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">

                <button
                  onClick={() => {
                    setOpenModal(false);
                    setNote("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={submitRevision}
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Submit
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

AdminAnnouncementView.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);