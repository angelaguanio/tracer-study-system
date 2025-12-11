import { Link } from '@inertiajs/react';
import { Button } from './ui/button';

export default function PaginationLinks({ links }) {
    return (
        <div className="flex w-full justify-end">
            <div className="flex items-center justify-between gap-2">
                {links &&
                    links.map((link, index) =>
                        link.url ? (
                            <Button key={index} asChild size={'sm'} variant={link.active ? 'outline' : 'ghost'}>
                                <Link
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    href={link.url}
                                    prefetch="click"
                                    cacheFor={'1m'}
                                />
                            </Button>
                        ) : (
                            <Button dangerouslySetInnerHTML={{ __html: link.label }} key={index} size={'sm'} variant={'ghost'} />
                        ),
                    )}
            </div>
        </div>
    );
}
