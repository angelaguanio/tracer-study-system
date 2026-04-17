import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementCard from "@/components/coordinator/CoordinatorAnnouncementCard";
import { Plus, X, Check, Search, ChevronDown } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CoordinatorAnnouncement({ announcements }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpdatedSuccess, setShowUpdatedSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // auto-hide modal after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // detect update modal
  useEffect(() => {
    const updated = new URLSearchParams(window.location.search).get("updated");

    if (updated === "1") {
      setShowUpdatedSuccess(true);

      const timer = setTimeout(() => {
        setShowUpdatedSuccess(false);

        router.replace("/coordinator/announcement", {
          preserveState: true,
          preserveScroll: true,
        });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  // GLOBAL SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      router.get(
        "/coordinator/announcement",
        {
          search,
          status: activeTab,
          sort: sortOrder,
        },
        {
          preserveState: true,
          replace: true,
        }
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [search, activeTab, sortOrder]);

  // HANDLE DATA (pagination safe)
  const list = announcements?.data ?? [];
  const filteredAnnouncements = list;

  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Announcements</h1>
      </div>

      {/* INFO BANNER */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">📢</div>
          <p className="text-gray-600">
            Create, edit, or remove announcements to keep everyone informed.
          </p>
        </div>

        <Link
          href="/coordinator/announcement/create"
          className="flex items-center justify-center gap-2 bg-[#008236] hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          <Plus size={18} />
          Add Announcement
        </Link>
      </div>

      {/* TABS + SEARCH + SORT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* TABS */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? "bg-[#008236] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH + SORT */}
        <div className="flex gap-2 items-center">

          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* SORT */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="px-3 py-2 border rounded-md text-sm bg-white flex items-center gap-2"
            >
              Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
              <ChevronDown size={16} />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow z-50 w-32">

                <button
                  onClick={() => {
                    setSortOrder("newest");
                    setSortOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Newest
                </button>

                <button
                  onClick={() => {
                    setSortOrder("oldest");
                    setSortOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Oldest
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* TABLE */}
      <CoordinatorAnnouncementCard
        announcements={filteredAnnouncements}
        onDeleteSuccess={() => setShowSuccess(true)}
      />

      {/* PAGINATION */}
      {announcements?.links && (
        <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
          {announcements.links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              onClick={() =>
                router.get(link.url, {}, { preserveState: true, preserveScroll: true })
              }
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-3 py-1 border rounded-md text-sm ${
                link.active
                  ? "bg-[#008236] text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
              } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          ))}
        </div>
      )}

      {/* DELETE SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
          <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center h-60">

            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={28} className="text-white" />
            </div>

            <p className="text-gray-700 font-medium">
              Deleted successfully!
            </p>

          </div>
        </div>
      )}

      {/* UPDATED SUCCESS MODAL */}
      {showUpdatedSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
          <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center h-60">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowUpdatedSuccess(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            {/* GREEN CIRCLE WITH CHECK */}
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={28} className="text-white stroke-[3]" />
            </div>

            <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
              Updated successfully!
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

CoordinatorAnnouncement.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);