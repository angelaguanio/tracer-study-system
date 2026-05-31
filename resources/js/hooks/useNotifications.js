import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

let pusherInstance = null;

function getPusher() {
    if (!pusherInstance) {
        pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        });
    }
    return pusherInstance;
}


export function useNotifications(userRole,userId) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/notifications');
            setNotifications(res.data.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await axios.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    const markRead = useCallback(async (id) => {
        await axios.post(`/notifications/${id}/read`);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllRead = useCallback(async () => {
        await axios.post('/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    }, []);

    useEffect(() => {
        fetchUnreadCount();

        const pusher = getPusher();

        // Role channel (admin or coordinator)
        const roleChannel = pusher.subscribe(`role.${userRole}`);
        roleChannel.bind('notification.created', (data) => {
            fetchNotifications();
            setUnreadCount(prev => prev + 1);
        });

        // User-specific channel (for coordinator approval/rejection notifs)
        const userChannel = pusher.subscribe(`user.${userId}`);
        userChannel.bind('notification.created', (data) => {
            fetchNotifications();
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            roleChannel.unbind_all();
            userChannel.unbind_all();
            pusher.unsubscribe(`role.${userRole}`);
            pusher.unsubscribe(`user.${userId}`);
        };
    }, [userRole, userId]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markRead,
        markAllRead,
    };
}