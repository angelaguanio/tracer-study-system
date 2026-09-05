import { router } from "@inertiajs/react";
import { BarChart2, MapPin } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function AnalyticsIndex({ surveys, type, latestTracerId }) {
    const currentList = surveys.data ?? [];

    const pageTitle = type === 'tracer' ? 'Tracer Study Analytics' : 'General Survey Analytics';

    return (
        <div className="w-full max-w-full px-4 py-6 flex flex-col gap-4 self-start">
            <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>

            <div className="pt-2">
                <p className="text-md text-gray-500 mt-2 mb-2 pl-2">Available Surveys</p>
            </div>

            {currentList.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No surveys available.</p>
            ) : (
                currentList.map((survey) => (
                    <Card key={survey.id} className="bg-white border shadow-sm">
                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 pl-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold text-gray-800">{survey.title}</h2>
                                    {type === 'tracer' && survey.id === latestTracerId && (
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                                            Currently Active
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Badge className={survey.status === "active" ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-500 border-gray-300"}>
                                        {survey.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                    <span>{survey.sections_count} section{survey.sections_count !== 1 ? "s" : ""}</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => router.get(
                                    survey.is_tracer_study
                                        ? route("admin.analytics.show", survey.id)
                                        : route("admin.analytics.cect-show", survey.id)
                                )}
                            >
                                <BarChart2 size={14} />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}

            {surveys.last_page > 1 && (
                <div className="flex justify-start items-center mt-6">
                    <Pagination className="justify-start">
                        <PaginationContent>

                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (surveys.current_page > 1) {
                                            router.get(
                                                route("admin.analytics"),
                                                {
                                                    page: surveys.current_page - 1,
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
                                        surveys.current_page === 1
                                            ? "pointer-events-none opacity-40"
                                            : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                    }`}
                                />
                            </PaginationItem>

                            {Array.from(
                                { length: surveys.last_page },
                                (_, i) => i + 1
                            )
                                .filter((page) => {
                                    const current = surveys.current_page;

                                    return (
                                        page === 1 ||
                                        page === surveys.last_page ||
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
                                                isActive={surveys.current_page === page}
                                                onClick={(e) => {
                                                    e.preventDefault();

                                                    router.get(
                                                        route("admin.analytics"),
                                                        { page },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            replace: true,
                                                        }
                                                    );
                                                }}
                                                className={`h-9 w-9 p-0 transition-colors ${
                                                    surveys.current_page === page
                                                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white"
                                                        : "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                                }`}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                            surveys.current_page <
                                            surveys.last_page
                                        ) {
                                            router.get(
                                                route(type === 'tracer' ? "admin.analytics.tracer" : "admin.analytics.general"),
                                                {
                                                    page: surveys.current_page + 1,
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
                                        surveys.current_page === surveys.last_page
                                            ? "pointer-events-none opacity-40"
                                            : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                    }`}
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

AnalyticsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
