import { createContext, useContext, useEffect, useState } from 'react';

const initialState = {
    theme: 'system',
    setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'vite-ui-theme', ...props }) {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        // Only use stored value if it's a valid explicit theme (not 'system')
        if (stored && stored !== 'system') return stored;
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        // Never fall back to system prefers-color-scheme — always use explicit theme
        root.classList.add(theme === 'system' ? defaultTheme : theme);
    }, [theme, defaultTheme]);

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
