import React from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import CoordinatorAnnouncementViewCard from "../../components/coordinator/CoordinatorAnnouncementViewCard";

function CoordinatorAnnouncementView({ announcement }) {
  return (
    <div className="min-h-screen w-full bg-[#f0faff]">
      
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <Link href="/coordinator/announcement" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
        <CoordinatorAnnouncementViewCard announcement={announcement} />
      </div>

    </div>
  );
}

CoordinatorAnnouncementView.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);

export default CoordinatorAnnouncementView;