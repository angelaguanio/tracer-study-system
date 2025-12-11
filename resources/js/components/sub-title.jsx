import { cn } from '@/lib/utils';

export default function Subtitle({ children, className }) {
    return <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>;
}
