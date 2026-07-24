import { useState, useEffect } from 'react';

/**
 * Returns true when the browser has network connectivity,
 * false when it is offline. Updates in real time via the
 * native window 'online' / 'offline' events.
 */
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const goOnline  = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online',  goOnline);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online',  goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    return isOnline;
}
