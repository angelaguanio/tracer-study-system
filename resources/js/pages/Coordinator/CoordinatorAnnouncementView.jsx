import React from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Pencil, RefreshCw } from "lucide-react";
import CoordinatorAnnouncementViewCard from "../../components/coordinator/CoordinatorAnnouncementViewCard";

function CoordinatorAnnouncementView({ announcement }) {
  const isPending = announcement?.status === "pending";
  const isRevise = announcement?.status === "revise";

  return (
    <div className="min-h-screen w-full bg-[#f0faff]">
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* BACK */}
          <Link
            href="/coordinator/announcement"
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-base font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </Link>

          {/* ACTION BUTTON */}
          {(isPending || isRevise) && (
            <button
              onClick={() =>
                router.get(`/coordinator/announcement/${announcement.id}/edit`)
              }
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap
                ${isRevise
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200"
                  : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                }
              `}
            >
              {isRevise ? (
                <RefreshCw size={16} />
              ) : (
                <Pencil size={16} />
              )}

              {isRevise ? "Resubmit" : "Edit"}
            </button>
          )}

        </div>

        {/* ================= CONTENT ================= */}
        <CoordinatorAnnouncementViewCard announcement={announcement} />

      </div>
    </div>
  );
}

CoordinatorAnnouncementView.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);

export default CoordinatorAnnouncementView;