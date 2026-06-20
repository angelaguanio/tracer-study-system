import { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2, Users, TrendingUp } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export default function EmploymentLocationAnalytics({
    summary,
    cityDistribution,
    detailedData,
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [tableFilter, setTableFilter] = useState("all");

    // Get top cities for pie chart
    const topCities = cityDistribution.slice(0, 6);
    const pieData = topCities.map(city => ({
        name: city.city,
        value: city.count
    }));

    // Generate colors for cities
    const cityColors = [
        "#22c55e", "#3b82f6", "#f59e0b", "#ec4899", 
        "#14b8a6", "#8b5cf6", "#ef4444", "#06b6d4"
    ];

    const filteredTable = detailedData.filter((row) => {
        if (tableFilter === "all") return true;
        return row.company_city === tableFilter;
    });

    // Get all unique cities for the dropdown filter
    const allUniqueCities = [...new Set(detailedData.map(row => row.company_city))].sort();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 self-start">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(route("admin.analytics"))}
                        className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                        <ArrowLeft size={16} className="mr-1" /> 
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-600" />
                            Alumni Employment Cities
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Track the cities where alumni are currently employed
                        </p>
                    </div>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SummaryCard
                    icon={<Users size={24} className="text-white" />}
                    label="Total Employed"
                    value={summary.total_employed}
                />
                <SummaryCard
                    icon={<MapPin size={24} className="text-white" />}
                    label="Cities Tracked"
                    value={summary.total_cities}
                />
                <SummaryCard
                    icon={<Building2 size={24} className="text-white" />}
                    label="Outside Cabanatuan Employment"
                    value={summary.external_count}
                    sub={`${summary.external_percentage}%`}
                />
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-gray-200">
                {["overview", "table"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px cursor-pointer ${
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
                                Top Employment Cities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {summary.total_employed === 0 ? (
                                <EmptyState />
                            ) : (
                                <ResponsiveContainer width="100%" height={380}>
                                    <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={130}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ percent, value }) =>
                                                value > 0 ? `${(percent * 100).toFixed(1)}%` : ''
                                            }
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={cityColors[index % cityColors.length]} />
                                            ))}
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
                                Alumni Employment Locations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cityDistribution.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <ResponsiveContainer width="100%" height={380}>
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
                                        <Bar dataKey="count" name="Alumni Count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* TABLE TAB */}
            {activeTab === "table" && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Detailed Distribution ({filteredTable.length} records)
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Filter by City:
                                </label>
                                <Select value={tableFilter} onValueChange={setTableFilter}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="All Cities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Cities</SelectItem>
                                        {allUniqueCities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                            {["Name", "Program", "Year", "Home City", "Company", "Workplace"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTable.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800 text-center">{row.name}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.course || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">
                                                    {row.start_year && row.end_year 
                                                        ? `${row.start_year}-${row.end_year}` 
                                                        : row.year_graduated || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.home_city}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.company_name || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.company_city}</td>
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
        <Card className="border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
                    <div className="text-white">
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-gray-600 text-sm font-medium">
                        {label}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">{value}</span>
                        {sub && <span className="text-sm text-gray-500">{sub}</span>}
                    </div>
                </div>
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
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
