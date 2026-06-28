import { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function EmploymentLocationAnalytics({ summary, cityDistribution, detailedData }) {
    const [tableFilter, setTableFilter] = useState("all");

    const filteredTable = tableFilter === "all"
        ? detailedData
        : detailedData.filter(row => row.company_city === tableFilter);

    const allUniqueCities = [...new Set(detailedData.map(row => row.company_city))].sort();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 self-start">

            {/* HEADER */}
            <div className="flex items-start gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.visit(route("admin.analytics"))}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer shrink-0"
                >
                    <ArrowLeft size={16} />
                </Button>
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-600 shrink-0" />
                        Alumni Employment Cities
                    </h1>
                    <p className="text-md text-gray-500">Track where alumni are currently employed</p>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard label="Total Employed" value={summary.total_employed} icon={<Users size={20} className="text-blue-600" />} />
                <StatCard label="Cities Tracked" value={summary.total_cities} icon={<MapPin size={20} className="text-blue-600" />} />
            </div>

            {/* BAR CHART */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-md font-semibold text-gray-700">
                        Alumni Employment Locations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cityDistribution.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={cityDistribution.slice(0, 8)}
                                layout="vertical"
                                margin={{ left: 10, right: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 13 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="city" tick={{ fontSize: 15 }} width={80} />
                                <Tooltip />
                                <Bar dataKey="count" name="Alumni" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* DETAIL TABLE */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-md font-semibold text-gray-700">
                            Detailed Distribution ({filteredTable.length} records)
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Filter:</span>
                            <Select value={tableFilter} onValueChange={setTableFilter}>
                                <SelectTrigger className="w-44 h-8 text-sm">
                                    <SelectValue placeholder="All Cities" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {allUniqueCities.map(city => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
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
                        <>
                            {/* MOBILE CARDS */}
                            <div className="block md:hidden p-4 space-y-3">
                                {filteredTable.map((row, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b bg-gray-50 flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
                                                <p className="text-xs text-gray-500">{row.course || "—"}</p>
                                            </div>
                                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                {row.start_year && row.end_year ? `${row.start_year}-${row.end_year}` : "—"}
                                            </span>
                                        </div>
                                        <div className="p-4 grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Home</p>
                                                <p className="mt-0.5 text-sm text-gray-800">{row.home_city || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Workplace</p>
                                                <p className="mt-0.5 text-sm text-gray-800">{row.company_city || "—"}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Company</p>
                                                <p className="mt-0.5 text-sm text-gray-800">{row.company_name || "—"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {["Name", "Program", "Year", "Home City", "Company", "Workplace"].map(h => (
                                                <th key={h} className="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTable.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800 text-center">{row.name}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.course || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">
                                                    {row.start_year && row.end_year ? `${row.start_year}-${row.end_year}` : row.year_graduated || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.home_city}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.company_name || "—"}</td>
                                                <td className="px-4 py-3 text-gray-600 text-center">{row.company_city}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

EmploymentLocationAnalytics.layout = (page) => <AdminLayout>{page}</AdminLayout>;

function StatCard({ label, value, icon }) {
    return (
        <Card className="border-gray-200 shadow-sm bg-white">
            <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <div>
                    <p className="text-lg text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
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
            <p className="text-xs">Alumni need a company location on file.</p>
        </div>
    );
}
