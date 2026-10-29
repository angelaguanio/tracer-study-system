import React, { useEffect, useState } from 'react'
import AuthLayout from '../../layouts/auth-layout'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup'
import TextInput from '../../components/text-input'
import { useForm, Link, Head } from '@inertiajs/react'
import { UserRound, Lock, ArrowLeft, Loader2, WifiOff, AlertCircle, X } from 'lucide-react';
import axios from 'axios';


export default function AdminLogin({ sessionExpired, }) {
  const [showSessionExpired, setShowSessionExpired] = useState(Boolean(sessionExpired));
  //form
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  // Ensure fresh CSRF token on mount
  useEffect(() => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
    }
  }, []);

  //form change
  function handleChange(e) {
    const { name, value } = e.target
    setData(name, value)
  }

  //submit
  function handleSubmit(e) {
    e.preventDefault();
    if (processing) return;
    post(route('admin.login.submit'));
  }

return (
  <AuthLayout>
    <Head title="Admin Login" />
    {/* expired session - fixed overlay so form never shifts */}
    {showSessionExpired && (
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-none">
        <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-blue-200 bg-white/95 backdrop-blur-md p-4 shadow-xl ring-1 ring-black/5">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 text-sm">Session Expired</h3>
            <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
              Your session expired due to inactivity. Please log in again.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSessionExpired(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      )}
      <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
        <CardHeader className="relative flex flex-col items-center justify-center">
          <Wup label="Admin Login" />
        </CardHeader>

        <CardContent className="px-6">
          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {errors.email && (
              <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700 sm:text-base">
                {errors.email}
              </div>
            )}

            <TextInput
              name="email"
              type="email"
              value={data.email}
              placeholder="Email Address"
              onChange={handleChange}
              icon={UserRound}
              className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
            />

            <TextInput
              name="password"
              type="password"
              value={data.password}
              placeholder="Password"
              onChange={handleChange}
              icon={Lock}
              className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
            />

            <div className='text-end text-[12px] -mt-2 underline'>
              <Link href={route('admin.forgot-password')} >Forgot Password?</Link>
            </div>

            <Button
              type="submit"
              variant="blue"
              size="login2"
              disabled={processing}
              className="w-full h-11 text-sm sm:h-12 sm:text-base md:h-14"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
