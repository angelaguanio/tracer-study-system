import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function usePolling({
    interval = 5000,
    only = [],
    enabled = true,
    paused = false,
}) {
    useEffect(() => {
        if (!enabled || paused) return;

        let poller = null;

        const reload = () => {
            router.reload({
                only,
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        };

        const startPolling = () => {
            stopPolling();
            poller = setInterval(reload, interval);
        };

        const stopPolling = () => {
            if (poller) {
                clearInterval(poller);
                poller = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                reload(); // immediately sync when user returns
                startPolling();
            }
        };

        startPolling();

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        );

        return () => {
            stopPolling();
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, [interval, enabled, paused, JSON.stringify(only)]);
}