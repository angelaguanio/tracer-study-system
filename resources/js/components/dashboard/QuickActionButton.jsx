import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

/**
 * QuickActionButton Component
 * 
 * Button that navigates using Inertia.visit()
 * 
 * @param {string} label - Button label
 * @param {string} href - Navigation URL
 * @param {React.ComponentType} icon - Optional icon component
 * @param {string} variant - Button variant: 'primary' | 'secondary' | 'default' | 'outline'
 */
export default function QuickActionButton({ label, href, icon: Icon, variant = 'default' }) {
  const isDefault = variant === 'default';
  const isOutline = variant === 'outline';

  return (
    <Button 
      asChild 
      variant={isDefault ? 'default' : isOutline ? 'outline' : variant}
      className={`w-full h-12 transition-all font-semibold ${
        isDefault 
          ? 'shadow-sm hover:opacity-90' 
          : isOutline 
            ? 'border-2 hover:bg-slate-50' 
            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
      }`}
      style={
        isDefault
          ? { background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)', borderColor: 'var(--theme-primary)' }
          : isOutline
            ? { borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }
            : {}
      }
    >
      <Link href={href}>
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {label}
      </Link>
    </Button>
  );
}
