import { useState, useRef } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import AnalyticsChart from "@/components/survey/coordinator/AnalyticsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, Legend, CartesianGrid,
    PieChart, Pie,
} from "recharts";

const latestYear = new Date().getFullYear() - 1;
const YEAR_OPTIONS = ["All Years", ...Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
})];

const SEMESTER_OPTIONS = ["All Semesters", "1st Semester", "2nd Semester", "3rd Semester", "Summer"];
const COLORS = ["#2859C5", "#008236", "#E70813", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"];

/* ── Small reusable pieces ── */
function StatCard({ label, value, sub }) {
    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-1">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

function SectionCard({ title, children, action }) {
    return (
        <div className="pdf-section bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-4 overflow-hidden w-full">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h2>
                {action && <div className="no-pdf">{action}</div>}
            </div>
            {children}
        </div>
    );
}

function DistributionBar({ label, value, total, color = "#2859C5" }) {
    const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
    return (
        <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-36 shrink-0 truncate text-gray-600 text-xs">{label}</span>
            <div className="flex-1 min-w-0 bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="shrink-0 text-right text-gray-700 font-medium text-xs tabular-nums">
                {value}
                <span className="text-gray-400 font-normal"> / {total}</span>
            </span>
        </div>
    );
}

/* Custom donut label */
const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
            {`${Math.round(percent * 100)}%`}
        </text>
    );
};

