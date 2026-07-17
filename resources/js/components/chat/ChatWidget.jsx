import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { MessageCircle, ArrowLeft, X } from 'lucide-react';
import echo from '../../echo';
import ConversationList from './ConversationList';
import MessagePane from './MessagePane';

export default function ChatWidget({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(false); // ref so Echo listeners always see current value
    const [activeConversation, setActiveConversation] = useState(null);
    const [totalUnread, setTotalUnread] = useState(0);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [echoChannel, setEchoChannel] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [globalPresenceChannel, setGlobalPresenceChannel] = useState(null);

    const isAdmin = user?.user_role === 'admin';
    const isCoordinator = user?.user_role === 'coordinator';

    // Keep the ref in sync with state so stale closures always read the current value
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Join global presence channel on mount
    useEffect(() => {
        if (!isAdmin && !isCoordinator) return;

        const presenceChannel = echo.join('chat.presence')
            .here((members) => {
                const status = {};
                members.forEach((m) => { status[m.id] = true; });
                setOnlineStatus(status);
            })
            .joining((member) => {
                setOnlineStatus((prev) => ({ ...prev, [member.id]: true }));
            })
            .leaving((member) => {
                setOnlineStatus((prev) => ({ ...prev, [member.id]: false }));
            });

        setGlobalPresenceChannel(presenceChannel);

        return () => {
            echo.leave('chat.presence');
        };
    }, [isAdmin, isCoordinator]);

    // Track channel names subscribed at mount for badge counting (never leave these)
    const badgeChannelsRef = useRef([]);

    // Fetch initial unread count and subscribe to ALL channels on mount for badge counting
    useEffect(() => {
        axios.get('/messenger/conversations').then((res) => {
            if (isAdmin) {
                const convs = Array.isArray(res.data) ? res.data : [];
                const total = convs.reduce((sum, c) => sum + (c.unread_count ?? 0), 0);
                setTotalUnread(total);

                // Subscribe to ALL coordinator channels permanently for badge increments.
                // These are never left until component unmounts.
                convs.forEach((conv) => {
                    const adminId = parseInt(conv.admin_id, 10);
                    const coordinatorId = parseInt(conv.coordinator_id, 10);
                    if (!adminId || !coordinatorId) return;
                    const min = Math.min(adminId, coordinatorId);
                    const max = Math.max(adminId, coordinatorId);
                    const channelName = `chat.${min}.${max}`;
                    echo.private(channelName)
                        .listen('.message.sent', (event) => {
                            if (!isOpenRef.current && event.sender_id !== user.id) {
                                setTotalUnread((n) => n + 1);
                            }
                        });
                    badgeChannelsRef.current.push(channelName);
                });
            } else if (isCoordinator) {
                const conv = Array.isArray(res.data) ? res.data[0] : res.data;
                if (conv) {
                    setTotalUnread(conv.unread_count ?? 0);
                    setActiveConversation(conv);

                    const adminId = parseInt(conv.admin_id, 10);
                    const coordinatorId = parseInt(conv.coordinator_id, 10);
                    if (adminId && coordinatorId) {
                        const min = Math.min(adminId, coordinatorId);
                        const max = Math.max(adminId, coordinatorId);
                        const channelName = `chat.${min}.${max}`;
                        const ch = echo.private(channelName)
                            .listen('.message.sent', (event) => {
                                if (!isOpenRef.current && event.sender_id !== user.id) {
                                    setTotalUnread((n) => n + 1);
                                }
                            });
                        setEchoChannel(ch);
                        badgeChannelsRef.current.push(channelName);
                    }
                }
            }
        }).catch(() => {});

        // Cleanup: leave badge channels only on unmount
        return () => {
            badgeChannelsRef.current.forEach(name => echo.leave(name));
            badgeChannelsRef.current = [];
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, isCoordinator]);

    const subscribeToChannel = (conv) => {
        const adminId = parseInt(conv.admin_id, 10);
        const coordinatorId = parseInt(conv.coordinator_id, 10);

        if (!adminId || !coordinatorId || isNaN(adminId) || isNaN(coordinatorId)) {
            console.warn('subscribeToChannel: missing IDs', conv);
            return;
        }

        const min = Math.min(adminId, coordinatorId);
        const max = Math.max(adminId, coordinatorId);
        const channelName = `chat.${min}.${max}`;

        // Re-use the already-subscribed channel — Echo deduplicates by name.
        // Just get the existing private channel reference for MessagePane to attach its handlers.
        const channel = echo.private(channelName);
        setEchoChannel(channel);
        return channel;
    };

    const leaveChannel = (conv) => {
        // Don't actually leave the Pusher channel — the badge subscription must persist.
        // Just clear the echoChannel ref so MessagePane detaches its handlers.
        setEchoChannel(null);
    };

    // Admin: subscribe when a conversation is selected
    const handleSelectConversation = (conv) => {
        if (activeConversation && activeConversation.id !== conv.id) {
            leaveChannel(activeConversation);
        }
        setActiveConversation(conv);
        setTotalUnread(0);
        // Clear unread badge for this conversation in the list
        setConversations(prev => prev.map(c =>
            c.id === conv.id ? { ...c, unread_count: 0 } : c
        ));
        subscribeToChannel(conv);
    };

    const handleOpen = () => {
        setIsOpen(true);
        setTotalUnread(0);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleBack = () => {
        if (activeConversation) {
            leaveChannel(activeConversation);
        }
        setActiveConversation(null);
    };

    if (!isAdmin && !isCoordinator) return null;

    return (
        <div className={`fixed bottom-4 right-4 flex flex-col items-end gap-2 ${isOpen ? 'z-50' : 'z-40 pointer-events-none'}`}>
            {/* Floating panel */}
            <div className={`w-80 h-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
                isOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none'
            }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white">
                        <div className="flex items-center gap-2">
                            {isAdmin && activeConversation && (
                                <button
                                    onClick={handleBack}
                                    className="p-1 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                                    aria-label="Back to conversations"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            )}
                            <span className="font-semibold text-sm">
                                {activeConversation
                                    ? isAdmin
                                        ? `${activeConversation.coordinator?.first_name ?? ''} ${activeConversation.coordinator?.last_name ?? ''}`.trim() || 'Chat'
                                        : `${activeConversation.admin?.first_name ?? ''} ${activeConversation.admin?.last_name ?? ''}`.trim() || 'Chat'
                                    : 'Messages'}
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                            aria-label="Close chat"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-hidden">
                        {activeConversation ? (
                            <MessagePane
                                conversationId={activeConversation.id}
                                currentUser={user}
                                echoChannel={echoChannel}
                            />
                        ) : (
                            <ConversationList
                                currentUser={user}
                                onSelect={handleSelectConversation}
                                onlineStatus={onlineStatus}
                                conversations={conversations}
                                setConversations={setConversations}
                            />
                        )}
                    </div>
                </div>

            {/* Toggle button */}
            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="relative w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer pointer-events-auto"
                aria-label="Toggle chat"
            >
                <MessageCircle size={22} />
                {!isOpen && totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                )}
            </button>
        </div>
    );
}
