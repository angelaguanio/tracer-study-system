import { useMemo, useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
  ArrowLeft, ArrowRight,
  User, MapPin, Phone, Mail, Lock,
  GraduationCap, BookOpen, CalendarDays,
  Briefcase, Building2, BadgeDollarSign, Users,
  Eye, EyeOff, Loader2
} from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';
import TextInput from '@/components/text-input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '../../components/ui/button';
import TextLink from '../../components/text-link';

// ─── Step meta ────────────────────────────────────────────────────────────────
const STEP_META = [
  { icon: User,          title: 'Personal Information',  subtitle: 'Tell us a bit about yourself',            total: 4 },
  { icon: GraduationCap, title: 'Academic Information',  subtitle: 'Share your academic background',           total: 4 },
  { icon: Lock,          title: 'Account Information',   subtitle: 'Create your login credentials',            total: 4 },
  { icon: Briefcase,     title: 'Employment Status',     subtitle: 'Help us update our alumni records',        total: 4 },
  { icon: Briefcase,     title: 'Employment Information',subtitle: 'Tell us about your current employment',    total: 4 },
  { icon: Briefcase,     title: 'Employment Information',subtitle: 'Share your reason for not working',        total: 4 },
];

// ─── Options ──────────────────────────────────────────────────────────────────
const CECT_COURSES = [
  { value: 'BSCpE', label: 'Bachelor of Science in Computer Engineering' },
  { value: 'BSEcE', label: 'Bachelor of Science in Electronics Engineering' },
  { value: 'BSIT',  label: 'Bachelor of Science in Information Technology' },
];

