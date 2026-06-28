import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Send } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AlumnaInquiryContent({ inquiry, onBack }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [inquiry?.replies]);

    const sendReply = () => {
        if (!replyText.trim()) return;
        setSending(true);
        router.post(route('alumna.inquiries.reply', inquiry.id), { message: replyText }, {
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
                {user?.profile_picture ? (
                    <img
                        src={`/storage/${user.profile_picture}`}
                        alt='avatar'
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold'>
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                )}
            </Avatar>
        );
    };

    if (!inquiry) {
        return (
            <div className='flex items-center justify-center h-full w-full text-gray-400'>
                Select an inquiry to view
            </div>
        );
    }

    const replies = [...(inquiry.replies ?? [])].reverse();
    const isResolved = inquiry.status === 'resolved';

    return (
        <main className='flex flex-col w-full h-full p-4 gap-3'>
          <header className="flex items-center gap-2 px-3 pb-3 border-b">
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>

            <div className="min-w-0">
                <h1 className="text-xl font-semibold break-words">
                    {inquiry.subject}
                </h1>

                <p className="text-xs text-gray-400">
                    {inquiry.formatted_date}
                </p>

                {inquiry.department && (
                    <p className="text-sm text-gray-500">
                        Department: {inquiry.department}
                    </p>
                )}
            </div>
        </header>
            {/* Thread */}
            <div className='flex flex-col flex-1 overflow-y-auto gap-4 px-2 pb-2'>
                {/* Original inquiry — alumna's message, shown on the right */}
                <div className='flex gap-3 flex-row-reverse'>
                    <AvatarBlock user={inquiry.alumni} />
                    <div className='flex flex-col gap-1 max-w-[80%] items-end'>
                        <span className='text-xs text-gray-400'>
                            You · {inquiry.formatted_date}
                        </span>
                        <div
                            className='bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3'
                            style={{ wordBreak: 'break-word' }}
                        >
                            <p className='text-sm font-semibold mb-1'>{inquiry.subject}</p>
                            <p className='text-sm'>{inquiry.message}</p>
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {replies.map((reply) => {
                    const isMe = reply.sender_role === 'alumna';
                    return (
                        <div key={reply.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <AvatarBlock user={reply.sender} />
                            <div className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className='text-xs text-gray-400'>
                                    {isMe
                                        ? 'You'
                                        : `${reply.sender?.first_name} ${reply.sender?.last_name}`}
                                    {' · '}
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm ${
                                        isMe
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-gray-100 text-slate-700 rounded-tl-none'
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
            {isResolved ? (
                <div className='text-center text-sm text-gray-400 border-t pt-3'>
                    This inquiry has been resolved. No further replies needed.
                </div>
            ) : (
                <div className='flex gap-2 items-end border-t pt-3'>
                    <textarea
                        className='flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px] max-h-[140px]'
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
            )}
        </main>
    );
}
