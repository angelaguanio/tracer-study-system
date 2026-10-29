import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup';
import TextInput from '../../components/text-input';
import { useForm } from '@inertiajs/react';
import AuthLayout from "@/layouts/auth-layout";
import { 
  UserRound, Lock, Loader2, GraduationCap, 
  CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight, X
} from 'lucide-react';
import { Link, Head, router } from "@inertiajs/react";
import axios from 'axios';

export default function AlumnaLogin({ status, sessionExpired }) {
  // Session expired dismissible state
  const [showSessionExpired, setShowSessionExpired] = useState(Boolean(sessionExpired));

  // Mode: 'login' | 'activate'
  const [activeTab, setActiveTab] = useState('login');

  // Login form
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  // Activation Step 1: Verification (Student ID + Name only)
  const [activationStep, setActivationStep] = useState(1); // 1 = verify, 2 = set credentials
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState(null);

  // Activation Step 2: Credentials
  const [credEmail, setCredEmail] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credPasswordConfirm, setCredPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submittingCreds, setSubmittingCreds] = useState(false);
  const [credErrors, setCredErrors] = useState({});

  // Ensure fresh CSRF token on mount
  useEffect(() => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
    }
  }, []);

  function handleLoginChange(e) {
    const { name, value } = e.target;
    setData(name, value);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (processing) return;

    if (!data.email || !data.password) {
      alert("Please fill in both email and password.");
      return;
    }
    post(route('alumna.login'));
  }

  // Handle Step 1: Verify Student Record
  async function handleVerifyIdentity(e) {
    e.preventDefault();
    setVerificationError('');

    if (!studentId.trim() || !studentName.trim()) {
      setVerificationError("Please provide both your Student ID and Name.");
      return;
    }

    setVerifying(true);
    try {
      const response = await axios.post('/alumni/verify-identity', {
        student_id: studentId.trim(),
        name: studentName.trim(),
      });

      if (response.data.success) {
        setVerifiedStudent(response.data.student);
        setActivationStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please check your details and try again.';
      setVerificationError(msg);
    } finally {
      setVerifying(false);
    }
  }

  // Validate password rules in real-time
  const passwordIssues = [];
  if (credPassword) {
    if (!/[A-Z]/.test(credPassword)) passwordIssues.push('At least one uppercase letter');
    if (!/[0-9]/.test(credPassword)) passwordIssues.push('At least one number');
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(credPassword)) passwordIssues.push('At least one special symbol');
    if (credPassword.length < 8) passwordIssues.push('At least 8 characters');
  }

  // Handle Step 2: Setup Credentials
  async function handleSetupCredentials(e) {
    e.preventDefault();
    setCredErrors({});

    const errs = {};
    if (!credEmail.trim()) errs.email = 'Email address is required.';
    if (!credPassword) errs.password = 'Password is required.';
    if (passwordIssues.length > 0) errs.password = 'Password requirements not met.';
    if (credPassword !== credPasswordConfirm) errs.password_confirmation = 'Passwords do not match.';

    if (Object.keys(errs).length > 0) {
      setCredErrors(errs);
      return;
    }

    setSubmittingCreds(true);
    try {
      const response = await axios.post('/alumni/setup-credentials', {
        student_user_id: verifiedStudent?.id,
        email: credEmail.trim(),
        password: credPassword,
        password_confirmation: credPasswordConfirm,
      });

      if (response.data.redirect) {
        router.visit(response.data.redirect);
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response.data.errors) {
        setCredErrors(err.response.data.errors);
      } else {
        const msg = err.response?.data?.message || 'Failed to save credentials. Please try again.';
        setCredErrors({ general: msg });
      }
    } finally {
      setSubmittingCreds(false);
    }
  }

  return (
    <>
      <Head title={activeTab === 'login' ? "Alumni Login" : "Activate Alumni Account"} />

      {/* Expired session warning - fixed overlay so form never shifts */}
      {showSessionExpired && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-none">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-emerald-300 bg-white/95 backdrop-blur-md p-4 shadow-xl ring-1 ring-black/5">
            <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-emerald-950 text-sm">Session Expired</h3>
              <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
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

      <Card className="w-full max-w-md px-4 py-4 sm:px-6 sm:py-5 rounded-2xl bg-white shadow-lg">
        <CardHeader className="relative flex flex-col items-center justify-center p-0 mb-3">
          <Wup compact label={activeTab === 'login' ? "Alumni Portal" : "Account Activation"} />

          {/* Mode Switcher Tabs */}
          <div className="flex w-full mt-2.5 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setVerificationError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('activate');
                setVerificationError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'activate'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              First-Time Activation
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ===================== LOG IN MODE ===================== */}
          {activeTab === 'login' && (
            <form className="space-y-3" onSubmit={handleLoginSubmit}>
              {status && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{status}</span>
                </div>
              )}

              {errors.credentials && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{errors.credentials}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Email Address</label>
                <TextInput 
                  name="email" 
                  type="email"
                  value={data.email} 
                  placeholder="name@example.com" 
                  onChange={handleLoginChange}  
                  icon={UserRound}
                  className="pl-10 text-black border-gray-400 w-full text-sm py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Password</label>
                <TextInput 
                  name="password" 
                  type="password"
                  value={data.password} 
                  placeholder="••••••••" 
                  onChange={handleLoginChange} 
                  icon={Lock}
                  className="pl-10 text-black border-gray-400 w-full text-sm py-2"
                />
              </div>

              <div className="text-end text-xs -mt-1">
                <Link 
                  href={route('alumna.forgot-password')} 
                  className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="blue" 
                size="login2"            
                disabled={processing}
                className="w-full h-10 text-sm font-semibold"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          )}

          {/* ===================== FIRST-TIME ACTIVATION MODE ===================== */}
          {activeTab === 'activate' && activationStep === 1 && (
            <form className="space-y-2.5" onSubmit={handleVerifyIdentity}>
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 leading-snug">
                <p className="font-semibold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  Alumni Pre-Verification
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Enter your official <strong>Student ID</strong> and <strong>Name</strong> to verify against graduation records.
                </p>
              </div>

              {verificationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{verificationError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <GraduationCap className="absolute left-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 22-3333-444"
                    className="w-full rounded-lg border border-gray-400 pl-10 pr-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <p className="text-[10.5px] text-gray-400 mt-0.5">Official Student ID as registered during enrollment</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <UserRound className="absolute left-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="First Name and Last Name"
                    className="w-full rounded-lg border border-gray-400 pl-10 pr-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <p className="text-[10.5px] text-gray-400 mt-0.5">Your registered name in university records</p>
              </div>

              <Button
                type="submit"
                variant="blue" 
                size="login2"            
                disabled={verifying}
                className="w-full h-10 text-sm font-semibold"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Record...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Verify Identity</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* ===================== ACTIVATION STEP 2: SET CREDENTIALS ===================== */}
          {activeTab === 'activate' && activationStep === 2 && (
            <form className="space-y-2.5" onSubmit={handleSetupCredentials}>
              {/* Verified badge */}
              <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-2 text-xs text-emerald-950">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Student Record Verified</span>
                </div>
                <div className="mt-0.5 text-xs">
                  <p className="font-bold text-gray-900">{verifiedStudent?.full_name}</p>
                  <p className="text-gray-600 text-[11px]">ID: {verifiedStudent?.student_id} • {verifiedStudent?.courses}</p>
                </div>
              </div>

              {credErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{credErrors.general}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <UserRound className="absolute left-3 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    value={credEmail}
                    onChange={(e) => setCredEmail(e.target.value)}
                    placeholder="Enter your active personal email"
                    className="w-full rounded-lg border border-gray-400 pl-10 pr-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                {credErrors.email && <p className="text-xs text-red-500 mt-0.5">{credErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-400 pl-10 pr-10 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {credErrors.password && <p className="text-xs text-red-500 mt-0.5">{credErrors.password}</p>}

                {/* Password rule indicators */}
                {credPassword && passwordIssues.length > 0 && (
                  <div className="mt-1 p-1.5 bg-amber-50 border border-amber-200 rounded text-[10.5px] text-amber-800 space-y-0.5">
                    <p className="font-medium">Password must have:</p>
                    {passwordIssues.map((issue, idx) => (
                      <p key={idx} className="flex items-center gap-1 text-red-600">
                        • {issue}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credPasswordConfirm}
                    onChange={(e) => setCredPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-400 pl-10 pr-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                {credErrors.password_confirmation && (
                  <p className="text-xs text-red-500 mt-0.5">{credErrors.password_confirmation}</p>
                )}
              </div>

              <div className="flex gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActivationStep(1)}
                  className="w-1/3 h-10 text-xs sm:text-sm"
                  disabled={submittingCreds}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="blue"
                  disabled={submittingCreds}
                  className="flex-1 h-10 text-xs sm:text-sm font-semibold"
                >
                  {submittingCreds ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Verification Link"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 text-center mt-3 p-0">
          {activeTab === 'login' ? (
            <p>
              First time logging into the portal?{" "}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('activate');
                  setVerificationError('');
                }}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Activate your account here
              </button>
            </p>
          ) : (
            <p>
              Already activated your account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Sign in with your email
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

AlumnaLogin.layout = page => <AuthLayout>{page}</AuthLayout>;
