import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function AppLayout({ children }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {children}
            <Toaster position="top-right" duration={1000} />
        </ThemeProvider>
    );
}
