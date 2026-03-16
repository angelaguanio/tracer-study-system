import React from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementViewCard from "@/Components/CoordinatorAnnouncementViewCard";

function CoordinatorAnnouncementView() {
  return (
    <div className="w-full px-10 py-6 bg-[#f0faff]">
      <CoordinatorAnnouncementViewCard />
    </div>
  );
}

CoordinatorAnnouncementView.layout = page => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);

export default CoordinatorAnnouncementView;