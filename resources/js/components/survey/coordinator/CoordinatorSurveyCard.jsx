import { router } from "@inertiajs/react";
import { Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CoordinatorSurveyCard({ survey, isArchived = false }) {
    const handleDelete = () => {
        router.delete(route("coordinator.surveys.destroy", survey.id));
    };

    const handleArchive = () => {
        router.patch(route("coordinator.surveys.archive", survey.id));
    };

    const handleUnarchive = () => {
        router.patch(route("coordinator.surveys.unarchive", survey.id));
    };

    return (
        <Card className={`bg-white border shadow-sm ${isArchived ? "opacity-75" : ""}`}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-800">{survey.title}</h2>
                        {isArchived && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs">
                                Archived
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge
                            className={
                                survey.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-gray-100 text-gray-500 border-gray-300"
                            }
                        >
                            {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                        </Badge>
                        <span>{survey.sections_count} section{survey.sections_count !== 1 ? "s" : ""}</span>
                        <span>·</span>
                        <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Edit — only for active surveys */}
                    {!isArchived && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10"
                            onClick={() => router.get(route("coordinator.surveys.builder", survey.id))}
                        >
                            <Pencil size={14} />
                            Edit
                        </Button>
                    )}



                    {/* Unarchive button for archived surveys */}
                    {isArchived ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                >
                                    <ArchiveRestore size={14} />
                                    Unarchive
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Unarchive Survey</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Restore "{survey.title}" to the active survey list?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                        onClick={handleUnarchive}
                                    >
                                        Unarchive
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : survey.has_responses ? (
                        /* Archive button — shown when responses exist */
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                >
                                    <Archive size={14} />
                                    Archive
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Archive Survey</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Archive "{survey.title}"? It will be hidden from the main list but all response data will be preserved. You can unarchive it later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                        onClick={handleArchive}
                                    >
                                        Archive
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        /* Delete button — only when no responses */
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#E70813] bg-[#FF9E9E]/30 text-[#E70813] hover:bg-[#E70813]/10"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{survey.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-[#E70813] hover:bg-red-700 text-white"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
