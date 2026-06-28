import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Archive } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import SurveyCard from "@/components/survey/coordinator/SurveyCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function SurveyIndex({ surveys = [], archivedSurveys = [] }) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("active"); // "active" | "archived"
    const [form, setForm] = useState({ title: "", description: "" });
    const [errors, setErrors] = useState({});

    const handleCreate = () => {
        router.post(route("admin.surveys.store"), form, {
            onError: (e) => setErrors(e),
            onSuccess: () => { setOpen(false); setForm({ title: "", description: "" }); },
        });
    };

    const currentData = tab === "active" ? surveys : archivedSurveys;
    const currentList = currentData.data ?? [];
    const isArchivedTab = tab === "archived";

    const pageParam =
        tab === "active" ? "active_page" : "archived_page";

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">List of Surveys</h1>
                <Button className="bg-[#008236] hover:bg-green-700 text-white" onClick={() => setOpen(true)}>
                    <Plus size={16} /> New Survey
                </Button>
            </div>

            {/* Tab filter */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit shadow-sm">
                <button
                    onClick={() => setTab("active")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        tab === "active"
                            ? "bg-[#008236] text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    Active
                    {surveys.length > 0 && (
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === "active" ? "bg-white/20" : "bg-gray-100"}`}>
                            {surveys.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab("archived")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        tab === "archived"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    <Archive size={13} />
                    Archived
                    {archivedSurveys.length > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "archived" ? "bg-white/20" : "bg-gray-100"}`}>
                            {archivedSurveys.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Survey list */}
            {currentList.length === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
                    {isArchivedTab ? "No archived surveys." : "No surveys yet. Create one to get started."}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {currentList.map((survey) => (
                        <SurveyCard key={survey.id} survey={survey} isArchived={isArchivedTab} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {currentData.last_page > 1 && (
                <div className="flex justify-start items-center mt-6">
                    <Pagination className="justify-start">
                        <PaginationContent>

                            {/* Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (currentData.current_page > 1) {
                                            router.get(
                                                route("admin.surveys.index"),
                                                {
                                                    [pageParam]:
                                                        currentData.current_page - 1,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    replace: true,
                                                }
                                            );
                                        }
                                    }}
                                    className={`h-9 transition-colors ${
                                        currentData.current_page === 1
                                            ? "pointer-events-none opacity-40"
                                            : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                    }`
                                    }
                                />
                            </PaginationItem>

                            {/* Pages */}
                            {Array.from(
                                { length: currentData.last_page },
                                (_, i) => i + 1
                            )
                                .filter((page) => {
                                    const current = currentData.current_page;

                                    return (
                                        page === 1 ||
                                        page === currentData.last_page ||
                                        (page >= current - 1 &&
                                            page <= current + 1)
                                    );
                                })
                                .map((page, index, arr) => {
                                    const prevPage = arr[index - 1];

                                    return (
                                        <PaginationItem key={page}>
                                            {prevPage &&
                                                page - prevPage > 1 && (
                                                    <PaginationEllipsis />
                                                )}

                                            <PaginationLink
                                                href="#"
                                                isActive={currentData.current_page === page}
                                                onClick={(e) => {
                                                    e.preventDefault();

                                                    router.get(
                                                        route("admin.surveys.index"),
                                                        {
                                                            [pageParam]: page,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            replace: true,
                                                        }
                                                    );
                                                }}
                                                className={`h-9 w-9 p-0 transition-colors ${
                                                    currentData.current_page === page
                                                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white"
                                                        : "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                                }`}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                            {/* Next */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                            currentData.current_page <
                                            currentData.last_page
                                        ) {
                                            router.get(
                                                route("admin.surveys.index"),
                                                {
                                                    [pageParam]:
                                                        currentData.current_page + 1,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    replace: true,
                                                }
                                            );
                                        }
                                    }}
                                    className={`h-9 transition-colors ${
                                        currentData.current_page === currentData.last_page
                                            ? "pointer-events-none opacity-40"
                                            : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                    }`
                                    }
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* New Survey dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="lg:max-w-lg max-w-sm">
                    <DialogHeader>
                        <DialogTitle>New Survey</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label>Title</Label>
                            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Survey title" />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Description <span className="text-gray-400 font-normal">(optional)</span></Label>
                            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
                        </div>
                    </div>
                    <DialogFooter className=" flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="bg-[#008236] hover:bg-green-700 text-white  w-full sm:w-auto" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

SurveyIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