export default function SurveyAnalytics({
    survey,
    sections = [],
    analytics = [],
    totalRespondents = 0,
    sectionSummary = [],
    descriptive = {},
    employment = {},
    likertGroups = [],
    trendByYear = [],
    textAnalysis = [],
    filters = {},
}) {
    const [localFilters, setLocalFilters] = useState({
        year_graduated: filters.yearGraduated || "",
        semester: filters.semester || "",
    });
    const [downloading, setDownloading] = useState(false);
    const [showPerQuestion, setShowPerQuestion] = useState(false);
    const reportRef = useRef(null);

    /* ── PDF download (Section-aware, never cuts charts in half) ── */
    const handleDownload = async () => {
        if (!reportRef.current || downloading) return;
        setDownloading(true);
        const prevShow = showPerQuestion;
        setShowPerQuestion(true);
        try {
            const [{ toPng }, { default: jsPDF }] = await Promise.all([
                import('html-to-image'),
                import('jspdf'),
            ]);

            // Give React time to render all expanded questions and Recharts to render the charts
            await new Promise((res) => setTimeout(res, 800));

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

                // If block fits on the page (almost all cards fit!)
                if (blockH <= usableH) {
                    pdf.addImage(dataUrl, 'PNG', margin, currentY, usableW, blockH);
                    currentY += blockH + 6;
                } else {
                    // Slices only exceptionally oversized blocks
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
                    "Wesleyan University - Philippines | Tracer Study Analytics",
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
            setShowPerQuestion(prevShow);
            setDownloading(false);
        }
    };

    const applyFilters = (updated) => {
        const next = { ...localFilters, ...updated };
        setLocalFilters(next);
        const params = Object.fromEntries(
            Object.entries(next).filter(([, v]) => v && v !== "All Years" && v !== "All Semesters")
        );
        router.get(route("admin.analytics.show", survey.id), params, { preserveState: true, replace: true });
    };

    const degreeData = Object.entries(descriptive.degree_distribution || {}).map(([k, v]) => ({ name: k || "Unknown", value: v }));
    const yearData   = Object.entries(descriptive.year_distribution   || {}).map(([k, v]) => ({ name: k, value: v }));

    const trendData = trendByYear.map(t => ({
        year: String(t.year),
        employment_rate: t.employment_rate,
        ...Object.fromEntries(Object.entries(t.section_scores || {}).map(([k, v]) => [k, v])),
    }));

    const sectionColors = {};
    (likertGroups || []).forEach((g, i) => { sectionColors[g.section_title] = COLORS[i % COLORS.length]; });

    /* Employment donut data */
    const empDonutData = [
        { name: "Employed",   value: employment.employed   ?? 0, color: "#008236" },
        { name: "Unemployed", value: employment.unemployed ?? 0, color: "#E70813" },
    ].filter(d => d.value > 0);

    const yearLabel = yearData.length > 0
        ? yearData[0].name === yearData[yearData.length - 1].name
            ? yearData[0].name
            : `${yearData[0].name.split('-')[0]} – ${yearData[yearData.length - 1].name.split('-')[1] || yearData[yearData.length - 1].name}`
        : "—";

    const backRoute = survey?.type === 'Tracer Study'
        ? route("admin.analytics.tracer")
        : route("admin.analytics.alumni-forms");

    return (
        <div className="min-h-screen w-full bg-app-bg p-4 sm:p-6 flex flex-col gap-5" ref={reportRef}>

            {/* ── Header + inline filters ── */}
            <div className="pdf-section flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3 min-w-0">
                    <Link href={backRoute} className="no-pdf">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-800 p-0 hover:bg-transparent">
                            <ArrowLeft size={16} />
                        </Button>
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
                            <SelectTrigger className="h-8 text-sm w-36 bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {SEMESTER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="h-8 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {downloading
                            ? <><Loader2 size={16} className="animate-spin" /> Generating PDF...</>
                            : <><Download size={16} /> Download Report</>}
                    </button>
                </div>
            </div>

            {totalRespondents === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center text-gray-400 shadow-sm">No response data available.</div>
            ) : (
                <>
                {/* ── 1. Overview ── */}
                <div className="pdf-section grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Total Respondents" value={totalRespondents} />
                    <StatCard label="Employment Rate"   value={`${employment.rate ?? 0}%`} sub={`${employment.employed ?? 0} employed`} />
                    <StatCard label="Degrees Represented" value={Object.keys(descriptive.degree_distribution || {}).length} />
                    <StatCard label="Year Range" value={yearLabel} />
                </div>

                {/* ── 2. Employment Overview ── */}
                <SectionCard title="Employment Overview">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        {/* Donut chart */}
                        {empDonutData.length > 0 && (
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={empDonutData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            labelLine={false}
                                            label={renderDonutLabel}
                                        >
                                            {empDonutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(v) => [`${v} respondents`]} />
                                        <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Stat breakdown */}
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard label="Employed"   value={employment.employed   ?? 0} sub={`${employment.rate ?? 0}% of respondents`} />
                                <StatCard label="Unemployed" value={employment.unemployed ?? 0} />
                                {employment.salary && (
                                    <div className="col-span-2">
                                        <StatCard
                                            label="Avg Salary"
                                            value={`₱${employment.salary.average?.toLocaleString()}`}
                                            sub={`Min ₱${employment.salary.min?.toLocaleString()} · Max ₱${employment.salary.max?.toLocaleString()}`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Industry breakdown — only if meaningful (more than 1 company) */}
                    {Object.keys(employment.industry || {}).length > 1 && (
                        <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Top Industries / Companies</p>
                            {Object.entries(employment.industry).slice(0, 8).map(([k, v], i) => (
                                <DistributionBar key={k} label={k} value={v} total={employment.employed ?? totalRespondents} color={COLORS[i % COLORS.length]} />
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* ── 3. Respondent Distribution ── */}
                <SectionCard title="Respondent Distribution">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {degreeData.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-3">By Degree Program</p>
                                {degreeData.map((d, i) => (
                                    <DistributionBar key={d.name} label={d.name} value={d.value} total={totalRespondents} color={COLORS[i % COLORS.length]} />
                                ))}
                            </div>
                        )}
                        {yearData.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-3">By Year Graduated</p>
                                {/* Horizontal bars: year labels on Y-axis — no cut-off regardless of how many years */}
                                <ResponsiveContainer width="100%" height={Math.max(160, yearData.length * 22)}>
                                    <BarChart data={yearData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                                        <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{ fontSize: 10 }}
                                            width={72}
                                        />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#2859C5" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* ── 4. Likert / Skills Analysis ── */}
                {likertGroups.length > 0 && (
                    <SectionCard title="Skills & Competency Analysis">
                        {/* Section score cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {likertGroups.map((g) => (
                                <div key={g.section_id} className="border rounded-xl p-4 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">{g.section_title}</p>
                                    <p className="text-3xl font-bold" style={{ color: sectionColors[g.section_title] }}>
                                        {g.avg_score}
                                        <span className="text-sm font-normal text-gray-400 ml-1">/ {g.max_score}</span>
                                    </p>
                                    {g.strongest && <p className="text-xs text-green-600 mt-2">↑ {g.strongest.label} ({g.strongest.avg_score})</p>}
                                    {g.weakest   && <p className="text-xs text-red-500">↓ {g.weakest.label} ({g.weakest.avg_score})</p>}
                                </div>
                            ))}
                        </div>

                        {/* Per-section question rankings */}
                        {likertGroups.map((g) => (
                            <div key={g.section_id} className="mt-1">
                                <p className="text-xs font-semibold text-gray-500 mb-2">{g.section_title} — Question Rankings</p>
                                <div className="flex flex-col gap-1.5">
                                    {g.questions.map((q, i) => (
                                        <div key={q.question_id} className="flex items-center gap-2 text-sm">
                                            <span className="w-5 text-gray-400 text-xs shrink-0">{i + 1}.</span>
                                            <span className="flex-1 text-gray-700 text-xs">{q.label}</span>
                                            <span className="font-semibold text-gray-800 text-sm tabular-nums">{q.avg_score}</span>
                                            <span className="text-gray-400 text-xs">/ {q.max_score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </SectionCard>
                )}

                {/* ── 5. Trend Analysis ── */}
                {trendData.length > 1 && (
                    <SectionCard title="Trends Over Time">
                        <p className="text-xs font-semibold text-gray-500 -mb-2">Employment Rate by Graduation Year</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                                <Tooltip formatter={(v) => `${v}%`} />
                                <Line type="monotone" dataKey="employment_rate" stroke="#008236" strokeWidth={2.5} dot={{ r: 3 }} name="Employment Rate" />
                            </LineChart>
                        </ResponsiveContainer>

                        {likertGroups.length > 0 && (
                            <>
                                <p className="text-xs font-semibold text-gray-500 mt-2 -mb-2">Average Section Scores by Graduation Year</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                                        {likertGroups.map((g, i) => (
                                            <Line key={g.section_id} type="monotone" dataKey={g.section_title} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </SectionCard>
                )}

                {/* ── 6. Text Response Analysis ── */}
                {textAnalysis.length > 0 && (
                    <SectionCard title="Open-Ended Responses">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {textAnalysis.map((t) => (
                                <div key={t.question_id} className="border rounded-xl p-4 bg-gray-50 flex flex-col gap-2">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700">{t.question_label}</p>
                                        <p className="text-xs text-gray-400">{t.section_title} · {t.response_count} responses</p>
                                    </div>
                                    {Object.keys(t.top_keywords).length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {Object.entries(t.top_keywords).slice(0, 8).map(([word, count]) => (
                                                <Badge key={word} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-normal">
                                                    {word} <span className="text-blue-400 ml-0.5">·{count}</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {t.sample_answers.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-1">
                                            {(downloading ? t.sample_answers : t.sample_answers.slice(0, 4)).map((a, i) => (
                                                <p key={i} className="text-xs text-gray-600 italic border-l-2 border-blue-200 pl-2">"{a}"</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {/* ── 7. Per-Question Charts (collapsible on screen, fully rendered for PDF export) ── */}
                {analytics.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="pdf-section bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Per-Question Breakdown ({analytics.length} questions)
                            </h2>
                            <div className="no-pdf">
                                <button
                                    onClick={() => setShowPerQuestion(v => !v)}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                                >
                                    {showPerQuestion ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Show all {analytics.length} questions</>}
                                </button>
                            </div>
                        </div>

                        {(showPerQuestion || downloading) ? (
                            Array.from({ length: Math.ceil(analytics.length / 2) }).map((_, rowIndex) => {
                                const pair = analytics.slice(rowIndex * 2, rowIndex * 2 + 2);
                                return (
                                    <div key={rowIndex} className="pdf-section grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {pair.map((q) => (
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
                                );
                            })
                        ) : (
                            <div className="bg-white border rounded-xl p-6 text-center text-gray-400 shadow-sm no-pdf">
                                <p className="text-xs">
                                    Click{" "}
                                    <button
                                        onClick={() => setShowPerQuestion(true)}
                                        className="font-medium text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Show all {analytics.length} questions
                                    </button>{" "}
                                    to view individual question charts.
                                </p>
                            </div>
                        )}
                    </div>
                )}
                </>
            )}
        </div>
    );
}

SurveyAnalytics.layout = (page) => <AdminLayout>{page}</AdminLayout>;
