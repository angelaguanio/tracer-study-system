import { cn } from './../lib/utils';

export default function Title({ className, children, ...props }) {
    return (
        <h1 {...props} className={cn('text-xl', className)}>
            {children}
        </h1>
    );
}
