import { useEffect, useState, useCallback } from 'react';
import echo from '@/echo';
import axios from 'axios';

export function useNotifications(userRole, userId) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const clearBadge = useCallback(() => {
        setUnreadCount(0);
    }, []);

    
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

        // Use Echo for notifications (now using Pusher)
        const roleChannel = echo.channel(`role.${userRole}`);
        roleChannel.listen('notification.created', () => {
            fetchNotifications();
            setUnreadCount(prev => prev + 1);
        });

        // User-specific channel (for coordinator approval/rejection notifs)
        const userChannel = echo.channel(`user.${userId}`);
        userChannel.listen('notification.created', () => {
            fetchNotifications();
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            echo.leaveChannel(`role.${userRole}`);
            echo.leaveChannel(`user.${userId}`);
        };
    }, [userRole, userId, fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markRead,
        markAllRead,
        clearBadge,
    };
}