import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button';
import { CheckCircle, RotateCcw, Send, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Avatar } from './ui/avatar';
import axios from "axios";
import echo from '@/echo';
import inquireImg from '@/assets/inquire.svg';
import cectLogo from '@/assets/wup_cect.webp';

export default function InquiryContent({ inquiry, onUpdateStatus, onReplyAdded, userRole = 'admin', onBack }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [inquiry?.replies]);

    // Fetch fresh replies immediately when switching to a different inquiry
    useEffect(() => {
        if (!inquiry) return;

        const routeName =
            userRole === 'coordinator'
                ? 'coordinator.inquiries.replies'
                : 'admin.inquiries.replies';

        axios.get(route(routeName, inquiry.id))
            .then(({ data }) => {
                onReplyAdded?.({
                    status: data.status,
                    replies: data.replies ?? [],
                    replace: true,
                });
            })
            .catch(console.error);

    // Only re-run when the selected inquiry changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inquiry?.id, userRole]);

    // Subscribe to real-time reply updates via Pusher instead of polling
    useEffect(() => {
        if (!inquiry) return;

        const channel = echo.channel(`inquiry.${inquiry.id}`);

        channel.listen('.inquiry.replied', (event) => {
            onReplyAdded?.({
                status: event.status,
                replies: event.reply ? undefined : undefined, // handled below
                replace: false,
                newReply: event.reply,
            });
        });

        return () => {
            echo.leaveChannel(`inquiry.${inquiry.id}`);
        };
    }, [inquiry?.id]);

    const toggleResolved = async () => {
        const newStatus = inquiry.status === 'resolved' ? 'replied' : 'resolved';
        const routeName = userRole === 'coordinator'
            ? 'coordinator.inquiries.update'
            : 'admin.inquiries.update';

        setUpdatingStatus(true);
        router.patch(route(routeName, inquiry.id), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    newStatus === 'resolved'
                        ? 'Inquiry marked as resolved'
                        : 'Inquiry reopened'
                );
                onUpdateStatus(inquiry.id, newStatus);
            },
            onFinish: () => setUpdatingStatus(false),
        });
    };

    const sendReply = async () => {
        if (!replyText.trim()) return;
        const routeName = userRole === 'coordinator'
            ? 'coordinator.inquiries.reply'
            : 'admin.inquiries.reply';

        setSending(true);
        try {
            const { data } = await axios.post(route(routeName, inquiry.id), {
                message: replyText,
            });

            onReplyAdded?.(data.reply);
            setReplyText('');
            toast.success('Reply sent!');
        } catch (error) {
            toast.error('Failed to send reply.');
        } finally {
            setSending(false);
        }
    };

    const AvatarBlock = ({ user, size = 'sm' }) => {
        const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
        return (
            <Avatar className={`${dim} shrink-0 overflow-hidden border border-slate-200/80 shadow-sm`}>
                {user?.profile_picture ? (
                   <img
                       src={user.profile_picture}
                       alt={`${user.first_name}'s profile`}
                       className="w-full h-full object-cover"
                   />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0B2545] to-[#009AFB] flex items-center justify-center text-white font-bold">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                )}
            </Avatar>
        );
    };

    if (!inquiry) {
        return (
            <div className='relative flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/40 backdrop-blur-sm rounded-r-2xl overflow-hidden select-none'>
                {/* Background CECT seal watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                    <img src={cectLogo} alt="CECT Logo Watermark" className="w-80 h-80 object-contain filter grayscale" />
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                    <div className="w-48 h-48 mb-4 relative flex items-center justify-center">
                        <img src={inquireImg} alt="Select an inquiry" className="w-full h-full object-contain filter drop-shadow-sm" />
                    </div>

                    <h3 className="text-xl font-bold text-[#0B2545] mb-2 tracking-tight">Select an inquiry to view</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                        Choose a conversation from the sidebar list to inspect details, send replies, or manage inquiry status.
                    </p>
                </div>
            </div>
        );
    }

    // Sort replies oldest-first for display
    const replies = [...(inquiry.replies ?? [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    return (
        <main className='relative flex flex-col flex-1 h-full min-w-0 p-5 gap-3 bg-white/40 backdrop-blur-sm rounded-r-2xl overflow-hidden'>
            {/* Background CECT seal watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                <img src={cectLogo} alt="CECT Logo Watermark" className="w-[420px] h-[420px] object-contain filter grayscale" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="md:hidden shrink-0 h-8 w-8 rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-700" />
                    </Button>

                    <AvatarBlock user={inquiry.alumni} size="lg" />

                    <div className="min-w-0">
                        <h1 className="text-base font-bold text-[#0B2545] leading-tight truncate">
                            {inquiry.alumni.first_name} {inquiry.alumni.last_name}
                        </h1>

                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span className="truncate">{inquiry.alumni.email}</span>
                            <span>•</span>
                            <span className="shrink-0">{inquiry.formatted_date}</span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={toggleResolved}
                    disabled={updatingStatus}
                    size="sm"
                    className={`h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shrink-0 shadow-sm transition-all duration-200 ${
                        inquiry.status === 'resolved'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                >
                    {inquiry.status === 'resolved' ? (
                        <>
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reopen
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Mark Resolved
                        </>
                    )}
                </Button>
            </header>

            {/* Thread */}
            <div className='relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto gap-4 px-2 py-3 inquiry-scrollbar'>
                {/* Original inquiry */}
                <div className='flex gap-3'>
                    <AvatarBlock user={inquiry.alumni} />
                    <div className='flex flex-col gap-1 max-w-[78%] items-start'>
                        <span className='text-[11px] text-slate-400 font-medium px-1'>
                            {inquiry.alumni.first_name} · {inquiry.formatted_date}
                        </span>
                        <div className='bg-white text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/80 shadow-sm'>
                            <p className='text-sm font-bold text-[#0B2545] mb-1 border-b border-slate-100 pb-1'>{inquiry.subject}</p>
                            <p className='text-sm leading-relaxed' style={{ wordBreak: 'break-word' }}>
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
                            <div className={`flex flex-col gap-1 max-w-[78%] ${isStaff ? 'items-end' : 'items-start'}`}>
                                <span className='text-[11px] text-slate-400 font-medium px-1'>
                                    {reply.sender.first_name} · {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        isStaff
                                            ? 'bg-[#009AFB] text-white rounded-tr-none shadow-md shadow-[#009AFB]/10 border border-[#009AFB]'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-sm'
                                    }`}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    {reply.message}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className='relative z-10 flex gap-2.5 items-end bg-white/90 backdrop-blur-md border border-slate-200/70 p-2.5 rounded-2xl shadow-md'>
                <textarea
                    className='flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-h-[50px] max-h-[130px] inquiry-scrollbar'
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
                    className='h-10 w-10 p-0 shrink-0 rounded-xl bg-[#009AFB] hover:bg-[#0082D6] text-white shadow-md shadow-[#009AFB]/20 transition-all duration-200 hover:scale-[1.03] disabled:opacity-40'
                >
                    <Send className='h-4 w-4' />
                </Button>
            </div>
        </main>
    );
}