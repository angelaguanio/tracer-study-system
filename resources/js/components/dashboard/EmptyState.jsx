import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

/**
 * EmptyState Component
 * 
 * Displays when no data is available
 * Optional call-to-action button
 * 
 * @param {string} message - Empty state message
 * @param {string} actionLabel - Optional action button label
 * @param {string} actionHref - Optional action button URL
 */
export default function EmptyState({ message, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
