import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import bg from '../assets/bg.png'

export default function AuthLayout({ children }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex h-screen w-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage : `url(${bg})`}} >
                
                 <div className='w-1/2 flex flex-col items-start justify-center space-y-2 ml-30'>
                    <h1 className='text-7xl font-bold font-inria text-white tracking-widest drop-shadow-lg text-left'>
                        GRADUATE <br/>
                        TRACER <br/>
                        STUDY
                    </h1>

                    <h3 className='text-2xl font-bold font-inria text-white tracking-widest drop-shadow-lg text-left'>
                    Track your career journey <br/>
                    and stay connected with <br/>
                    your Alma Mater.
                    </h3>
                 </div>

                 {/* right side */}
                 <div className='w-1/2 flex flex-col justify-center m-15'>
                    {children}
                 </div>
            </div>

            
            <Toaster position="top-right" />
        </ThemeProvider>
    );
}
