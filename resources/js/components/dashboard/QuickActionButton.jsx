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
  // Map variant to theme colors
  const variantClasses = {
    default: 'bg-blue-500 hover:bg-blue-700 text-white',
    outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
  };

  return (
    <Button 
      asChild 
      variant={variant}
      className={`w-full h-12 ${variantClasses[variant] || variantClasses.default}`}
    >
      <Link href={href}>
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {label}
      </Link>
    </Button>
  );
}
