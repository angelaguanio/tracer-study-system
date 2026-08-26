import { Link, Head } from '@inertiajs/react';
import AlumnaLayout from "@/layouts/alumna-layout";

const IconArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;

function DetailItem({ label, value, isStatus = false }) {
    let displayVal = value;
    if (displayVal && typeof displayVal === 'object') {
        displayVal = displayVal.full_address || displayVal.name || '—';
    }
    const finalValue = (!displayVal || displayVal === "null" || displayVal === "null (null)" || displayVal === "") ? "—" : displayVal;
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-[14px] font-bold ${isStatus && finalValue === 'Employed' ? 'text-green-600' : (isStatus && finalValue === 'Unemployed' ? 'text-gray-500' : 'text-gray-800')}`}>
                {finalValue}
            </span>
        </div>
    );
}

export default function HistoryDetail({ history, profile }) {
    if (!history || !profile) return null;
    
    const dateSaved = new Date(history.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const employmentRange = `${history.employment_start_year ?? "—"} - ${history.is_present ? "Present" : (history.employment_end_year || "—")}`;

    const userAddress = (typeof profile.address === 'object' && profile.address !== null)
        ? profile.address.full_address
        : (profile.address_details?.full_address || profile.address);

    const jobLocation = (typeof history.location === 'object' && history.location !== null)
        ? history.location.full_address
        : history.location;

    return (
        <div className="w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-5">
            <Head title="Employment History Detail" />

            <div className="flex items-center">
                <Link href={route('alumna.profile')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                    <IconArrow /> Back to Profile
                </Link>
            </div>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 sm:px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="text-[#008542] shrink-0"><IconHistory /></div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 leading-tight">Archived Profile Record</h2>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Saved on {dateSaved}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 space-y-10">
                    {/* Personal Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                            <IconUser /> Personal Details
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <DetailItem label="Full Name" value={`${profile.first_name} ${profile.last_name}`} />
                            <DetailItem label="Email Address" value={profile.email} />
                            <DetailItem label="Contact Number" value={profile.contact_number} />
                            <DetailItem label="Address" value={userAddress} />
                            <DetailItem label="Course" value={profile.courses ?? profile.course} />
                            <DetailItem label="Year Graduated" value={(profile.start_year && profile.end_year) ? `${profile.start_year} - ${profile.end_year}` : (profile.year_graduated ?? '—')}/>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Employment Status */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                            <IconBriefcase /> Employment Status
                        </div>
                        <div className="space-y-6">
                            <DetailItem label="Status" value={history.currently_employed === 'Yes' ? 'Employed' : 'Unemployed'} isStatus={true} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-gray-100">
                                {history.currently_employed === 'Yes' ? (
                                    <>
                                        <DetailItem label="Company Name" value={history.company_name} />
                                        <DetailItem label="Position" value={history.position} />
                                        <DetailItem label="Employment Type" value={history.employment_type} />
                                        <DetailItem label="Location" value={jobLocation} />
                                        <DetailItem label="Employment Range" value={employmentRange} />
                                        <DetailItem label="Monthly Salary" value={history.monthly_salary && parseFloat(history.monthly_salary) > 0 ? `₱${parseFloat(history.monthly_salary).toLocaleString()}` : '—'} />
                                    </>
                                ) : (
                                    <DetailItem label="Reason for Unemployment" value={history.unemployment_reason ?? 'Job Hunting'} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

HistoryDetail.layout = (page) => <AlumnaLayout children={page} />;