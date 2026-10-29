import { useState, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import AnalyticsChart from "@/components/survey/coordinator/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const latestYear = new Date().getFullYear() - 1;
const YEAR_OPTIONS = ["All Years", ...Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
})];
const SEMESTER_OPTIONS = ["All Semesters", "1st Semester", "2nd Semester", "3rd Semester", "Summer"];

/* ── shared sub-components ─────────────────────────────────── */
function SectionCard({ title, children }) {
    return (
        <div className="pdf-section bg-white border rounded-lg p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-2">{title}</h2>
            {children}
        </div>
    );
}

function StatCard({ label, value, sub }) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-1">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

/* ── main component ─────────────────────────────────────────── */
export default function CectSurveyAnalytics({
    survey,
    sections = [],
    analytics = [],
    textAnalysis = [],
    totalRespondents = 0,
    sectionSummary = [],
    filters = {},
}) {
    const [localFilters, setLocalFilters] = useState({
        year_graduated: filters.yearGraduated || "",
        semester:       filters.semester || "",
    });
    const [downloading, setDownloading] = useState(false);
    const reportRef = useRef(null);

    const handleDownload = async () => {
        if (!reportRef.current || downloading) return;
        setDownloading(true);
        try {
            const [{ toPng }, { default: jsPDF }] = await Promise.all([
                import('html-to-image'),
                import('jspdf'),
            ]);

            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pageW  = pdf.internal.pageSize.getWidth();
            const pageH  = pdf.internal.pageSize.getHeight();
            const margin = 12;
            const usableW = pageW - margin * 2;
            const usableH = pageH - margin * 2;

            let currentY = margin;

            // Collect all top-level report sections
            const sections = Array.from(reportRef.current.querySelectorAll('.pdf-section'));

            for (const section of sections) {
                const dataUrl = await toPng(section, {
                    quality: 1,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    cacheBust: true,
                    filter: (node) => !node?.classList?.contains('no-pdf'),
                });

                const img = new Image();
                img.src = dataUrl;
                await new Promise((res) => { img.onload = res; });

                const blockH = (img.height * usableW) / img.width;

                // Check if card fits on current page
                if (currentY + blockH > pageH - margin) {
                    if (currentY > margin) {
                        pdf.addPage();
                        currentY = margin;
                    }
                }

                if (blockH <= usableH) {
                    pdf.addImage(dataUrl, 'PNG', margin, currentY, usableW, blockH);
                    currentY += blockH + 6;
                } else {
                    let srcY = 0;
                    while (srcY < img.height) {
                        if (currentY > margin && srcY > 0) {
                            pdf.addPage();
                            currentY = margin;
                        }
                        const availableH = (pageH - margin) - currentY;
                        const sliceH_mm = Math.min(availableH, (img.height - srcY) * (usableW / img.width));
                        const sliceH_px = Math.floor(sliceH_mm / (usableW / img.width));

                        const sliceCanvas = document.createElement('canvas');
                        sliceCanvas.width = img.width;
                        sliceCanvas.height = sliceH_px;
                        const ctx = sliceCanvas.getContext('2d');
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                        ctx.drawImage(img, 0, srcY, img.width, sliceH_px, 0, 0, img.width, sliceH_px);

                        pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, currentY, usableW, sliceH_mm);
                        srcY += sliceH_px;
                        currentY += sliceH_mm + 6;

                        if (currentY >= pageH - margin && srcY < img.height) {
                            pdf.addPage();
                            currentY = margin;
                        }
                    }
                }
            }

            // Add page numbers & footer to every page
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(156, 163, 175);
                pdf.text(
                    "Wesleyan University - Philippines | Alumni Forms Analytics",
                    margin,
                    pageH - 4
                );
                pdf.text(
                    `Page ${i} of ${totalPages}`,
                    pageW - margin - 18,
                    pageH - 4
                );
            }

            const filterTag = localFilters.year_graduated ? `_${localFilters.year_graduated}` : '';
            pdf.save(`survey_report_${survey.id}${filterTag}_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const applyFilters = (updated) => {
        const next = { ...localFilters, ...updated };
        setLocalFilters(next);
        const params = Object.fromEntries(
            Object.entries(next).filter(([, v]) => v && v !== "All Years" && v !== "All Semesters")
        );
        router.get(route("admin.analytics.cect-show", survey.id), params, { preserveState: true, replace: true });
    };

    // Group analytics by section
    const bySection = {};
    for (const q of analytics) {
        const key = q.section_id ?? "unsectioned";
        if (!bySection[key]) bySection[key] = { title: q.section_title ?? "Questions", items: [] };
        bySection[key].items.push(q);
    }

    const textBySection = {};
    for (const t of textAnalysis) {
        const key = t.section_title ?? "Open-ended";
        if (!textBySection[key]) textBySection[key] = [];
        textBySection[key].push(t);
    }

    const downloadUrl = route("admin.analytics.cect-download", {
        survey: survey.id,
        ...(localFilters.year_graduated && localFilters.year_graduated !== "All Years"
            ? { year_graduated: localFilters.year_graduated } : {}),
        ...(localFilters.semester && localFilters.semester !== "All Semesters"
            ? { semester: localFilters.semester } : {}),
    });

    const backRoute = survey?.type === 'Tracer Study'
        ? route("admin.analytics.tracer")
        : route("admin.analytics.alumni-forms");

    return (
        <div className="min-h-screen w-full bg-app-bg p-4 sm:p-6 flex flex-col gap-6" ref={reportRef}>

         {/* Header + inline filters */}
            <div className="pdf-section flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border rounded-lg p-5 shadow-sm">
                
                <div className="flex items-start gap-3 min-w-0">
                    <Link href={backRoute} className="no-pdf">
                        <button className="p-2 rounded hover:bg-gray-200 text-gray-600 cursor-pointer shrink-0">
                            <ArrowLeft size={18} />
                        </button>
                    </Link>

                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 break-words">
                            {survey.title} — Analytics
                        </h1>

                        <p className="text-sm text-gray-500 mt-0.5">
                            Total respondents: <span className="font-semibold text-gray-800">{totalRespondents}</span>
                            {localFilters.year_graduated && <span> · Year: {localFilters.year_graduated}</span>}
                            {localFilters.semester && <span> · Semester: {localFilters.semester}</span>}
                        </p>
                    </div>
                </div>

                {/* Filters + Download grouped on the right */}
                <div className="flex flex-wrap items-end gap-2 sm:shrink-0 no-pdf">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-gray-500">Year Graduated</Label>
                        <Select
                            value={localFilters.year_graduated || "All Years"}
                            onValueChange={(v) => applyFilters({ year_graduated: v === "All Years" ? "" : v })}
                        >
                            <SelectTrigger className="h-8 text-sm w-36 bg-white cursor-pointer"><SelectValue /></SelectTrigger>
                            <SelectContent className="max-h-48 overflow-y-auto">
                                {YEAR_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-gray-500">Semester</Label>
                        <Select
                            value={localFilters.semester || "All Semesters"}
                            onValueChange={(v) => applyFilters({ semester: v === "All Semesters" ? "" : v })}
                        >
                            <SelectTrigger className="h-8 text-sm w-36 bg-white cursor-pointer"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {SEMESTER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="h-8 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                        {downloading
                            ? <><Loader2 size={16} className="animate-spin" /> Generating PDF...</>
                            : <><Download size={16} /> Download Report</>}
                    </button>
                </div>
            </div>

            {totalRespondents === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
                    No responses yet for the selected filters.
                </div>
            ) : (
                <>
                    {/* Overview stat cards */}
                    <div className="pdf-section grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Total Respondents" value={totalRespondents} />
                        <StatCard label="Sections" value={sections.length} />
                        <StatCard label="Questions with Data" value={analytics.length + textAnalysis.length} />
                        <StatCard
                            label="Choice Questions"
                            value={analytics.filter(q => ["radio","checkbox","select"].includes(q.question_type)).length}
                        />
                    </div>

                    {/* Section response rates */}
                    {sectionSummary.length > 1 && (
                        <SectionCard title="Section Response Rates">
                            <div className="flex flex-col gap-2">
                                {sectionSummary.map((s) => {
                                    const pct = totalRespondents > 0 ? Math.round((s.response_count / totalRespondents) * 100) : 0;
                                    return (
                                        <div key={s.section_id} className="flex items-center gap-3 text-sm">
                                            <span className="w-48 shrink-0 truncate text-gray-600 text-xs">{s.title}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-3">
                                                <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="shrink-0 text-xs text-gray-500 w-24 text-right">
                                                {s.response_count} / {totalRespondents} ({pct}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </SectionCard>
                    )}

                    {/* Per-section charts */}
                    {Object.entries(bySection).map(([sectionId, { title, items }]) => (
                        <SectionCard key={sectionId} title={title}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {items.map((q) => (
                                    <div key={q.question_id}>
                                        <AnalyticsChart label={q.label} data={q.data} questionType={q.question_type} />
                                        {q.question_type === "number" && q.stats && (
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500 px-1">
                                                <span>Min: <strong>{q.stats.min}</strong></span>
                                                <span>Max: <strong>{q.stats.max}</strong></span>
                                                <span>Avg: <strong>{q.stats.average}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    ))}

                    {/* Text / textarea analysis */}
                    {Object.entries(textBySection).map(([sectionTitle, questions]) => (
                        <SectionCard key={sectionTitle} title={`${sectionTitle} — Open-ended Responses`}>
                            {questions.map((t) => (
                                <div key={t.question_id} className="border rounded-lg p-4 bg-gray-50">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">{t.label}</p>
                                    <p className="text-xs text-gray-400 mb-3">{t.response_count} responses</p>
                                    {Object.keys(t.top_keywords).length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {Object.entries(t.top_keywords).map(([word, count]) => (
                                                <Badge key={word} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                                    {word} ({count})
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {t.sample_answers.length > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Sample responses:</p>
                                            {t.sample_answers.map((a, i) => (
                                                <p key={i} className="text-xs text-gray-600 italic border-l-2 border-blue-200 pl-2">"{a}"</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionCard>
                    ))}
                </>
            )}
        </div>
    );
}

CectSurveyAnalytics.layout = (page) => <AdminLayout>{page}</AdminLayout>;
