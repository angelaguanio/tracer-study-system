import { useState, useRef, useMemo } from 'react';
import { usePage, useForm, Link, router } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { User, Briefcase, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const inputClass = "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008542] focus:border-[#008542] transition shadow-sm bg-white";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2";

const EMPLOYMENT_TYPE_OPTIONS = [
    { value: 'Permanent/Regular', label: 'Permanent/Regular' },
    { value: 'Probationary', label: 'Probationary' },
];

const UNEMPLOYMENT_REASON_OPTIONS = [
    { value: 'Studying', label: 'Studying' },
    { value: 'Job Hunting', label: 'Job Hunting' },
    { value: 'Career Break', label: 'Career Break' },
];

// Personal info fields, rendered in order via PERSONAL_FIELDS.map(...)
const PERSONAL_FIELDS = [
    { name: 'last_name', label: 'Last Name', type: 'text', required: true },
    { name: 'first_name', label: 'First Name', type: 'text', required: true },
    { name: 'middle_name', label: 'Middle Name', type: 'text', required: false },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'contact_number', label: 'Contact Number', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
];

export default function StudentProfileEdit() {
    const { profile } = usePage().props;
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(
        profile?.profile_picture || null
    );

    const EMPLOYMENT_CURRENT_YEAR = new Date().getFullYear();
    const EMPLOYMENT_START_YEAR = 2018;

    const employmentYearOptions = useMemo(
        () =>
            Array.from(
                { length: EMPLOYMENT_CURRENT_YEAR - EMPLOYMENT_START_YEAR + 1 },
                (_, index) => {
                    const year = EMPLOYMENT_CURRENT_YEAR - index;
                    return { value: String(year), label: String(year) };
                }
            ),
        [EMPLOYMENT_CURRENT_YEAR]
    );

    const employmentEndYearOptions = useMemo(
        () => [{ value: 'current', label: 'Present' }, ...employmentYearOptions],
        [employmentYearOptions]
    );

    // Employment fields shown when is_employed === 'yes'. Declared after the
    // year options so they can reference them.
    const EMPLOYMENT_FIELDS = useMemo(() => ([
        { name: 'company', label: 'Company Name', type: 'text', required: true, colSpan: 'sm:col-span-2' },
        { name: 'employment_type', label: 'Employment Type', type: 'select', required: true, options: EMPLOYMENT_TYPE_OPTIONS, placeholder: 'Select Type' },
        { name: 'position', label: 'Position', type: 'text', required: true },
        { name: 'employment_start_year', label: 'Start Year', type: 'select', required: true, options: employmentYearOptions, placeholder: 'Select' },
        { name: 'employment_end_year', label: 'End Year', type: 'select', required: true, options: employmentEndYearOptions, placeholder: 'Select' },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'monthly_salary', label: 'Monthly Salary', type: 'number', required: false },
    ]), [employmentYearOptions, employmentEndYearOptions]);

    const initialEndYear = profile?.employment?.employment_end_year
        ? String(profile.employment.employment_end_year)
        : (profile?.employment?.currently_employed === 'Yes' ? 'current' : '');

    const { data, setData, processing, errors } = useForm({
        last_name: profile?.last_name || '',
        first_name: profile?.first_name || '',
        middle_name: profile?.middle_name || '',
        address: profile?.address || '',
        contact_number: profile?.contact_number || '',
        email: profile?.email || '',
        is_employed: profile?.employment?.currently_employed ? String(profile.employment.currently_employed).toLowerCase() : '',
        employment_type: profile?.employment?.employment_type || '',
        company: profile?.employment?.company_name || '',
        employment_start_year: profile?.employment?.employment_start_year || '',
        employment_end_year: initialEndYear,
        position: profile?.employment?.position || '',
        location: profile?.employment?.location || '',
        monthly_salary: profile?.employment?.monthly_salary || '',
        reason_unemployed: profile?.employment?.unemployment_reason || '',
        profile_picture: null,
    });

    // Generic change handler for plain text/email/number inputs.
    const handleInputChange = (name) => (e) => setData(name, e.target.value);

    // Generic change handler for shadcn Select, which hands back the value directly.
    const handleSelectChange = (name) => (value) => setData(name, value);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
            setData('profile_picture', file);
        }
    };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const endYear = data.is_employed === 'yes' && data.employment_end_year === 'current'
            ? null
            : data.employment_end_year || null;

        const formData = new FormData();

        // Personal fields
        formData.append('first_name',      data.first_name);
        formData.append('last_name',       data.last_name);
        formData.append('middle_name',     data.middle_name ?? '');
        formData.append('address',         data.address);
        formData.append('contact_number',  data.contact_number);
        formData.append('email',           data.email);

        // Employment
        formData.append('is_employed',     data.is_employed);
        if (data.is_employed === 'yes') {
            formData.append('company',                data.company);
            formData.append('company_name',           data.company);
            formData.append('employment_type',        data.employment_type);
            formData.append('position',               data.position);
            formData.append('location',               data.location);
            formData.append('employment_start_year',  data.employment_start_year);
            if (endYear) formData.append('employment_end_year', endYear);
            if (data.monthly_salary) formData.append('monthly_salary', data.monthly_salary);
            formData.append('is_present', endYear ? 0 : 1);
        } else {
            formData.append('reason_unemployed',   data.reason_unemployed);
            formData.append('unemployment_reason', data.reason_unemployed);
        }

        // Profile picture
        if (data.profile_picture instanceof File) {
            formData.append('profile_picture', data.profile_picture);
        }

        router.post(route('alumna.profile.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        });
    };

    const handleStatusChange = (newStatus) => {
        setData({
            ...data,
            is_employed: newStatus,
            company: '',
            employment_start_year: '',
            employment_end_year: newStatus === 'yes' ? 'current' : '',
            position: '',
            location: '',
            employment_type: '',
            monthly_salary: '',
            reason_unemployed: ''
        });
    };

    // Renders a single field config as either an Input or a Select, sharing
    // the same label/wrapper markup so the grid layout stays consistent.
    const renderField = (field) => {
        const { name, label, type, required, colSpan, options, placeholder } = field;

        const hasError = Boolean(errors[name]);
        const fieldClass = hasError ? `${inputClass} border-red-400 focus:ring-red-400 focus:border-red-400` : inputClass;

        return (
            <div key={name} className={colSpan}>
                <Label className={labelClass}>{label}</Label>
                {type === 'select' ? (
                    <Select
                        required={required}
                        value={data[name]}
                        onValueChange={handleSelectChange(name)}
                    >
                        <SelectTrigger className={fieldClass}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        type={type}
                        required={required}
                        value={data[name]}
                        onChange={handleInputChange(name)}
                        className={fieldClass}
                    />
                )}
                {hasError && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
            </div>
        );
    };

    return (
        <div className="w-full max-w-[800px] mx-auto py-8 px-4 flex flex-col gap-5 pb-12">
            <div className="flex justify-between items-center">
                <Link href={route('alumna.profile')} className="flex pl-2 items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition">
                    <ArrowLeft size={14} /> Back to Profile
                </Link>
                <Button
                    form="profile-form"
                    type="submit"
                    disabled={submitting}
                    className="flex items-center bg-[#008542] hover:bg-green-800 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase tracking-wide transition-all h-auto"
                >
                    <Save size={14} className="mr-2" /> {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <form id="profile-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {errors.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
                        {errors.error}
                    </div>
                )}

                {/* PERSONAL INFO */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><User size={18} /> Personal Information</div>

                    <div className="flex justify-center mb-4">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="h-25 w-25 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 text-white flex items-center justify-center text-2xl font-bold">
                                            {profile?.initials || "U"}
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all"
                                >
                                    <ImageIcon size={16} className="text-gray-600" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-3 text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors hover:cursor-pointer hover:underline"
                            >
                                Change Profile Picture
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PERSONAL_FIELDS.map(renderField)}
                    </div>
                </section>

                {/* EMPLOYMENT STATUS */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><Briefcase size={18} /> Employment Status</div>

                    <div className="flex flex-col gap-2">
                        <Label className={labelClass}>Currently Employed</Label>
                        <div className="flex gap-4">
                            {['yes', 'no'].map((value) => (
                                <label key={value} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
                                    <input
                                        type="radio"
                                        value={value}
                                        checked={data.is_employed === value}
                                        onChange={() => handleStatusChange(value)}
                                        className="w-4 h-4"
                                    /> {value}
                                </label>
                            ))}
                        </div>
                        {errors.is_employed && <p className="text-red-500 text-xs mt-0.5">{errors.is_employed}</p>}
                    </div>

                    {data.is_employed === 'yes' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {EMPLOYMENT_FIELDS.map(renderField)}
                        </div>
                    )}

                    {data.is_employed === 'no' && (
                        <div>
                            <Label className={labelClass}>Reason for Unemployment</Label>
                            <Select
                                required
                                value={data.reason_unemployed}
                                onValueChange={handleSelectChange('reason_unemployed')}
                            >
                                <SelectTrigger className={errors.reason_unemployed ? `${inputClass} border-red-400 focus:ring-red-400 focus:border-red-400` : inputClass}>
                                    <SelectValue placeholder="Please select your reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNEMPLOYMENT_REASON_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.reason_unemployed && <p className="text-red-500 text-xs mt-1.5">{errors.reason_unemployed}</p>}
                        </div>
                    )}
                </section>
            </form>
        </div>
    );
}

StudentProfileEdit.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;