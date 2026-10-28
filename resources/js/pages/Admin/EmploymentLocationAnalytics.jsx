import { useState, useRef } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Users, Download, Loader2, FileSpreadsheet } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function EmploymentLocationAnalytics({ summary, cityDistribution, detailedData }) {
    const [tableFilter, setTableFilter] = useState("all");
    const [downloading, setDownloading] = useState(false);
    const topSectionRef = useRef(null);

    const filteredTable = tableFilter === "all"
        ? detailedData
        : detailedData.filter(row => row.company_city === tableFilter);

    const allUniqueCities = [...new Set(detailedData.map(row => row.company_city))].sort();

    /* ── PDF download with jspdf-autotable ── */
    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            const [{ toPng }, { default: jsPDF }, autoTableModule] = await Promise.all([
                import('html-to-image'),
                import('jspdf'),
                import('jspdf-autotable'),
            ]);

            const autoTable = autoTableModule.default || autoTableModule.autoTable || autoTableModule;

            // Landscape A4: 297mm x 210mm
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 14;
            const usableW = pageW - margin * 2;

            // 1. Report Title & Metadata
            pdf.setFontSize(16);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(17, 24, 39);
            pdf.text("Employment Location Report", margin, 15);

            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(107, 114, 128);
            pdf.text("Track where alumni are currently employed", margin, 20);

            const activeFilterText = tableFilter === "all" ? "All Cities" : tableFilter;
            const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            pdf.text(
                `Generated: ${dateStr}   |   Filter: ${activeFilterText}   |   Records: ${filteredTable.length} employed alumni`,
                margin,
                25
            );

            // 2. Capture Top Section (Stat Cards + Bar Chart) for Page 1
            let startTableY = 30;
            if (topSectionRef.current) {
                const dataUrl = await toPng(topSectionRef.current, {
                    quality: 1,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    cacheBust: true,
                });

                const img = new Image();
                img.src = dataUrl;
                await new Promise((res) => { img.onload = res; });

                const imgH = (img.height * usableW) / img.width;
                const renderedTopH = Math.min(imgH, 115);

                pdf.addImage(dataUrl, 'PNG', margin, 29, usableW, renderedTopH);
                startTableY = 29 + renderedTopH + 8;
            }

            // 3. Section Title for the Table
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(55, 65, 81);
            pdf.text(`Detailed Distribution (${filteredTable.length} records)`, margin, startTableY);

            // 4. Render Table with autoTable (never cuts off rows, fits all columns within margin)
            const tableRows = filteredTable.map((row) => [
                row.name || "—",
                row.course || "—",
                row.start_year && row.end_year ? `${row.start_year}-${row.end_year}` : row.year_graduated || "—",
                row.home_city || "—",
                row.company_name || "—",
                row.company_city || "—",
            ]);

            autoTable(pdf, {
                startY: startTableY + 3,
                margin: { left: margin, right: margin, bottom: 14 },
                head: [["Name", "Program", "Year", "Home City", "Company", "Workplace"]],
                body: tableRows,
                theme: 'striped',
                headStyles: {
                    fillColor: [0, 154, 251], // #009AFB matching UI
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 8.5,
                    cellPadding: 3,
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2.2,
                    textColor: [55, 65, 81],
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: 50, halign: 'left' },
                    1: { cellWidth: 32, halign: 'center' },
                    2: { cellWidth: 28, halign: 'center' },
                    3: { cellWidth: 46, halign: 'center' },
                    4: { cellWidth: 64, halign: 'left' },
                    5: { cellWidth: 49, halign: 'center' },
                },
                styles: {
                    overflow: 'linebreak',
                },
                showHead: 'everyPage',
            });

            // 5. Add clean footer with page numbering to every page
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(156, 163, 175);
                pdf.text(
                    "Wesleyan University - Philippines | Employment Location Report",
                    margin,
                    pageH - 6
                );
                pdf.text(
                    `Page ${i} of ${totalPages}`,
                    pageW - margin - 18,
                    pageH - 6
                );
            }

            const cityTag = tableFilter !== 'all' ? `_${tableFilter.replace(/\s+/g, '_')}` : '';
            pdf.save(`employment_location_report${cityTag}_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    /* ── CSV download ── */
    const handleExportCsv = () => {
        const url = route('admin.analytics.employment-location.download', {
            city: tableFilter !== 'all' ? tableFilter : undefined,
        });
        window.location.href = url;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 self-start">

            {/* HEADER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-600 shrink-0" />
                        Employment Location Report
                    </h1>
                    <p className="text-md text-gray-500 mt-0.5">Track where alumni are currently employed</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto no-pdf">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="h-8 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                        {downloading
                            ? <><Loader2 size={16} className="animate-spin" /> Generating PDF...</>
                            : <><Download size={16} /> Download Report</>}
                    </button>
                    <button
                        onClick={handleExportCsv}
                        className="h-8 px-3 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                        title="Download CSV spreadsheet"
                    >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* TOP SECTION: SUMMARY CARDS & BAR CHART */}
            <div ref={topSectionRef} className="space-y-6">
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
            </div>

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
                                    <thead className="bg-[#009AFB] border-b border-[#009AFB]">
                                        <tr>
                                            {["Name", "Program", "Year", "Home City", "Company", "Workplace"].map(h => (
                                                <th key={h} className="px-4 py-3 text-center text-[11px] font-bold text-white uppercase tracking-wider">{h}</th>
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
