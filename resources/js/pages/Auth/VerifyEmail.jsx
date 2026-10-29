import { usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
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
    const [emailSent, setEmailSent] = useState(props.sent || false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
        }
    }, []);

    // Handle cooldown expiration from localStorage
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

    // Cooldown countdown timer
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

    // Cross-device automatic verification polling
    // When the user clicks the link on their phone, this device detects it and auto-advances
    useEffect(() => {
        if (!email || isVerified) return;

        let isSubscribed = true;

        const checkVerification = async () => {
            try {
                const res = await axios.get(route('alumna.verification.check'), {
                    params: { email }
                });

                if (res.data?.verified && isSubscribed) {
                    setIsVerified(true);
                    // Automatically forward to Profile Setup
                    if (res.data.redirect) {
                        window.location.href = res.data.redirect;
                    }
                }
            } catch (err) {
                // Ignore transient network errors during background check
            }
        };

        // Poll every 2.5 seconds
        const intervalId = setInterval(checkVerification, 2500);

        // Immediate first check
        checkVerification();

        return () => {
            isSubscribed = false;
            clearInterval(intervalId);
        };
    }, [email, isVerified]);

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
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Card className="w-full max-w-md sm:max-w-lg px-6 py-7 rounded-2xl bg-white shadow-xl">
            <CardHeader className="flex flex-col items-center gap-3 p-0 mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                    isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                    {isVerified ? (
                        <CheckCircle2 className="h-7 w-7" />
                    ) : (
                        <MailCheck className="h-7 w-7" />
                    )}
                </div>

                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {isVerified ? "Email Verified!" : "Verify Your Email"}
                    </h2>

                    {isVerified ? (
                        <p className="mt-1.5 text-sm text-emerald-800 font-medium flex items-center justify-center gap-1.5">
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                            Advancing to Profile Setup...
                        </p>
                    ) : (
                        <>
                            <p className="mt-1 text-sm text-gray-700 font-medium">
                                Your login credentials have been saved.
                            </p>
                            <p className="mt-1 text-xs text-gray-500 leading-relaxed px-2">
                                We've sent a verification link to <strong className="text-gray-900">{email}</strong>. Open the link on your phone or in your inbox to proceed.
                            </p>
                        </>
                    )}
                </div>

                {/* Cross-device live auto-detection notice */}
                {!isVerified && (
                    <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-start gap-2.5 text-xs text-emerald-900 mt-1">
                        <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </span>
                        <div>
                            <p className="font-semibold text-emerald-950">Waiting for email verification...</p>
                            <p className="text-emerald-800 text-[11px] mt-0.5 leading-snug">
                                If you click the link on your phone, this screen will automatically reflect it and take you directly to <strong>Step 3: Profile Setup</strong>.
                            </p>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-3 p-0">
                {!isVerified && (
                    <Button
                        onClick={resendEmail}
                        disabled={processing || cooldown > 0}
                        variant="blue"
                        size="login2"
                        className="w-full h-11 text-sm font-semibold"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Sending...</span>
                            </div>
                        ) : cooldown > 0 ? (
                            `Resend Email (${cooldown}s)`
                        ) : (
                            "Resend Verification Email"
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

VerifyEmail.layout = page => <AuthLayout>{page}</AuthLayout>;
