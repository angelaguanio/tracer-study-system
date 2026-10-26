import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Sparkles, ChevronRight, Loader2, MessageSquarePlus } from 'lucide-react';
import { INQUIRY_SUGGESTIONS } from '@/data/inquirySuggestions';

export default function ContactForm({auth, userEmail, userName, coordinators, departments, onSuccess}) {

  const [submittingQuickId, setSubmittingQuickId] = useState(null);

  const {data, setData, post, processing, errors, reset} = useForm({
    title: '',
    department: '',
    alumni_coord: '',
    subject: '',
    message: '',
    email: userEmail,
    name: userName
  })

  const filteredCoordinators = data.department && data.department !== 'admin'
    ? coordinators.filter(coord => coord.department === data.department)
    : [];

  const isRequiredFilled = Boolean(
    data.title &&
    data.department &&
    (data.department === 'admin' || data.alumni_coord)
  );

  function handleChange(e) {
    const {name, value} = e.target
    setData(name, value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!data.title) {
      toast.error('Please select your Title (Mr., Mrs., Ms.).');
      return;
    }

    if (!data.department) {
      toast.error('Please select a Recipient Department.');
      return;
    }

    // If a department is selected and it's not admin, coordinator is required
    if (data.department !== 'admin' && !data.alumni_coord) {
      toast.error('Please select an alumni coordinator for your department.');
      return;
    }

    if (!data.subject?.trim()) {
      toast.error('Please enter a subject.');
      return;
    }

    if (!data.message?.trim()) {
      toast.error('Please enter your message.');
      return;
    }

    post(route('alumna.contact.store'), {
        onSuccess: () => {
            toast.success('Message sent successfully!', {
              description: 'We will get back to you as soon as possible.'
            });
            reset();
            if (onSuccess) onSuccess();
        },
        onError: (errors) => {
            toast.error('Failed to send message', {
              description: 'Please check the form and try again.'
            });
            console.error('Form errors:', errors);
        }
    });
  }

  // Handle instant 1-click suggestive inquiries
  function handleQuickInquiry(suggestion) {
    if (!data.title) {
      toast.error('Please select your Title (Mr., Mrs., Ms.) before selecting an inquiry.');
      return;
    }

    if (!data.department) {
      toast.error('Please select a Recipient Department before selecting an inquiry.');
      return;
    }

    if (data.department !== 'admin' && !data.alumni_coord) {
      toast.error('Please select an Alumni Coordinator for your department before selecting an inquiry.');
      return;
    }

    setSubmittingQuickId(suggestion.id);

    router.post(route('alumna.inquiries.quickStore'), {
      title: data.title,
      department: data.department,
      alumni_coord: data.department === 'admin' ? null : data.alumni_coord,
      subject: suggestion.title,
      message: suggestion.defaultInquiryMessage,
      auto_reply: suggestion.template,
    }, {
      onSuccess: () => {
        toast.success('Inquiry submitted! An automated response has been provided.');
        reset();
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        toast.error('Failed to submit inquiry. Please try again.');
        console.error(err);
      },
      onFinish: () => setSubmittingQuickId(null),
    });
  }

  const titleItems = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Mrs.', label: 'Mrs.' },
    { value: 'Ms.', label: 'Ms.' },
  ]

  const isBusy = processing || submittingQuickId !== null;

  return (
    <Card className='w-full max-w-3xl px-4 sm:px-6 border-0 shadow-none'>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-2">

          {/* User details & Title */}
          <div className='flex flex-col w-full py-3 px-4 bg-blue-200/20 rounded-2xl border border-blue-300'>
            <div className="flex flex-row gap-4 items-center min-w-0 w-full">
              <Select onValueChange={(value) => setData('title', value)} value={data.title}>
                  <SelectTrigger className={`w-[110px] shrink-0 text-black text-sm bg-white ${!data.title ? 'border-amber-400' : 'border-gray-400'}`}>
                    <SelectValue placeholder="Title *" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48" >
                    <SelectGroup >
                      {titleItems.map((title) => (
                        <SelectItem key={title.value} value={title.value} >
                          {title.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

              {/* user details */}
              <div className="flex flex-col min-w-0">
                <h1 className="text-base font-medium break-words leading-tight">
                  {userName}
                </h1>

                <p className="text-sm text-gray-500 break-all leading-tight">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Recipient Selection */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-1'>
            {/* Department */}
            <div className='flex flex-col gap-2 w-full'>
              <Label className="text-xs font-semibold text-slate-700">
                Recipient Department <span className="text-red-500">*</span>
              </Label>
              <Select 
                onValueChange={(value) => {
                  setData(prev => ({
                    ...prev,
                    department: value,
                    alumni_coord: value === 'admin' ? '' : prev.alumni_coord
                  }));
                }} 
                value={data.department}
              >
                <SelectTrigger className={`w-full text-black text-sm bg-white ${!data.department ? 'border-amber-400' : 'border-gray-400'}`}>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="max-h-48" >
                  <SelectGroup >
                      <SelectItem value='admin'>Alumni Office</SelectItem>
                      {departments && departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept} Department
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Coordinator */}
            <div className='flex flex-col gap-2 w-full'>
              <Label className="text-xs font-semibold text-slate-700">
                Alumni Coordinator
                {data.department && data.department !== 'admin' && (
                  <span className='text-red-500 ml-1'>*</span>
                )}
              </Label>
              <Select 
                onValueChange={(val) => setData('alumni_coord', val)}
                disabled={!data.department || data.department === 'admin'}
                value={data.department === 'admin' ? '' : data.alumni_coord}
              >
                <SelectTrigger className={`w-full text-black text-sm bg-white ${
                  data.department && data.department !== 'admin' && !data.alumni_coord
                    ? 'border-red-400'
                    : 'border-gray-400'
                }`}>
                  <SelectValue placeholder={
                    !data.department 
                      ? "Select department first" 
                      : data.department === 'admin'
                        ? "Not applicable for Alumni Office"
                        : filteredCoordinators.length === 0 
                          ? "No coordinators available"
                          : "Select Coordinator"
                  } />
                </SelectTrigger>
                <SelectContent className="max-h-48" >
                  <SelectGroup >
                     {filteredCoordinators.length > 0 ? (
                       filteredCoordinators.map((coord)=> (
                          <SelectItem key={coord.id} value={coord.id.toString()}>
                            {coord.first_name} {coord.last_name} ({coord.department} Coordinator)
                          </SelectItem>
                        ))
                     ) : (
                       <div className="px-2 py-1.5 text-sm text-gray-500">
                         No coordinators available
                       </div>
                     )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {data.department && data.department !== 'admin' && !data.alumni_coord && (
                <p className='text-red-500 text-[11px]'>Please select an alumni coordinator.</p>
              )}
            </div>
          </div>

          {/* ── META-STYLE SUGGESTIVE INQUIRIES ───────────────────────── */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-6 w-6 rounded-md bg-[#009AFB]/10 text-[#009AFB] flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B2545] flex items-center gap-1.5">
                  Frequently Asked Inquiries
                  <span className="text-[10px] bg-sky-100 text-[#009AFB] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    Instant Reply
                  </span>
                </h4>
                {!isRequiredFilled ? (
                  <p className="text-[11px] text-amber-600 font-medium">
                    * Please select your Title and Recipient above before clicking an inquiry.
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Click any question to ask and get an instant answer from {data.department === 'admin' ? 'the Alumni Office' : 'your Coordinator'}:
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INQUIRY_SUGGESTIONS.map((item) => {
                const isSubmittingThis = submittingQuickId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleQuickInquiry(item)}
                    className={`flex items-center justify-between text-left p-3 rounded-2xl border transition-all duration-200 group disabled:opacity-50 cursor-pointer ${
                      !isRequiredFilled
                        ? 'border-slate-200/90 bg-slate-50/70 hover:border-amber-400 hover:bg-amber-50/40'
                        : 'border-sky-100 bg-sky-50/60 hover:bg-sky-100/80 hover:border-[#009AFB]/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span className="text-[10px] uppercase font-bold text-[#009AFB] tracking-wider block mb-0.5">
                        {item.category}
                      </span>
                      <p className="text-xs font-semibold text-[#0B2545] group-hover:text-[#009AFB] transition leading-snug">
                        {item.alumniPrompt || item.title}
                      </p>
                    </div>

                    <div className="shrink-0 h-7 w-7 rounded-xl bg-white border border-slate-200/80 text-slate-500 flex items-center justify-center group-hover:bg-[#009AFB] group-hover:text-white group-hover:border-[#009AFB] transition shadow-2xs">
                      {isSubmittingThis ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#009AFB] group-hover:text-white" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Or write a custom inquiry
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Subject & Message Inputs */}
          <div className='space-y-4 pt-1'>
            <div className='space-y-1.5'>
              <Label className="text-xs font-semibold text-slate-700">Subject</Label>
              <Input 
                className='px-3.5 border border-gray-300 focus:border-[#009AFB] h-11 text-sm rounded-xl bg-white shadow-xs' 
                placeholder="Brief subject of your concern"
                name="subject"
                value={data.subject}
                onChange={handleChange}
                disabled={isBusy}
              />
            </div>
            <div className='space-y-1.5'>
              <Label className="text-xs font-semibold text-slate-700">Your Message</Label>
              <Textarea 
                className='p-3.5 border border-gray-300 focus:border-[#009AFB] min-h-[140px] resize-none text-sm rounded-xl bg-white shadow-xs' 
                placeholder="Tell us how we can help you..."
                name="message"
                value={data.message}
                onChange={handleChange}
                disabled={isBusy}
              />
            </div>
          </div>
          
        </CardContent>

        {/* Increased spacing between text box and submit button */}
        <CardFooter className="pt-6 pb-6 flex flex-col gap-2">
          <Button 
            type='submit' 
            size='login2' 
            variant='blue' 
            disabled={isBusy}
            className="w-full h-12 rounded-full text-sm font-semibold shadow-md shadow-[#009AFB]/20 hover:shadow-lg transition-all hover:scale-[1.01]"
          >
            {processing ? 'Submitting...' : 'Submit Custom Inquiry'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
