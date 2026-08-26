import { useEffect, useState, useCallback, useRef } from 'react';
import echo from '@/echo';
import axios from 'axios';

export function useNotifications(userRole, userId) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const currentPage = useRef(1);

    const clearBadge = useCallback(() => {
        setUnreadCount(0);
    }, []);

    const markSeen = useCallback(async () => {
        try {
            await axios.post('/notifications/seen');
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark notifications as seen:', error);
        }
    }, []);

    // Resets to page 1 and replaces the list
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            currentPage.current = 1;
            const res = await axios.get('/notifications', { params: { page: 1 } });
            setNotifications(res.data.data);
            setHasMore(res.data.current_page < res.data.last_page);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Appends next page results (infinite scroll)
    const loadMore = useCallback(async () => {
        if (loadingMore) return;
        try {
            setLoadingMore(true);
            const nextPage = currentPage.current + 1;
            const res = await axios.get('/notifications', { params: { page: nextPage } });
            currentPage.current = nextPage;
            setNotifications(prev => [...prev, ...res.data.data]);
            setHasMore(res.data.current_page < res.data.last_page);
        } catch (error) {
            console.error('Failed to load more notifications:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore]);

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
    }, []);

    const markAllRead = useCallback(async () => {
        await axios.post('/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }, []);

    useEffect(() => {
        fetchUnreadCount();

        const roleChannel = echo.channel(`role.${userRole}`);
        roleChannel.listen('notification.created', () => {
            fetchNotifications();
            setUnreadCount(prev => prev + 1);
        });

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
        loadingMore,
        hasMore,
        fetchNotifications,
        loadMore,
        markRead,
        markAllRead,
        clearBadge,
        markSeen,
    };
}