import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import NavbarAlumni from "../../components/navbar-alumni";
 
const IconUser      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconUser2     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconBuilding  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 9h1m5 0h1M9 13h1m5 0h1M9 17h1m5 0h1"/></svg>;
const IconHistory   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M3 12a9 9 0 109-9 9 9 0 00-9 9z"/><path d="M12 7v5l3 3"/></svg>;
const IconEdit      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
 
const statusColor = (status) => {
    if (status === 'yes') return 'bg-green-600';
    if (status === 'no')  return 'bg-red-600';
    return 'bg-gray-400';
};
 
export default function StudentProfile() {
    const { profile, flash } = usePage().props;
    const emp = profile.employment;
 
    return (
        <div className="min-h-screen bg-[#e8f4fd]">
            <NavbarAlumni />
 
            <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
 
                {/* Success message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}
 
                {/* Edit Profile Button */}
                <div className="flex justify-end">
                    <Link
                        href={route('alumna.profile.edit')}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md transition"
                    >
                        <IconEdit />
                        EDIT PROFILE
                    </Link>
                </div>
 
                {/* ══ Personal Information ══ */}
                <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-4 sm:mb-5 text-gray-700">
                        <IconUser />
                        <h2 className="text-sm sm:text-base font-bold flex-1">Personal Information</h2>
                    </div>
 
                    <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-5">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-500 text-white flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                            {profile.initials}
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">{profile.name}</h3>
                            {profile.middle_name && (
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {profile.first_name} {profile.middle_name}. {profile.last_name}
                                </p>
                            )}
                        </div>
                    </div>
 
                    <hr className="border-gray-200 mb-4 sm:mb-5" />
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-5">
                        <div className="flex items-start gap-3 text-gray-500">
                            <IconMail />
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-semibold text-gray-800 break-all">{profile.email || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-gray-500">
                            <IconPhone />
                            <div>
                                <p className="text-xs text-gray-400">Contact Number</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.contact_number || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-gray-500">
                            <IconPin />
                            <div>
                                <p className="text-xs text-gray-400">Address</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.address || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-gray-500">
                            <IconUser2 />
                            <div>
                                <p className="text-xs text-gray-400">Username</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.username || '—'}</p>
                            </div>
                        </div>
                    </div>
                </section>
 
                {/* ══ Employment Status ══ */}
                <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-4 text-gray-700">
                        <IconBriefcase />
                        <h2 className="text-sm sm:text-base font-bold flex-1">Employment Status</h2>
                        {emp && (
                            <span className={`${statusColor(emp.is_employed)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                                {emp.is_employed === 'yes' ? 'Employed' : 'Unemployed'}
                            </span>
                        )}
                    </div>
 
                    {emp ? (
                        emp.is_employed === 'yes' ? (
                            <div className="flex flex-col gap-3 pl-1">
                                {emp.company && (
                                    <div className="flex items-center gap-3 font-bold text-gray-800">
                                        <IconBuilding />
                                        {emp.company}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {emp.employment_type && (
                                        <div>
                                            <p className="text-xs text-gray-400">Employment Type</p>
                                            <p className="text-sm font-semibold text-gray-800">{emp.employment_type}</p>
                                        </div>
                                    )}
                                    {emp.position && (
                                        <div>
                                            <p className="text-xs text-gray-400">Position</p>
                                            <p className="text-sm font-semibold text-gray-800">{emp.position}</p>
                                        </div>
                                    )}
                                    {emp.location && (
                                        <div>
                                            <p className="text-xs text-gray-400">Location</p>
                                            <p className="text-sm font-semibold text-gray-800">{emp.location}</p>
                                        </div>
                                    )}
                                    {emp.monthly_salary && (
                                        <div>
                                            <p className="text-xs text-gray-400">Monthly Salary</p>
                                            <p className="text-sm font-semibold text-gray-800">₱{Number(emp.monthly_salary).toLocaleString('en-PH')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="pl-1">
                                {emp.reason_unemployed && (
                                    <div>
                                        <p className="text-xs text-gray-400">Reason</p>
                                        <p className="text-sm font-semibold text-gray-800">{emp.reason_unemployed}</p>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <p className="text-xs sm:text-sm text-gray-400 text-center py-4">
                            No employment data on record.
                        </p>
                    )}
                </section>
 
                {/* ══ Employment History ══ */}
                <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-4 text-gray-700">
                        <IconHistory />
                        <h2 className="text-sm sm:text-base font-bold">Employment History</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 text-center py-4">
                        No employment history on record.
                    </p>
                </section>
 
            </div>
        </div>
    );
}
 