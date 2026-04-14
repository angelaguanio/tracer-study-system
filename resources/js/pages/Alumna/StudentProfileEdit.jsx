import React from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import NavbarAlumni from "../../components/navbar-alumni";
import profileConfig from "../../lib/profile.json";
 
const { personalFields, employmentQuestions } = profileConfig;
 
const IconUser      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
const IconSave      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconArrow     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
 
const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";
const labelClass = "block text-xs text-gray-500 mb-1";
const errorClass = "text-xs text-red-500 mt-1";
 
const isVisible = (question, data) => {
    if (!question.showIf) return true;
    return data[question.showIf.key] === question.showIf.value;
};
 
const Question = ({ question, data, setData, errors }) => {
    if (!isVisible(question, data)) return null;
 
    if (question.type === 'radio') {
        return (
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">{question.label}</p>
                <div className="flex flex-wrap gap-4">
                    {question.options.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name={question.key}
                                value={opt.value}
                                checked={data[question.key] === opt.value}
                                onChange={() => setData(question.key, opt.value)}
                                className="accent-blue-500"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
                {errors[question.key] && <p className={errorClass}>{errors[question.key]}</p>}
            </div>
        );
    }
 
    if (question.type === 'select') {
        return (
            <div className="mb-4">
                <label className={labelClass}>{question.label}</label>
                <select
                    className={inputClass}
                    value={data[question.key] || ''}
                    onChange={e => setData(question.key, e.target.value)}
                >
                    <option value="">-- Select --</option>
                    {question.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {errors[question.key] && <p className={errorClass}>{errors[question.key]}</p>}
            </div>
        );
    }
 
    return (
        <div className="mb-4">
            <label className={labelClass}>{question.label}</label>
            <input
                type={question.type || 'text'}
                className={inputClass}
                placeholder={question.placeholder || ''}
                value={data[question.key] || ''}
                onChange={e => setData(question.key, e.target.value)}
            />
            {errors[question.key] && <p className={errorClass}>{errors[question.key]}</p>}
        </div>
    );
};
 
export default function StudentProfileEdit() {
    const { profile } = usePage().props;
 
    const { data, setData, put, processing, errors } = useForm({
        first_name:        profile.first_name     || '',
        last_name:         profile.last_name      || '',
        middle_name:       profile.middle_name    || '',
        email:             profile.email          || '',
        username:          profile.username       || '',
        address:           profile.address        || '',
        contact_number:    profile.contact_number || '',
        is_employed:       '',
        employment_type:   '',
        company:           '',
        position:          '',
        location:          '',
        monthly_salary:    '',
        reason_unemployed: '',
    });
 
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('alumna.profile.update'));
    };
 
    return (
        <div className="min-h-screen bg-[#e8f4fd]">
            <NavbarAlumni />
 
            <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
 
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('alumna.profile')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm transition"
                    >
                        <IconArrow /> Back to Profile
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md transition"
                    >
                        <IconSave />
                        {processing ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </div>
 
                {/* ══ Personal Information ══ */}
                <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-5 text-gray-700">
                        <IconUser />
                        <h2 className="text-sm sm:text-base font-bold">Personal Information</h2>
                    </div>
 
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-500 text-white flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                            {profile.initials}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Change profile picture</p>
                            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
                                Upload Picture
                            </button>
                        </div>
                    </div>
 
                    {/* Personal fields — from profile.json */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {personalFields.map(field => (
                            <div key={field.key}>
                                <label className={labelClass}>{field.label}</label>
                                <input
                                    type={field.type}
                                    className={inputClass}
                                    placeholder={field.placeholder}
                                    value={data[field.key] || ''}
                                    onChange={e => setData(field.key, e.target.value)}
                                />
                                {errors[field.key] && <p className={errorClass}>{errors[field.key]}</p>}
                            </div>
                        ))}
                    </div>
                </section>
 
                {/* ══ Employment Status ══ */}
                <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-5 text-gray-700">
                        <IconBriefcase />
                        <h2 className="text-sm sm:text-base font-bold">Employment Status</h2>
                    </div>
 
                    {/* Employment questions — from profile.json */}
                    {employmentQuestions.map(question => (
                        <Question
                            key={question.key}
                            question={question}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    ))}
                </section>
 
            </div>
        </div>
    );
}