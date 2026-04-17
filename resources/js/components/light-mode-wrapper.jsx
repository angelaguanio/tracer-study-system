import { useEffect } from 'react';

/**
 * Forces light mode on the <html> element for public/pre-auth pages.
 * Overrides any system dark mode preference or stored theme.
 */
export default function LightModeWrapper({ children }) {
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');

        return () => {
            // Restore from localStorage when leaving public pages
            const stored = localStorage.getItem('vite-ui-theme');
            if (stored && stored !== 'system') {
                root.classList.remove('light', 'dark');
                root.classList.add(stored);
            }
        };
    }, []);

    return <>{children}</>;
}
