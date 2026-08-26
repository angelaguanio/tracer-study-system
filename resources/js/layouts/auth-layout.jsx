import { useEffect } from 'react';
import { Toaster } from 'sonner';
import authBg from '../assets/cover3.png';
import wupCectLogo from '../assets/wup_cect.png';
import GlobalOfflineOverlay from '@/components/GlobalOfflineOverlay';

export default function AuthLayout({ children }) {
    // Always force light mode on auth pages
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, []);

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${authBg})` }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/50 via-teal-500/50 to-blue-600/50 opacity-85"></div>
            
            {/* Content Container */}
            <div className="relative min-h-screen w-full">
                {/* WUP CECT Logo in upper left corner */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10">
                    <img 
                        src={wupCectLogo} 
                        alt="WUP CECT Logo" 
                        className="h-20 w-auto sm:h-18 md:h-22 drop-shadow-lg object-contain"
                    />
                </div>
                <div className="mx-auto gap-20 flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-8 lg:flex-row lg:justify-between lg:px-10 lg:py-0">
                    
                    {/* Hero text */}
                    <div className="flex w-full max-w-md flex-col items-center text-center lg:w-1/2 lg:max-w-none lg:items-start lg:text-left">
                        <h1 className="font-inria text-4xl font-bold tracking-widest text-white drop-shadow-lg sm:text-5xl lg:text-7xl">
                            GRADUATE <br />
                            ACCESS & <br />
                            TRACKING <br />
                            ENVIRONMENT
                        </h1>

                        <h3 className="mt-4 font-inria text-base font-bold tracking-wide text-white drop-shadow-lg sm:text-lg lg:text-2xl">
                            Track your career journey <br />
                            and stay connected with <br />
                            your Alma Mater.
                        </h3>
                    </div>

                    {/* Card */}
                    <div className="mt-8 flex w-full justify-center lg:mt-0 lg:w-1/2">
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />
            <GlobalOfflineOverlay />
        </div>
    );
}
