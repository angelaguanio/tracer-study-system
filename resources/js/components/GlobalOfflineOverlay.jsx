import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useState, useEffect } from 'react';

export default function GlobalOfflineOverlay() {
    const isOnline = useOnlineStatus();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Prevent flashing on initial load if temporarily disconnected
        let timeout;
        if (!isOnline) {
            timeout = setTimeout(() => setShow(true), 500); // 500ms delay before showing
        } else {
            setShow(false);
        }
        return () => clearTimeout(timeout);
    }, [isOnline]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            document.body.style.pointerEvents = 'none'; // Prevent interaction with body elements
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.pointerEvents = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.pointerEvents = 'unset';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
            style={{ pointerEvents: 'auto' }} // Re-enable pointer events for the overlay itself (though it just blocks clicks)
        >
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <WifiOff className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You are offline</h2>
                <p className="text-gray-600 mb-6">
                    Please check your internet connection. We'll automatically reconnect you once your network is restored.
                </p>
                
                {/* Visual pulse indicator to show it's "waiting" */}
                <div className="flex gap-2 justify-center items-center h-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
