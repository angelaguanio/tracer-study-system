import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Send, ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import echo from '@/echo';
import inquireImg from '@/assets/inquire.svg';
import cectLogo from '@/assets/wup_cect.webp';

export default function AlumnaInquiryContent({ inquiry, onBack }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [liveReplies, setLiveReplies] = useState(inquiry?.replies ?? []);
    const [liveStatus, setLiveStatus] = useState(inquiry?.status ?? null);
    const bottomRef = useRef(null);
    const prevReplyCountRef = useRef(inquiry?.replies?.length ?? 0);

    // Reset when switching inquiry
    useEffect(() => {
        setLiveReplies(inquiry?.replies ?? []);
        setLiveStatus(inquiry?.status ?? null);
        prevReplyCountRef.current = inquiry?.replies?.length ?? 0;
    }, [inquiry?.id]);

    // Subscribe to real-time replies via Echo instead of polling
    useEffect(() => {
        if (!inquiry) return;

        const channel = echo.channel(`inquiry.${inquiry.id}`);

        channel.listen('.inquiry.replied', (event) => {
            if (event.reply) {
                setLiveReplies(prev => {
                    const exists = prev.some(r => r.id === event.reply.id);
                    if (exists) return prev;
                    return [...prev, event.reply];
                });
            }
            if (event.status) {
                setLiveStatus(event.status);
            }
        });

        return () => {
            echo.leaveChannel(`inquiry.${inquiry.id}`);
        };
    }, [inquiry?.id]);

    useEffect(() => {
        const newCount = liveReplies.length;
        if (newCount > prevReplyCountRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevReplyCountRef.current = newCount;
    }, [liveReplies]);

    const sendReply = async () => {
        if (!replyText.trim()) return;

        setSending(true);
        try {
            await axios.post(
                route('alumna.inquiries.reply', inquiry.id),
                { message: replyText }
            );
            setReplyText('');
            toast.success('Reply sent!');
            // Echo will deliver the reply back via .inquiry.replied event
        } catch (e) {
            console.error(e);
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
                    <div className='h-full w-full bg-gradient-to-br from-[#0B2545] to-[#009AFB] flex items-center justify-center text-white font-bold'>
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                )}
            </Avatar>
        );
    };

    if (!inquiry) {
        return (
            <div className='relative flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/40 backdrop-blur-sm rounded-r-3xl overflow-hidden select-none'>
                {/* Background CECT seal watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                    <img src={cectLogo} alt="CECT Logo Watermark" className="w-80 h-80 object-contain filter grayscale" />
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                    <div className="w-52 h-52 mb-5 relative flex items-center justify-center">
                        <img src={inquireImg} alt="Select an inquiry" className="w-full h-full object-contain filter drop-shadow-sm" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0B2545] mb-2 tracking-tight">Select an inquiry to view</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Choose a conversation from the sidebar or click <span className="font-semibold text-[#009AFB]">"New Inquiry"</span> to reach out to the Alumni Office or your Department Coordinator.
                    </p>
                </div>
            </div>
        );
    }

    const replies = [...liveReplies].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    const isResolved = liveStatus === 'resolved';

    return (
        <main className='relative flex flex-col w-full h-full p-5 gap-3 bg-white/40 backdrop-blur-sm rounded-r-3xl overflow-hidden'>
            {/* Background CECT seal watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                <img src={cectLogo} alt="CECT Logo Watermark" className="w-[420px] h-[420px] object-contain filter grayscale" />
            </div>

            <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 rounded-xl">
                            <ArrowLeft className="h-5 w-5 text-slate-700" />
                        </Button>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold text-[#0B2545] truncate">{inquiry.subject}</h1>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>{inquiry.formatted_date}</span>
                            <span>•</span>
                            <span className="font-medium text-[#009AFB]">
                                {inquiry.department ? `Department: ${inquiry.department}` : 'Recipient: Alumni Office'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Thread */}
            <div className='relative z-10 flex flex-col flex-1 overflow-y-auto gap-4 px-2 py-3 inquiry-scrollbar'>
                {/* Original inquiry */}
                <div className='flex gap-3 flex-row-reverse'>
                    <AvatarBlock user={inquiry.alumni} />
                    <div className='flex flex-col gap-1 max-w-[78%] items-end'>
                        <span className='text-[11px] text-slate-400 font-medium px-1'>
                            You · {inquiry.formatted_date}
                        </span>
                        <div
                            className='bg-[#009AFB] text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md shadow-[#009AFB]/10 border border-[#009AFB]'
                            style={{ wordBreak: 'break-word' }}
                        >
                            <p className='text-sm font-bold mb-1 border-b border-white/20 pb-1'>{inquiry.subject}</p>
                            <p className='text-sm leading-relaxed'>{inquiry.message}</p>
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {replies.map((reply) => {
                    const isMe = reply.sender_role === 'alumna';
                    return (
                        <div key={reply.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <AvatarBlock user={reply.sender} />
                            <div className={`flex flex-col gap-1 max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className='text-[11px] text-slate-400 font-medium px-1'>
                                    {isMe ? 'You' : `${reply.sender?.first_name} ${reply.sender?.last_name}`}
                                    {' · '}
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </span>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        isMe
                                            ? 'bg-[#009AFB] text-white rounded-tr-none shadow-md shadow-[#009AFB]/10'
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

            {/* Input Bar */}
            {isResolved ? (
                <div className='relative z-10 text-center text-xs font-medium text-slate-400 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl py-3 px-4 shadow-sm'>
                    This inquiry has been resolved. No further replies needed.
                </div>
            ) : (
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
            )}
        </main>
    );
}
