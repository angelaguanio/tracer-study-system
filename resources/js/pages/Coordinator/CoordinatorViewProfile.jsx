import React, { useState } from "react";
import CoordinatorLayout from "@/layouts/coord-layout"; 
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Icons
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12M9 9h6"/></svg>;
const IconGrad = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;

export default function CoordinatorViewProfile({ user }) {
  const emp = user.employment;
  const fullName = `${user.first_name} ${user.middle_name && user.middle_name !== '*' ? user.middle_name + ' ' : ''}${user.last_name}${user.suffix && user.suffix.toUpperCase() !== 'N/A' ? ' ' + user.suffix : ''}`;
  const displayedYear = (user.start_year && user.end_year) ? `${user.start_year}-${user.end_year}` : (user.year_graduated || '—');
  const validEmploymentHistory = (user.employment_history?.filter(h => h.currently_employed === 'Yes' && h.company_name) || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const [selectedHistory, setSelectedHistory] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewDetails = (history) => {
    setSelectedHistory(history);
    setDetailsModalOpen(true);
  };

 const imageSrc = user.profile_picture || null;

  return (
    <>
      <Head title={`Alumna Profile - ${fullName}`} />
      <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5 pb-12">
        <div className="flex justify-between items-center">
          <Button onClick={() => router.visit(route("coordinator.alumni.index"))} v variant="ghost"
  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-transparent">
            <ArrowLeft size={14} /> BACK TO LIST
          </Button>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><IconUser /> Personal Information</div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 mb-4">
            <div className="h-16 w-16 rounded-full overflow-hidden shadow-inner border-2 border-gray-200 bg-gray-100 shrink-0 flex items-center justify-center">
              {imageSrc ? <img src={imageSrc} alt="Profile" className="w-full h-full object-cover" /> : <div className="h-full w-full bg-[#6c757d] text-white flex items-center justify-center text-xl font-bold">{(user.first_name?.[0] || 'U') + (user.last_name?.[0] || '')}</div>}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">{fullName}</h3>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{user.courses || '—'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2 border-t border-gray-50">
            <InfoItem icon={<IconMail />} label="Email" value={user.email} />
            <InfoItem icon={<IconPhone />} label="Contact Number" value={user.contact_number} />
            <InfoItem icon={<IconPin />} label="Address" value={user.address} />
            <InfoItem icon={<IconGrad />} label="Course" value={user.courses} />
            <InfoItem label="Year Graduated" value={displayedYear} />
            <DetailItem label="Semester Graduated" value={user.semester ?? user.semester_graduated ?? '—'} />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><IconBriefcase /> Current Employment Status</div>
            <span className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${emp?.currently_employed === 'Yes' ? 'bg-[#008542] text-white' : 'bg-gray-400 text-white'}`}>
              {emp?.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'}
            </span>
          </div>
          {emp?.currently_employed === 'Yes' ? (
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex items-center gap-2 font-bold text-gray-800 text-[15px]">
                 <IconBuilding /> {emp.company_name} <span className="text-gray-400 text-xs font-normal">({emp.employment_type})</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem label="Position" value={emp.position} />
                <InfoItem label="Location" value={emp.location} />
                <div><span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Period</span><span className="text-[13px] font-bold text-[#343a40]">{validEmploymentHistory.length > 0 ? `${new Date(validEmploymentHistory[0].created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — Present` : '—'}</span></div>
                <div><span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly Salary</span><span className="text-[13px] font-bold text-[#343a40]">₱{emp.monthly_salary ? parseFloat(String(emp.monthly_salary).replace(/[^\d.]/g, '')).toLocaleString('en-PH', { minimumFractionDigits: 0 }) : '0'}</span></div>
              </div>
            </div>
          ) : (
            <div className="pt-2"><span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reason for Unemployment</span><span className="text-[13px] font-bold text-[#343a40] italic">{emp?.unemployment_reason || 'Career Break'}</span></div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><IconHistory /> Employment History</div>
          {validEmploymentHistory.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-left text-sm table-fixed">
                  <thead className="bg-[#009AFB]"><tr className="border-b border-[#009AFB] text-[10px] text-white uppercase tracking-wider"><th className="py-3 pl-4 w-[20%]">Range</th><th className="py-3 text-center w-[25%]">Company</th><th className="py-3 text-center w-[20%]">Position</th><th className="py-3 text-center w-[15%]">Status</th><th className="py-3 text-center pr-4 w-[20%]">Action</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{validEmploymentHistory.map((h, index) => (<tr key={h.id} className="hover:bg-gray-50/50 transition"><td className="py-4 text-center text-gray-600 text-[12px]">{`${new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — ${index === 0 && emp?.currently_employed === 'Yes' && h.is_present ? 'Present' : new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}</td><td className="py-4 text-center font-bold text-gray-800 text-[12px]">{h.company_name}</td><td className="py-4 text-center text-gray-600 text-[12px]">{h.position || '—'}</td><td className="py-4 text-center"><span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">EMPLOYED</span></td><td className="py-4 text-center"><button type="button" onClick={() => handleViewDetails(h)} className="text-[10px] font-bold text-blue-500 border border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">View Details</button></td></tr>))}</tbody>
                </table>
              </div>
              <div className="md:hidden flex flex-col gap-3">{validEmploymentHistory.map((h, index) => (<div key={h.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col gap-2"><div className="flex justify-between items-start"><div><p className="text-[11px] font-bold text-gray-400 uppercase">Company</p><p className="font-bold text-gray-800">{h.company_name}</p></div><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 uppercase">EMPLOYED</span></div><div className="grid grid-cols-2 gap-2 mt-2"><div><p className="text-[10px] font-bold text-gray-400 uppercase">Position</p><p className="text-sm text-gray-600">{h.position || '—'}</p></div><div><p className="text-[10px] font-bold text-gray-400 uppercase">Range</p><p className="text-sm text-gray-600">{`${new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — ${index === 0 && emp?.currently_employed === 'Yes' && h.is_present ? 'Present' : new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}</p></div></div><button type="button" onClick={() => handleViewDetails(h)} className="w-full mt-2 text-[11px] font-bold text-blue-500 border border-blue-400 hover:bg-blue-50 py-2 rounded transition-colors">View Details</button></div>))}</div>
            </>
          ) : (<div className="text-center py-6 text-gray-400 italic text-sm">No employment history records found.</div>)}
        </section>

        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="lg:max-w-3xl max-w-sm p-0 overflow-hidden bg-white">
            <div className="bg-white px-8 pt-8 pb-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0Fdf4] text-[#00a651]">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-1">Employment history</h2>
                  <p className="text-[10px] text-[#8C9EB5] font-bold uppercase tracking-widest">
                    Saved on {selectedHistory ? new Date(selectedHistory.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            </div>

            {selectedHistory && (
              <div className="px-8 py-8 max-h-[60vh] overflow-y-auto inquiry-scrollbar bg-white">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F4F6F8] text-[#8C9EB5]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                    </div>
                    <span className="text-[#8C9EB5] font-bold text-[11px] uppercase tracking-widest">
                      Employment Status
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between w-full p-5 bg-[#F2FCF5] border border-[#BFF0D4] rounded-xl mb-8">
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] font-bold text-[#8C9EB5] uppercase tracking-widest">Status</span>
                         <span className="text-[15px] font-bold text-[#008542]">Employed</span>
                       </div>
                       <div className="flex items-center justify-center w-7 h-7 bg-[#00A651] rounded-full text-white shadow-sm">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><path d="M5 13l4 4L19 7"/></svg>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 gap-x-8 pt-8 border-t border-gray-100">
                      <DetailItem label="Company Name" value={selectedHistory.company_name} />
                      <DetailItem label="Position" value={selectedHistory.position} />
                      <DetailItem label="Employment Type" value={selectedHistory.employment_type} />
                      <DetailItem label="Location" value={selectedHistory.location} icon={<svg viewBox="0 0 24 24" fill="none" stroke="#8C9EB5" strokeWidth="2" width="14" height="14" className="shrink-0"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>} />
                      <DetailItem label="Employment Range" value={`${new Date(selectedHistory.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — ${validEmploymentHistory.findIndex(h => h.id === selectedHistory.id) === 0 && emp?.currently_employed === 'Yes' && selectedHistory.is_present ? 'Present' : new Date(selectedHistory.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`} />
                      <DetailItem label="Monthly Salary" value={selectedHistory.monthly_salary ? `₱${parseFloat(String(selectedHistory.monthly_salary).replace(/[^\d.]/g, '')).toLocaleString()}` : '—'} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function InfoItem({ icon, label, value }) {
  let displayVal = value;
  if (displayVal && typeof displayVal === 'object') {
    displayVal = displayVal.full_address || displayVal.name || '—';
  }
  return (<div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span><span className="text-[13px] font-bold text-[#343a40]">{displayVal || '—'}</span></div>);
}

function DetailItem({ label, value, isStatus = false, icon = null }) {
  let displayVal = value;
  if (displayVal && typeof displayVal === 'object') {
    displayVal = displayVal.full_address || displayVal.name || '—';
  }
  const finalValue = (displayVal === null || displayVal === undefined || displayVal === "null" || displayVal === "") ? " — " : displayVal;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-[#8C9EB5] uppercase tracking-wider">{label}</span>
      <span className="text-[14.5px] font-medium text-[#2C3E50] flex items-center gap-1.5">
        {icon}
        {finalValue}
      </span>
    </div>
  );
}

CoordinatorViewProfile.layout = (page) => <CoordinatorLayout children={page} />;
