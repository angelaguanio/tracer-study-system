import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export default function FormError({ message, className }) {
    if (!message) return null;

    return (
        <div className={cn('text-destructive flex items-center gap-2 text-sm', className)}>
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
        </div>
    );
}
