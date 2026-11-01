import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/coordinator/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/coordinator/CoordinatorAlumniTable";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Loader2, X, Archive, Users } from "lucide-react";
import EditAlumniModal from "@/components/alumni/EditAlumniModal";
import ArchiveAlumniDialog from "@/components/alumni/ArchiveAlumniDialog";
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
import { Button } from "@/components/ui/button";

export default function CoordinatorAlumni({ alumni, filters, counts = { active: 0, archived: 0 } }) {
  const { flash } = usePage().props;

  const [status, setStatus] = useState(filters.status || "active");
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
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

    // ── CSV Import modal ──────────────────────────────────────
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile]       = useState(null);
    const [importing, setImporting]             = useState(false);
    const [importResult, setImportResult]       = useState(null);
    const fileInputRef                          = useRef(null);

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validExtensions = [".csv", ".txt"];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!validExtensions.includes(ext)) {
        toast.error("Please select a valid CSV file (.csv)");
        return;
      }

      setSelectedFile(file);
      setImportResult(null);
    };

    const handleUploadCsv = async () => {
      if (!selectedFile) {
        toast.error("Please choose a CSV file to upload.");
        return;
      }

      setImporting(true);
      setImportResult(null);

      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      try {
        const response = await axios.post(route("coordinator.alumni.import-csv"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });

        const data = response.data;
        setImportResult(data);
        toast.success(data.message || "Students imported successfully!");
        
        // Refresh directory data
        router.reload({ only: ["alumni"] });
      } catch (error) {
        console.error("CSV import error:", error);
        if (error.response?.data?.rejected) {
          setImportResult(error.response.data);
        }
        let errMsg = error.response?.data?.message || error.response?.data?.error || "Failed to import CSV file.";

        // Sanitize raw SQL dumps or database exceptions into clean messages
        if (typeof errMsg === "string") {
          if (errMsg.includes("student_id") && (errMsg.includes("Unknown column") || errMsg.includes("SQLSTATE"))) {
            errMsg = "Database update required: 'student_id' column is missing in table 'users'. Please run the SQL command in phpMyAdmin.";
          } else if (errMsg.includes("email") || errMsg.includes("password")) {
            errMsg = "Database update required: 'email' and 'password' must be set to NULLABLE. Please run the SQL command in phpMyAdmin.";
          } else if (errMsg.includes("SQLSTATE") || errMsg.includes("SQL:") || errMsg.includes("Connection: mysql")) {
            errMsg = "A database error occurred during import. Please ensure the database tables and columns are up to date.";
          }
        }

        toast.error(errMsg);
      } finally {
        setImporting(false);
      }
    };

    const resetImportState = () => {
      setSelectedFile(null);
      setImportResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const downloadOfficialTemplate = () => {
      const csvContent =
        "lastname,firstname,middlename,suffix,student id,department,program,school year,semester\n" +
        "Dela Cruz,Juan,Santos,Jr.,22-3333-444,CECT,BSIT,2025-2026,1st Semester\n" +
        "Reyes,Maria,N/A,*,22-4444-555,CECT,BSCS,2025-2026,2nd Semester\n";

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "student_import_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

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

  const handleView = (id) => {
    router.visit(route("coordinator.alumni.show", id));
  };

  useEffect(() => {
    if (flash?.success) {
        toast.success(flash.success);
    }
  }, [flash?.success]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const delay = setTimeout(() => applyFilters(), 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    setSelectedIds([]);
  }, [alumni?.current_page]);

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
      route("coordinator.alumni.email.send", selectedUser.id),
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

      const { data } = await axios.post(route("coordinator.alumni.email.bulk"), payload);

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

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedIds.length} alumni selected
              </span>
            )}

            {status === "active" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetImportState();
                    setImportModalOpen(true);
                  }}
                  className="flex items-center gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-full px-4 py-2 text-xs sm:text-sm cursor-pointer shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Import CSV
                </Button>

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

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <CoordinatorAlumniFilters 
            search={search} setSearch={setSearch} 
            year={year} setYear={(v) => {setYear(v); applyFilters({year: v})}} 
            course={course} setCourse={(v) => {setCourse(v); applyFilters({course: v})}}
            employment={employment} setEmployment={(v) => {setEmployment(v); applyFilters({employment: v})}}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col mt-4">
          <CoordinatorAlumniTable
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
        submitRouteName="coordinator.alumni.update"
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
          archive: "coordinator.alumni.archive",
          restore: "coordinator.alumni.restore",
          destroy: "coordinator.alumni.destroy",
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
                <Label htmlFor="indiv-subject">
                  Subject
                </Label>

                <Input
                  id="indiv-subject"
                  placeholder="Email subject..."
                  value={indivSubject}
                  onChange={(e) => setIndivSubject(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="indiv-message">
                  Message
                </Label>

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

          {/* ── IMPORT CSV MODAL ── */}
          <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
            <DialogContent className="max-w-xl sm:max-w-2xl w-full p-6 sm:p-8">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-gray-900 text-xl font-bold">
                      Import Students CSV
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-0.5">
                      Upload student records to import or update alumni directory data.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-3">
                {/* Official template guide card */}
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-sm sm:text-base">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Official Template Required</span>
                    </div>

                    <button
                      type="button"
                      onClick={downloadOfficialTemplate}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download Official Template
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Please download the official CSV template above. <strong className="font-semibold text-amber-950">Do not alter, rename, add, or delete any of the column headers</strong>. The template headers are strictly required by the system, and your file import will not work if any header is modified or removed.
                  </p>

                  <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-3 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-amber-950">Important Note:</strong> All fields are required. If a student does not have a <strong>middle name</strong> or <strong>suffix</strong>, please enter an asterisk (<code className="px-1.5 py-0.5 rounded bg-amber-200/80 font-mono font-bold">*</code>) or <code className="px-1.5 py-0.5 rounded bg-amber-200/80 font-mono font-bold">N/A</code> in those column fields. It will automatically appear as blank on the website.
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-amber-850/80 italic">
                    Note: If an existing student with the same Student ID is found in the database, their record will automatically be updated with the latest information.
                  </p>
                </div>

                {/* Upload dropzone */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-file-input"
                  />
                  {!selectedFile ? (
                    <label
                      htmlFor="csv-file-input"
                      className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all bg-gray-50/60 hover:bg-emerald-50/40 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-semibold text-gray-800 block">
                          Click to browse or drop your CSV file here
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                          Supports UTF-8 encoded .csv files up to 5MB
                        </span>
                      </div>
                    </label>
                  ) : (
                    <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetImportState}
                        disabled={importing}
                        className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Results summary (after upload) */}
                {importResult && importResult.rejected && (
                  <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 sm:p-5 text-xs sm:text-sm space-y-2.5">
                    <div className="flex items-start gap-2 text-red-800 font-bold text-sm sm:text-base">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{importResult.message}</span>
                    </div>
                    {importResult.errors?.length > 0 && (
                      <div className="pt-2.5 border-t border-red-200 space-y-1 max-h-40 overflow-y-auto">
                        {importResult.errors.map((err, i) => (
                          <div key={i} className="text-xs text-red-800">• {err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {importResult && !importResult.rejected && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 text-xs sm:text-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{importResult.message}</span>
                    </div>
                    <div className="flex items-center gap-5 text-gray-700 font-medium">
                      <span>Added: <strong className="text-emerald-700">{importResult.created_count ?? 0}</strong></span>
                      <span>Updated: <strong className="text-blue-700">{importResult.updated_count ?? 0}</strong></span>
                    </div>
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-emerald-200 text-amber-900 space-y-1 max-h-32 overflow-y-auto">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Warnings / Skipped Records:</span>
                        </div>
                        {importResult.errors.map((err, i) => (
                          <div key={i} className="text-xs text-amber-800">• {err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2.5 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setImportModalOpen(false)}
                  disabled={importing}
                  className="rounded-xl px-5"
                >
                  {importResult ? "Close" : "Cancel"}
                </Button>

                <Button
                  onClick={handleUploadCsv}
                  disabled={!selectedFile || importing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer disabled:opacity-40 rounded-xl px-5"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Start Import
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </div>
  );
}

CoordinatorAlumni.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;
