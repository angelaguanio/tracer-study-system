import { Loader2 } from 'lucide-react';

export default function Loading({ title }) {
    return (
        <span className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" /> {title}
        </span>
    );
}
