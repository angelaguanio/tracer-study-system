import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/coordinator/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/coordinator/CoordinatorAlumniTable";
import axios from "axios";
import { toast } from "sonner";
import { Mail } from "lucide-react";
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

export default function CoordinatorAlumni({ alumni, filters }) {
  const { flash } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");
  const [employment, setEmployment] = useState(filters.employment || "all");
  const isFirstRender = useRef(true);

    // ── Bulk selection ────────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState([]);

    // ── Bulk email modal ──────────────────────────────────────
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
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

  const applyFilters = (params = {}) => {
    router.get("/coordinator/alumni", 
      { search, year, course, employment, page: 1, ...params }, 
      { preserveState: true, replace: true }
    );
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
  
    setBulkProgress({
        processed: 0,
        total: selectedIds.length,
    });
  
    sendNextBatch(0);
  };

  
//====================================================

const sendNextBatch = async (offset) => {
  try {
      const { data } = await axios.post(
          route("coordinator.alumni.email.bulk"),
          {
              subject: bulkSubject,
              message: bulkMessage,
              user_ids: selectedIds,
              offset,
              batch_size: 10,
          }
      );

      setBulkProgress({
          processed: data.processed,
          total: data.total,
      });

      if (!data.finished) {
          setTimeout(() => {
              sendNextBatch(data.next_offset);
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
      <div className="flex px-2 md:px-4 mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">List of Alumni</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden p-4 md:p-6 relative">
        {/* TOP BAR: Filters & Bulk Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <CoordinatorAlumniFilters 
            search={search} setSearch={setSearch} 
            year={year} setYear={(v) => {setYear(v); applyFilters({year: v})}} 
            course={course} setCourse={(v) => {setCourse(v); applyFilters({course: v})}}
            employment={employment} setEmployment={(v) => {setEmployment(v); applyFilters({employment: v})}}
          />

          <div className="flex items-center gap-3 shrink-0">
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedIds.length} alumni selected
              </span>
            )}

            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm disabled:opacity-40"
            >
              <Mail className="w-4 h-4" />
              Send Bulk Email
              {selectedIds.length > 0 && (
                <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                  {selectedIds.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col mt-4">
          <CoordinatorAlumniTable
            alumni={alumni}
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            onSendEmail={openIndivModal}
          />
        </div>
      </div>
      
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
                <DialogTitle className="text-blue-800">
                  Send Bulk Email
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({selectedIds.length} recipients)
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-2">
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

CoordinatorAlumni.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;