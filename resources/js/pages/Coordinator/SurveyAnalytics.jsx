import { useState } from "react";
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import AnalyticsChart from "@/components/survey/coordinator/AnalyticsChart";
import SectionSummaryTable from "@/components/survey/coordinator/SectionSummaryTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YEARS = ["All Years", "2018", "2019", "2020", "2021", "2022"];

export default function SurveyAnalytics({ survey, sections = [], analytics = [], totalRespondents = 0, sectionSummary = [] }) {
    const [filters, setFilters] = useState({ section_id: "", year_graduated: "", from: "", to: "" });

    const applyFilters = (updated) => {
        const next = { ...filters, ...updated };
        setFilters(next);
        const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v !== "All Years"));
        router.get(route("coordinator.surveys.analytics", survey.id), params, { preserveState: true, replace: true });
    };

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-800">{survey.title} — Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Total respondents: <span className="font-semibold text-gray-800">{totalRespondents}</span></p>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 min-w-36">
                    <Label className="text-xs">Section</Label>
                    <Select value={filters.section_id || "all"} onValueChange={(v) => applyFilters({ section_id: v === "all" ? "" : v })}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="All Sections" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {sections.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1 min-w-36">
                    <Label className="text-xs">Year Graduated</Label>
                    <Select value={filters.year_graduated || "All Years"} onValueChange={(v) => applyFilters({ year_graduated: v === "All Years" ? "" : v })}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs">From</Label>
                    <Input type="date" className="h-8 text-sm" value={filters.from} onChange={(e) => applyFilters({ from: e.target.value })} />
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs">To</Label>
                    <Input type="date" className="h-8 text-sm" value={filters.to} onChange={(e) => applyFilters({ to: e.target.value })} />
                </div>
            </div>

            {/* Section summary */}
            <SectionSummaryTable sectionSummary={sectionSummary} />

            {/* Charts */}
            {analytics.length === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">No response data available.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analytics.map((q) => <AnalyticsChart key={q.question_id} label={q.label} data={q.data} />)}
                </div>
            )}
        </div>
    );
}

SurveyAnalytics.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;
