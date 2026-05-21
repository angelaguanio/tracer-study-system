import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * MetricCard Component
 * 
 * Displays a single metric with title, value, and optional icon/trend
 * 
 * @param {string} title - The metric title
 * @param {number|string} value - The metric value (displays "N/A" for null/undefined)
 * @param {React.ComponentType} icon - Optional icon component
 * @param {object} trend - Optional trend indicator {value: number, direction: 'up'|'down'}
 * @param {string} color - Optional color theme for the icon background
 */
export default function MetricCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const displayValue = value === null || value === undefined || value === 'N/A' ? 'N/A' : value;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{displayValue}</div>
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-semibold">{trend.direction === 'up' ? '↑' : '↓'} {trend.value}%</span>
            <span className="text-muted-foreground">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
