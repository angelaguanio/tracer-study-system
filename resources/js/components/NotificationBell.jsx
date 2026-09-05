// resources/js/Components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';


export default function NotificationBell({ className = "", notifications: sharedNotifications, iconSize = 22 }) {
    const { auth } = usePage().props;

    // Don't render if not authenticated
    if (!auth?.user) return null;
   
    const [open, setOpen] = useState(false);

    const localNotifications = useNotifications(
        auth.user.user_role,
        auth.user.id
    );
    
    const {
        notifications,
        unreadCount,
        loading,
        loadingMore,
        hasMore,
        fetchNotifications,
        loadMore,
        markRead,
        markAllRead,
        markSeen,
    } = sharedNotifications ?? localNotifications;

    const listRef = useRef(null);

    // Trigger loadMore when user scrolls near the bottom of the list
    const handleScroll = () => {
        const el = listRef.current;
        if (!el) return;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
            if (hasMore && !loadingMore) loadMore();
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchNotifications();
        markSeen(); // persists seen timestamp to DB so count stays 0 on refresh
    };

    const getNotificationRoute = (notification) => {
        const userRole = auth.user.user_role;
        const { type, data } = notification;

        switch (type) {
            case 'survey_answered':
                if (userRole === 'admin') {
                    // Go directly to the specific user's survey response
                    return data.survey_id && data.alumni_id 
                        ? route('admin.admin.survey-response.view', [data.survey_id, data.alumni_id])
                        : route('admin.admin.survey-response.index');
                } else if (userRole === 'coordinator') {
                    // Go directly to the specific user's survey response
                    return data.survey_id && data.alumni_id 
                        ? route('coordinator.coordinator.survey-response.view', [data.survey_id, data.alumni_id])
                        : route('coordinator.coordinator.survey-response.index');
                }
                break;

            case 'alumni_registered':
                if (userRole === 'admin') {
                    // Go directly to the new alumni's profile if we have their ID
                    return data.alumni_id 
                        ? route('admin.alumni.show', data.alumni_id)
                        : route('admin.alumni.index');
                } else if (userRole === 'coordinator') {
                    // Go directly to the new alumni's profile if we have their ID
                    return data.alumni_id 
                        ? route('coordinator.alumni.show', data.alumni_id)
                        : route('coordinator.alumni.index');
                }
                break;

            case 'inquiry_received':
                if (userRole === 'admin') {
                    return route('admin.inquiries.index');
                } else if (userRole === 'coordinator') {
                    return route('coordinator.inquiries.index');
                }
                break;

            case 'announcement_pending':
                // Go directly to the specific announcement for review
                return data.announcement_id 
                    ? route('admin.announcement.show', data.announcement_id)
                    : route('admin.announcement.index');

            case 'announcement_approved':
            case 'announcement_rejected':
                return data.announcement_id
                    ? route('coordinator.announcement.show', data.announcement_id)
                    : route('coordinator.announcement.index');

            case 'announcement_revision':
                // Coordinator gets this — go directly to that announcement to edit it
                return data.announcement_id
                    ? route('coordinator.announcement.show', data.announcement_id)
                    : route('coordinator.announcement.index');

            case 'announcement_resubmitted':
                // Admin gets this — go directly to that announcement to review it
                return data.announcement_id
                    ? route('admin.announcement.show', data.announcement_id)
                    : route('admin.announcement.index');

            case 'announcement_published':
                return data.announcement_id
                    ? route('alumna.announcement.view', data.announcement_id)
                    : route('alumna.announcements');
            
            case 'inquiry_replied':
                return route('alumna.inquiries.index'); // or a specific-thread route if you have one
            
            case 'survey_published':
                if (data.survey_type === 'tracer') {
                    return route('alumna.questionnaire');
                }
                return data.survey_id
                    ? route('alumna.surveys.show', data.survey_id)
                    : route('alumna.surveys.index');

            case 'survey_completed':
                return route('alumna.questionnaire');

            default:
                // Default to dashboard
                if (userRole === 'admin') {
                    return route('admin.dashboard');
                } else if (userRole === 'coordinator') {
                    return route('coordinator.dashboard');
                } else if (userRole === 'alumna') {
                    return route('alumna.home');
                }
        }

        return null;
    };

    const handleNotificationClick = (notification) => {
        // Mark as read if not already read
        if (!notification.is_read) {
            markRead(notification.id);
        }

        // Navigate to the appropriate page
        const targetRoute = getNotificationRoute(notification);
        if (targetRoute) {
            setOpen(false); // Close the notification dropdown
            router.visit(targetRoute);
        }
    };

    const icons = {
        survey_answered: '📋',
        alumni_registered: '👤',
        announcement_pending: '📢',
        announcement_approved: '✅',
        announcement_rejected: '❌',
        inquiry_received: '💬',
        announcement_revision: '✏️',
        announcement_resubmitted: '🔄', 
        announcement_published: '📢',
        inquiry_replied: '💬',
        survey_published: '📋',
        survey_completed: '✅',
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                if (open) {
                    setOpen(false);
                    
                } else {
                    handleOpen();
                }
            }}
            className={`relative p-2 rounded-full cursor-pointer ${className}`}
            >
                <Bell size={iconSize} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
              <>
              {/* Backdrop — mobile only */}
              <div
                  className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                  onClick={() => {
                      setOpen(false);
                      
                  }}
              />

              <div
                  className="
                      fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl
                      max-h-[80vh]
                      sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2
                      sm:w-96 sm:rounded-xl sm:max-h-96
                      bg-white shadow-xl border overflow-hidden flex flex-col
                  "
              >
                  {/* Drag handle — mobile only */}
                  <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
                      <span className="w-10 h-1.5 bg-gray-300 rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center px-4 py-3 border-b shrink-0">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button
                          onClick={() => {
                              markAllRead();
                             
                          }}
                          className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                          Mark all as read
                      </button>
                  </div>

                  {/* List */}
                  <div ref={listRef} onScroll={handleScroll} className="overflow-y-auto divide-y flex-1">
                      {loading && (
                          <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
                      )}
                      {!loading && notifications.length === 0 && (
                          <p className="text-center text-sm text-gray-400 py-6">No notifications yet</p>
                      )}
                      {!loading && notifications.map(notif => (
                          <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                                  !notif.is_read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                              }`}
                              title="Click to view details"
                          >
                              <span className="text-xl mt-0.5">{icons[notif.type] ?? '🔔'}</span>
                              <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notif.created_at}</p>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                  {!notif.is_read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mb-1" />
                                  )}
                                  <span className="text-xs text-gray-400">→</span>
                              </div>
                          </div>
                      ))}

                      {/* Load more indicator */}
                      {loadingMore && (
                          <p className="text-center text-xs text-gray-400 py-3">Loading more...</p>
                      )}
                      {!loading && !loadingMore && !hasMore && notifications.length > 0 && (
                          <p className="text-center text-xs text-gray-400 py-3">You're all caught up</p>
                      )}
                  </div>
              </div>
          </>
            )}
        </div>
    );
}