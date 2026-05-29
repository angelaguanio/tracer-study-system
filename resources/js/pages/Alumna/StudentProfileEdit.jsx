import { useState, useRef } from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";

const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconSave = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IconImage = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

const inputClass = "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008542] focus:border-[#008542] transition shadow-sm bg-white appearance-none";
const readOnlyInputClass = "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-gray-500 bg-gray-50 cursor-not-allowed transition shadow-sm appearance-none";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2";

export default function StudentProfileEdit() {
    const { profile } = usePage().props;
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(
        profile?.profile_picture ? `/storage/${profile.profile_picture}` : null
    );

    // Check if the alumna already has an active job recorded from the database
    const hasExistingActiveJob = profile?.employment?.currently_employed === 'Yes';

    const { data, setData, post, processing } = useForm({
        last_name:             profile?.last_name || '',
        first_name:            profile?.first_name || '',
        middle_name:           profile?.middle_name || '',
        address:               profile?.address || '',
        contact_number:        profile?.contact_number || '',
        email:                 profile?.email || '',
        
        courses:               profile?.courses || '',
        end_year:              profile?.end_year || '',
        semester:              profile?.semester || '',

        is_employed:           profile?.employment?.currently_employed?.toLowerCase() || '',
        employment_type:       profile?.employment?.employment_type || '',
        company:               profile?.employment?.company_name || '',
        position:              profile?.employment?.position || '',
        location:              profile?.employment?.location || '',
        
        employment_start_year: profile?.employment?.employment_start_year || '',
        employment_end_year:   profile?.employment?.employment_end_year || '',

        monthly_salary:        profile?.employment?.monthly_salary || '',
        reason_unemployed:     profile?.employment?.unemployment_reason || '',

        // derived/archived display range (YYYY-YYYY)
        employment_range:      '',

        profile_picture:       null,
    });

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
        post(route('alumna.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (newStatus) => {
        setData({
            ...data,
            is_employed: newStatus,
            company: '',
            position: '',
            location: '',
            employment_type: '',
            employment_start_year: '',
            employment_end_year: '',
            monthly_salary: '',
            reason_unemployed: ''
        });
    };

    return (
        <div className="w-full max-w-[800px] mx-auto py-8 px-4 flex flex-col gap-5 pb-12">

            {/* TOP BAR */}
            <div className="flex justify-between items-center">
                <Link
                    href={route('alumna.profile')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition"
                >
                    <IconArrow /> Back to Profile
                </Link>
                <button
                    form="profile-form"
                    type="submit"
                    disabled={processing}
                    className="flex items-center bg-[#008542] hover:bg-green-800 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase tracking-wide transition-all cursor-pointer"
                >
                    <IconSave /> {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form id="profile-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>

                {/* PERSONAL INFORMATION */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                        <IconUser /> Personal Information
                    </div>

                    {/* AVATAR */}
                    <div className="flex items-center gap-5 mb-4">
                        <div className="relative group">
                            <div className="h-16 w-16 rounded-full overflow-hidden shadow-inner border-2 border-gray-200 group-hover:border-[#008542] transition-all">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-[#6c757d] text-white flex items-center justify-center text-xl font-bold">
                                        {profile?.initials || 'U'}
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg border hover:shadow-xl transition-all cursor-pointer"
                            >
                                <IconImage />
                            </button>
                        </div>
                        <p className={labelClass}>Profile Photo</p>
                    </div>

                    <div><label className={labelClass}>Last Name</label><input type="text" required value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>First Name</label><input type="text" required value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Middle Name</label><input type="text" value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Address</label><input type="text" required value={data.address} onChange={e => setData('address', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Contact Number</label><input type="text" required value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Email Address</label><input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} /></div>
                </section>

                {/* EMPLOYMENT STATUS */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8 flex flex-col gap-8">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                        <IconBriefcase /> Employment Status
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className={labelClass}>Currently Employed</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="radio" 
                                        required 
                                        name="is_employed" 
                                        value="yes" 
                                        disabled={hasExistingActiveJob}
                                        checked={data.is_employed === 'yes'} 
                                        onChange={() => handleStatusChange('yes')} 
                                        className="w-4 h-4 accent-[#008542]" 
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="radio" 
                                        required 
                                        name="is_employed" 
                                        value="no" 
                                        disabled={hasExistingActiveJob}
                                        checked={data.is_employed === 'no'} 
                                        onChange={() => handleStatusChange('no')} 
                                        className="w-4 h-4 accent-[#008542]" 
                                    />
                                    No
                                </label>
                            </div>
                            {hasExistingActiveJob && (
                                <p className="text-[11px] text-amber-600 font-medium mt-1">
                                    * To record a new employment status, enter the End Year of your current company first to archive it.
                                </p>
                            )}
                        </div>

                        {data.is_employed === 'yes' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Employment Type</label>
                                    <div className="relative w-full">
                                        <select 
                                            required 
                                            disabled={hasExistingActiveJob}
                                            value={data.employment_type} 
                                            onChange={e => setData('employment_type', e.target.value)} 
                                            className={hasExistingActiveJob ? readOnlyInputClass : inputClass}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Permanent/Regular">Permanent/Regular</option>
                                            <option value="Probationary">Probationary</option>
                                        </select>
                                        {!hasExistingActiveJob && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="text-gray-500"><polyline points="6 9 12 15 18 9"/></svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Company Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        readOnly={hasExistingActiveJob}
                                        value={data.company} 
                                        onChange={e => setData('company', e.target.value)} 
                                        className={hasExistingActiveJob ? readOnlyInputClass : inputClass} 
                                        placeholder="Company Name" 
                                    />
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Position</label>
                                    <input 
                                        type="text" 
                                        required 
                                        readOnly={hasExistingActiveJob}
                                        value={data.position} 
                                        onChange={e => setData('position', e.target.value)} 
                                        className={hasExistingActiveJob ? readOnlyInputClass : inputClass} 
                                        placeholder="Position" 
                                    />
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Location</label>
                                    <input 
                                        type="text" 
                                        required 
                                        readOnly={hasExistingActiveJob}
                                        value={data.location} 
                                        onChange={e => setData('location', e.target.value)} 
                                        className={hasExistingActiveJob ? readOnlyInputClass : inputClass} 
                                        placeholder="Location" 
                                    />
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Start Year</label>
                                    <input 
                                        type="number" 
                                        required 
                                        readOnly={hasExistingActiveJob}
                                        min="1900" 
                                        max="2099" 
                                        value={data.employment_start_year} 
                                        onChange={e => {
                                            const v = e.target.value;
                                            setData({
                                                ...data,
                                                employment_start_year: v,
                                                employment_range: (v && data.employment_end_year) ? `${v}-${data.employment_end_year}` : ''
                                            });
                                        }} 
                                        className={hasExistingActiveJob ? readOnlyInputClass : inputClass} 
                                        placeholder="Year when you started working" 
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>End Year</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min={data.employment_start_year || "1900"} 
                                        max="2099" 
                                        value={data.employment_end_year}
                                        onChange={e => {
                                            const v = e.target.value;
                                            setData({
                                                ...data,
                                                employment_end_year: v,
                                                employment_range: (data.employment_start_year && v) ? `${data.employment_start_year}-${v}` : ''
                                            });
                                        }}
                                        className={inputClass} 
                                        placeholder="Enter year to save current job to history log" 
                                    />
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Employment Range</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={data.employment_range || (data.employment_start_year && data.employment_end_year ? `${data.employment_start_year}-${data.employment_end_year}` : '')}
                                        className={readOnlyInputClass}
                                        placeholder="YYYY-YYYY"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Monthly Salary (Optional)</label>
                                    <input 
                                        type="number" 
                                        readOnly={hasExistingActiveJob}
                                        value={data.monthly_salary} 
                                        onChange={e => setData('monthly_salary', e.target.value)} 
                                        className={hasExistingActiveJob ? readOnlyInputClass : inputClass} 
                                        placeholder="Monthly Salary" 
                                    />
                                </div>
                            </>
                        )}

                        {data.is_employed === 'no' && (
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>Reason for Unemployment</label>
                                <div className="relative w-full">
                                    <select 
                                        required 
                                        value={data.reason_unemployed} 
                                        onChange={e => setData('reason_unemployed', e.target.value)} 
                                        className={inputClass}
                                    >
                                        <option value="" disabled>Please select your reason</option>
                                        <option value="Studying">Studying</option>
                                        <option value="Job Hunting">Job Hunting</option>
                                        <option value="Family Reasons">Family Reasons</option>
                                        <option value="Health Reasons">Health Reasons</option>
                                        <option value="Personal Reasons">Personal Reasons</option>
                                        <option value="Career Break">Career Break</option>
                                        <option value="Recently Resigned">Recently Resigned</option>
                                        <option value="Laid Off">Laid Off</option>
                                        <option value="Relocating">Relocating</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="text-gray-500"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

            </form>
        </div>
    );
}

StudentProfileEdit.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;