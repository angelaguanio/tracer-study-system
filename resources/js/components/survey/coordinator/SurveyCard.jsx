import { router } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";
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

export default function SurveyCard({ survey }) {
    const handleDelete = () => {
        router.delete(route("admin.surveys.destroy", survey.id));
    };

    return (
        <Card className="bg-white border shadow-sm">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-gray-800">{survey.title}</h2>
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
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#9ECEFF] text-[#2859C5] hover:bg-[#9ECEFF]/10"
                        onClick={() => router.get(route("admin.surveys.builder", survey.id))}
                    >
                        <Pencil size={14} />
                        Edit
                    </Button>

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
                </div>
            </CardContent>
        </Card>
    );
}
