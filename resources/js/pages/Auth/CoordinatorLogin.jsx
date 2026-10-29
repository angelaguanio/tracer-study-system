import { useEffect, useState } from 'react'
import AuthLayout from '../../layouts/auth-layout'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup'
import TextInput from '../../components/text-input'
import { useForm, Head } from '@inertiajs/react'
import { UserRound, Lock, ShieldCheck, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

export default function CoordinatorLogin({ forceChangePassword = false, sessionExpired, }) {
  const [showSessionExpired, setShowSessionExpired] = useState(Boolean(sessionExpired));

  // LOGIN FORM
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  // CHANGE PASSWORD FORM
  const {
    data: pwData,
    setData: setPwData,
    post: pwPost,
    processing: pwProcessing,
    errors: pwErrors
  } = useForm({
    password: "",
    password_confirmation: "",
  });

  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setData(name, value);
  }

  function handlePwChange(e) {
    const { name, value } = e.target;
    setPwData(name, value);
    if (name === 'password') {
      validatePassword(value);
    }
  }

  function validatePassword(password) {
    const errs = [];
    if (!/[A-Z]/.test(password))
      errs.push('Password must contain at least one capital letter');
    if (!/[0-9]/.test(password))
      errs.push('Password must contain at least one number');
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password))
      errs.push('Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>_)');
    if (password.length < 8)
      errs.push('Password must be at least 8 characters long');
    setPasswordErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    post(route('coordinator.login'));
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!validatePassword(pwData.password)) return;
    pwPost(route('coordinator.change-password'));
  }

  // ─── CHANGE PASSWORD VIEW ───────────────────────────────────────────────
  if (forceChangePassword) {
    return (
      <AuthLayout>
        <Head title="Coordinator - Set New Password" />
        <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <Wup label="Coordinator Portal" />
          </CardHeader>

          <CardContent className="px-6 space-y-4">
            {/* Prompt message */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              <strong>Action required:</strong> You must set a new password before continuing.
            </div>

            <form className="space-y-3 sm:space-y-4" onSubmit={handlePasswordChange}>
              {pwErrors.password && (
                <div className="rounded bg-red-100 p-2 text-sm text-red-700">
                  {pwErrors.password}
                </div>
              )}

              <TextInput
                name="password"
                type="password"
                value={pwData.password}
                placeholder="New Password"
                onChange={handlePwChange}
                icon={Lock}
                className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
              />

              {/* live validation errors */}
              {passwordErrors.length > 0 && (
                <div className="text-xs text-red-600 space-y-1 mt-1">
                  {passwordErrors.map((err, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              <TextInput
                name="password_confirmation"
                type="password"
                value={pwData.password_confirmation}
                placeholder="Confirm New Password"
                onChange={handlePwChange}
                icon={ShieldCheck}
                className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
              />

              <Button
                type="submit"
                disabled={pwProcessing || passwordErrors.length > 0}
                className="w-full bg-[#2859C5] hover:bg-[#1f47a0] text-white font-medium h-11 text-sm sm:h-12 sm:text-base md:h-14"
              >
                {pwProcessing ? "Saving..." : "Set New Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // ─── LOGIN VIEW (DEFAULT) ───────────────────────────────────────────────
  return (
    <AuthLayout>
      <Head title="Coordinator Login" />
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
          <Wup label="Coordinator Login" />
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

            <Button
              variant="blue"
              size="login2"
              className="w-full h-11 text-sm sm:h-12 sm:text-base md:h-14"
              disabled={processing}
            >
              {processing ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
