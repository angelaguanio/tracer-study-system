import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import AdminAlumniFilters from "@/components/admin/AdminAlumniFilters";
import AdminAlumniTable from "@/components/admin/AdminAlumniTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import EditAlumniModal from "@/components/alumni/EditAlumniModal";
import ArchiveAlumniDialog from "@/components/alumni/ArchiveAlumniDialog";
import { Mail, Archive, Users } from "lucide-react";
import axios from "axios";

export default function AdminAlumni({ alumni, filters, counts = { active: 0, archived: 0 } }) {
  const { flash } = usePage().props;

  // ── Tab / Status ──────────────────────────────────────────
  const [status, setStatus] = useState(filters.status || "active");

  // ── Filters ───────────────────────────────────────────────
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear]     = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");
  const [employment, setEmployment] = useState(filters.employment || "all");
  const isFirstRender = useRef(true);

  // ── Edit & Archive Dialog States ─────────────────────────
  const [editModalOpen, setEditModalOpen]       = useState(false);
  const [editingAlumnus, setEditingAlumnus]     = useState(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [targetAlumnus, setTargetAlumnus]       = useState(null);
  const [dialogAction, setDialogAction]         = useState("archive"); // 'archive' | 'restore' | 'delete'

  // ── Bulk selection ────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState([]);

  // ── Bulk email modal ──────────────────────────────────────
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkSendMode, setBulkSendMode]   = useState("selected"); // 'selected' | 'all'
  const [bulkSubject, setBulkSubject]     = useState("");
  const [bulkMessage, setBulkMessage]     = useState("");
  const [bulkSending, setBulkSending]     = useState(false);
  const [bulkProgress, setBulkProgress] = useState({
    processed: 0,
    total: 0,
});

  // ── Individual email modal ────────────────────────────────
  const [indivModalOpen, setIndivModalOpen] = useState(false);
  const [selectedUser, setSelectedUser]     = useState(null); // { id, name, email }
  const [indivSubject, setIndivSubject]     = useState("");
  const [indivMessage, setIndivMessage]     = useState("");
  const [indivSending, setIndivSending]     = useState(false);

  // ── Flash toast ───────────────────────────────────────────
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash?.success]);

  // Clear selection on page change
  useEffect(() => {
    setSelectedIds([]);
  }, [alumni?.current_page]);

  // ── Filter logic ──────────────────────────────────────────
  const applyFilters = (params = {}) => {
    router.get(
      window.location.pathname,
      { status, search, year, course, employment, page: 1, ...params },
      { preserveState: true, replace: true }
    );
  };

  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    applyFilters({ status: newStatus });
  };

  // ── Modal Trigger Handlers ────────────────────────────────
  const handleOpenEdit = (alumnus) => {
    setEditingAlumnus(alumnus);
    setEditModalOpen(true);
  };

  const handleOpenArchive = (alumnus) => {
    setTargetAlumnus(alumnus);
    setDialogAction("archive");
    setArchiveDialogOpen(true);
  };

  const handleOpenRestore = (alumnus) => {
    setTargetAlumnus(alumnus);
    setDialogAction("restore");
    setArchiveDialogOpen(true);
  };

  const handleOpenDelete = (alumnus) => {
    setTargetAlumnus(alumnus);
    setDialogAction("delete");
    setArchiveDialogOpen(true);
  };

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const delay = setTimeout(() => applyFilters(), 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (!isFirstRender.current) applyFilters();
  }, [year, course, employment]);

  // ── Bulk selection helpers ────────────────────────────────
  const currentPageIds = alumni?.data?.map((a) => a.id) ?? [];
  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // ── Open individual email modal ───────────────────────────
  const openIndivModal = (user) => {
    setSelectedUser(user);
    setIndivSubject("");
    setIndivMessage("");
    setIndivModalOpen(true);
  };

  // ── Individual email submit ───────────────────────────────
  const handleSendIndividual = () => {
    if (!indivSubject.trim() || !indivMessage.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    setIndivSending(true);
    router.post(
      route("admin.alumni.email.send", selectedUser.id),
      { subject: indivSubject, message: indivMessage },
      {
        onSuccess: () => {
          setIndivModalOpen(false);
          setSelectedUser(null);
        },
        onError: () => toast.error("Failed to send email. Please try again."),
        onFinish: () => setIndivSending(false),
      }
    );
  };

  // ── Bulk email submit ─────────────────────────────────────
  // const handleSendBulk = () => {
  //   if (!bulkSubject.trim() || !bulkMessage.trim()) {
  //     toast.error("Subject and message are required.");
  //     return;
  //   }

  //   setBulkSending(true);
  //   router.post(
  //     route("admin.alumni.email.bulk"),
  //     { subject: bulkSubject, message: bulkMessage, send_all: false, user_ids: selectedIds },
  //     {
  //       onSuccess: () => {
  //         setBulkModalOpen(false);
  //         setBulkSubject("");
  //         setBulkMessage("");
  //         setSelectedIds([]);
  //       },
  //       onError: () => toast.error("Failed to queue emails. Please try again."),
  //       onFinish: () => setBulkSending(false),
  //     }
  //   );
  // };
  const handleSendBulk = () => {
    if (!bulkSubject.trim() || !bulkMessage.trim()) {
        toast.error("Subject and message are required.");
        return;
    }
  
    setBulkSending(true);
  
    const isAll = bulkSendMode === "all";
    setBulkProgress({
        processed: 0,
        total: isAll ? (counts.active ?? 0) : selectedIds.length,
    });
  
    sendNextBatch(0, isAll);
  };

//====================================================

const sendNextBatch = async (offset, isAll = false) => {
  try {
      const payload = {
          subject: bulkSubject,
          message: bulkMessage,
          offset,
          batch_size: 10,
      };

      if (isAll) {
          payload.send_all = true;
      } else {
          payload.user_ids = selectedIds;
      }

      const { data } = await axios.post(route("admin.alumni.email.bulk"), payload);

      setBulkProgress({
          processed: data.processed,
          total: data.total,
      });

      if (!data.finished) {
          setTimeout(() => {
              sendNextBatch(data.next_offset, isAll);
          }, 500);

          return;
      }

      toast.success("Bulk email completed!");

      setBulkSending(false);
      setBulkModalOpen(false);
      setBulkSubject("");
      setBulkMessage("");
      setSelectedIds([]);

  } catch (error) {
      console.error(error);
      toast.error("Failed sending emails.");
      setBulkSending(false);
  }
};

  return (
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">
      <div className="flex flex-col gap-1 px-2 md:px-4 mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Alumni Directory</h1>
        <p className="text-lg text-gray-500">
          View graduate profiles, track employment progress, and send email reminders for tracer study participation.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden p-4 md:p-6 relative">
        {/* Status Tabs & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabChange("active")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                status === "active"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Active Alumni</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                status === "active" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {counts.active ?? 0}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("archived")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                status === "archived"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Archived</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                status === "archived" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {counts.archived ?? 0}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedIds.length} selected
              </span>
            )}

            {status === "active" && (
              <>
                <Button
                  onClick={() => {
                    setBulkSendMode("all");
                    setBulkModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Email All Alumni ({counts.active ?? 0})
                </Button>

                <Button
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    setBulkSendMode("selected");
                    setBulkModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-xs sm:text-sm disabled:opacity-40 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Send to Selected
                  {selectedIds.length > 0 && (
                    <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                      {selectedIds.length}
                    </span>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AdminAlumniFilters
            search={search} setSearch={setSearch}
            year={year}     setYear={setYear}
            course={course} setCourse={setCourse}
            employment={employment} setEmployment={setEmployment}
          />
        </div>

        {/* TABLE */}
        <div className="mt-3 flex-1 min-h-0">
          <AdminAlumniTable
            alumni={alumni}
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            onSendEmail={openIndivModal}
            onEdit={handleOpenEdit}
            onArchive={handleOpenArchive}
            onRestore={handleOpenRestore}
            onDelete={handleOpenDelete}
            isArchivedView={status === "archived"}
          />
        </div>
      </div>

      {/* ── EDIT ALUMNI MODAL ── */}
      <EditAlumniModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingAlumnus(null);
        }}
        alumnus={editingAlumnus}
        submitRouteName="admin.alumni.update"
      />

      {/* ── ARCHIVE / RESTORE / DELETE DIALOG ── */}
      <ArchiveAlumniDialog
        isOpen={archiveDialogOpen}
        onClose={() => {
          setArchiveDialogOpen(false);
          setTargetAlumnus(null);
        }}
        alumnus={targetAlumnus}
        actionType={dialogAction}
        routes={{
          archive: "admin.alumni.archive",
          restore: "admin.alumni.restore",
          destroy: "admin.alumni.destroy",
        }}
      />

      {/* ── INDIVIDUAL EMAIL MODAL ── */}
      <Dialog open={indivModalOpen} onOpenChange={setIndivModalOpen}>
        <DialogContent className="lg:max-w-lg max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              Send an email to {selectedUser?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="indiv-subject">Subject</Label>
              <Input
                id="indiv-subject"
                placeholder="Email subject..."
                value={indivSubject}
                onChange={(e) => setIndivSubject(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="indiv-message">Message</Label>
              <Textarea
                id="indiv-message"
                placeholder="Write your message here..."
                rows={6}
                value={indivMessage}
                onChange={(e) => setIndivMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIndivModalOpen(false)}
              disabled={indivSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendIndividual}
              disabled={indivSending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {indivSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── BULK EMAIL MODAL ── */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="lg:max-w-lg max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-blue-800 flex items-center justify-between">
              <span>Send Bulk Email</span>
              <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {bulkSendMode === "all"
                  ? `All active alumni (${counts.active ?? 0})`
                  : `${selectedIds.length} selected`}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Mode Selector */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setBulkSendMode("all")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  bulkSendMode === "all"
                    ? "bg-white text-emerald-700 font-bold shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Alumni ({counts.active ?? 0})
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => setBulkSendMode("selected")}
                className={`flex-1 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
                  bulkSendMode === "selected"
                    ? "bg-white text-blue-700 font-bold shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Selected Only ({selectedIds.length})
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-subject">Subject</Label>
              <Input
                id="bulk-subject"
                placeholder="Email subject..."
                value={bulkSubject}
                onChange={(e) => setBulkSubject(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-message">Message</Label>
              <Textarea
                id="bulk-message"
                placeholder="Write your message here..."
                rows={6}
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkModalOpen(false)}
              disabled={bulkSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendBulk}
              disabled={bulkSending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {bulkSending
              ? `Sending ${bulkProgress.processed}/${bulkProgress.total}`
              : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

AdminAlumni.layout = (page) => <AdminLayout>{page}</AdminLayout>;
