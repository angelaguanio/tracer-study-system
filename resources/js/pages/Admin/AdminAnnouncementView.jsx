import AdminLayout from "@/layouts/admin-layout";
import AdminAnnouncementViewCard from "@/components/admin/AdminAnnouncementViewCard";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function AdminAnnouncementView({ announcement }) {
  return (
    <div className="min-h-screen w-full bg-[#f0faff]">
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <Link href="/admin/announcement" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
        <AdminAnnouncementViewCard announcement={announcement} />
      </div>
    </div>
  );
}

AdminAnnouncementView.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);
