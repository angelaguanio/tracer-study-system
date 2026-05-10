import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";

const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12M9 9h6"/></svg>;
const IconGrad = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="mr-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;

export default function StudentProfile() {
    const { profile, flash } = usePage().props;
    const emp = profile.employment;

    const fullName = `${profile.first_name} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}`;

    const avatarElement = profile.profile_picture ? (
        <img
            src={`/storage/${profile.profile_picture}`}
            alt={`${profile.first_name}'s profile`}
            className="w-full h-full object-cover"
        />
    ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 text-white flex items-center justify-center text-xl font-bold">
            {profile.initials}
        </div>
    );

    return (
        <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5">
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="flex justify-end">
                <Link
                    href={route('alumna.profile.edit')}
                    className="flex items-center bg-[#008542] hover:bg-green-800 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase tracking-wide transition-colors"
                >
                    <IconEdit /> Edit Profile
                </Link>
            </div>

            {/* Personal Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
                <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                    <IconUser /> Personal Information
                </div>

                <div className="flex items-center gap-5 mb-8">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white">
                        {avatarElement}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-[#343a40] leading-tight">{fullName}</h3>
                    </div>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="grid grid-cols-2 gap-y-6">
                    <InfoItem icon={<IconMail />} label="Email" value={profile.email} />
                    <InfoItem icon={<IconPhone />} label="Contact Number" value={profile.contact_number} />
                    <InfoItem icon={<IconPin />} label="Address" value={profile.address} />
                    <InfoItem
                        icon={<IconGrad />}
                        label="Course & Year"
                        value={profile.courses && profile.year_graduated
                            ? `${profile.courses} (${profile.year_graduated})`
                            : null
                        }
                    />
                </div>
            </section>

            {/* Employment Status */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                        <IconBriefcase /> Current Employment Status
                    </div>
                    <span className={`px-4 py-1 rounded-full text-white text-[10px] font-bold uppercase ${emp?.currently_employed === 'Yes' ? 'bg-[#28a745]' : 'bg-[#aeb4b9]'}`}>
                        {emp?.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'}
                    </span>
                </div>

                {emp?.currently_employed === 'Yes' ? (
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-6">
                            <IconBuilding />
                            <span className="font-bold text-gray-800 text-base">{emp.company_name}</span>
                            <span className="text-gray-400 text-sm font-medium">({emp.employment_type})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-6">
                            <InfoItem label="Position" value={emp.position} />
                            <InfoItem label="Location" value={emp.location} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly Salary</p>
                                <p className="text-[13px] font-bold text-[#343a40]">
                                    ₱{emp?.monthly_salary ?
                                        parseFloat(emp.monthly_salary.toString().replace(/[^\d.]/g, ''))?.toLocaleString('en-PH', { minimumFractionDigits: 0 }) ?? '0'
                                        : '0'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 flex flex-col gap-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reason for Unemployment</p>
                        <p className="text-[13px] font-bold text-[#343a40] italic">{emp?.unemployment_reason || 'No details provided.'}</p>
                    </div>
                )}
            </section>

            {/* Employment History Logs */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
                <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                    <IconHistory /> Employment History Logs
                </div>

                {profile.employment_history?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3 font-bold pl-2">Date Logged</th>
                                    {/* Centered Headers */}
                                    <th className="pb-3 font-bold text-center">Company</th>
                                    <th className="pb-3 font-bold text-center">Position</th>
                                    <th className="pb-3 font-bold text-center">Status</th>
                                    <th className="pb-3 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {profile.employment_history.map((history) => {
                                    const isUnemployed = history.currently_employed === 'No' || !history.company_name;

                                    return (
                                        <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-2 pl-2 text-gray-600">
                                                {new Date(history.created_at).toLocaleDateString()}
                                            </td>
                                            {/* Centered Company Dash/Value */}
                                            <td className="py-2 font-bold text-gray-800 text-center">
                                                {isUnemployed ? '—' : history.company_name}
                                            </td>
                                            {/* Centered Position Dash/Value */}
                                            <td className="py-2 text-gray-600 text-center">
                                                {isUnemployed ? '—' : (history.position || '—')}
                                            </td>
                                            <td className="py-2 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${history.currently_employed === 'Yes' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {history.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'}
                                                </span>
                                            </td>
                                            <td className="py-2 text-center">
                                                <Link
                                                    href={route('alumna.history.show', history.id)}
                                                    className="inline-block text-[10px] font-bold text-blue-500 border border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 italic text-sm">
                        No employment history on record.
                    </div>
                )}
            </section>
        </div>
    );
}

StudentProfile.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="text-gray-400 mt-1">{icon}</div>}
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                {/* Applied a flex container to center the fallback dash if value is missing */}
                <span className={`text-[13px] font-bold text-[#343a40] ${!value ? 'flex justify-center' : ''}`}>
                    {value || '—'}
                </span>
            </div>
        </div>
    );
}