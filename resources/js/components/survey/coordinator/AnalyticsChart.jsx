import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const COLORS = ["#2859C5", "#008236", "#E70813", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#7EC8E3"];

function pickChartType(data, questionType) {
    if (!data || data.length === 0) return "empty";
    if (questionType === "number") return "bar";
    const allUnique = data.every(d => d.value === 1) && data.length > 5;
    if (allUnique) return "list";
    if (["radio", "checkbox", "select"].includes(questionType)) {
        return data.length <= 6 ? "pie" : "bar";
    }
    return data.length <= 4 ? "pie" : "bar";
}

function PieChartView({ data }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label={({ label, value }) => `${label} (${Math.round((value / total) * 100)}%)`}
                    labelLine={false}
                >
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} responses`]} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
        </ResponsiveContainer>
    );
}

function BarChartView({ data }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 28 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

function ListView({ data }) {
    return (
        <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-1">
            {data.map((d, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-600 border-b py-1">
                    <span className="truncate flex-1">{d.label}</span>
                    <span className="ml-2 text-gray-400 shrink-0">{d.value}×</span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsChart({ label, data = [], questionType = "" }) {
    // Ensure data is always a proper array (guards against object {} from server)
    const safeData = Array.isArray(data) ? data : Object.values(data ?? {});
    const type = pickChartType(safeData, questionType);

    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {type === "empty" && <p className="text-xs text-gray-400 py-4 text-center">No responses yet</p>}
            {type === "pie"  && <PieChartView data={safeData} />}
            {type === "bar"  && <BarChartView data={safeData} />}
            {type === "list" && <ListView data={safeData} />}
        </div>
    );
}
