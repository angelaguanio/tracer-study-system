import { Toaster } from 'sonner';

export default function AppLayout({ children }) {
    return (
        <>
            {children}
            <Toaster position="top-right" duration={1000} />
        </>
    );
}
