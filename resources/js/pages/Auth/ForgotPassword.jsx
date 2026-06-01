import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import logo from '../../assets/logotracer.png'

export default function ForgotPassword({status}) {
  const { data, setData, post, processing, errors } = useForm({ email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/alumna/forgot-password');
  };

  return (
    <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg gap-4 ">
        <CardHeader className="relative flex flex-col items-center justify-center gap-5">
            {/* Back Button */}
            <Link
                href={route('alumna.login')}
                className="absolute left-1 top-4 flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100"
            >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            
            <div className='justify-center items-center flex flex-col'>
                <img src={logo} className='w-20 h-auto'/>
                <h2 className='mt-2 text-lg text-black font-bruno'>Alumni Connect</h2>
            </div>
            
            <div className='justify-center w-full'>
            <h2 className="text-xl font-bold text-gray-900 mt-4">Forgot Password</h2>
            <p className="text-gray-600 text-start mt-2 text-sm">Enter your email to receive a reset link</p>
            </div>

            {/* Success Message */}
            {status && (
                <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg text-sm mt-4 w-full flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{status}</span>
                </div>
            )}
        </CardHeader>

        <CardContent>
             <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="Enter your registered email"
                        className={`pl-10 text-black border-gray-300 w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        required
                    />
                </div>
                
                {/* Error Message */}
                {errors.email && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{errors.email}</span>
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={processing}
                    variant="blue" 
                    size="login2" 
                    className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base mt-2"
                >
                    {processing ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
        </CardContent>

    </Card>
  )
}

ForgotPassword.layout = page => <AuthLayout>{page}</AuthLayout>
