import AlumnaLayout from "@/layouts/alumna-layout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, ImageOff } from "lucide-react";

export default function AlumnaAnnouncementView({ announcement }) {
  return (
    <div className="min-h-screen w-full">
      <div className="px-4 sm:px-6 md:px-10 py-6 max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          href="/alumna/announcements"
          className="inline-flex items-center gap-1 text-md text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={16} /> Back to Announcements
        </Link>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
          {announcement?.title}
        </h1>

        {/* DATE */}
        <p className="text-gray-600 mb-6">
          {announcement?.created_at
            ? `${new Date(announcement.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • ${new Date(
                announcement.created_at
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
        </p>

        {/* IMAGE (ONLY IF AVAILABLE) */}
        {announcement?.image && (Array.isArray(announcement.image) ? announcement.image.length > 0 : announcement.image) ? (
            <img
              src={
                Array.isArray(announcement.image)
                  ? announcement.image[0] // first image lang ipapakita
                  : announcement.image
              }
              alt={announcement.title}
              className="w-full max-h-[500px] object-contain mb-6"
            />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
            <ImageOff size={64} className="text-gray-400" />
          </div>
        )}

        {/* CONTENT */}
        <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {announcement?.details}
        </div>

      </div>
    </div>
  );
}

AlumnaAnnouncementView.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);