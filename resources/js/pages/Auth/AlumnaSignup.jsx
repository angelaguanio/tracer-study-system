import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  ArrowLeft, ArrowRight,
  User, MapPin, Phone, Mail, Lock,
  GraduationCap, BookOpen, CalendarDays,
  Briefcase, Building2, BadgeDollarSign, Users,
  Eye, EyeOff, Loader2, Camera,
} from 'lucide-react';

import PhAddressSelector from '@/components/address/PhAddressSelector';
import InternationalAddressSelector from '@/components/address/InternationalAddressSelector';
import AuthLayout from '@/layouts/auth-layout';
import TextInput from '@/components/text-input';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '../../components/ui/button';
import TextLink from '../../components/text-link';

// ─── Step meta ────────────────────────────────────────────────────────────────
const STEP_META = [
  { icon: User,          title: 'Personal Information',  subtitle: 'Tell us a bit about yourself',            total: 5 },
  { icon: Camera,        title: 'Profile Picture',       subtitle: 'Upload a clear photo of yourself',         total: 5 },
  { icon: GraduationCap, title: 'Academic Information',  subtitle: 'Share your academic background',           total: 5 },
  { icon: Lock,          title: 'Account Information',   subtitle: 'Create your login credentials',            total: 5 },
  { icon: Briefcase,     title: 'Employment Status',     subtitle: 'Help us update our alumni records',        total: 5 },
  { icon: Briefcase,     title: 'Employment Information',subtitle: 'Tell us about your current employment',    total: 5 },
  { icon: Briefcase,     title: 'Employment Information',subtitle: 'Share your reason for not working',        total: 5 },
];

// ─── Options ──────────────────────────────────────────────────────────────────
const BASE_COURSES = [
  { value: 'BSCpE', label: 'Bachelor of Science in Computer Engineering' },
  { value: 'BSEcE', label: 'Bachelor of Science in Electronics Engineering' },
  { value: 'BSIT',  label: 'Bachelor of Science in Information Technology' },
  { value: 'BSCS',  label: 'Bachelor of Science in Computer Science' },
];