const SEMESTER_OPTIONS = [
  { value: '1st Semester', label: '1st Semester' },
  { value: '2nd Semester', label: '2nd Semester' },
  { value: '3rd Semester', label: '3rd Semester' },
  { value: 'Summer',       label: 'Summer' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Permanent/Regular', label: 'Permanent/Regular', icon: Briefcase },
  { value: 'Probationary',      label: 'Probationary',      icon: Users },
];

const UNEMPLOYMENT_REASONS = [
  'Studying', 'Job Hunting', 'Career Break',
];

const INITIAL_FORM = {
  last_name: '', first_name: '', middle_name: '',
  address: '', contact_number: '',
  email: '', password: '', password_confirmation: '',
  department: 'CECT', courses: '',
  school_year: '', start_year: '', end_year: '', semester: '',
  user_role: '',
  currently_employed: '',
  employment_type: '', company_name: '', position: '',
  location: '', monthly_salary: '',
  employment_start_year: '', employment_end_year: '',
  is_present: true,
  unemployment_reason: '',
};

// ─── Reusable field with icon ─────────────────────────────────────────────────
function IconInput({ icon: Icon, name, type = 'text', placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-3 rounded-lg border border-gray-400 bg-white px-4 py-2.5
          ${
            error
              ? "border-red-400"
              : "border-gray-400 focus-within:border-blue-500"
          }`}
      >
        <Icon className="h-4 w-4 text-gray-500 shrink-0" />
        <input
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="flex-1 text-sm text-black placeholder:text-gray-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="shrink-0 text-black hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

// ─── Step header ──────────────────────────────────────────────────────────────
function StepHeader({ step }) {
  const meta = STEP_META[step - 1];
  const Icon = meta.icon;
  // Map step to display number (steps 5/6 both count as step 4 in display)
  const displayStep = Math.min(step, 4);
  return (
    <div className="flex flex-col items-center gap-1.5 pb-3 border-b border-gray-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <Icon className="h-6 w-6 text-emerald-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{meta.title}</h2>
      <p className="text-xs text-gray-500">{meta.subtitle}</p>
      <span className="mt-0.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-600">
        Step {displayStep} of {meta.total}
      </span>
    </div>
  );
}

// ─── Select with icon wrapper ─────────────────────────────────────────────────
function IconSelect({ icon: Icon, placeholder, value, onValueChange, children, error, disabled = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`w-full flex items-center gap-3 rounded-lg border px-4 bg-white overflow-hidden transition-colors
          ${error ? "border-red-400" : "border-gray-400 focus-within:border-blue-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
          <Icon className="h-4 w-4 text-gray-500 shrink-0" />

          <Select value={value} onValueChange={onValueChange} disabled={disabled}>
              <SelectTrigger className="flex-1 min-w-0 w-full border-0 shadow-none px-0 py-3 text-sm text-black focus:ring-0 [&>span]:truncate">
                  <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="max-h-48">
                  {children}
              </SelectContent>
          </Select>
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AlumnaSignup() {
  const [step, setStep] = useState(1);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [stepErrors, setStepErrors] = useState({});

  const { data, setData, post, errors, processing, transform } = useForm(INITIAL_FORM);

  // Jump back to the step that has an error after server validation
  useEffect(() => {
    const stepFields = [
      ['last_name', 'first_name', 'middle_name', 'address', 'contact_number'],
      ['courses', 'start_year', 'end_year', 'semester'],
      ['email', 'password', 'password_confirmation'],
      ['currently_employed'],
      ['employment_type', 'company_name', 'position', 'location', 'monthly_salary', 'employment_start_year', 'employment_end_year'],
      ['unemployment_reason'],
    ];
    for (let i = 0; i < stepFields.length; i++) {
      if (stepFields[i].some((f) => errors[f])) { setStep(i + 1); return; }
    }
  }, [errors]);

  const EMPLOYMENT_CURRENT_YEAR = new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear() - 1; // last completed academic year
    return Array.from({ length: currentYear - 1990 + 1 }, (_, i) => {
      const s = currentYear - i; return { value: `${s}-${s + 1}`, label: `${s}-${s + 1}` };
    });
  }, []);

  const employmentYearOptions = useMemo(() =>
    Array.from({ length: EMPLOYMENT_CURRENT_YEAR - 2018 + 1 }, (_, i) => {
      const y = EMPLOYMENT_CURRENT_YEAR - i; return { value: String(y), label: String(y) };
    }), [EMPLOYMENT_CURRENT_YEAR]);

  const handleChange = ({ target: { name, value } }) => {
    setData(name, value);
    if (name === 'password') validatePassword(value);
  };

  const validatePassword = (pw) => {
    const errs = [];
    if (!/[A-Z]/.test(pw))errs.push('At least one capital letter');
    if (!/[0-9]/.test(pw))errs.push('At least one number');
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(pw))errs.push('At least one symbol');
    if (pw.length < 8)errs.push('At least 8 characters');
    setPasswordErrors(errs);
    return errs.length === 0;
  };

  const handleSelectChange = (name, value) => {
    if (name === 'employment_end_year') {
      setData(value === 'current'
        ? { ...data, is_present: true,  employment_end_year: 'current' }
        : { ...data, is_present: false, employment_end_year: value });
      return;
    }
    setData(name, value);
  };

  const isStep1Done = [data.last_name, data.first_name, data.address, data.contact_number].every(Boolean);
  const isStep2Done = [data.courses, data.school_year, data.semester].every(Boolean);
  const isStep3Done = [data.email, data.password, data.password_confirmation].every(Boolean) && passwordErrors.length === 0;

  const validateStep1 = () => {
    const errors = {};

    if (!data.last_name.trim()) {
        errors.last_name = "Last name is required";
    }

    if (!data.first_name.trim()) {
        errors.first_name = "First name is required";
    }

    if (!data.address.trim()) {
        errors.address = "Address is required";
    }

    if (!/^09\d{9}$/.test(data.contact_number)) {
        errors.contact_number = "Contact number must be 11 digits and start with 09";
    }

    return errors;
};

const validateStep2 = () => {
  const errors = {};

  if (!data.courses) {
      errors.courses = "Course is required";
  }

  if (!data.school_year) {
      errors.school_year = "School year is required";
  }

  if (!data.semester) {
      errors.semester = "Semester is required";
  }

  return errors;
};

const validateStep3 = () => {
  const errors = {};

  if (!data.email) {
      errors.email = "Email is required";
  }

  if (passwordErrors.length > 0) {
      errors.password = "Password requirements not met";
  }

  if (data.password !== data.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
  }

  return errors;
};

const validateStep4 = () => {
  const errors = {};

  if (!data.currently_employed) {
      errors.currently_employed = "Please select your employment status";
  }

  return errors;
};

const validateStep5 = () => {
  const errors = {};

  if (!data.employment_type) {
      errors.employment_type = "Employment type is required";
  }

  if (!data.company_name) {
      errors.company_name = "Company name is required";
  }

  if (!data.position) {
      errors.position = "Position is required";
  }

  if (!data.location) {
      errors.location = "Location is required";
  }

  if (!data.employment_start_year) {
      errors.employment_start_year = "Start year is required";
  }

  return errors;
};

const validateStep6 = () => {
  const errors = {};

  if (!data.unemployment_reason) {
      errors.unemployment_reason = "Please select a reason";
  }

  return errors;
};

const nextStep = () => {

  let errors = {};

  if (step === 1) {
      errors = validateStep1();

      if (Object.keys(errors).length > 0) {
          setStepErrors(errors);
          return;
      }

      setStepErrors({});
      setStep(2);
      return;
  }

  if (step === 2) {
      errors = validateStep2();

      if (Object.keys(errors).length > 0) {
          setStepErrors(errors);
          return;
      }

      setStepErrors({});
      setStep(3);
      return;
  }

  if (step === 3) {
      errors = validateStep3();

      if (Object.keys(errors).length > 0) {
          setStepErrors(errors);
          return;
      }

      setStepErrors({});
      setStep(4);
      return;
  }

  if (step === 4) {
      errors = validateStep4();

      if (Object.keys(errors).length > 0) {
          setStepErrors(errors);
          return;
      }

      setStepErrors({});

      if (data.currently_employed === 'Yes') {
          setStep(5);
      } else {
          setStep(6);
      }
  }
};

  const prevStep = () => {
    if (step === 5 || step === 6) { setStep(4); return; }
    if (step > 1) setStep((p) => p - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (processing) return;
    const [start_year, end_year] = data.school_year.split('-');
  
    transform((formData) => ({
      ...formData,
      start_year,
      end_year,
      employment_end_year: formData.is_present ? null : formData.employment_end_year,
    }));

    post('/alumna/signup', {
      preserveScroll: true,
      onSuccess: () => { setData(INITIAL_FORM); setStep(1); },
    });
  };

  const canNext =
    (step === 1 && isStep1Done) ||
    (step === 2 && isStep2Done) ||
    (step === 3 && isStep3Done) ||
    (step === 4 && !!data.currently_employed);

  return (
    <Card className="relative w-full max-w-md rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: 'min(90vh, 660px)' }}>

      <CardContent className="custom-scrollbar overflow-y-auto px-6 py-4 flex-1">
        <form id="signupForm" className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <StepHeader step={step} />

          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <IconInput icon={User}  name="last_name"      placeholder="Last Name"      value={data.last_name}      onChange={handleChange} error={stepErrors.last_name || errors.last_name} />
              <IconInput icon={User}  name="first_name"     placeholder="First Name"     value={data.first_name}     onChange={handleChange} error={stepErrors.first_name || errors.first_name} />
              <IconInput icon={User}  name="middle_name"    placeholder="Middle Name (optional)" value={data.middle_name} onChange={handleChange} error={stepErrors.middle_name || errors.middle_name} />
              <IconInput icon={MapPin} name="address"       placeholder="Address"        value={data.address}        onChange={handleChange} error={stepErrors.address || errors.address} />
              <IconInput icon={Phone} name="contact_number" placeholder="Contact Number" value={data.contact_number} onChange={handleChange} error={stepErrors.contact_number || errors.contact_number} type="number" />
            </div>
          )}

          {/* ── Step 2: Academic ── */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              {/* Static dept display */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">College of Engineering and Computer Technology (CECT)</span>
              </div>

              <IconSelect icon={BookOpen} placeholder="Program / Course" value={data.courses} onValueChange={(v) => handleSelectChange('courses', v)} error={stepErrors.courses || errors.courses}>
                <SelectGroup>
                  {CECT_COURSES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>

              <IconSelect icon={CalendarDays} placeholder="Year Graduated" value={data.school_year} onValueChange={(v) => handleSelectChange('school_year', v)} error={stepErrors.start_year || errors.start_year}>
                <SelectGroup>
                  {yearOptions.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>

              <IconSelect icon={CalendarDays} placeholder="Semester" value={data.semester} onValueChange={(v) => handleSelectChange('semester', v)} error={stepErrors.semester || errors.semester}>
                <SelectGroup>
                  {SEMESTER_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>
            </div>
          )}

          {/* ── Step 3: Account ── */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <IconInput icon={Mail} name="email"                 type="email"    placeholder="Email Address"      value={data.email}                 onChange={handleChange} error={stepErrors.email || errors.email} />
              <IconInput icon={Lock} name="password"              type="password" placeholder="Password"           value={data.password}              onChange={handleChange} error={stepErrors.password || errors.password} />
              {passwordErrors.length > 0 && (
                <ul className="text-xs text-red-500 space-y-1 pl-1">
                  {passwordErrors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              )}
              <IconInput icon={Lock} name="password_confirmation" type="password" placeholder="Confirm Password"  value={data.password_confirmation} onChange={handleChange} error={stepErrors.password_confirmation || errors.password_confirmation} />
            </div>
          )}

          {/* ── Step 4: Employed? ── */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <p className="text-center text-sm text-gray-500">
                Help us keep our alumni records updated by sharing your current employment status.
              </p>
              <p className="text-center font-semibold text-gray-800">Are you currently employed?</p>
              <div className="flex flex-col gap-3">
                {['Yes', 'No'].map((val) => {
                  const checked = data.currently_employed === val;
                  return (
                    <label key={val} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all
                      ${checked ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="radio" name="currently_employed" value={val} checked={checked} onChange={handleChange} className="h-5 w-5 accent-emerald-500" />
                      <span className="font-medium text-gray-800">{val === 'Yes' ? "Yes, I'm employed" : "No, I'm not employed"}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 5: Employment details ── */}
          {step === 5 && (
            <div className="flex flex-col gap-4 px-2">
              {/* Employment type cards */}
              <div>
                <p className="mb-3 font-semibold text-gray-800">Employment Status</p>
              <div className="flex flex-col gap-2">
                  {EMPLOYMENT_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
                    const checked = data.employment_type === value;
                    return (
                      <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all
                        ${checked ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <input type="radio" name="employment_type" value={value} checked={checked} onChange={handleChange} className="h-5 w-5 accent-emerald-500 shrink-0" />
                        <Icon className={`h-5 w-5 shrink-0 ${checked ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium text-gray-800">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Year range */}
              <div>
                <p className="mb-3 font-semibold text-gray-800">When did you start?</p>
                <div className="grid grid-cols-2 gap-3">
                  <IconSelect icon={CalendarDays} placeholder="Start Year" value={data.employment_start_year} onValueChange={(v) => handleSelectChange('employment_start_year', v)} error={stepErrors.employment_start_year || errors.employment_start_year}>
                    <SelectGroup>
                      {employmentYearOptions.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
                    </SelectGroup>
                  </IconSelect>
                  <IconSelect icon={CalendarDays} placeholder="End Year" value={data.is_present ? 'current' : data.employment_end_year} onValueChange={(v) => handleSelectChange('employment_end_year', v)}>
                    <SelectGroup>
                      <SelectItem value="current">Present/Current</SelectItem>
                      {employmentYearOptions.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
                    </SelectGroup>
                  </IconSelect>
                </div>
              </div>

              {/* Company fields */}
              <div className="flex flex-col gap-3">
                <IconInput icon={Building2}        name="company_name"   placeholder="Name of Company"          value={data.company_name}   onChange={handleChange} error={stepErrors.company_name || errors.company_name} />
                <IconInput icon={Briefcase}         name="position"       placeholder="Position in the Company"  value={data.position}       onChange={handleChange} error={stepErrors.position || errors.position} />
                <IconInput icon={MapPin}            name="location"       placeholder="Location of Company"      value={data.location}       onChange={handleChange} error={stepErrors.location || errors.location} />
                <IconInput icon={BadgeDollarSign}   name="monthly_salary" placeholder="Monthly Salary (Optional)" value={data.monthly_salary} onChange={handleChange} error={stepErrors.monthly_salary || errors.monthly_salary} type="number" />
              </div>
            </div>
          )}

          {/* ── Step 6: Unemployment reason ── */}
          {step === 6 && (
            <div className="flex flex-col gap-4 px-2">
              <p className="text-center font-semibold text-gray-800">
                What is your reason for not working at the moment?
              </p>
              <IconSelect icon={Briefcase} placeholder="Select your reason" value={data.unemployment_reason} onValueChange={(v) => handleSelectChange('unemployment_reason', v)} error={stepErrors.unemployment_reason || errors.unemployment_reason}>
                <SelectGroup>
                  {UNEMPLOYMENT_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectGroup>
              </IconSelect>
            </div>
          )}

        </form>
      </CardContent>

      {/* ── Footer ── */}
      <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-2">
        <div className="flex w-full gap-3">
          {/* Back */}
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || processing}
            className="flex-1 rounded-xl h-12 font-semibold"
        >
            Back
        </Button>

          {/* Next — steps 1-4 */}
          {step < 5 && (
            <Button
              type="button" onClick={nextStep} disabled={!canNext}
              className="flex-1 rounded-xl h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {/* Submit — steps 5 & 6 */}
          {(step === 5 || step === 6) && (
            <Button
              form="signupForm"
              type="submit"
              disabled={processing}
              className="flex-1 rounded-xl h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
              {processing ? (
                  <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                  </>
              ) : (
                  <>
                      Sign Up
                      <ArrowRight className="h-4 w-4" />
                  </>
              )}
          </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Already have an account?</span>
          <TextLink routeName="alumna.login" linkName="Login here" className="text-blue-600 font-medium" />
        </div>
      </CardFooter>
    </Card>
  );
}

AlumnaSignup.layout = (page) => <AuthLayout>{page}</AuthLayout>;
