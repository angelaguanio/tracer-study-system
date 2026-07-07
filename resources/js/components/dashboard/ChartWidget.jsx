import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

/**
 * ChartWidget Component
 * 
 * Wrapper for chart library (recharts)
 * Handles empty states and loading states
 * 
 * @param {string} title - Chart title
 * @param {string} description - Optional chart description
 * @param {any} data - Chart data
 * @param {string} type - Chart type: 'bar' | 'pie' | 'line'
 * @param {number} height - Chart height (default: 300)
 * @param {string} emptyMessage - Message to display when no data
 */
export default function ChartWidget({ title, description, data, type = 'bar', height = 300, emptyMessage = 'No data available' }) {
  const hasData = data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0);
  const recentSurveys =
    type === "progress" && Array.isArray(data)
      ? data.slice(0, 5)
      : [];

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center" style={{ height }}>
            <div className="text-muted-foreground text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>{emptyMessage}</p>
            </div>
          </div>
        ) : type === "progress" ? (

          <div className="space-y-5">
            {recentSurveys.map((survey) => (
              <div key={survey.survey_title}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm break-words">
                      {survey.survey_title}
                    </h4>

                    <p className="text-xs text-gray-500">
                      {survey.completed_responses} Responses
                    </p>
                  </div>

                  <span className="self-start sm:self-auto text-sm font-semibold text-blue-600 whitespace-nowrap">
                    {survey.completion_rate}%
                  </span>
                </div>

                <Progress
                  value={survey.completion_rate}
                  className="h-2"
                  indicatorClassName="bg-blue-600"
                />
              </div>
            ))}
          </div>
        
        ) : (
          
          <ResponsiveContainer width="100%" height={height}>
            {type === 'bar' && (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={data[0]?.survey_title ? "survey_title" : data[0]?.year ? "year" : data[0]?.course ? "course" : "name"}
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey={data[0]?.completion_rate !== undefined ? "completion_rate" : "count"}
                  fill="#3b82f6" 
                  name={data[0]?.completion_rate !== undefined ? "Completion Rate (%)" : "Number of Alumni"}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
            {type === 'pie' && (
              <PieChart>
                <Pie
                  data={Array.isArray(data) 
                    ? data // Handle array data (existing employment distribution)
                    : Object.entries(data)
                        .filter(([key]) => !key.includes('percentage')) // Filter out percentage fields
                        .map(([key, value]) => ({
                          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value: typeof value === 'number' ? value : 0
                        }))
                  }
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(Array.isArray(data) ? data : Object.keys(data).filter(key => !key.includes('percentage'))).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={60}
                  wrapperStyle={{ fontSize: '16px', paddingTop: '10px', fontWeight: '500' }}
                  iconSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
