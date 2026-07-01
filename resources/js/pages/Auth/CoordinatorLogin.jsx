import { useEffect, useState } from 'react'
import AuthLayout from '../../layouts/auth-layout'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup'
import TextInput from '../../components/text-input'
import { useForm } from '@inertiajs/react'
import { UserRound, Lock, ShieldCheck } from 'lucide-react';
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import axios from 'axios';

export default function CoordinatorLogin({ forceChangePassword = false, sessionExpired, }) {

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
    post("/coordinator/login");
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!validatePassword(pwData.password)) return;
    pwPost("/coordinator/change-password");
  }

  // ─── CHANGE PASSWORD VIEW ───────────────────────────────────────────────
  if (forceChangePassword) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <Wup />
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
                variant="blue"
                size="login2"
                className="w-full h-11 text-sm sm:h-12 sm:text-base md:h-14"
                disabled={pwProcessing || passwordErrors.length > 0}
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
      {/* expired session */}
    {sessionExpired && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-800">
                Session Expired
            </h3>

            <p className="mt-1 text-sm text-blue-700">
                Your session expired due to inactivity.
                Please log in again.
            </p>
        </div>
    )}
      <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
        <CardHeader className="relative flex flex-col items-center justify-center">
          <Link
            href={route('role.select')}
            className="absolute left-4 top-4 flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <Wup />
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