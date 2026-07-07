import React, { useState, useRef, useEffect } from 'react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { ChevronDown, Send, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Avatar } from './ui/avatar';


export default function InquiryContent({ inquiry, onUpdateStatus, userRole = 'admin', onBack }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    const statusItems = [
        { value: 'pending', label: 'Pending' },
        { value: 'replied', label: 'Replied' },
        { value: 'resolved', label: 'Resolved' },
    ];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [inquiry?.replies]);

    const updateStatus = (newStatus) => {
        const routeName = userRole === 'coordinator'
            ? 'coordinator.inquiries.update'
            : 'admin.inquiries.update';

        router.patch(route(routeName, inquiry.id), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Inquiry marked as ${newStatus}`);
                onUpdateStatus(inquiry.id, newStatus);
            }
        });
    };

    const sendReply = () => {
        if (!replyText.trim()) return;
        const routeName = userRole === 'coordinator'
            ? 'coordinator.inquiries.reply'
            : 'admin.inquiries.reply';

        setSending(true);
        router.post(route(routeName, inquiry.id), { message: replyText }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyText('');
                toast.success('Reply sent!');
            },
            onFinish: () => setSending(false),
        });
    };

    const AvatarBlock = ({ user, size = 'sm' }) => {
        const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-12 w-12 text-sm';
        return (
            <Avatar className={`${dim} shrink-0 overflow-hidden border border-gray-200`}>
                {user.profile_picture ? (
                   <img
                   src={user.profile_picture}
                   alt={`${user.first_name}'s profile`}
                   className="w-full h-full object-cover"
               />
                ) : (
                    <div className={`h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold`}>
                        {user.first_name[0]}{user.last_name[0]}
                    </div>
                )}
            </Avatar>
        );
    };

    if (!inquiry) {
        return (
            <div className="flex items-center justify-center h-full w-full text-gray-400">
                No Content
            </div>
        );
    }

    // Sort replies oldest-first for display
    const replies = [...(inquiry.replies ?? [])].reverse();

    return (
        <main className='flex flex-col flex-1 min-w-0 min-h-full p-4 md:p-6 gap-4 overflow-y-auto'>
            {/* Header */}
            <header className="border-b pb-3">
                <div className="flex items-center justify-between gap-3">

                    {/* Left side */}
                    <div className="flex items-center gap-3 min-w-0">

                        {/* Back button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="md:hidden shrink-0 h-8 w-8"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <AvatarBlock user={inquiry.alumni} size="lg" />

                        <div className="min-w-0">
                            <h1 className="lg:text-lg text-md font-semibold leading-tight truncate">
                                {inquiry.alumni.first_name} {inquiry.alumni.last_name}
                            </h1>

                            <p className="lg:text-sm text-xs text-gray-500 truncate">
                                {inquiry.alumni.email}
                            </p>

                            <p className="text-xs text-gray-400">
                                {inquiry.formatted_date}
                            </p>
                        </div>
                    </div>

                    {/* Right side */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 px-3 text-sm gap-1 shrink-0"
                            >
                                Mark as
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Change Status
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            {statusItems.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => updateStatus(option.value)}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </header>

            {/* Thread */}
            <div className='flex flex-col flex-1 min-h-0 overflow-y-auto gap-4 px-1 md:px-2 md:pb-4'>
                {/* Original inquiry */}
                <div className='flex gap-3'>
                    <AvatarBlock user={inquiry.alumni} />
                    <div className='flex flex-col gap-1 max-w-[80%]'>
                        <span className='text-xs text-gray-400'>
                            {inquiry.alumni.first_name} · {inquiry.formatted_date}
                        </span>
                        <div className='bg-gray-100 text-slate-700 rounded-2xl rounded-tl-none px-4 py-3'>
                            <p className='text-sm font-semibold mb-1'>{inquiry.subject}</p>
                            <p className='text-sm' style={{ wordBreak: 'break-word' }}>
                                {inquiry.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {replies.map((reply) => {
                    const isStaff = reply.sender_role === 'admin' || reply.sender_role === 'coordinator';
                    return (
                        <div key={reply.id} className={`flex gap-3 ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}>
                            <AvatarBlock user={reply.sender} />
                            <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${isStaff ? 'items-end' : 'items-start'}`}>
                                <span className='text-xs text-gray-400'>
                                    {reply.sender.first_name} · {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className={`rounded-2xl px-4 py-3 text-sm ${isStaff
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 text-slate-700 rounded-tl-none'
                                }`}
                                    style={{ wordBreak: 'break-word' }}>
                                    {reply.message}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className='flex gap-2 items-start lg:items-end border-t pt-3 sticky bottom-0 bg-white md:pb-0 '>
                <textarea
                    className='flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 lg:min-h-[60px] min-h-[70px] max-h-[140px]'
                    placeholder='Write a reply...'
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendReply();
                        }
                    }}
                />
                <Button
                    onClick={sendReply}
                    disabled={sending || !replyText.trim()}
                    className='h-10 w-10 p-0 rounded-xl bg-blue-600 hover:bg-blue-700'
                >
                    <Send className='h-4 w-4 text-white' />
                </Button>
            </div>
        </main>
    );
}