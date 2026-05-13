import axios from 'axios';
import { useEffect, useState } from 'react';
import PresenceIndicator from './PresenceIndicator';

export default function ConversationList({ currentUser, onSelect, onlineStatus = {}, conversations, setConversations }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/chat/conversations')
            .then((res) => {
                // Admin gets an array; coordinator gets a single object
                const data = Array.isArray(res.data) ? res.data : [res.data];
                setConversations(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                Loading…
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {conversations.map((conv) => {
                const isAdmin = currentUser.user_role === 'admin';
                // For admin view: the other party is the coordinator
                // For coordinator view: the other party is the admin
                const other = isAdmin ? conv.coordinator : conv.admin;
                const otherId = other?.id ?? (isAdmin ? conv.coordinator_id : conv.admin_id);
                const otherName = other
                    ? `${other.first_name ?? ''} ${other.last_name ?? ''}`.trim()
                    : '';
                const unread = conv.unread_count ?? 0;
                const isOnline = onlineStatus[otherId] ?? false;

                return (
                    <li key={conv.id}>
                        <button
                            onClick={() => onSelect(conv)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                            <PresenceIndicator isOnline={isOnline} />
                            <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {otherName || 'Unknown'}
                            </span>
                            {unread > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                                    {unread > 99 ? '99+' : unread}
                                </span>
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
