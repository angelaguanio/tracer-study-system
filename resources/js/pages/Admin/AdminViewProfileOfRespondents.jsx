import React, { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// ICONS (Clean layout lines matching StudentProfile)
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013.1 4.2 2 2 0 015.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2L9.1 9.9a16 16 0 006.9 6.9l1.3-1.3a2 2 0 012-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z"/></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12M9 9h6"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;

export default function AdminViewProfileOfRespondents(props) {
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const user = props.user ?? props.response ?? null;
  if (!user) return <div className="p-6 text-red-500 font-bold text-center">No user data found.</div>;

  const emp = user.employment;
  const fullName = (user.first_name || user.last_name) ? `${user.first_name ?? ''} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name ?? ''}`.trim() : (user.name ?? 'Unknown Alumna');
  const validEmploymentHistory = Array.isArray(user.employment_history) ? user.employment_history.sort((a, b) => Number(b?.employment_start_year || 0) - Number(a?.employment_start_year || 0)) : [];
  const imageSrc = user.profile_picture || null;

  const handleViewDetails = (history) => {
    setSelectedHistory(history);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <Head title={`Alumna Profile - ${fullName}`} />
      <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5 pb-12">
        
        <div className="flex justify-start">
          <Button onClick={() => router.visit(route("admin.alumni.index"))}  variant="ghost"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-transparent">
             <ArrowLeft size={14} /> BACK TO LIST
          </Button>
        </div>

        {/* 1. PERSONAL INFORMATION */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase"><IconUser /> Personal Information</div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="h-16 w-16 rounded-full overflow-hidden shadow-inner border-2 border-gray-200 bg-gray-100 shrink-0 flex items-center justify-center">
              {imageSrc ? <img src={imageSrc} alt="Profile" className="w-full h-full object-cover" /> : <div className="h-full w-full bg-[#6c757d] text-white flex items-center justify-center text-xl font-bold">{(user.first_name?.[0] || 'U') + (user.last_name?.[0] || '')}</div>}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{fullName}</h3>
              <p className="text-gray-400 text-xs font-semibold uppercase">{user.courses ?? user.course ?? '—'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2 border-t border-gray-50">
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Contact Number" value={user.contact_number} />
            <InfoItem label="Address" value={user.address} />
            <InfoItem label="Course" value={user.courses ?? user.course} />
            <InfoItem label="Year Graduated"
             value={(user.start_year && user.end_year)  ? `${user.start_year} - ${user.end_year}` : (user.year_graduated ? `${parseInt(user.year_graduated) - 1} - ${user.year_graduated}` : '—')}/>
            <InfoItem label="Semester Graduated" value={user.semester_graduated ?? user.semester ?? '—'}/>
          </div>
        </section>

        {/* 2. CURRENT EMPLOYMENT STATUS */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px] uppercase"><IconBriefcase /> Current Employment Status</div>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${emp?.currently_employed === 'Yes' ? 'bg-[#008542] text-white' : 'bg-gray-400 text-white'}`}>
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
                <InfoItem label="Period" value={emp.employment_start_year ? `${emp.employment_start_year} - Present` : '—'} />
                <InfoItem label="Monthly Salary" value={`₱${emp.monthly_salary ? parseFloat(String(emp.monthly_salary).replace(/[^\d.]/g, '')).toLocaleString() : '0'}`} />
              </div>
            </div>
          ) : (
            <InfoItem label="Reason for Unemployment" value={emp?.unemployment_reason || 'No details provided.'} />
          )}
        </section>

        {/* 3. EMPLOYMENT HISTORY LOGS CARD */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase tracking-tight"><IconHistory /> Employment History</div>
          {validEmploymentHistory.length > 0 ? (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-y-auto border border-gray-100 rounded-lg" style={{ maxHeight: '300px' }}>
                <table className="w-full text-left text-sm table-fixed">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                      <th className="py-3 pl-4 w-[20%]">Range</th>
                      <th className="py-3 text-center w-[25%]">Company</th>
                      <th className="py-3 text-center w-[20%]">Position</th>
                      <th className="py-3 text-center w-[15%]">Status</th>
                      <th className="py-3 text-center pr-4 w-[20%]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {validEmploymentHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-center text-gray-600 text-sm">
                          {history.employment_start_year ? `${history.employment_start_year} - ${history.is_present ? 'Present' : (history.employment_end_year || '—')}` : '—'}
                        </td>
                        <td className="py-4 text-center font-bold text-gray-800 text-sm">{history.company_name}</td>
                        <td className="py-4 text-center text-gray-600 text-sm">{history.position || '—'}</td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">EMPLOYED</span>
                        </td>
                        <td className="py-4 text-center">
                          <button type="button" onClick={() => handleViewDetails(history)} className="inline-block text-[10px] font-bold text-blue-500 border border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE STACKED CARDS VIEW */}
              <div className="md:hidden flex flex-col gap-4">
                {validEmploymentHistory.map((history) => (
                  <div key={history.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company</p>
                        <p className="font-bold text-gray-800">{history.company_name}</p>
                      </div>
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-green-100 text-green-700 uppercase">EMPLOYED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Position</p>
                        <p className="text-sm text-gray-600">{history.position || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Range</p>
                        <p className="text-sm text-gray-600">{history.employment_start_year ? `${history.employment_start_year} - ${history.is_present ? 'Present' : (history.employment_end_year || '—')}` : '—'}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleViewDetails(history)} className="w-full text-[11px] font-bold text-blue-500 border border-blue-400 hover:bg-blue-50 py-2 rounded transition-colors">View Details</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-400 italic text-sm">No employment history records found.</div>
          )}
        </section>

        {/* DETAILS POPUP MODAL */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[#008542]"><IconHistory /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">Archived Profile Record</h2>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Saved on {selectedHistory ? new Date(selectedHistory.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            </div>

            {selectedHistory && (
              <div className="px-8 py-4 space-y-10 max-h-[60vh] overflow-y-auto inquiry-scrollbar">
                <div>
                  <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                    <IconUser /> Personal Details
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <DetailItem label="Full Name" value={fullName} />
                    <DetailItem label="Email Address" value={user.email} />
                    <DetailItem label="Contact Number" value={user.contact_number} />
                    <DetailItem label="Address" value={user.address} />
                    <DetailItem 
                      label="Course " 
                      value={user.courses ?? user.course ?? '—'}
                    />
                    <DetailItem
                    label="Year Graduated"
                    value={(user.start_year && user.end_year) ? `${user.start_year} - ${user.end_year}` : (user.year_graduated ? `${parseInt(user.year_graduated) - 1} - ${user.year_graduated}` : '—')}
                    />
                     <DetailItem label="Semester Graduated" value={user.semester || user.semester_graduated || '—'} />
                  </div>
                </div>

                <hr className="border-gray-50" />

                <div>
                  <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                    <IconBriefcase /> Employment Status
                  </div>
                  <div className="space-y-8">
                    <DetailItem label="Status" value="Employed" isStatus={true} />
                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                      <DetailItem label="Company Name" value={selectedHistory.company_name} />
                      <DetailItem label="Position" value={selectedHistory.position} />
                      <DetailItem label="Employment Type" value={selectedHistory.employment_type} />
                      <DetailItem label="Location" value={selectedHistory.location} />
                      <DetailItem
                        label="Employment Range"
                        value={`${selectedHistory.employment_start_year || '—'} - ${selectedHistory.is_present ? 'Present' : (selectedHistory.employment_end_year || '—')}`}
                        />
                      <DetailItem
                        label="Monthly Salary"
                        value={selectedHistory.monthly_salary ? `₱${parseFloat(String(selectedHistory.monthly_salary).replace(/[^\d.]/g, '')).toLocaleString()}` : '—'}
                      />
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

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-[13px] font-bold text-[#343a40]">{value || '—'}</span>
    </div>
  );
}

function DetailItem({ label, value, isStatus = false }) {
  const finalValue = (value === null || value === undefined || value === "null") ? " — " : value;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-[14px] font-bold ${isStatus ? 'text-green-600' : 'text-gray-800'}`}>
        {finalValue}
      </span>
    </div>
  );
}

AdminViewProfileOfRespondents.layout = (page) => <AdminLayout>{page}</AdminLayout>;