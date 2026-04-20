import React from 'react';
import { Link, Head } from '@inertiajs/react';
import NavbarAlumni from "../../components/navbar-alumni";

const IconArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;

export default function HistoryDetail({ history, profile }) {
    const dateSaved = new Date(history.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#e8f4fd]">
            <Head title="Employment History Detail" />
            <NavbarAlumni />
            
            <div className="w-full max-w-[700px] mx-auto px-4 py-10 flex flex-col gap-6">
                <div className="flex items-center">
                    <Link 
                        href={route('alumna.profile')} 
                        className="flex items-center gap-2 text-gray-500 hover:text-[#008542] text-sm font-medium transition-colors"
                    >
                        <IconArrow /> Back to Profile
                    </Link>
                </div>

                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-[#008542]"><IconHistory /></div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 leading-tight">Archived Profile Record</h2>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Saved on {dateSaved}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Personal Information */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                <IconUser /> Personal Details
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <DetailItem label="Full Name" value={`${profile.first_name} ${profile.last_name}`} />
                                <DetailItem label="Email Address" value={profile.email} />
                                <DetailItem label="Contact Number" value={profile.contact_number} />
                                <DetailItem label="Address" value={profile.address} />
                                <DetailItem 
                                    label="Course & Year" 
                                    value={profile.courses && profile.year_graduated 
                                        ? `${profile.courses} (${profile.year_graduated})` 
                                        : null
                                    } 
                                />
                            </div>
                        </div>

                        <hr className="border-gray-50" />

                        {/* Employment Status */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                <IconBriefcase /> Employment Status
                            </div>
                            <div className="space-y-8">
                                <DetailItem 
                                    label="Status" 
                                    value={history.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'} 
                                    isStatus={true}
                                />

                                {history.currently_employed === 'Yes' ? (
                                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                        <DetailItem label="Company Name" value={history.company_name} />
                                        <DetailItem label="Position" value={history.position} />
                                        <DetailItem label="Employment Type" value={history.employment_type} />
                                        <DetailItem label="Location" value={history.location} />
                                        <DetailItem 
                                            label="Monthly Salary" 
                                            value={history.monthly_salary ? `₱${parseFloat(history.monthly_salary).toLocaleString()}` : '—'} 
                                        />
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-gray-50">
                                        <DetailItem label="Reason for Unemployment" value={history.unemployment_reason} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function DetailItem({ label, value, isStatus = false }) {
    const finalValue = (value === null || value === undefined || value === "null" || value === "null (null)") ? " — " : value;

    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-[14px] font-bold ${isStatus && finalValue === 'Employed' ? 'text-green-600' : 'text-gray-800'}`}>
                {finalValue}
            </span>
        </div>
    );
}