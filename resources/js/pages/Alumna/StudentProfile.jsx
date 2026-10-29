import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Briefcase, ExternalLink, Pencil } from 'lucide-react';

function InfoCard({ icon: Icon, label, value, className = "" }) {
    let displayVal = value;
    if (displayVal && typeof displayVal === 'object') {
        displayVal = displayVal.full_address || displayVal.name || '—';
    }
    return (
        <div className={`flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all ${className}`}>
            <div 
                className="mt-0.5 rounded-xl p-2.5 shrink-0 shadow-xs"
                style={{ 
                    background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                    color: 'var(--theme-primary)' 
                }}
            >
                <Icon size={18} strokeWidth={2} />
            </div>
            <div className="flex flex-col text-left justify-center pt-0.5 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
                <span className="text-[14px] font-bold text-slate-800 break-words">{displayVal || '—'}</span>
            </div>
        </div>
    );
}

export default function StudentProfile() {
    const { profile, flash } = usePage().props;

    const validSuffix = (profile?.suffix && profile.suffix !== 'None' && profile.suffix !== 'N/A') ? ' ' + profile.suffix : '';
    const fullName = `${profile?.first_name} ${profile?.middle_name && profile.middle_name !== '*' ? profile.middle_name + ' ' : ''}${profile?.last_name}${validSuffix}`;
    
    const displayedYear = (profile?.start_year && profile?.end_year)
        ? `${profile.start_year}–${profile.end_year}${profile?.semester_graduated ? ` (${profile.semester_graduated})` : ''}`
        : (profile?.school_year || '—');

    const displayedSemester = profile?.semester_graduated || profile?.semester || null;

    // Last updated formatting
    const updatedAt = profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

    return (
        <div className="w-full max-w-[900px] mx-auto px-4 py-8 flex flex-col gap-6">
            {flash?.success && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg">{flash.success}</div>}

            {/* Header Area */}
            <div className="flex justify-between items-center pl-2">
                <div className="flex items-center gap-3">
                    <div 
                        className="p-2 rounded-full"
                        style={{ 
                            background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                            color: 'var(--theme-primary)' 
                        }}
                    >
                        <User size={22} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">ACCOUNT</p>
                        <h1 className="text-lg font-bold text-[#1e293b] leading-tight">Personal information</h1>
                    </div>
                </div>
                <Link 
                    href={route('alumna.profile.edit')} 
                    className="flex items-center gap-2 text-[13px] font-bold px-5 py-2.5 rounded-full shadow-sm hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
                >
                    <Pencil size={16} />
                    Edit profile
                </Link>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden mt-2">
                {/* Top Section */}
                <div 
                    className="p-8 sm:p-10 relative overflow-hidden border-b border-slate-200/70"
                    style={{ background: 'linear-gradient(to bottom right, #ffffff, color-mix(in srgb, var(--theme-primary) 10%, white))' }}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-28 w-28 rounded-full overflow-hidden shadow-md border-[4px] border-white bg-[#1e293b] shrink-0 flex items-center justify-center">
                                {profile?.profile_picture ? (
                                    <img
                                        src={profile.profile_picture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-white text-4xl font-bold">
                                        {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '') || 'R'}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[13px] font-medium text-slate-500 mb-0.5">Welcome back</span>
                                <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900">{fullName}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--theme-primary)' }}>PROFILE DETAILS</p>
                            <h3 className="text-[19px] font-bold text-slate-900">Your information</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={Mail} label="EMAIL ADDRESS" value={profile?.email} />
                        <InfoCard icon={Phone} label="CONTACT NUMBER" value={profile?.contact_number} />
                        <InfoCard 
                            icon={MapPin} 
                            label="CURRENT ADDRESS" 
                            value={profile?.address_details?.full_address || (typeof profile?.address === 'object' ? profile?.address?.full_address : profile?.address)} 
                            className="md:col-span-2"
                        />
                        <InfoCard icon={GraduationCap} label="COURSE" value={profile?.courses || '—'} />
                        <InfoCard icon={Calendar} label="YEAR GRADUATED" value={displayedYear} />
                        {displayedSemester && displayedYear && !String(displayedYear).includes(String(displayedSemester)) && (
                            <InfoCard icon={GraduationCap} label="SEMESTER GRADUATED" value={displayedSemester} />
                        )}
                    </div>
                </div>
            </div>
            
            <div className="text-center text-[12px] font-medium text-gray-400 mt-2">
                Last updated · {updatedAt}
            </div>
        </div>
    );
}

StudentProfile.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
