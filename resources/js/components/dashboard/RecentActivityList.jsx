import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Clock, ArrowRight } from 'lucide-react';

/**
 * RecentActivityList Component
 * 
 * Displays a list of recent items with links
 * Formats dates consistently
 * Shows empty state when no items
 * 
 * @param {string} title - List title
 * @param {Array} items - Array of items to display
 * @param {string} linkPattern - URL pattern with {id} placeholder
 * @param {string} emptyMessage - Message to display when no items
 */
export default function RecentActivityList({ title, items, linkPattern, emptyMessage = 'No recent activity' }) {
  const hasItems = items && items.length > 0;

  const getLink = (item) => {
    return linkPattern
      .replace('{id}', item.id)
      .replace('{survey_id}', item.survey_id)
      .replace('{user_id}', item.user_id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasItems ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item, index) => (
              <Link
                key={index}
                href={getLink(item)}
                className="group block p-4 rounded-lg border border-transparent hover:border-primary/20 hover:bg-accent/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {item.title || item.survey_title || 'Untitled'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="truncate">
                        {item.sender_name || item.author_name || item.alumna_name || 'Unknown'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.created_at || item.submitted_at}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                {item.status && (
                  <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    item.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
