import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import { Briefcase, MapPin, Pencil, Clock, Plus, CalendarDays, BadgeDollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Permanent/Regular', label: 'Permanent/Regular' },
  { value: 'Probationary',      label: 'Probationary' },
];

const UNEMPLOYMENT_REASONS = [
  'Studying',
  'Job Hunting',
  'Career Break',
  'Family / Personal Responsibilities',
  'Health Reasons',
  'Preparing for Licensure/Certification Exam',
  'Starting a Business',
  'Other',
];

export default function AlumnaUpdates({ employment, history }) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        currently_employed: employment?.currently_employed || 'No',
        employment_type: employment?.employment_type || '',
        company_name: employment?.company_name || '',
        position: employment?.position || '',
        location: employment?.location || '',
        monthly_salary: employment?.monthly_salary || '',
        employment_duration: employment?.employment_duration || '',
        unemployment_reason: employment?.unemployment_reason || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('alumna.updates.store'), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <AlumnaLayout>
            <Head title="Alumni Updates" />
            
            {/* Background gradient */}
            <div className="min-h-screen w-full bg-app-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                            Alumni <span style={{ color: 'var(--theme-primary)' }}>Updates</span>
                        </h1>
                        
                        <p className="text-lg text-gray-500 max-w-full">
                            A quick update helps your alumni community celebrate your wins, discover your expertise, and open doors to what's next.
                        </p>
                    </div>

                    {/* Current Employment Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90">
                        <form onSubmit={submit}>
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border"
                                        style={{ 
                                            background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                                            color: 'var(--theme-primary)', 
                                            borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, #e2e8f0)' 
                                        }}
                                    >
                                        <Briefcase className="w-7 h-7" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Current employment</h2>
                                        <p className="text-[15px] text-gray-500 mt-0.5">Tell us where your work is taking you.</p>
                                    </div>
                                </div>
                                {employment?.updated_at && (
                                    <div 
                                        className="text-[13px] font-semibold px-4 py-1.5 rounded-full border"
                                        style={{ 
                                            background: 'color-mix(in srgb, var(--theme-primary) 10%, white)', 
                                            color: 'var(--theme-primary)', 
                                            borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, #e2e8f0)' 
                                        }}
                                    >
                                        Last updated {new Date(employment.updated_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-10">
                                <div className="space-y-2.5">
                                    <label className="text-sm font-semibold text-gray-700">Employment status</label>
                                    <Select 
                                        value={data.currently_employed} 
                                        onValueChange={(val) => setData('currently_employed', val)}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger className="h-14 w-full bg-white border-gray-200 rounded-xl px-4 font-medium text-gray-700 data-[disabled]:opacity-70 data-[disabled]:bg-gray-50">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Yes">Employed</SelectItem>
                                            <SelectItem value="No">Unemployed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.currently_employed && <p className="text-xs text-red-500">{errors.currently_employed}</p>}
                                </div>

                                {data.currently_employed === 'Yes' && (
                                    <>
                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Employment Type</label>
                                            <Select 
                                                value={data.employment_type} 
                                                onValueChange={(val) => setData('employment_type', val)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-14 w-full bg-white border-gray-200 rounded-xl px-4 font-medium text-gray-700 data-[disabled]:opacity-70 data-[disabled]:bg-gray-50">
                                                    <SelectValue placeholder="e.g. Permanent/Regular" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.employment_type && <p className="text-xs text-red-500">{errors.employment_type}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Job title</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Pencil className="h-[18px] w-[18px] text-gray-400" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={data.position}
                                                    onChange={(e) => setData('position', e.target.value)}
                                                    placeholder="e.g. Product Designer"
                                                    className="h-14 pl-12 bg-white border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-70 disabled:bg-gray-50"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Company / organization</label>
                                            <Input
                                                type="text"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                placeholder="e.g. Northstar Labs"
                                                className="h-14 bg-white border-gray-200 rounded-xl px-4 font-medium text-gray-700 disabled:opacity-70 disabled:bg-gray-50"
                                                disabled={!isEditing}
                                            />
                                            {errors.company_name && <p className="text-xs text-red-500">{errors.company_name}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Location</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <MapPin className="h-[18px] w-[18px] text-gray-400" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    placeholder="e.g. Toronto, Canada"
                                                    className="h-14 pl-12 bg-white border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-70 disabled:bg-gray-50"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Employment Duration</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <CalendarDays className="h-[18px] w-[18px] text-gray-400" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={data.employment_duration}
                                                    onChange={(e) => setData('employment_duration', e.target.value)}
                                                    placeholder="e.g. 2023 - Present"
                                                    className="h-14 pl-12 bg-white border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-70 disabled:bg-gray-50"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {errors.employment_duration && <p className="text-xs text-red-500">{errors.employment_duration}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-gray-700">Monthly Salary (Optional)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <BadgeDollarSign className="h-[18px] w-[18px] text-gray-400" />
                                                </div>
                                                <Input
                                                    type="number"
                                                    value={data.monthly_salary}
                                                    onChange={(e) => setData('monthly_salary', e.target.value)}
                                                    placeholder="e.g. 50000"
                                                    className="h-14 pl-12 bg-white border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-70 disabled:bg-gray-50"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {errors.monthly_salary && <p className="text-xs text-red-500">{errors.monthly_salary}</p>}
                                        </div>
                                    </>
                                )}

                                {data.currently_employed === 'No' && (
                                    <div className="space-y-2.5 col-span-1 md:col-span-2 max-w-md">
                                        <label className="text-sm font-semibold text-gray-700">Reason for Not Working</label>
                                        <Select 
                                            value={data.unemployment_reason} 
                                            onValueChange={(val) => setData('unemployment_reason', val)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className="h-14 w-full bg-white border-gray-200 rounded-xl px-4 font-medium text-gray-700 data-[disabled]:opacity-70 data-[disabled]:bg-gray-50">
                                                <SelectValue placeholder="Select reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UNEMPLOYMENT_REASONS.map((r) => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.unemployment_reason && <p className="text-xs text-red-500">{errors.unemployment_reason}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-end mt-12 pt-8 border-t border-gray-100 gap-6">
                                {isEditing ? (
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={() => {
                                                reset();
                                                setIsEditing(false);
                                            }}
                                            className="rounded-full px-6 py-6 text-sm font-semibold w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="text-white rounded-full px-8 py-6 text-sm font-semibold shadow-sm w-full sm:w-auto hover:opacity-90"
                                            style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
                                        >
                                            Save updates
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        type="button" 
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full px-8 py-6 text-sm font-semibold shadow-sm w-full sm:w-auto"
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Details
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Employment History */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90 mt-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                            <div>
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Employment history</h2>
                                </div>
                                <p className="text-[15px] text-gray-500 mt-1">A timeline of the experiences that shaped your career.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {history.length > 0 ? history.map((item, index) => {
                                const isCurrent = index === 0 && employment?.currently_employed === 'Yes' && item.is_present;

                                return (
                                    <div key={item.id} className="border border-slate-200/90 rounded-2xl p-6 hover:border-slate-300 transition-all relative flex flex-col h-full bg-slate-50/50 hover:bg-white shadow-xs hover:shadow-md duration-300 group">
                                        <div className="flex justify-between items-start mb-5 flex-grow gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.company_name || (item.currently_employed === 'No' ? 'Unemployed' : 'Employed')}</h3>
                                                {item.position && <p className="text-[15px] font-medium mt-1" style={{ color: 'var(--theme-primary)' }}>{item.position}</p>}
                                            </div>
                                            {isCurrent ? (
                                                <div 
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 shadow-2xs"
                                                    style={{ 
                                                        background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                                                        color: 'var(--theme-primary)' 
                                                    }}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--theme-primary)' }}></div>
                                                    Current
                                                </div>
                                            ) : (
                                                <Clock className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0 mt-0.5" />
                                            )}
                                        </div>

                                        <div className="mt-7 pt-5 border-t border-gray-50 flex flex-col gap-1.5">
                                            {(item.employment_type || item.location) && (
                                                <div className="text-[13px] text-gray-500 font-medium">
                                                    {item.employment_type || 'Full-time'} <span className="mx-1.5">•</span> {item.location || 'N/A'}
                                                </div>
                                            )}
                                            <div className="text-[13px] text-gray-400 font-medium">
                                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — {isCurrent ? 'Present' : new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full py-16 text-center text-gray-500 text-sm bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    No employment history found. Update your current employment to start building your timeline.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AlumnaLayout>
    );
}
