import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, AlertCircle } from 'lucide-react';

export default function UpdateProfileBanner() {
    const { auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const now = new Date();

        // If the user just signed up within the last 90 days, do NOT show the banner
        if (auth?.user?.created_at) {
            const createdAt = new Date(auth.user.created_at);
            const diffTimeSinceCreation = Math.abs(now - createdAt);
            const diffDaysSinceCreation = Math.ceil(diffTimeSinceCreation / (1000 * 60 * 60 * 24));
            
            if (diffDaysSinceCreation < 90) {
                return; // Account is less than 3 months old, no need to update yet
            }
        }

        // We use localStorage to track when the banner was last dismissed
        const lastDismissedStr = localStorage.getItem('profileReminderDismissedAt');
        
        if (!lastDismissedStr) {
            // Never dismissed, show after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }

        const lastDismissed = new Date(lastDismissedStr);
        
        // Calculate difference in months (roughly 90 days)
        const diffTime = Math.abs(now - lastDismissed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays >= 90) {
            // It has been 90 days (approx 3 months), show again
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [auth]);

    const handleDismiss = () => {
        localStorage.setItem('profileReminderDismissedAt', new Date().toISOString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-5 w-80 sm:w-96 flex flex-col gap-3 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                
                <button 
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-[#005AAA] p-2.5 rounded-xl shrink-0 mt-0.5">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#001D4A] text-lg leading-tight">Time for an update?</h3>
                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                            It's been a while! Just a friendly reminder to update your profile in case you have a new job, salary, or contact information.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button 
                        onClick={handleDismiss}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Remind me later
                    </button>
                    <Link 
                        href="/alumna/profile"
                        className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#005AAA] hover:bg-[#003C87] rounded-xl text-center transition-colors shadow-md"
                    >
                        Update Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
