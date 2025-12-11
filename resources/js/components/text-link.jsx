import { Link } from '@inertiajs/react';

export default function TextLink({ routeName, linkName, ...props }) {
    return (
        <Link {...props} prefetch="click" cacheFor={'1m'} preserveScroll href={route(routeName)} className="underline underline-offset-4">
            {linkName}
        </Link>
    );
}
