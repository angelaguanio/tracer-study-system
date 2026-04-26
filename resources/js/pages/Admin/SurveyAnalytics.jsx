import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import AnalyticsChart from "@/components/survey/coordinator/AnalyticsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, CartesianGrid } from "recharts";

const YEARS = ["All Years", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const COLORS = ["#2859C5", "#008236", "#E70813", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"];

function StatCard({ label, value, sub }) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-1">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-3 overflow-hidden w-full">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-2">{title}</h2>
            {children}
        </div>
    );
}

function DistributionBar({ label, value, total, color = "#2859C5" }) {
    const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
    return (
        <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-36 shrink-0 truncate text-gray-600 text-xs">{label}</span>
            <div className="flex-1 min-w-0 bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="shrink-0 w-20 text-right text-gray-700 font-medium text-xs">
                {value} <span className="text-gray-400 font-normal">({pct}%)</span>
            </span>
        </div>
    );
}

export default function SurveyAnalytics({
    survey,
    sections = [],
    analytics = [],
    totalRespondents = 0,
    sectionSummary = [],
    descriptive = {},
    employment = {},
    likertGroups = [],
    crossAnalysis = {},
    trendByYear = [],
    textAnalysis = [],
    filters = {},
    locationMigration = {},
}) {
    const [localFilters, setLocalFilters] = useState({
        year_graduated: filters.yearGraduated || "",
        from: filters.from || "",
        to: filters.to || "",
    });

    const applyFilters = (updated) => {
        const next = { ...localFilters, ...updated };
        setLocalFilters(next);
        const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v !== "All Years"));
        router.get(route("admin.surveys.analytics", survey.id), params, { preserveState: true, replace: true });
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

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href={route("admin.analytics")}>
                    <button className="p-2 rounded hover:bg-gray-200 text-gray-600"><ArrowLeft size={18} /></button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{survey.title} — Analytics</h1>
                    <p className="text-sm text-gray-500">Total respondents: <span className="font-semibold text-gray-800">{totalRespondents}</span></p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 min-w-36">
                    <Label className="text-xs">Year Graduated</Label>
                    <Select value={localFilters.year_graduated || "All Years"} onValueChange={(v) => applyFilters({ year_graduated: v === "All Years" ? "" : v })}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">From</Label>
                    <Input type="date" className="h-8 text-sm" value={localFilters.from} onChange={(e) => applyFilters({ from: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">To</Label>
                    <Input type="date" className="h-8 text-sm" value={localFilters.to} onChange={(e) => applyFilters({ to: e.target.value })} />
                </div>
            </div>

            {totalRespondents === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">No response data available.</div>
            ) : (
                <>
                {/* ── 1. Descriptive Statistics ── */}
                <SectionCard title="1. Descriptive Statistics">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Total Respondents" value={totalRespondents} />
                        <StatCard label="Employment Rate" value={`${employment.rate ?? 0}%`} sub={`${employment.employed ?? 0} employed`} />
                        <StatCard label="Degrees Represented" value={Object.keys(descriptive.degree_distribution || {}).length} />
                        <StatCard label="Year Range" value={yearData.length > 0 ? `${yearData[0].name} – ${yearData[yearData.length-1].name}` : "—"} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {degreeData.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Degree Distribution</p>
                                {degreeData.map((d, i) => (
                                    <DistributionBar key={d.name} label={d.name} value={d.value} total={totalRespondents} color={COLORS[i % COLORS.length]} />
                                ))}
                            </div>
                        )}
                        {yearData.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Year Graduated Distribution</p>
                                <ResponsiveContainer width="100%" height={160}>
                                    <BarChart data={yearData}>
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#2859C5" radius={[4,4,0,0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* ── 2. Employment Analysis ── */}
                <SectionCard title="2. Employment Analysis">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <StatCard label="Employed" value={employment.employed ?? 0} sub={`${employment.rate ?? 0}% of respondents`} />
                        <StatCard label="Unemployed" value={employment.unemployed ?? 0} />
                        {employment.salary && (
                            <StatCard label="Avg Salary" value={`₱${employment.salary.average?.toLocaleString()}`} sub={`Min ₱${employment.salary.min?.toLocaleString()} · Max ₱${employment.salary.max?.toLocaleString()}`} />
                        )}
                    </div>

                    {Object.keys(employment.breakdown || {}).length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Employment Status Breakdown</p>
                            {Object.entries(employment.breakdown).map(([k, v], i) => (
                                <DistributionBar key={k} label={k} value={v} total={totalRespondents} color={COLORS[i % COLORS.length]} />
                            ))}
                        </div>
                    )}

                    {Object.keys(employment.industry || {}).length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Industry / Company Type</p>
                            {Object.entries(employment.industry).slice(0, 10).map(([k, v], i) => (
                                <DistributionBar key={k} label={k} value={v} total={totalRespondents} color={COLORS[i % COLORS.length]} />
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* ── 3. Employment Migration ── */}
                {(locationMigration?.total > 0) && (
                    <SectionCard title="3. Employment Migration — Local vs. External">
                        <p className="text-xs text-gray-500 mb-3">
                            Based on home address vs. company location for employed respondents with location data.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <StatCard label="With Location Data" value={locationMigration.total} />
                            <StatCard
                                label="Local Employment"
                                value={locationMigration.local}
                                sub={`${locationMigration.local_percentage}%`}
                            />
                            <StatCard
                                label="External Employment"
                                value={locationMigration.external}
                                sub={`${locationMigration.external_percentage}%`}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Bar Chart */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Count Comparison</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart
                                        data={[
                                            { name: "Local", value: locationMigration.local },
                                            { name: "External", value: locationMigration.external },
                                        ]}
                                        margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#3b82f6" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Percentage bars */}
                            <div className="flex flex-col justify-center gap-3">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Local (same area)</span>
                                        <span className="font-semibold">{locationMigration.local_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4">
                                        <div
                                            className="h-4 rounded-full bg-green-500 transition-all"
                                            style={{ width: `${locationMigration.local_percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>External (different area)</span>
                                        <span className="font-semibold">{locationMigration.external_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4">
                                        <div
                                            className="h-4 rounded-full bg-blue-500 transition-all"
                                            style={{ width: `${locationMigration.external_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                )}

                {/* ── 4. Grouped Likert Analysis ── */}
                {likertGroups.length > 0 && (
                    <SectionCard title="4. Grouped Likert Analysis">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                            {likertGroups.map((g) => (
                                <div key={g.section_id} className="border rounded-lg p-3 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">{g.section_title}</p>
                                    <p className="text-2xl font-bold" style={{ color: sectionColors[g.section_title] }}>
                                        {g.avg_score} <span className="text-sm font-normal text-gray-400">/ {g.max_score}</span>
                                    </p>
                                    {g.strongest && <p className="text-xs text-green-600 mt-1">↑ {g.strongest.label} ({g.strongest.avg_score})</p>}
                                    {g.weakest   && <p className="text-xs text-red-500">↓ {g.weakest.label} ({g.weakest.avg_score})</p>}
                                </div>
                            ))}
                        </div>

                        {likertGroups.map((g) => (
                            <div key={g.section_id} className="mt-3">
                                <p className="text-xs font-semibold text-gray-500 mb-1">{g.section_title} — Question Rankings</p>
                                <div className="flex flex-col gap-1">
                                    {g.questions.map((q, i) => (
                                        <div key={q.question_id} className="flex items-center gap-2 text-sm">
                                            <span className="w-5 text-gray-400 text-xs">{i + 1}.</span>
                                            <span className="flex-1 text-gray-700 truncate">{q.label}</span>
                                            <span className="font-semibold text-gray-800">{q.avg_score}</span>
                                            <span className="text-gray-400 text-xs">/ {q.max_score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </SectionCard>
                )}

                {/* ── 4. Cross Analysis ── */}
                {(crossAnalysis.section_vs_employment?.length > 0 || crossAnalysis.degree_vs_employment?.length > 0) && (
                    <SectionCard title="5. Cross Analysis">
                        {crossAnalysis.section_vs_employment?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Section Score vs Employment Status</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="text-left p-2 border">Section</th>
                                                <th className="text-right p-2 border">Employed Avg</th>
                                                <th className="text-right p-2 border">Unemployed Avg</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {crossAnalysis.section_vs_employment.map((r) => (
                                                <tr key={r.section} className="border-t">
                                                    <td className="p-2 border">{r.section}</td>
                                                    <td className="p-2 border text-right text-green-700 font-medium">{r.employed_avg ?? "—"}</td>
                                                    <td className="p-2 border text-right text-red-600 font-medium">{r.unemployed_avg ?? "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {crossAnalysis.degree_vs_employment?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Degree vs Employment Rate</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="text-left p-2 border">Degree</th>
                                                <th className="text-right p-2 border">Total</th>
                                                <th className="text-right p-2 border">Employed</th>
                                                <th className="text-right p-2 border">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {crossAnalysis.degree_vs_employment.map((r) => (
                                                <tr key={r.degree} className="border-t">
                                                    <td className="p-2 border">{r.degree}</td>
                                                    <td className="p-2 border text-right">{r.total}</td>
                                                    <td className="p-2 border text-right">{r.employed}</td>
                                                    <td className="p-2 border text-right font-semibold">{r.employment_rate}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                )}

                {/* ── 5. Trend Analysis ── */}
                {trendData.length > 1 && (
                    <SectionCard title="6. Trend Analysis by Year Graduated">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Employment Rate Over Time</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                                <Tooltip formatter={(v) => `${v}%`} />
                                <Line type="monotone" dataKey="employment_rate" stroke="#008236" strokeWidth={2} dot name="Employment Rate" />
                            </LineChart>
                        </ResponsiveContainer>

                        {likertGroups.length > 0 && (
                            <>
                                <p className="text-xs font-semibold text-gray-500 mt-3 mb-1">Average Section Scores Over Time</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend />
                                        {likertGroups.map((g, i) => (
                                            <Line key={g.section_id} type="monotone" dataKey={g.section_title} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </SectionCard>
                )}

                {/* ── 7. Text Response Analysis ── */}
                {textAnalysis.length > 0 && (
                    <SectionCard title="7. Text Response Analysis">
                        {textAnalysis.map((t) => (
                            <div key={t.question_id} className="border rounded-lg p-3 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-600">{t.section_title} — {t.question_label}</p>
                                <p className="text-xs text-gray-400 mb-2">{t.response_count} responses</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {Object.entries(t.top_keywords).slice(0, 15).map(([word, count]) => (
                                        <Badge key={word} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                            {word} ({count})
                                        </Badge>
                                    ))}
                                </div>
                                {t.sample_answers.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs text-gray-500 font-medium">Sample responses:</p>
                                        {t.sample_answers.map((a, i) => (
                                            <p key={i} className="text-xs text-gray-600 italic border-l-2 border-blue-200 pl-2">"{a}"</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </SectionCard>
                )}

                {/* ── Per-question Charts ── */}
                {analytics.length > 0 && (
                    <SectionCard title="Per-Question Response Charts">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {analytics.map((q) => <AnalyticsChart key={q.question_id} label={q.label} data={q.data} questionType={q.question_type} />)}
                        </div>
                    </SectionCard>
                )}
                </>
            )}
        </div>
    );
}

SurveyAnalytics.layout = (page) => <AdminLayout>{page}</AdminLayout>;
