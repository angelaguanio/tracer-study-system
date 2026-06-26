import React, { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ICONS
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
  const fullName = `${user.first_name ?? ''} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name ?? ''}`.trim();

  const validEmploymentHistory = Array.isArray(user.employment_history)
    ? user.employment_history.sort((a, b) => Number(b.employment_start_year || 0) - Number(a.employment_start_year || 0))
    : [];

  const handleViewDetails = (history) => {
    setSelectedHistory(history);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <Head title={`Alumna Profile - ${fullName}`} />
      <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5 pb-12">
        
        <div className="flex justify-start">
          <Button onClick={() => router.visit(route("admin.alumni.index"))} variant="outline" className="text-[11px] font-bold uppercase gap-2">
            <ArrowLeft size={14} /> BACK TO LIST
          </Button>
        </div>

        {/* 1. PERSONAL INFO */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-[13px] uppercase"><IconUser /> Personal Information</div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl">{user.first_name?.[0] || 'U'}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{fullName}</h3>
              <p className="text-gray-400 text-xs font-semibold uppercase">{user.courses ?? '—'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2 border-t border-gray-50">
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Contact Number" value={user.contact_number} />
            <InfoItem label="Address" value={user.address} />
            <InfoItem label="Year Graduated" value={(user.start_year && user.end_year) ? `${user.start_year} - ${user.end_year}` : '—'} />
          </div>
        </section>

        {/* 2. EMPLOYMENT HISTORY (RESPONSIVE) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-600 font-bold text-[13px] uppercase"><IconHistory /> Employment History</div>
          
          {validEmploymentHistory.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50"><tr className="text-[10px] text-gray-400 uppercase"><th className="p-3">Range</th><th className="p-3">Company</th><th className="p-3">Position</th><th className="p-3">Action</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {validEmploymentHistory.map((h) => (
                      <tr key={h.id}>
                        <td className="p-3 text-sm">{h.employment_start_year || '—'}</td>
                        <td className="p-3 font-bold">{h.company_name}</td>
                        <td className="p-3">{h.position || '—'}</td>
                        <td className="p-3"><button onClick={() => handleViewDetails(h)} className="text-blue-500 font-bold text-[10px] border border-blue-400 px-3 py-1 rounded">VIEW</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stack */}
              <div className="md:hidden flex flex-col gap-3">
                {validEmploymentHistory.map((h) => (
                  <div key={h.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col gap-2">
                    <p className="font-bold text-gray-800">{h.company_name}</p>
                    <div className="grid grid-cols-2 text-[11px]">
                      <p className="text-gray-400 uppercase">Position: <span className="text-gray-800">{h.position}</span></p>
                      <p className="text-gray-400 uppercase">Range: <span className="text-gray-800">{h.employment_start_year}</span></p>
                    </div>
                    <button onClick={() => handleViewDetails(h)} className="w-full text-[11px] font-bold text-blue-500 border border-blue-400 py-2 rounded">VIEW DETAILS</button>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-gray-400 italic">No history found.</p>}
        </section>

        {/* DIALOG MODAL (RESPONSIVE) */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="w-[95vw] max-w-2xl p-0 overflow-hidden bg-white">
            <div className="bg-gray-50 p-6 border-b border-gray-100"><h2 className="font-bold text-gray-800">Archived Profile Record</h2></div>
            {selectedHistory && (
              <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailItem label="Company Name" value={selectedHistory.company_name} />
                  <DetailItem label="Position" value={selectedHistory.position} />
                  <DetailItem label="Location" value={selectedHistory.location} />
                  <DetailItem label="Monthly Salary" value={selectedHistory.monthly_salary} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

// Components
function InfoItem({ label, value }) {
  return (<div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span><span className="text-[13px] font-bold text-[#343a40]">{value || '—'}</span></div>);
}

function DetailItem({ label, value }) {
  return (<div className="flex flex-col gap-1.5"><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span><span className="text-[14px] font-bold text-gray-800">{value || '—'}</span></div>);
}

AdminViewProfileOfRespondents.layout = (page) => <AdminLayout>{page}</AdminLayout>;