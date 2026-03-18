import React from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementViewCard from "@/Components/CoordinatorAnnouncementViewCard";

function CoordinatorAnnouncementView() {
  return (
    <div className="min-h-screen w-full bg-[#f0faff]">
      
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <CoordinatorAnnouncementViewCard />
      </div>

    </div>
  );
}

CoordinatorAnnouncementView.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);

export default CoordinatorAnnouncementView;