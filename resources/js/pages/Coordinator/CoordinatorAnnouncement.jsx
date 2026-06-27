import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAnnouncementCard from "@/components/coordinator/CoordinatorAnnouncementCard";
import { Plus, X, Check, Search, ChevronDown, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CoordinatorAnnouncement({ announcements }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [showUpdatedSuccess, setShowUpdatedSuccess] = useState(false);

  const { props } = usePage();

  // auto-hide modal after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // detect update modal
  useEffect(() => {
    const url = new URL(window.location.href);
    const updated = url.searchParams.get("updated");

    if (updated === "1") {
      setShowUpdatedSuccess(true);

      setTimeout(() => {
        setShowUpdatedSuccess(false);

        router.replace("/coordinator/announcement", {
          preserveState: true,
          preserveScroll: true,
        });
      }, 2500);
    }
  }, []);

  useEffect(() => {
    if (props.flash?.success === "Deleted") {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [props.flash?.success]);

  // GLOBAL SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      router.get(
        "/coordinator/announcement",
        {
          search,
          status: statusFilter,
          sort: sortOrder,
        },
        {
          preserveState: true,
          replace: true,
        }
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [search, statusFilter, sortOrder]);

  const list = announcements?.data ?? [];
  const filteredAnnouncements = list;

  return (
    <div className="w-full h-full p-2 sm:p-6 flex flex-col gap-4 overflow-y-auto">

      {/* INFO BANNER */}
      <div className=" rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-5 rounded-full">
            <Megaphone size={25} className="text-blue-700"/>
          </div>
          <p className="text-lg text-gray-600">
            Create and manage announcements to keep everyone informed.
          </p>
        </div>

        <Link
          href="/coordinator/announcement/create"
          className="flex items-center justify-center text-[15px] text-sm gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition"
        >
          <Plus size={18} />
          Create Announcement
        </Link>
      </div>

      <div className="flex flex-col justify-evenly gap-5 px-6 py-7 border shadow-lg rounded-2xl bg-white "> 
      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* ================= LEFT SIDE (SEARCH) ================= */}
        <div className="w-full sm:w-auto">
          <div className="relative w-full sm:w-64 bg-white">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        {/* ================= RIGHT SIDE (FILTERS) ================= */}
        <div className="flex flex-wrap gap-2 items-center justify-between w-full sm:w-auto">

          {/* STATUS FILTER */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="px-3 py-2 border rounded-md text-sm bg-white flex items-center gap-2 hover:cursor-pointer"
            >
              Status: {
                statusFilter === ""
                  ? "All"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)
              }
              <ChevronDown size={16} />
            </button>

            {statusOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow z-50 w-28">
                {["", "approved", "pending", "revise"].map((status) => (
                  <button
                    key={status || "all"}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-sm hover:bg-gray-100 text-center"
                  >
                    {status === ""
                      ? "All"
                      : status.charAt(0).toUpperCase() + 
                        status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SORT */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="px-3 py-2 border rounded-md text-sm bg-white flex items-center gap-2 hover:cursor-pointer"
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
      <div className="flex-1 min-h-0 overflow-y-auto rounded-md">
        <CoordinatorAnnouncementCard
          announcements={filteredAnnouncements}
          onDeleteSuccess={() => setShowSuccess(true)}
        />
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start items-center gap-1">

          {/* PREVIOUS */}
          <button
            disabled={announcements.current_page === 1}
            onClick={() =>
              router.get(
                `/coordinator/announcement?page=${announcements.current_page - 1}`,
                {},
                { preserveState: true, preserveScroll: true }
              )
            }
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: announcements.last_page }, (_, i) => i + 1)
            .filter((page) => {
              const current = announcements.current_page;
              return (
                page === 1 ||
                page === announcements.last_page ||
                (page >= current - 1 && page <= current + 1)
              );
            })
            .map((page, index, arr) => {
              const prevPage = arr[index - 1];
              return (
                <div key={page} className="flex items-center gap-1">
                  {prevPage && page - prevPage > 1 && (
                    <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
                  )}
                  <button
                    onClick={() =>
                      router.get(
                        `/coordinator/announcement?page=${page}`,
                        {},
                        { preserveState: true, preserveScroll: true }
                      )
                    }
                    className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition ${
                      announcements.current_page === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}

          {/* NEXT */}
          <button
            disabled={announcements.current_page === announcements.last_page}
            onClick={() =>
              router.get(
                `/coordinator/announcement?page=${announcements.current_page + 1}`,
                {},
                { preserveState: true, preserveScroll: true }
              )
            }
            className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>

        </div>

      {/* DELETE SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
          <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center justify-center h-60">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            {/* GREEN CIRCLE WITH CHECK */}
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={28} className="text-white stroke-[3]" />
            </div>

            {/* TEXT */}
            <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
              Deleted successfully!
            </p>

          </div>
        </div>
      )}

      {/* UPDATE SUCCESS MODAL */}
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

            {/* GREEN ICON */}
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={28} className="text-white stroke-[3]" />
            </div>

            {/* TEXT */}
            <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
              Updated successfully!
            </p>

          </div>
        </div>
      )}
    </div>
    </div>
  );
}

CoordinatorAnnouncement.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);
