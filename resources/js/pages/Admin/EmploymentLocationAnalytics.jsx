import { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2, Users, TrendingUp } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = {
    local: "#22c55e",
    external: "#3b82f6",
};

const COURSE_COLORS = ["#6366f1", "#f59e0b", "#ec4899", "#14b8a6"];

export default function EmploymentLocationAnalytics({
    summary,
    cityDistribution,
    yearBreakdown,
    courseBreakdown,
    detailedData,
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [tableFilter, setTableFilter] = useState("all");

    const pieData = [
        { name: "Local Employment", value: summary.local_count },
        { name: "External Employment", value: summary.external_count },
    ];

    const filteredTable = detailedData.filter((row) => {
        if (tableFilter === "local") return row.is_local;
        if (tableFilter === "external") return !row.is_local;
        return true;
    });

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 self-start">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(route("admin.analytics"))}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-600" />
                            Employment Location Analytics
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Local vs. External employment based on home address and company location
                        </p>
                    </div>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    icon={<Users size={18} className="text-gray-600" />}
                    label="Total Employed"
                    value={summary.total_employed}
                    color="bg-gray-50"
                />
                <SummaryCard
                    icon={<MapPin size={18} className="text-green-600" />}
                    label="Local Employment"
                    value={summary.local_count}
                    sub={`${summary.local_percentage}%`}
                    color="bg-green-50"
                />
                <SummaryCard
                    icon={<Building2 size={18} className="text-blue-600" />}
                    label="External Employment"
                    value={summary.external_count}
                    sub={`${summary.external_percentage}%`}
                    color="bg-blue-50"
                />
                <SummaryCard
                    icon={<TrendingUp size={18} className="text-purple-600" />}
                    label="Cities Tracked"
                    value={cityDistribution.length}
                    color="bg-purple-50"
                />
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-gray-200">
                {["overview", "by-year", "by-course", "table"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                            activeTab === tab
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* PIE CHART */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Local vs. External Ratio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {summary.total_employed === 0 ? (
                                <EmptyState />
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${(percent * 100).toFixed(1)}%`
                                            }
                                        >
                                            <Cell fill={COLORS.local} />
                                            <Cell fill={COLORS.external} />
                                        </Pie>
                                        <Tooltip formatter={(v, n) => [v, n]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* CITY DISTRIBUTION BAR */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Top Company Locations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cityDistribution.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart
                                        data={cityDistribution.slice(0, 8)}
                                        layout="vertical"
                                        margin={{ left: 10, right: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis
                                            type="category"
                                            dataKey="city"
                                            tick={{ fontSize: 11 }}
                                            width={90}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="local" name="Local" fill={COLORS.local} stackId="a" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="external" name="External" fill={COLORS.external} stackId="a" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* BY YEAR TAB */}
            {activeTab === "by-year" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Local vs. External by Graduation Year
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {yearBreakdown.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={yearBreakdown} margin={{ top: 10, right: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="local" name="Local" fill={COLORS.local} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="external" name="External" fill={COLORS.external} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* BY COURSE TAB */}
            {activeTab === "by-course" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Local vs. External by Course
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {courseBreakdown.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={courseBreakdown} margin={{ top: 10, right: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="local" name="Local" fill={COLORS.local} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="external" name="External" fill={COLORS.external} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* TABLE TAB */}
            {activeTab === "table" && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Detailed Distribution ({filteredTable.length} records)
                            </CardTitle>
                            <div className="flex gap-2">
                                {["all", "local", "external"].map((f) => (
                                    <Button
                                        key={f}
                                        size="sm"
                                        variant={tableFilter === f ? "default" : "outline"}
                                        onClick={() => setTableFilter(f)}
                                        className="capitalize text-xs"
                                    >
                                        {f}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredTable.length === 0 ? (
                            <div className="p-6"><EmptyState /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {["Name", "Course", "Year", "Home City", "Company", "Company City", "Type"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTable.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.course || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.year_graduated || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.home_city}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.company_name || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.company_city}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={row.is_local
                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                        : "bg-blue-100 text-blue-700 border-blue-200"
                                                    }>
                                                        {row.is_local ? "Local" : "External"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    );
}

EmploymentLocationAnalytics.layout = (page) => <AdminLayout>{page}</AdminLayout>;

function SummaryCard({ icon, label, value, sub, color }) {
    return (
        <Card className={`${color} border-0 shadow-sm`}>
            <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    {icon} {label}
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-800">{value}</span>
                    {sub && <span className="text-sm text-gray-500 mb-0.5">{sub}</span>}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
            <MapPin size={32} className="opacity-30" />
            <p className="text-sm">No data available yet.</p>
            <p className="text-xs">Alumni need both an address and company location on file.</p>
        </div>
    );
}
