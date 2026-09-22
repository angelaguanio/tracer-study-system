import { useState, useRef } from 'react';
import { usePage, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin-layout";
import { User, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PhAddressSelector from '@/components/address/PhAddressSelector';
import InternationalAddressSelector from '@/components/address/InternationalAddressSelector';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const inputClass = "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008542] focus:border-[#008542] transition shadow-sm bg-white";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2";

const PERSONAL_FIELDS = [
    { name: 'last_name', label: 'Last Name', type: 'text', required: true },
    { name: 'first_name', label: 'First Name', type: 'text', required: true },
    { name: 'middle_name', label: 'Middle Name', type: 'text', required: true, placeholder: "Enter * if you don't have a middle name" },
    { name: 'suffix', label: 'Suffix', type: 'select', required: true, placeholder: "e.g. Jr., Sr., III", options: [
        {value: 'N/A', label: 'N/A'},
        {value: 'Jr.', label: 'Jr.'},
        {value: 'Sr.', label: 'Sr.'},
        {value: 'II', label: 'II'},
        {value: 'III', label: 'III'},
        {value: 'IV', label: 'IV'},
        {value: 'V', label: 'V'},
    ] },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
];

export default function AdminProfileEdit() {
    const { profile } = usePage().props;
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(
        profile?.profile_picture || null
    );

    const addressObj = profile?.addressDetails || (typeof profile?.address === 'object' ? profile.address : null);
    const [residency, setResidency] = useState(addressObj?.country && addressObj.country !== 'Philippines' ? 'International' : 'Philippines');

    const { data, setData, post, processing, errors } = useForm({
        last_name: profile?.last_name || '',
        first_name: profile?.first_name || '',
        middle_name: profile?.middle_name || '',
        suffix: profile?.suffix || '',
        country: addressObj?.country || 'Philippines',
        street_address: addressObj?.street_address || '',
        subdivision: addressObj?.subdivision || '',
        region: addressObj?.region || '',
        province: addressObj?.province || '',
        city: addressObj?.city || '',
        barangay: addressObj?.barangay || '',
        zip_code: addressObj?.zip_code || '',
        address: addressObj?.full_address || (typeof profile?.address === 'string' ? profile.address : ''),
        contact_number: profile?.contact_number 
            ? (profile.contact_number.startsWith('09') && profile.contact_number.length === 11 
                ? '+63' + profile.contact_number.substring(1) 
                : profile.contact_number)
            : '',
        email: profile?.email || '',
        profile_picture: null,
    });

    const handleInputChange = (name) => (e) => setData(name, e.target.value);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
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
                        placeholder={placeholder}
                    />
                )}
                {hasError && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
            </div>
        );
    };

    return (
        <div className="w-full max-w-[800px] mx-auto py-8 px-4 flex flex-col gap-5 pb-12">


            <form id="profile-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>

                {errors.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
                        {errors.error}
                    </div>
                )}

                {/* PERSONAL INFO */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('admin.profile')} 
                                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 h-8 w-8 rounded shadow-sm transition-all"
                                title="Cancel and go back"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                                <User size={18} /> Edit Admin Profile
                            </div>
                        </div>
                        <Button
                            form="profile-form"
                            type="submit"
                            disabled={processing}
                            className="flex items-center bg-[#008542] hover:bg-green-800 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase tracking-wide transition-all h-auto shrink-0"
                        >
                            <Save size={14} className="mr-2" /> {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

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
                                            {profile?.initials || "A"}
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

                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex flex-col gap-2 mb-4 mt-2">
                            <Label className={labelClass}>Where do you currently reside?</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="residency" 
                                        checked={residency === 'Philippines'} 
                                        onChange={() => { 
                                            setResidency('Philippines'); 
                                            setData(p => ({...p, country: 'Philippines', street_address: '', region: '', province: '', city: '', barangay: ''}));
                                        }} 
                                        className="w-4 h-4 accent-[#008542]" 
                                    />
                                    Philippines
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="residency" 
                                        checked={residency === 'International'} 
                                        onChange={() => { 
                                            setResidency('International'); 
                                            setData(p => ({...p, country: '', street_address: '', region: '', province: '', city: '', barangay: ''}));
                                        }} 
                                        className="w-4 h-4 accent-[#008542]" 
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
                                }}
                                errors={errors}
                                variant="profile"
                            />
                        ) : (
                            <InternationalAddressSelector
                                data={data}
                                onChange={(updatedAddress) => {
                                    setData((prev) => ({ ...prev, ...updatedAddress }));
                                }}
                                errors={errors}
                                variant="profile"
                            />
                        )}
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-100">
                        <div className="w-full">
                            <Label className={labelClass}>Contact Number <span className="text-red-500">*</span></Label>
                            <div className={`flex items-center w-full border ${errors.contact_number ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-2.5 bg-white transition shadow-sm focus-within:border-[#008542] focus-within:ring-1 focus-within:ring-[#008542]`}>
                                <PhoneInput
                                    international
                                    defaultCountry="PH"
                                    value={data.contact_number || ''}
                                    onChange={(value) => setData('contact_number', value)}
                                    className="flex-1 PhoneInput--custom text-[14px]"
                                />
                            </div>
                            {errors.contact_number && <p className="text-red-500 text-xs mt-1.5">{errors.contact_number}</p>}
                            
                            <style dangerouslySetInnerHTML={{__html: `
                                .PhoneInput--custom .PhoneInputInput {
                                    border: none;
                                    outline: none;
                                    background: transparent;
                                    font-size: 14px;
                                    color: #111827;
                                    width: 100%;
                                }
                                .PhoneInput--custom .PhoneInputCountry {
                                    margin-right: 0.75rem;
                                }
                            `}} />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}

AdminProfileEdit.layout = (page) => <AdminLayout>{page}</AdminLayout>;
