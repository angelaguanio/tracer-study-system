import React from "react";
import { router } from "@inertiajs/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Archive, RotateCcw, Trash2 } from "lucide-react";

export default function ArchiveAlumniDialog({ isOpen, onClose, alumnus, actionType, routes }) {
  if (!alumnus) return null;

  const isArchive = actionType === "archive";
  const isRestore = actionType === "restore";
  const isDelete = actionType === "delete";

  const handleConfirm = () => {
    let targetRoute = "";
    let method = "patch";
    let successMsg = "";

    if (isArchive) {
      targetRoute = route(routes.archive, alumnus.id);
      method = "patch";
      successMsg = `${alumnus.name || "Alumnus"} has been archived.`;
    } else if (isRestore) {
      targetRoute = route(routes.restore, alumnus.id);
      method = "patch";
      successMsg = `${alumnus.name || "Alumnus"} has been restored.`;
    } else if (isDelete) {
      targetRoute = route(routes.destroy, alumnus.id);
      method = "delete";
      successMsg = `${alumnus.name || "Alumnus"} was permanently deleted.`;
    }

    router[method](targetRoute, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(successMsg);
        onClose();
      },
      onError: () => {
        toast.error("An error occurred. Please try again.");
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isArchive && <Archive className="w-5 h-5 text-amber-600" />}
            {isRestore && <RotateCcw className="w-5 h-5 text-emerald-600" />}
            {isDelete && <Trash2 className="w-5 h-5 text-red-600" />}
            <span>
              {isArchive && "Archive Alumnus"}
              {isRestore && "Restore Alumnus"}
              {isDelete && "Permanently Delete Alumnus"}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            {isArchive && (
              <>
                Are you sure you want to archive <strong>{alumnus.name}</strong>? They will be moved to the Archived tab. Their records, responses, and survey history will be preserved.
              </>
            )}
            {isRestore && (
              <>
                Restore <strong>{alumnus.name}</strong> back to the active alumni directory?
              </>
            )}
            {isDelete && (
              <>
                <span className="text-red-600 font-semibold block mb-1">Warning: This action cannot be undone.</span>
                Are you sure you want to permanently delete <strong>{alumnus.name}</strong> and all linked account records?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              isDelete
                ? "bg-red-600 hover:bg-red-700 text-white"
                : isRestore
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }
          >
            {isArchive && "Archive"}
            {isRestore && "Restore"}
            {isDelete && "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
