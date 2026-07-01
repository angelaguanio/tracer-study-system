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
export default function RecentActivityList({ title, items, linkPattern, emptyMessage = 'No recent activity', showAuthor = true, }) {
  const hasItems = items && items.length > 0;

  const getLink = (item) => {
    return linkPattern
      .replace('{id}', item.id)
      .replace('{survey_id}', item.survey_id)
      .replace('{user_id}', item.user_id);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-300 w-full gap-3">
      <CardHeader  className="pb-3 px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-md md:text-lg">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-3 md:px-6 py-3">
        {!hasItems ? (
          <div className="text-center py-5">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-2 h-full overflow-y-auto">
            {items.map((item, index) => (
            <Link
              key={index}
              href={getLink(item)}
              className="group block p-3 md:p-4 rounded-lg border border-transparent hover:border-primary/20 hover:bg-accent/50 transition-all duration-200"
            >
              {/* Row 1 */}
              <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors flex-1">
                  {item.title || item.survey_title || "Untitled"}
                </p>

                <span className="text-[11px] md:text-xs text-muted-foreground whitespace-nowrap">
                  {item.created_at || item.submitted_at}
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center mt-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                {showAuthor && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {item.sender_name || item.author_name || item.alumna_name}
                  </p>
                )}

                  {item.status && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  )}
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
