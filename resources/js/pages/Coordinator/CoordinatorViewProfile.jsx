import React, { useState } from "react";
import CoordinatorLayout from "@/layouts/coord-layout"; // Matches your first picture layout
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Icons (Same as your original file)
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12M9 9h6"/></svg>;
const IconGrad = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;

export default function CoordinatorViewProfile({ user }) {
  const emp = user.employment;
  const fullName = `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`;

  return (
    <>
      <Head title={`Alumna Profile - ${fullName}`} />
      <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5">
        
        {/* Back Button - Points to Coordinator route */}
        <div className="flex justify-start">
          <Button
            onClick={() => router.visit(route("coordinator.alumni.index"))}
            variant="outline"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide px-4 py-2"
          >
            <ArrowLeft size={14} /> BACK TO LIST
          </Button>
        </div>

        {/* Profile Card */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
            <IconUser /> ALUMNA INFORMATION
          </div>

          <div className="flex items-center gap-5 mb-8">
            <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200">
              <img 
                src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}&background=70CAFF&color=fff`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#343a40] leading-tight">{fullName}</h3>
              <p className="text-gray-500 text-sm font-medium">{user.courses} ({user.year_graduated})</p>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          <div className="grid grid-cols-2 gap-y-6">
            <InfoItem icon={<IconMail />} label="Email" value={user.email} />
            <InfoItem icon={<IconPhone />} label="Contact Number" value={user.contact_number} />
            <InfoItem icon={<IconPin />} label="Address" value={user.address} />
            <InfoItem icon={<IconGrad />} label="Course & Year" value={`${user.courses} (${user.year_graduated})`} />
          </div>
        </section>

        {/* Employment Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight">
                 <IconBriefcase /> CURRENT EMPLOYMENT
              </div>
              <span className="px-4 py-1 rounded-full bg-gray-400 text-white text-[10px] font-bold uppercase">
                 {emp?.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'}
              </span>
           </div>
           <div className="py-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reason for Unemployment</p>
              <p className="text-[13px] font-bold text-[#343a40] italic">{emp?.unemployment_reason || 'looking for a job.'}</p>
           </div>
        </section>
      </div>
    </>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-[13px] font-bold text-[#343a40]">{value || '—'}</span>
      </div>
    </div>
  );
}


CoordinatorViewProfile.layout = (page) => <CoordinatorLayout children={page} />;