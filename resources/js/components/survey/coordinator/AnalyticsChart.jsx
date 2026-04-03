import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BAR_COLOR = "#7EC8E3"; // matches sky-300 theme

export default function AnalyticsChart({ label, data = [] }) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {data.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No responses yet</p>
            ) : (
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((_, i) => <Cell key={i} fill={BAR_COLOR} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
