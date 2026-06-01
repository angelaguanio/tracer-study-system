import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import logo from '../../assets/logotracer.png'


export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const validatePassword = (password) => {
        const errors = [];
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one capital letter');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
            errors.push('Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>_)');
        }
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        setPasswordErrors(errors);
        return errors.length === 0;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        } else {
            setConfirmPasswordError('');
            return true;
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData('password', newPassword);
        validatePassword(newPassword);
        
        // Re-validate confirm password if it has a value
        if (data.password_confirmation) {
            validateConfirmPassword(newPassword, data.password_confirmation);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        setData('password_confirmation', confirmPassword);
        validateConfirmPassword(data.password, confirmPassword);
    };

    const isFormValid = () => {
        return data.password && 
               data.password_confirmation && 
               passwordErrors.length === 0 && 
               !confirmPasswordError &&
               data.password === data.password_confirmation;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/alumna/reset-password');
    };

    return (
        <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
            <CardHeader className="relative flex flex-col items-center justify-center">
                {/* Back Button */}
                <Link
                    href={route('alumna.login')}
                    className="absolute left-4 top-4 flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Link>
                
                <div className='justify-center items-center flex flex-col'>
                    <img src={logo} className='w-20 h-auto'/>
                    <h2 className='mt-2 text-lg text-black font-bruno'>Alumni Connect</h2>
                </div>

                 <div className='justify-center w-full'>
                    <h2 className="text-xl font-bold text-gray-900 mt-4">Reset Password</h2>
                    <p className="text-gray-600 text-start mt-2">Enter your new password below</p>
                </div>

            </CardHeader>

            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="Your email"
                            className="pl-10 text-black border-gray-300 w-full"
                            readOnly
                        />
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={handlePasswordChange}
                            placeholder="New password"
                            className="pl-10 pr-10 text-black border-gray-300 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                    {passwordErrors.length > 0 && (
                        <div className="text-xs text-red-600 space-y-1 mt-1">
                            {passwordErrors.map((error, index) => (
                                <div key={index} className="flex items-start gap-1">
                                    <span>•</span>
                                    <span>{error}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm new password"
                            className="pl-10 pr-10 text-black border-gray-300 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                    )}
                    {confirmPasswordError && (
                        <p className="text-red-600 text-sm mt-1">{confirmPasswordError}</p>
                    )}

                    {/* General Error Messages */}
                    {errors.email && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                            {errors.email}
                        </div>
                    )}

                    {errors.token && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                            Invalid or expired reset token. Please request a new password reset.
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={processing || !isFormValid()}
                        variant="blue" 
                        size="login2" 
                        className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base mt-6"
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>

            </CardContent>
        </Card>
    );
}

ResetPassword.layout = page => <AuthLayout>{page}</AuthLayout>
