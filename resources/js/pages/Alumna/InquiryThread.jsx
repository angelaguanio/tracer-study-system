import { useState, useRef, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import { toast } from 'sonner';
import { Send, ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const statusColor = {
    pending:  'bg-yellow-100 text-yellow-700',
    replied:  'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
};

const AvatarBlock = ({ user }) => (
    <Avatar className="h-8 w-8 shrink-0 overflow-hidden border border-gray-200">
        {user.profile_picture ? (
            <img src={`/storage/${user.profile_picture}`} className="w-full h-full object-cover" />
        ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-xs font-bold">
                {user.first_name[0]}{user.last_name[0]}
            </div>
        )}
    </Avatar>
);

export default function InquiryThread({ inquiry }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    const replies = [...(inquiry.replies ?? [])].reverse();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [inquiry.replies]);

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

    // Disable reply if resolved
    const isResolved = inquiry.status === 'resolved';

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col h-screen gap-4">

            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <Link href={route('alumna.inquiries.index')} className="text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-slate-800">{inquiry.subject}</h1>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColor[inquiry.status]}`}>
                            {inquiry.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">{inquiry.formatted_date}</p>
                </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-2">

                {/* Original message */}
                <div className="flex gap-3">
                    <AvatarBlock user={inquiry.alumni} />
                    <div className="flex flex-col gap-1 max-w-[80%]">
                        <span className="text-xs text-gray-400">
                            You · {inquiry.formatted_date}
                        </span>
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700"
                            style={{ wordBreak: 'break-word' }}>
                            {inquiry.message}
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {replies.map((reply) => {
                    const isMe = reply.sender_role === 'alumni';
                    return (
                        <div key={reply.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <AvatarBlock user={reply.sender} />
                            <div className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-xs text-gray-400">
                                    {isMe ? 'You' : `${reply.sender.first_name} ${reply.sender.last_name}`}
                                    {' · '}
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                                <div className={`rounded-2xl px-4 py-3 text-sm ${
                                    isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-slate-700 rounded-tl-none'
                                }`} style={{ wordBreak: 'break-word' }}>
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
                <div className="text-center text-sm text-gray-400 border-t pt-3">
                    This inquiry has been resolved. No further replies needed.
                </div>
            ) : (
                <div className="flex gap-2 items-end border-t pt-3">
                    <textarea
                        className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px] max-h-[140px]"
                        placeholder="Write a reply..."
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
                        className="h-10 w-10 p-0 rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </div>
            )}
        </div>
    );
}

InquiryThread.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
