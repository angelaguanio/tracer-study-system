import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { BarChart2, Archive } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";
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

export default function CoordinatorAnalyticsIndex({ surveys = { data: [] }, archivedSurveys = { data: [] } }) {
    const [tab, setTab] = useState("active");
    const currentData = tab === "active" ? surveys : archivedSurveys;
    const currentList = currentData?.data ?? [];
    const isArchivedTab = tab === "archived";
    const pageParam = tab === "active" ? "page" : "archived_page";

    const goToPage = (page) => {
        router.get(
            route("coordinator.analytics"),
            {
                [pageParam]: page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="w-full max-w-full px-4 py-6 flex flex-col gap-4 self-start">
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>

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
                    {(surveys?.total ?? 0) > 0 && (
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === "active" ? "bg-white/20" : "bg-gray-100"}`}>
                            {surveys.total}
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
                    {(archivedSurveys?.total ?? 0) > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "archived" ? "bg-white/20" : "bg-gray-100"}`}>
                            {archivedSurveys.total}
                        </span>
                    )}
                </button>
            </div>

            <div className="py-2">
                <p className="text-lg text-gray-500">
                    {isArchivedTab ? "Archived Surveys with Responses" : "Active Survey Analytics"}
                </p>
            </div>

            {currentList.length === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
                    {isArchivedTab ? "No archived surveys available." : "No surveys with responses available yet."}
                </div>
            ) : (
                currentList.map((survey) => (
                    <Card key={survey.id} className="bg-white border shadow-sm">
                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 pl-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold text-gray-800">{survey.title}</h2>
                                    {isArchivedTab && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                                            Archived
                                        </span>
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
                                        {survey.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                    <span>
                                        {survey.sections_count} section
                                        {survey.sections_count !== 1 ? "s" : ""}
                                    </span>
                                    <span>·</span>
                                    <span>{survey.response_count ?? survey.responses_count ?? 0} response{(survey.response_count ?? survey.responses_count) !== 1 ? "s" : ""}</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() =>
                                    router.get(
                                        route("coordinator.analytics.cect-show", survey.id)
                                    )
                                }
                            >
                                <BarChart2 size={14} />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}

            {(currentData?.last_page ?? 1) > 1 && (
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
                                            goToPage(currentData.current_page - 1);
                                        }
                                    }}
                                    className={`h-9 transition-colors ${
                                        currentData.current_page === 1
                                            ? "pointer-events-none opacity-40"
                                            : "cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300"
                                    }`}
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
                                        (page >= current - 1 && page <= current + 1)
                                    );
                                })
                                .map((page, index, arr) => {
                                    const prevPage = arr[index - 1];

                                    return (
                                        <PaginationItem key={page}>
                                            {prevPage && page - prevPage > 1 && (
                                                <PaginationEllipsis />
                                            )}

                                            <PaginationLink
                                                href="#"
                                                isActive={currentData.current_page === page}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    goToPage(page);
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
                                        if (currentData.current_page < currentData.last_page) {
                                            goToPage(currentData.current_page + 1);
                                        }
                                    }}
                                    className={`h-9 transition-colors ${
                                        currentData.current_page === currentData.last_page
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

CoordinatorAnalyticsIndex.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;
