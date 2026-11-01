import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import EditAlumniFormFields from "@/components/alumni/EditAlumniFormFields";

export default function EditAlumniModal({ isOpen, onClose, alumnus, submitRouteName }) {
  const { data, setData, put, processing, errors } = useForm({
    student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    department: "",
    courses: "",
    start_year: "",
    end_year: "",
    semester: "",
    email: "",
    contact_number: "",
  });

  useEffect(() => {
    if (alumnus) {
      setData({
        student_id: alumnus.student_id || "",
        first_name: alumnus.first_name || "",
        middle_name: alumnus.middle_name || "",
        last_name: alumnus.last_name || "",
        suffix: alumnus.suffix || "",
        department: alumnus.department || "",
        courses: alumnus.course || alumnus.courses || "",
        start_year: alumnus.start_year || "",
        end_year: alumnus.end_year || "",
        semester: alumnus.semester || "",
        email: alumnus.email || "",
        contact_number: alumnus.contact_number || "",
      });
    }
  }, [alumnus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alumnus) return;

    put(route(submitRouteName, alumnus.id), {
      onSuccess: () => {
        toast.success("Alumni information updated successfully!");
        onClose();
      },
      onError: () => {
        toast.error("Failed to update alumni information. Please check the inputs.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[88vh] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span>Edit Alumni Record</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Update personal, academic, and contact information for this alumnus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <EditAlumniFormFields data={data} setData={setData} errors={errors} />
          </div>

          <DialogFooter className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 gap-2 flex items-center justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="h-9 px-4 text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
              {processing ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
