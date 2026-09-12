import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin-layout";

// ICONS 
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="mr-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

function InfoItem({ icon, label, value }) {
    let displayVal = value;
    if (displayVal && typeof displayVal === 'object') {
        displayVal = displayVal.full_address || displayVal.name || '—';
    }
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="text-gray-400 mt-1">{icon}</div>}
            <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-[13px] font-bold text-[#343a40]">{displayVal || '—'}</span>
            </div>
        </div>
    );
}

export default function AdminProfile() {
    const { profile, flash } = usePage().props;

    const validSuffix = (profile?.suffix && profile.suffix !== 'None' && profile.suffix !== 'N/A') ? ' ' + profile.suffix : '';
    const fullName = `${profile?.first_name} ${profile?.middle_name && profile.middle_name !== '*' ? profile.middle_name + ' ' : ''}${profile?.last_name}${validSuffix}`;

    return (
        <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5">
            {flash?.success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{flash.success}</div>}
            {flash?.error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{flash.error}</div>}

            {/* Personal Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase"><IconUser /> Admin Information</div>
                    <Link href={route('admin.profile.edit')} className="flex items-center bg-[#008542] hover:bg-green-800 text-white text-[11px] font-bold px-4 py-2 rounded shadow-sm uppercase transition-colors shrink-0">
                        <IconEdit /> Edit Profile
                    </Link>
                </div>
                <div className="flex items-center gap-5 mb-8">
                    <div className="h-20 w-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white shrink-0 flex items-center justify-center">
                        {profile?.profile_picture ? (
                            <img
                            src={profile.profile_picture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 text-white flex items-center justify-center text-2xl font-bold">
                               {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '') || 'A'}
                            </div>
                        )}
                    </div>
                    <div><h3 className="lg:text-2xl text-lg font-bold text-[#343a40]">{fullName}</h3></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pt-2 border-t border-gray-50">
                    <InfoItem icon={<IconMail />} label="Email" value={profile?.email} />
                    <InfoItem icon={<IconPhone />} label="Contact Number" value={profile?.contact_number} />
                    <InfoItem icon={<IconPin />} label="Address" value={profile?.address_details?.full_address || (typeof profile?.address === 'object' ? profile?.address?.full_address : profile?.address)} />
                </div>
            </section>
        </div>
    );
}

AdminProfile.layout = (page) => <AdminLayout>{page}</AdminLayout>;
