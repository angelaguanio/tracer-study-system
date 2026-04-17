import { ThemeProvider } from '@/components/theme-provider';
import LightModeWrapper from '@/components/light-mode-wrapper';
import { Toaster } from 'sonner';
import bg from '../assets/bg.png';

export default function AuthLayout({ children }) {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <LightModeWrapper>
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="min-h-screen w-full bg-black/20">
                    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-8 lg:flex-row lg:justify-between lg:px-10 lg:py-0">
                        
                        {/* Hero text */}
                        <div className="flex w-full max-w-md flex-col items-center text-center lg:w-1/2 lg:max-w-none lg:items-start lg:text-left">
                            <h1 className="font-inria text-4xl font-bold tracking-widest text-white drop-shadow-lg sm:text-5xl lg:text-7xl">
                                GRADUATE <br />
                                TRACER <br />
                                STUDY
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
            </div>

            <Toaster position="top-right" />
        </LightModeWrapper>
        </ThemeProvider>
    );
}