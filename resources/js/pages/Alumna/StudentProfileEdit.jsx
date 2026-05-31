import React, { useRef } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";

// ICONS
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;

export default function StudentProfileEdit() {
    const { profile } = usePage().props;
    const emp = profile?.employment;
    const fileInputRef = useRef(null);

    // GITHUB DESIGN CLASSES
    const inputClass = "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008542] focus:border-[#008542] transition shadow-sm bg-white appearance-none";
    const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2";

    // CORE FORM VALUES FROM GIT REVISIONS
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        last_name: profile?.last_name || '',
        first_name: profile?.first_name || '',
        middle_name: profile?.middle_name || '',
        address: profile?.address || '',
        contact_number: profile?.contact_number || '',
        email: profile?.email || '',
        
        courses: profile?.courses || profile?.course || '',
        end_year: profile?.end_year || profile?.year_graduated || '',
        semester: profile?.semester || profile?.semester_graduated || '',

        is_employed: profile?.employment?.currently_employed?.toLowerCase() || '',
        employment_type: profile?.employment?.employment_type || '',
        company: profile?.employment?.company_name || '',
        position: profile?.employment?.position || '',
        location: profile?.employment?.location || '',
        employment_start_year: profile?.employment?.employment_start_year || '',
        monthly_salary: profile?.employment?.monthly_salary || '',
        reason_unemployed: profile?.employment?.unemployment_reason || '',
        profile_picture: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('alumna.profile.update'), {
            forceFormData: true
        });
    };

    return (
        <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5">
            
            <div className="flex justify-start w-full">
                <Link
                    href={route('alumna.profile')}
                    className="flex items-center bg-gray-600 hover:bg-gray-700 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase tracking-wide transition-colors cursor-pointer"
                >
                    <IconArrowLeft /> Back to Profile
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Personal Information */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8 text-left">
                    <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                        <IconUser /> Personal Information
                    </div>

                    <div className="flex items-center gap-5 mb-8">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                            {data.profile_picture ? (
                                <img src={URL.createObjectURL(data.profile_picture)} alt="Preview" className="w-full h-full object-cover" />
                            ) : profile?.profile_picture ? (
                                <img src={`/storage/${profile.profile_picture}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 text-white flex items-center justify-center text-xl font-bold">
                                    {profile?.initials}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded transition-colors"
                        >
                            Choose Photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setData('profile_picture', e.target.files[0])}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className={labelClass}>First Name</label>
                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} />
                            {errors.first_name && <span className="text-red-500 text-xs mt-1">{errors.first_name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Middle Name</label>
                            <input type="text" value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Last Name</label>
                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} />
                            {errors.last_name && <span className="text-red-500 text-xs mt-1">{errors.last_name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Contact Number</label>
                            <input type="text" value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Address</label>
                            <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Course</label>
                            <input type="text" value={data.courses} onChange={e => setData('courses', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Year Graduated</label>
                            <input type="text" value={data.end_year} onChange={e => setData('end_year', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>Semester Graduated</label>
                            <input type="text" value={data.semester} onChange={e => setData('semester', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* Employment Status */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8 text-left">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                            <IconBriefcase /> Current Employment Status
                        </div>
                        <select
                            value={data.is_employed}
                            onChange={(e) => setData('is_employed', e.target.value)}
                            className="border border-gray-200 text-xs font-bold rounded-lg px-3 py-1 bg-gray-50 text-gray-700 outline-none focus:border-[#008542] transition-colors"
                        >
                            <option value="yes">Employed</option>
                            <option value="no">Unemployed</option>
                        </select>
                    </div>

                    {data.is_employed === 'yes' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex flex-col">
                                <label className={labelClass}>Company Name</label>
                                <input type="text" required value={data.company} onChange={e => setData('company', e.target.value)} className={inputClass} placeholder="Company Name" />
                            </div>
                            <div className="flex flex-col">
                                <label className={labelClass}>Position</label>
                                <input type="text" required value={data.position} onChange={e => setData('position', e.target.value)} className={inputClass} placeholder="Position" />
                            </div>
                            <div className="flex flex-col">
                                <label className={labelClass}>Location</label>
                                <input type="text" required value={data.location} onChange={e => setData('location', e.target.value)} className={inputClass} placeholder="Location" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>Employment Type</label>
                                <div className="relative w-full">
                                    <select 
                                        required 
                                        value={data.employment_type} 
                                        onChange={e => setData('employment_type', e.target.value)} 
                                        className={inputClass}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Permanent/Regular">Permanent/Regular</option>
                                        <option value="Probationary">Probationary</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <svg className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className={labelClass}>Start Year</label>
                                <input 
                                    type="number" 
                                    required 
                                    min="1900" 
                                    max="2099" 
                                    value={data.employment_start_year} 
                                    onChange={e => setData('employment_start_year', e.target.value)} 
                                    className={inputClass} 
                                    placeholder="Year when you started working" 
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className={labelClass}>Monthly Salary (Optional)</label>
                                <input type="number" value={data.monthly_salary} onChange={e => setData('monthly_salary', e.target.value)} className={inputClass} placeholder="Monthly Salary" />
                            </div>
                        </div>
                    )}

                    {data.is_employed === 'no' && (
                        <div className="flex flex-col gap-2 mt-4">
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
                                    <svg className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <div className="flex justify-end w-full">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#008542] hover:bg-green-800 disabled:bg-gray-400 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-colors uppercase tracking-wider cursor-pointer"
                    >
                        {processing ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

StudentProfileEdit.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;