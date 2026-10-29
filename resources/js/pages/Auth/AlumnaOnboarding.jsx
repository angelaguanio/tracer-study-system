import { useMemo, useState, useEffect, useRef } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import {
  ArrowLeft, ArrowRight,
  User, MapPin, Phone, Lock,
  GraduationCap, BookOpen, CalendarDays,
  Briefcase, Building2, BadgeDollarSign, Users,
  Loader2, Camera, ShieldCheck, CheckCircle2
} from 'lucide-react';

import PhAddressSelector from '@/components/address/PhAddressSelector';
import InternationalAddressSelector from '@/components/address/InternationalAddressSelector';
import AuthLayout from '@/layouts/auth-layout';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '../../components/ui/button';

// ─── Step meta ────────────────────────────────────────────────────────────────
const STEP_META = [
  { icon: User,          title: 'Personal Information',  subtitle: 'Confirm your personal and contact details', total: 4 },
  { icon: Camera,        title: 'Profile Picture',       subtitle: 'Upload a clear, recent photo of yourself',  total: 4 },
  { icon: GraduationCap, title: 'Academic Information',  subtitle: 'Official academic record verified',         total: 4 },
  { icon: Briefcase,     title: 'Employment Status',     subtitle: 'Update your current employment record',     total: 4 },
  { icon: Briefcase,     title: 'Employment Details',    subtitle: 'Tell us about your current employment',     total: 4 },
  { icon: Briefcase,     title: 'Employment Details',    subtitle: 'Share your reason for not working',         total: 4 },
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

// ─── Reusable field with icon ─────────────────────────────────────────────────
function IconInput({ icon: Icon, label, required = false, optional = false, name, type = 'text', placeholder, value, onChange, error, disabled = false }) {
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
          ${error ? "border-red-400" : "border-gray-400 focus-within:border-blue-500"}
          ${disabled ? "bg-gray-100 opacity-80 cursor-not-allowed" : ""}
        `}
      >
        <Icon className="h-4 w-4 text-gray-500 shrink-0" />
        <input
          name={name}
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

// ─── Step header ──────────────────────────────────────────────────────────────
function StepHeader({ step }) {
  const meta = STEP_META[step - 1] || STEP_META[0];
  const Icon = meta.icon;
  // Steps 4, 5, 6 display as Step 4 of 4
  const displayStep = Math.min(step, 4);
  return (
    <div className="flex flex-col items-center gap-1 pb-3 border-b border-gray-200">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-1">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{meta.title}</h2>
      <p className="text-xs text-gray-500">{meta.subtitle}</p>
      <span className="mt-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
        Step {displayStep} of 4
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
          ${disabled ? "bg-gray-100 opacity-80 cursor-not-allowed" : ""}
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

const FIELD_LABELS = {
  first_name: 'First Name',
  last_name: 'Last Name',
  middle_name: 'Middle Name',
  suffix: 'Suffix',
  contact_number: 'Contact Number',
  street_address: 'Street Address',
  region: 'Region',
  province: 'Province',
  city: 'City / Municipality',
  barangay: 'Barangay',
  country: 'Country',
  profile_picture: 'Profile Picture',
  currently_employed: 'Employment Status',
  employment_type: 'Employment Type',
  company_name: 'Company Name',
  position: 'Position',
  location: 'Company Address',
  monthly_salary: 'Monthly Salary',
  employment_duration: 'Employment Duration',
  unemployment_reason: 'Reason for Not Working',
};

export default function AlumnaOnboarding({ user }) {
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form with pre-filled academic and profile data from user prop
  const [data, setData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    middle_name: user?.middle_name || '',
    suffix: user?.suffix || 'N/A',
    student_id: user?.student_id || '',
    department: user?.department || 'CECT',
    courses: user?.courses || '',
    school_year: user?.school_year || '',
    semester: user?.semester || '',
    email: user?.email || '',
    country: 'Philippines',
    street_address: '',
    subdivision: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    zip_code: '',
    address: '',
    contact_number: user?.contact_number || '',
    currently_employed: '',
    employment_type: '',
    company_name: '',
    position: '',
    location: '',
    monthly_salary: '',
    employment_duration: '',
    is_present: true,
    unemployment_reason: '',
    profile_picture: null,
  });

  const [residency, setResidency] = useState('Philippines');

  const handleChange = ({ target: { name, value } }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStepErrors((prev) => ({ ...prev, profile_picture: 'Please select an image file (JPG, PNG, WebP).' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStepErrors((prev) => ({ ...prev, profile_picture: 'Image size must not exceed 5MB.' }));
      return;
    }

    setStepErrors((prev) => ({ ...prev, profile_picture: null }));
    setData((prev) => ({ ...prev, profile_picture: file }));

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result);
    reader.readAsDataURL(file);
  };

  // Validation functions
  const validateStep1 = () => {
    const errors = {};
    if (!data.contact_number) {
      errors.contact_number = 'Contact number is required';
    } else if (!/^\+\d{8,15}$/.test(data.contact_number.replace(/\s+/g, ''))) {
      errors.contact_number = 'Please enter a valid international phone number (e.g. +639123456789)';
    }

    if (residency === 'Philippines') {
      if (!data.region) errors.region = 'Region is required';
      if (!data.province) errors.province = 'Province is required';
      if (!data.city) errors.city = 'City / Municipality is required';
      if (!data.barangay) errors.barangay = 'Barangay is required';
      if (!data.street_address) errors.street_address = 'Street Address is required';
    } else {
      if (!data.country) errors.country = 'Country is required';
      if (!data.province) errors.province = 'State / Province is required';
      if (!data.city) errors.city = 'City is required';
      if (!data.street_address) errors.street_address = 'Street Address is required';
    }
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!data.profile_picture || !(data.profile_picture instanceof File)) {
      errors.profile_picture = 'Please choose a profile picture file to continue.';
    }
    return errors;
  };

  const validateStep3 = () => {
    // Academic info is pre-filled from DB
    return {};
  };

  const validateStep4 = () => {
    const errors = {};
    if (!data.currently_employed) errors.currently_employed = 'Please select your employment status';
    return errors;
  };

  const validateStep5 = () => {
    const errors = {};
    if (!data.employment_type) errors.employment_type = 'Employment type is required';
    if (!data.company_name) errors.company_name = 'Company name is required';
    if (!data.position) errors.position = 'Position is required';
    if (!data.location) errors.location = 'Location is required';
    if (!data.employment_duration) errors.employment_duration = 'Duration is required';
    return errors;
  };

  const validateStep6 = () => {
    const errors = {};
    if (!data.unemployment_reason) errors.unemployment_reason = 'Please select a reason';
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
      setStepErrors({});
      if (data.currently_employed === 'Yes') { setStep(5); } else { setStep(6); }
    }
  };

  const prevStep = () => {
    if (step === 5 || step === 6) { setStep(4); return; }
    if (step > 1) setStep((p) => p - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (processing) return;

    const err1 = validateStep1();
    if (Object.keys(err1).length > 0) { setStepErrors(err1); setStep(1); return; }

    const err2 = validateStep2();
    if (Object.keys(err2).length > 0) { setStepErrors(err2); setStep(2); return; }

    const err4 = validateStep4();
    if (Object.keys(err4).length > 0) { setStepErrors(err4); setStep(4); return; }

    if (data.currently_employed === 'Yes') {
      const err5 = validateStep5();
      if (Object.keys(err5).length > 0) { setStepErrors(err5); setStep(5); return; }
    } else {
      const err6 = validateStep6();
      if (Object.keys(err6).length > 0) { setStepErrors(err6); setStep(6); return; }
    }

    const formData = new FormData();
    formData.append('country', data.country || 'Philippines');
    formData.append('street_address', data.street_address || '');
    formData.append('subdivision', data.subdivision || '');
    formData.append('region', data.region || '');
    formData.append('province', data.province || '');
    formData.append('city', data.city || '');
    formData.append('barangay', data.barangay || '');
    formData.append('zip_code', data.zip_code || '');
    formData.append('address', data.address || '');
    formData.append('contact_number', data.contact_number || '');

    if (data.profile_picture instanceof File) {
      formData.append('profile_picture', data.profile_picture);
    }

    formData.append('currently_employed', data.currently_employed);
    if (data.currently_employed === 'Yes') {
      formData.append('employment_type', data.employment_type || '');
      formData.append('company_name', data.company_name || '');
      formData.append('position', data.position || '');
      formData.append('location', data.location || '');
      formData.append('monthly_salary', data.monthly_salary || '');
      formData.append('employment_duration', data.employment_duration || '');
      formData.append('is_present', data.is_present ? '1' : '0');
    } else {
      formData.append('unemployment_reason', data.unemployment_reason || '');
    }

    setProcessing(true);
    router.post(route('alumna.onboarding.submit'), formData, {
      forceFormData: true,
      onFinish: () => setProcessing(false),
      onError: (errs) => {
        setStepErrors(errs);
      }
    });
  };

  const isFinalStep = step === 5 || step === 6;

  return (
    <>
      <Head title="Alumni Profile Setup" />
      <Card className="relative w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden" style={{ maxHeight: 'min(90vh, 660px)' }}>
        <form className="flex flex-col flex-1 min-h-0 overflow-hidden" onSubmit={handleSubmit}>
          <CardContent className="custom-scrollbar overflow-y-auto overflow-x-hidden px-6 py-4 flex-1">
            <div className="flex flex-col gap-4">
              <StepHeader step={step} />

              {/* ── Step 1: Personal Information ── */}
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Identity Verified</p>
                      <p className="text-emerald-800">Your name and student ID are verified from university records.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <IconInput icon={User} name="first_name" label="First Name" value={data.first_name} disabled />
                    <IconInput icon={User} name="last_name" label="Last Name" value={data.last_name} disabled />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <IconInput icon={User} name="middle_name" label="Middle Name" value={data.middle_name} disabled />
                    <IconSelect icon={User} label="Suffix" placeholder="Suffix" value={data.suffix} onValueChange={(v) => handleSelectChange('suffix', v)}>
                      <SelectGroup>
                        <SelectItem value="N/A">N/A</SelectItem>
                        <SelectItem value="Jr.">Jr.</SelectItem>
                        <SelectItem value="Sr.">Sr.</SelectItem>
                        <SelectItem value="II">II</SelectItem>
                        <SelectItem value="III">III</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                      </SelectGroup>
                    </IconSelect>
                  </div>

                  <div className="flex flex-col gap-2 my-1">
                    <label className="text-xs font-medium text-gray-700">Where do you currently reside?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                        <input
                          type="radio"
                          name="residency"
                          checked={residency === 'Philippines'}
                          onChange={() => {
                            setResidency('Philippines');
                            setData(p => ({...p, country: 'Philippines', street_address: '', region: '', province: '', city: '', barangay: ''}));
                          }}
                          className="accent-emerald-600"
                        />
                        Philippines
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                        <input
                          type="radio"
                          name="residency"
                          checked={residency === 'International'}
                          onChange={() => {
                            setResidency('International');
                            setData(p => ({...p, country: '', street_address: '', region: '', province: '', city: '', barangay: ''}));
                          }}
                          className="accent-emerald-600"
                        />
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
                    <div className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-colors ${stepErrors.contact_number ? 'border-red-400' : 'border-gray-400 focus-within:border-emerald-500'}`}>
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
                <div className="flex flex-col items-center gap-4 py-2">
                  <p className="text-center text-xs sm:text-sm text-gray-500 px-2">
                    Upload a formal, clear photo of yourself for your alumni profile.
                  </p>

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
                          <span className="text-xs text-gray-400 font-medium">Upload photo</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    {avatarPreview ? 'Change Photo' : 'Select Photo File'}
                  </button>

                  {stepErrors.profile_picture && (
                    <p className="text-xs text-red-500 text-center">{stepErrors.profile_picture}</p>
                  )}

                  <p className="text-[11px] text-gray-400 text-center">
                    Accepted formats: JPG, PNG, WebP · Maximum size: 5MB
                  </p>
                </div>
              )}

              {/* ── Step 3: Academic Information (Pre-filled & Verified) ── */}
              {step === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-emerald-900">Official Academic Record Found</p>
                      <p className="text-emerald-800 mt-0.5">
                        These details were registered by your department coordinator and have been automatically locked.
                      </p>
                    </div>
                  </div>

                  <IconInput 
                    icon={GraduationCap} 
                    label="Student ID" 
                    value={data.student_id} 
                    disabled 
                  />

                  <IconInput 
                    icon={Building2} 
                    label="College / Department" 
                    value={data.department} 
                    disabled 
                  />

                  <IconInput 
                    icon={BookOpen} 
                    label="Program / Degree" 
                    value={data.courses} 
                    disabled 
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <IconInput 
                      icon={CalendarDays} 
                      label="School Year Graduated" 
                      value={data.school_year} 
                      disabled 
                    />
                    <IconInput 
                      icon={CalendarDays} 
                      label="Semester" 
                      value={data.semester} 
                      disabled 
                    />
                  </div>
                </div>
              )}

              {/* ── Step 4: Employment Status ── */}
              {step === 4 && (
                <div className="flex flex-col gap-4 py-2">
                  <p className="text-center text-xs text-gray-500">
                    Help us keep Wesleyan alumni records up to date.
                  </p>
                  <p className="text-center font-semibold text-gray-800 text-sm">Are you currently employed?</p>
                  <div className="flex flex-col gap-3">
                    {['Yes', 'No'].map((val) => {
                      const checked = data.currently_employed === val;
                      return (
                        <label
                          key={val}
                          className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all
                            ${checked ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                          <input
                            type="radio"
                            name="currently_employed"
                            value={val}
                            checked={checked}
                            onChange={handleChange}
                            className="h-5 w-5 accent-emerald-600"
                          />
                          <span className="font-semibold text-sm text-gray-900">
                            {val === 'Yes' ? "Yes, I am currently employed" : "No, I am currently not employed"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {stepErrors.currently_employed && (
                    <p className="text-xs text-red-500 text-center">{stepErrors.currently_employed}</p>
                  )}
                </div>
              )}

              {/* ── Step 5: Employed Details ── */}
              {step === 5 && (
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Employment Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMPLOYMENT_TYPE_OPTIONS.map(({ value, label, icon: TypeIcon }) => {
                        const checked = data.employment_type === value;
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all
                              ${checked ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                          >
                            <input
                              type="radio"
                              name="employment_type"
                              value={value}
                              checked={checked}
                              onChange={handleChange}
                              className="h-4 w-4 accent-emerald-600 shrink-0"
                            />
                            <TypeIcon className={`h-4 w-4 ${checked ? 'text-emerald-700' : 'text-gray-400'}`} />
                            <span className="text-xs font-medium text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {stepErrors.employment_type && <p className="text-xs text-red-500 mt-1">{stepErrors.employment_type}</p>}
                  </div>

                  <IconInput 
                    icon={Building2} 
                    name="company_name" 
                    label="Company Name" 
                    required 
                    placeholder="e.g. Acme Corp." 
                    value={data.company_name} 
                    onChange={handleChange} 
                    error={stepErrors.company_name} 
                  />

                  <IconInput 
                    icon={Briefcase} 
                    name="position" 
                    label="Position / Role" 
                    required 
                    placeholder="e.g. Software Engineer" 
                    value={data.position} 
                    onChange={handleChange} 
                    error={stepErrors.position} 
                  />

                  <IconInput 
                    icon={MapPin} 
                    name="location" 
                    label="Company Address / Location" 
                    required 
                    placeholder="e.g. Cabanatuan City, Nueva Ecija" 
                    value={data.location} 
                    onChange={handleChange} 
                    error={stepErrors.location} 
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <IconInput 
                      icon={CalendarDays} 
                      name="employment_duration" 
                      label="Duration" 
                      required 
                      placeholder="e.g. 2023 - Present" 
                      value={data.employment_duration} 
                      onChange={handleChange} 
                      error={stepErrors.employment_duration} 
                    />
                    <IconInput 
                      icon={BadgeDollarSign} 
                      name="monthly_salary" 
                      label="Monthly Salary (PHP)" 
                      optional 
                      placeholder="e.g. 30,000" 
                      value={data.monthly_salary} 
                      onChange={handleChange} 
                      error={stepErrors.monthly_salary} 
                    />
                  </div>
                </div>
              )}

              {/* ── Step 6: Unemployed Reason ── */}
              {step === 6 && (
                <div className="flex flex-col gap-4 py-2">
                  <p className="text-center font-semibold text-gray-800 text-sm">
                    What is your current status or reason for not working?
                  </p>
                  <IconSelect
                    icon={Briefcase}
                    label="Primary Reason"
                    required
                    placeholder="Select your current situation"
                    value={data.unemployment_reason}
                    onValueChange={(v) => handleSelectChange('unemployment_reason', v)}
                    error={stepErrors.unemployment_reason}
                  >
                    <SelectGroup>
                      {UNEMPLOYMENT_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectGroup>
                  </IconSelect>
                </div>
              )}
            </div>
          </CardContent>

          {/* ── Footer ── */}
          <CardFooter className="flex w-full gap-3 px-6 py-4 border-t border-gray-100 bg-white shrink-0">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={processing}
                className="w-1/3 h-11 text-xs sm:text-sm font-semibold rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}

            {!isFinalStep ? (
              <Button
                type="button"
                variant="blue"
                onClick={nextStep}
                className="flex-1 h-11 text-xs sm:text-sm font-semibold rounded-xl"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="blue"
                disabled={processing}
                className="flex-1 h-11 text-xs sm:text-sm font-semibold rounded-xl"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Finish</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </>
  );
}

AlumnaOnboarding.layout = page => <AuthLayout>{page}</AuthLayout>;

