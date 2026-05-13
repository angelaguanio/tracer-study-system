import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import MessageInput from './MessageInput';

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function MessagePane({ conversationId, currentUser, echoChannel }) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [otherUserReadAt, setOtherUserReadAt] = useState(null);
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const isNearBottomRef = useRef(true);

    // Scroll to bottom helper
    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Track whether user is near bottom
    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;

        // Load older messages when scrolled to top
        if (el.scrollTop === 0 && hasMore && !loadingMore) {
            loadOlderMessages();
        }
    }, [hasMore, loadingMore]);

    const loadOlderMessages = useCallback(async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const res = await axios.get(
                `/chat/conversations/${conversationId}/messages`,
                { params: { page: nextPage } }
            );
            const older = res.data.data ?? [];
            if (older.length === 0) {
                setHasMore(false);
            } else {
                const el = containerRef.current;
                const prevScrollHeight = el?.scrollHeight ?? 0;
                setMessages((prev) => [...older, ...prev]);
                setPage(nextPage);
                // Restore scroll position after prepend
                requestAnimationFrame(() => {
                    if (el) {
                        el.scrollTop = el.scrollHeight - prevScrollHeight;
                    }
                });
            }
        } catch {
            // silently ignore
        } finally {
            setLoadingMore(false);
        }
    }, [conversationId, page]);

    // Initial fetch
    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            try {
                const res = await axios.get(
                    `/chat/conversations/${conversationId}/messages`,
                    { params: { page: 1 } }
                );
                if (!cancelled) {
                    const data = res.data.data ?? [];
                    setMessages(data);
                    setHasMore((res.data.last_page ?? 1) > 1);
                    setPage(1);
                    setTimeout(scrollToBottom, 50);
                }
            } catch {
                // silently ignore
            }
            // Mark as read
            try {
                await axios.post(`/chat/conversations/${conversationId}/read`);
            } catch {
                // silently ignore
            }
        };
        init();
        return () => { cancelled = true; };
    }, [conversationId]);

    // Listen for incoming messages via Echo
    useEffect(() => {
        if (!echoChannel) return;
        
        const messageHandler = (event) => {
            // Skip broadcast if it's from the current user (already handled optimistically)
            if (event.sender_id === currentUser.id) return;
            
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === event.id)) return prev;
                return [...prev, event];
            });
            
            // Mark as read immediately since the chat is open and user is viewing
            axios.post(`/chat/conversations/${conversationId}/read`).catch(() => {});
            
            if (isNearBottomRef.current) {
                setTimeout(scrollToBottom, 50);
            }
        };
        
        const readHandler = (event) => {
            // Other user read messages
            if (event.user_id !== currentUser.id) {
                setOtherUserReadAt(event.read_at);
            }
        };
        
        echoChannel.listen('.message.sent', messageHandler);
        echoChannel.listen('.messages.read', readHandler);
        
        return () => {
            echoChannel.stopListening('.message.sent', messageHandler);
            echoChannel.stopListening('.messages.read', readHandler);
        };
    }, [echoChannel, currentUser.id, conversationId, scrollToBottom]);

    const handleSend = async (body) => {
        const tempId = `pending-${Date.now()}`;
        const clientKey = `client-${Date.now()}-${Math.random()}`;
        const optimistic = {
            id: tempId,
            clientKey,
            conversation_id: conversationId,
            sender_id: currentUser.id,
            sender_name: `${currentUser.first_name} ${currentUser.last_name}`,
            body,
            created_at: new Date().toISOString(),
            pending: true,
        };
        setMessages((prev) => [...prev, optimistic]);
        setTimeout(scrollToBottom, 50);

        try {
            const res = await axios.post('/chat/messages', {
                conversation_id: conversationId,
                body,
            });
            setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? { ...res.data, clientKey } : m))
            );
        } catch {
            setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? { ...m, pending: false, error: true } : m))
            );
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Message list */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-3 space-y-2"
            >
                {loadingMore && (
                    <p className="text-center text-xs text-gray-400 py-1">Loading…</p>
                )}
                {messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUser.id;
                    const key = msg.clientKey || msg.id;
                    return (
                        <div
                            key={key}
                            className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm break-words ${
                                    isOwn
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                } ${msg.pending ? 'opacity-60' : ''}`}
                                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                            >
                                {msg.body}
                            </div>
                            <span className="text-xs text-gray-400 mt-0.5">
                                {formatTime(msg.created_at)}
                            </span>
                            {msg.error && (
                                <span className="text-xs text-red-500">Failed to send</span>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
