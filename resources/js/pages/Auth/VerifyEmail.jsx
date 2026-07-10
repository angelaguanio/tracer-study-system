import { Link, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from "react";

export default function VerifyEmail() {
    const { props } = usePage();

    const fromSignup = props.from === "signup";
    const email = props.email;

    const storageKey = fromSignup
    ? "verify-email-signup-expiry"
    : "verify-email-login-expiry";

    const [processing, setProcessing] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [emailSent, setEmailSent] = useState(fromSignup);

    useEffect(() => {
        const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    
        if (csrfToken) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
        }
    }, []);

    useEffect(() => {
        if (fromSignup) return;
    
        localStorage.removeItem("verify-email-expiry");
        setCooldown(0);
        setEmailSent(false);
    }, [fromSignup]);

    useEffect(() => {
        const expiry = localStorage.getItem(storageKey);
    
        if (!expiry) return;
    
        const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);
    
        if (remaining > 0) {
            setCooldown(remaining);
            setEmailSent(true);
        } else {
            localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    useEffect(() => {
        if (cooldown <= 0) {
            localStorage.removeItem(storageKey);
            return;
        }
    
        const timer = setTimeout(() => {
            setCooldown(cooldown - 1);
        }, 1000);
    
        return () => clearTimeout(timer);
    }, [cooldown, storageKey]);

    useEffect(() => {
        if (!fromSignup) return;
    
        const expiry = localStorage.getItem(storageKey);
    
        if (!expiry) {
            const newExpiry = Date.now() + 60000;
    
            localStorage.setItem(storageKey, newExpiry);
    
            setCooldown(60);
            setEmailSent(true);
        }
    }, [fromSignup, storageKey]);

    const resendEmail = async () => {
        try {
            setProcessing(true);
    
            await axios.post(route("alumna.verification.send"), {
                email,
            });
    
            setEmailSent(true);
            const expiry = Date.now() + 60000;

            localStorage.setItem(storageKey, expiry);
            
            setCooldown(60);
            setEmailSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Card className="w-full max-w-md sm:max-w-lg px-6 py-8 rounded-2xl bg-white shadow-lg">

            <CardHeader className="flex flex-col items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <MailCheck className="h-8 w-8 text-blue-600" />
                </div>

                <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    {fromSignup ? "Verify Your Email" : "Email Verification Required"}
                </h2>

                {fromSignup ? (
                    <>
                        <p className="mt-2 text-gray-600">
                            Your account has been created successfully.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            We've sent a verification email to <strong>{email}</strong>.
                            Please verify your email before logging in.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mt-2 text-gray-600">
                            Your email address has not been verified yet.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Your account is still waiting for email verification.
                            Click the button below to send a verification email to <strong>{email}</strong>.
                        </p>
                    </>
                )}
                                </div>

                {emailSent && (
                    <div className="w-full rounded-lg border border-green-300 bg-green-50 p-4 flex gap-3">

                        <CheckCircle className="text-green-600 mt-1 h-5 w-5 flex-shrink-0" />

                        <div>
                            <h3 className="font-semibold text-green-800">
                                Verification Email Sent
                            </h3>

                            <p className="text-green-700 text-sm mt-1">
                                A verification email has been sent to <strong>{email}</strong>.
                                Please check your Inbox and Spam folder.
                                The verification link expires in 60 minutes.
                            </p>    

                            {cooldown > 0 ? (
                                <p className="text-xs text-green-600 mt-2">
                                    You can request another email in <strong>{cooldown}s</strong>.
                                </p>
                            ) : (
                                <p className="text-xs text-green-600 mt-2">
                                    Didn't receive it? You may resend the verification email now.
                                </p>
                            )}
                        </div>

                    </div>
                )}

            </CardHeader>

            <CardContent className="space-y-4">

            <Button
                onClick={resendEmail}
                disabled={processing || cooldown > 0}
                variant="blue"
                size="login2"
                className="w-full"
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : cooldown > 0 ? (
                    `Send Again (${cooldown}s)`
                ) : emailSent ? (
                    "Send Another Verification Email"
                ) : (
                    "Send Verification Email"
                )}
            </Button>

            <Link
                href={route('alumna.login')}
                className="w-full block text-center text-sm text-gray-600 hover:underline"
            >
                Back to Login
            </Link>

            </CardContent>

        </Card>
    );
}

VerifyEmail.layout = page => <AuthLayout>{page}</AuthLayout>;