const SEMESTER_OPTIONS = [
  { value: '1st Semester', label: '1st Semester' },
  { value: '2nd Semester', label: '2nd Semester' },
  { value: 'Summer/Midyear', label: 'Summer/Midyear' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Permanent/Regular', label: 'Permanent/Regular', icon: Briefcase },
  { value: 'Probationary',      label: 'Probationary',      icon: Users },
];

const UNEMPLOYMENT_REASONS = [
  'Studying',
  'Job Hunting',
  'Career Break',
  'Family / Personal Responsibilities',
  'Health Reasons',
  'Preparing for Licensure/Certification Exam',
  'Starting a Business',
  'Other',
];

const INITIAL_FORM = {
  last_name: '', first_name: '', middle_name: '', suffix: '',
  country: 'Philippines', street_address: '', subdivision: '', region: '', province: '', city: '', barangay: '', address: '',
  contact_number: '',
  email: '', password: '', password_confirmation: '',
  department: 'CECT', courses: '',
  school_year: '', start_year: '', end_year: '', semester: '',
  user_role: '',
  currently_employed: '',
  employment_type: '', company_name: '', position: '',
  location: '', monthly_salary: '',
  employment_duration: '',
  is_present: true,
  unemployment_reason: '',
  profile_picture: null,
};

// ─── Reusable field with icon ─────────────────────────────────────────────────
function IconInput({ icon: Icon, label, required = false, optional = false, name, type = 'text', placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-700">
          {label}{' '}
          {required && <span className="text-red-500">*</span>}
          {optional && <span className="text-gray-400 text-[11px]">(Optional)</span>}
        </label>
      )}
      <div
        className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 transition-colors
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
          className="flex-1 text-sm text-black placeholder:text-gray-500 focus:outline-none bg-transparent"
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
  // Map internal step to display number
  // Steps 1–5 display as 1–5; internal steps 6 & 7 display as step 5
  const displayStep = Math.min(step, 5);
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
function IconSelect({ icon: Icon, label, required = false, optional = false, placeholder, value, onValueChange, children, error, disabled = false }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-700">
          {label}{' '}
          {required && <span className="text-red-500">*</span>}
          {optional && <span className="text-gray-400 text-[11px]">(Optional)</span>}
        </label>
      )}
      <div
        className={`w-full flex items-center gap-3 rounded-lg border px-4 bg-white overflow-hidden transition-colors
          ${error ? "border-red-400" : "border-gray-400 focus-within:border-blue-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
          <Icon className="h-4 w-4 text-gray-500 shrink-0" />

          <Select value={value} onValueChange={onValueChange} disabled={disabled}>
              <SelectTrigger className="flex-1 min-w-0 w-full border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const [data, setData] = useState(INITIAL_FORM);
  const [residency, setResidency] = useState('Philippines');

  // Jump back to the step that has an error after server validation
  // (server errors come back via Inertia page props on failed redirect)

  const EMPLOYMENT_CURRENT_YEAR = new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear() - 1; // last completed academic year
    const allYears = Array.from({ length: currentYear - 1985 + 1 }, (_, i) => {
      const s = currentYear - i; return { value: `${s}-${s + 1}`, label: `${s}-${s + 1}` };
    });

    if (data.courses === 'BSCS') {
      return allYears.filter((y) => {
        const startYear = parseInt(y.value.split('-')[0], 10);
        return startYear >= 1998 && startYear <= 2010;
      });
    }
    if (data.courses === 'BSIT') {
      return allYears.filter((y) => {
        const startYear = parseInt(y.value.split('-')[0], 10);
        return startYear >= 2010;
      });
    }
    if (data.courses === 'BSEcE') {
      return allYears.filter((y) => {
        const startYear = parseInt(y.value.split('-')[0], 10);
        return startYear >= 1985;
      });
    }
    if (data.courses === 'BSCpE') {
      return allYears.filter((y) => {
        const startYear = parseInt(y.value.split('-')[0], 10);
        return startYear >= 1998;
      });
    }
    return allYears;
  }, [data.courses]);

  const employmentYearOptions = useMemo(() =>
    Array.from({ length: EMPLOYMENT_CURRENT_YEAR - 2018 + 1 }, (_, i) => {
      const y = EMPLOYMENT_CURRENT_YEAR - i; return { value: String(y), label: String(y) };
    }), [EMPLOYMENT_CURRENT_YEAR]);



  const handleChange = ({ target: { name, value } }) => {
    setData((prev) => ({ ...prev, [name]: value }));
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
      setData((prev) => value === 'current'
        ? { ...prev, is_present: true,  employment_end_year: 'current' }
        : { ...prev, is_present: false, employment_end_year: value });
      return;
    }
    if (name === 'courses') {
      if (value === 'BSCS' && data.school_year) {
        const startYear = parseInt(data.school_year.split('-')[0], 10);
        if (startYear < 1998 || startYear > 2010) {
          setData((prev) => ({ ...prev, [name]: value, school_year: '' }));
          return;
        }
      }
      if (value === 'BSIT' && data.school_year) {
        const startYear = parseInt(data.school_year.split('-')[0], 10);
        if (startYear < 2010) {
          setData((prev) => ({ ...prev, [name]: value, school_year: '' }));
          return;
        }
      }
      if (value === 'BSEcE' && data.school_year) {
        const startYear = parseInt(data.school_year.split('-')[0], 10);
        if (startYear < 1985) {
          setData((prev) => ({ ...prev, [name]: value, school_year: '' }));
          return;
        }
      }
      if (value === 'BSCpE' && data.school_year) {
        const startYear = parseInt(data.school_year.split('-')[0], 10);
        if (startYear < 1998) {
          setData((prev) => ({ ...prev, [name]: value, school_year: '' }));
          return;
        }
      }
      setData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Profile picture file handler ─────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type client-side
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setStepErrors((prev) => ({ ...prev, profile_picture: 'Only JPG, PNG, or WebP images are allowed.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStepErrors((prev) => ({ ...prev, profile_picture: 'Image must be 5MB or smaller.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    setData((prev) => ({ ...prev, profile_picture: file }));
    setStepErrors((prev) => ({ ...prev, profile_picture: null }));
  };

  // ── Per-step validation ────────────────────────────────────────────────────
  const isStep1Done = residency === 'Philippines' ? [
    data.last_name,
    data.first_name,
    data.middle_name,
    data.suffix,
    data.street_address,
    data.region,
    data.province,
    data.city,
    data.barangay,
    data.contact_number,
  ].every(Boolean) : [
    data.last_name,
    data.first_name,
    data.middle_name,
    data.suffix,
    data.street_address,
    data.country,
    data.province,
    data.city,
    data.contact_number,
  ].every(Boolean);
  const isStep2Done = !!data.profile_picture;
  const isStep3Done = [data.courses, data.school_year, data.semester].every(Boolean);
  const isStep4Done = [data.email, data.password, data.password_confirmation].every(Boolean) && passwordErrors.length === 0;

  const validateStep1 = () => {
    const errors = {};
    if (!data.last_name.trim()) errors.last_name = "Last name is required";
    if (!data.first_name.trim()) errors.first_name = "First name is required";
    if (!data.middle_name?.trim()) {
      errors.middle_name = "Middle name is required. Enter * if you do not have one.";
    } else {
      const mn = data.middle_name.trim();
      if (mn !== '*' && (mn.length === 1 || /^[A-Z]{2}$/.test(mn) || mn.endsWith('.'))) {
        errors.middle_name = "Please enter your full middle name, not just an initial. Enter * if you do not have a middle name.";
      }
    }
    if (!data.suffix) errors.suffix = "Suffix is required. Select 'None' if you do not have one.";
    if (!data.street_address?.trim()) errors.street_address = "Street address / House number is required";
    if (residency === 'Philippines') {
      if (!data.region) errors.region = "Region is required";
      if (!data.province) errors.province = "Province is required";
      if (!data.city) errors.city = "City / Municipality is required";
      if (!data.barangay) errors.barangay = "Barangay is required";
    } else {
      if (!data.country) errors.country = "Country is required";
      if (!data.province) errors.province = "State / Province is required";
      if (!data.city) errors.city = "City is required";
    }
    if (!/^\+\d{8,15}$/.test(data.contact_number || '')) errors.contact_number = "Enter a valid contact number (e.g., +63 912 345 6789)";
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!data.profile_picture) errors.profile_picture = "Please upload a profile picture to continue.";
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!data.courses) errors.courses = "Course is required";
    if (!data.school_year) errors.school_year = "School year is required";
    if (!data.semester) errors.semester = "Semester is required";
    return errors;
  };

  const validateStep4 = () => {
    const errors = {};
    if (!data.email) errors.email = "Email is required";
    if (passwordErrors.length > 0) errors.password = "Password requirements not met";
    if (data.password !== data.password_confirmation) errors.password_confirmation = "Passwords do not match";
    return errors;
  };

  const validateStep5 = () => {
    const errors = {};
    if (!data.currently_employed) errors.currently_employed = "Please select your employment status";
    return errors;
  };

  const validateStep6 = () => {
    const errors = {};
    if (!data.employment_type) errors.employment_type = "Employment type is required";
    if (!data.company_name) errors.company_name = "Company name is required";
    if (!data.position) errors.position = "Position is required";
    if (!data.location) errors.location = "Location is required";
    if (!data.employment_duration) errors.employment_duration = "Duration is required";
    return errors;
  };

  const validateStep7 = () => {
    const errors = {};
    if (!data.unemployment_reason) errors.unemployment_reason = "Please select a reason";
    return errors;
  };

  const nextStep = () => {
    let errors = {};

    if (step === 1) {
      errors = validateStep1();
      if (Object.keys(errors).length > 0) { setStepErrors(errors); return; }
      setStepErrors({}); setStep(2); return;
    }

    if (step === 2) {
      errors = validateStep2();
      if (Object.keys(errors).length > 0) { setStepErrors(errors); return; }
      setStepErrors({}); setStep(3); return;
    }

    if (step === 3) {
      errors = validateStep3();
      if (Object.keys(errors).length > 0) { setStepErrors(errors); return; }
      setStepErrors({}); setStep(4); return;
    }

    if (step === 4) {
      errors = validateStep4();
      if (Object.keys(errors).length > 0) { setStepErrors(errors); return; }
      setStepErrors({}); setStep(5); return;
    }

    if (step === 5) {
      errors = validateStep5();
      if (Object.keys(errors).length > 0) { setStepErrors(errors); return; }
      setStepErrors({});
      if (data.currently_employed === 'Yes') { setStep(6); } else { setStep(7); }
    }
  };

  const prevStep = () => {
    if (step === 6 || step === 7) { setStep(5); return; }
    if (step > 1) setStep((p) => p - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (processing) return;

    const [start_year, end_year] = data.school_year.split('-');

    const formData = new FormData();

    // Personal
    formData.append('first_name',     data.first_name);
    formData.append('last_name',      data.last_name);
    formData.append('middle_name',    data.middle_name ?? '');
    formData.append('suffix',         data.suffix === 'None' ? '' : (data.suffix ?? ''));
    formData.append('country',        data.country ?? 'Philippines');
    formData.append('street_address', data.street_address ?? '');
    formData.append('subdivision',    data.subdivision ?? '');
    formData.append('region',         data.region ?? '');
    formData.append('province',       data.province ?? '');
    formData.append('city',           data.city ?? '');
    formData.append('barangay',       data.barangay ?? '');
    formData.append('address',        data.address ?? '');
    formData.append('contact_number', data.contact_number || '');
    formData.append('department',     data.department);

    // Profile picture
    if (data.profile_picture instanceof File) {
      formData.append('profile_picture', data.profile_picture);
    }

    // Academic
    formData.append('courses',     data.courses);
    formData.append('school_year', data.school_year);
    formData.append('start_year',  start_year?.trim() ?? '');
    formData.append('end_year',    end_year?.trim() ?? '');
    formData.append('semester',    data.semester);

    // Account
    formData.append('email',                 data.email);
    formData.append('password',              data.password);
    formData.append('password_confirmation', data.password_confirmation);

    // Employment
    formData.append('currently_employed', data.currently_employed);

    if (data.currently_employed === 'Yes') {
      let duration = data.employment_duration || '';
      const parts = duration.split('-').map(s => s?.trim());
      
      // Auto format to include 'Present' if they just typed a start year
      if (parts.length === 1 || !parts[1] || parts[1].toLowerCase() === 'current') {
          duration = `${parts[0]} - Present`;
      }
      
      const isPresent = true; // since they answered Yes to 'Currently employed'

      formData.append('employment_type',       data.employment_type);
      formData.append('company_name',          data.company_name);
      formData.append('position',              data.position);
      formData.append('location',              data.location);
      formData.append('employment_duration',   duration);
      formData.append('is_present',            isPresent ? '1' : '0');
      if (data.monthly_salary) formData.append('monthly_salary', data.monthly_salary);
    } else {
      formData.append('unemployment_reason', data.unemployment_reason);
    }

    setProcessing(true);
    router.post('/alumna/signup', formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setData(INITIAL_FORM);
        setAvatarPreview(null);
        setStep(1);
        setProcessing(false);
      },
      onError: (errors) => {
        setProcessing(false);
        // Jump to the step with the first error
        const stepFields = [
          ['last_name', 'first_name', 'middle_name', 'address', 'contact_number'],
          ['profile_picture'],
          ['courses', 'start_year', 'end_year', 'semester'],
          ['email', 'password', 'password_confirmation'],
          ['currently_employed'],
          ['employment_type', 'company_name', 'position', 'location', 'monthly_salary', 'employment_start_year', 'employment_end_year'],
          ['unemployment_reason'],
        ];
        for (let i = 0; i < stepFields.length; i++) {
          if (stepFields[i].some((f) => errors[f])) { setStep(i + 1); return; }
        }
      },
    });
  };

  const canNext =
    (step === 1 && isStep1Done) ||
    (step === 2 && isStep2Done) ||
    (step === 3 && isStep3Done) ||
    (step === 4 && isStep4Done) ||
    (step === 5 && !!data.currently_employed);

  return (
    <Card className="relative w-full max-w-md rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: 'min(90vh, 660px)' }}>

      <CardContent className="custom-scrollbar overflow-y-auto px-6 py-4 flex-1">
        <form id="signupForm" className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <StepHeader step={step} />

          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <IconInput icon={User}  name="last_name"   label="Last Name" required placeholder="Last Name"      value={data.last_name}      onChange={handleChange} error={stepErrors.last_name} />
              <IconInput icon={User}  name="first_name"  label="First Name" required placeholder="First Name"     value={data.first_name}     onChange={handleChange} error={stepErrors.first_name} />
              <IconInput icon={User}  name="middle_name" label="Middle Name" required placeholder="Enter * if you don't have a middle name" value={data.middle_name} onChange={handleChange} error={stepErrors.middle_name} />
              <IconSelect icon={User} label="Suffix" required placeholder="e.g. Jr., Sr., III" value={data.suffix} onValueChange={(v) => handleSelectChange('suffix', v)} error={stepErrors.suffix}>
                <SelectGroup>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                </SelectGroup>
              </IconSelect>
              
              <div className="flex flex-col gap-2 my-2">
                <label className="text-xs font-medium text-gray-700">Where do you currently reside?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                    <input type="radio" name="residency" checked={residency === 'Philippines'} onChange={() => { setResidency('Philippines'); setData(p => ({...p, country: 'Philippines', street_address: '', region: '', province: '', city: '', barangay: ''})) }} className="accent-emerald-500" />
                    Philippines
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                    <input type="radio" name="residency" checked={residency === 'International'} onChange={() => { setResidency('International'); setData(p => ({...p, country: '', street_address: '', region: '', province: '', city: '', barangay: ''})) }} className="accent-emerald-500" />
                    Outside the Philippines
                  </label>
                </div>
              </div>

              {residency === 'Philippines' ? (
                <PhAddressSelector
                  data={data}
                  onChange={(updatedAddress) => {
                    setData((prev) => ({ ...prev, ...updatedAddress }));
                    setStepErrors((prev) => ({
                      ...prev,
                      street_address: null,
                      region: null,
                      province: null,
                      city: null,
                      barangay: null,
                    }));
                  }}
                  errors={stepErrors}
                />
              ) : (
                <InternationalAddressSelector
                  data={data}
                  onChange={(updatedAddress) => {
                    setData((prev) => ({ ...prev, ...updatedAddress }));
                    setStepErrors((prev) => ({
                      ...prev,
                      street_address: null,
                      country: null,
                      province: null,
                      city: null,
                    }));
                  }}
                  errors={stepErrors}
                />
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-colors ${stepErrors.contact_number ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'}`}>
                  <PhoneInput
                    international
                    defaultCountry="PH"
                    value={data.contact_number || ''}
                    onChange={(value) => setData(p => ({ ...p, contact_number: value }))}
                    className="flex-1 PhoneInput--custom text-sm"
                    style={{ '--PhoneInput-color--focus': '#10b981' }}
                  />
                </div>
                {stepErrors.contact_number && <p className="text-xs text-red-500 pl-1">{stepErrors.contact_number}</p>}
                
                {/* Embedded CSS for PhoneInput to match Tailwind design */}
                <style dangerouslySetInnerHTML={{__html: `
                  .PhoneInput--custom .PhoneInputInput {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    color: #000;
                    width: 100%;
                  }
                  .PhoneInput--custom .PhoneInputCountry {
                    margin-right: 0.75rem;
                  }
                `}} />
              </div>
            </div>
          )}

          {/* ── Step 2: Profile Picture ── */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-5 py-2">
              <p className="text-center text-sm text-gray-500 px-2">
                This photo will appear on your alumni profile. Please upload a clear, recent photo of yourself.
              </p>

              {/* Avatar preview */}
              <div className="relative group">
                <div
                  className={`h-36 w-36 rounded-full overflow-hidden border-4 shadow-md flex items-center justify-center cursor-pointer transition-all
                    ${stepErrors.profile_picture ? 'border-red-400' : 'border-emerald-200 group-hover:border-emerald-400'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2">
                      <Camera className="h-10 w-10 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Tap to upload</span>
                    </div>
                  )}
                </div>

                {/* Camera overlay button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-colors"
                  aria-label="Upload profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
              >
                {avatarPreview ? 'Change Photo' : 'Choose a Photo'}
              </button>

              {/* Error */}
              {stepErrors.profile_picture && (
                <p className="text-xs text-red-500 text-center">{stepErrors.profile_picture}</p>
              )}

              {/* Accepted formats note */}
              <p className="text-[11px] text-gray-400 text-center">
                Accepted: JPG, PNG, WebP · Max size: 5MB
              </p>

              {/* Required badge */}
              {!avatarPreview && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-amber-500 text-xs font-bold">⚠</span>
                  <span className="text-xs text-amber-700">A profile picture is required to sign up.</span>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Academic ── */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              {/* Static dept display */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  College / Department <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500">College of Engineering and Computer Technology (CECT)</span>
                </div>
              </div>

              <IconSelect icon={BookOpen} label="Program / Course" required placeholder="Program / Course" value={data.courses} onValueChange={(v) => handleSelectChange('courses', v)} error={stepErrors.courses}>
                <SelectGroup>
                  {BASE_COURSES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>

              <IconSelect icon={CalendarDays} label="Semester" required placeholder="Semester" value={data.semester} onValueChange={(v) => handleSelectChange('semester', v)} error={stepErrors.semester}>
                <SelectGroup>
                  {SEMESTER_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>

              <IconSelect icon={CalendarDays} label="Year Graduated" required placeholder="Year Graduated" value={data.school_year} onValueChange={(v) => handleSelectChange('school_year', v)} error={stepErrors.school_year}>
                <SelectGroup>
                  {yearOptions.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
                </SelectGroup>
              </IconSelect>
            </div>
          )}

          {/* ── Step 4: Account ── */}
          {step === 4 && (
            <div className="flex flex-col gap-3">
              <IconInput icon={Mail} name="email" label="Email Address" required type="email" placeholder="Email Address" value={data.email} onChange={handleChange} error={stepErrors.email} />
              <IconInput icon={Lock} name="password" label="Password" required type="password" placeholder="Password" value={data.password} onChange={handleChange} error={stepErrors.password} />
              {passwordErrors.length > 0 && (
                <ul className="text-xs text-red-500 space-y-1 pl-1">
                  {passwordErrors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              )}
              <IconInput icon={Lock} name="password_confirmation" label="Confirm Password" required type="password" placeholder="Confirm Password" value={data.password_confirmation} onChange={handleChange} error={stepErrors.password_confirmation} />
            </div>
          )}

          {/* ── Step 5: Employed? ── */}
          {step === 5 && (
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
              {stepErrors.currently_employed && <p className="text-xs text-red-500 text-center">{stepErrors.currently_employed}</p>}
            </div>
          )}

          {/* ── Step 6: Employment details ── */}
          {step === 6 && (
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
                <p className="mb-3 font-semibold text-gray-800">Employment Duration</p>
                <IconInput 
                  icon={CalendarDays} 
                  name="employment_duration" 
                  placeholder="e.g. 2023 (We'll automatically append 'Present')" 
                  value={data.employment_duration} 
                  onChange={handleChange} 
                  error={stepErrors.employment_duration} 
                  type="text" 
                />
              </div>

              {/* Company fields */}
              <div className="flex flex-col gap-3">
                <IconInput icon={Building2}        name="company_name"   label="Name of Company" required placeholder="Name of Company"          value={data.company_name}   onChange={handleChange} error={stepErrors.company_name} />
                <IconInput icon={Briefcase}         name="position"       label="Position in the Company" required placeholder="Position in the Company"  value={data.position}       onChange={handleChange} error={stepErrors.position} />
                <IconInput icon={MapPin}            name="location"       label="Address of Company" required placeholder="Address of Company"      value={data.location}       onChange={handleChange} error={stepErrors.location} />
                <IconInput icon={BadgeDollarSign}   name="monthly_salary" label="Monthly Salary" optional placeholder="Monthly Salary" value={data.monthly_salary} onChange={handleChange} error={stepErrors.monthly_salary} type="number" />
              </div>
            </div>
          )}

          {/* ── Step 7: Unemployment reason ── */}
          {step === 7 && (
            <div className="flex flex-col gap-4 px-2">
              <p className="text-center font-semibold text-gray-800">
                What is your reason for not working at the moment?
              </p>
              <IconSelect icon={Briefcase} label="Reason for Not Working" required placeholder="Select your reason" value={data.unemployment_reason} onValueChange={(v) => handleSelectChange('unemployment_reason', v)} error={stepErrors.unemployment_reason}>
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

          {/* Next — steps 1–5 */}
          {step < 6 && (
            <Button
              type="button" onClick={nextStep} disabled={!canNext}
              className="flex-1 rounded-xl h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {/* Submit — steps 6 & 7 */}
          {(step === 6 || step === 7) && (
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
