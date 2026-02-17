import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const NotificationList = () => {
  const navigate = useNavigate();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_match':
        return <HeartSolid className="h-6 w-6 text-red-500" />;
      case 'new_message':
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />;
      case 'profile_approved':
        return <CheckBadgeIcon className="h-6 w-6 text-green-500" />;
      case 'profile_rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'verification_approved':
        return <ShieldCheckIcon className="h-6 w-6 text-green-500" />;
      case 'verification_rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'guardian_alert':
        return <BellAlertIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <BellAlertIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on type
    switch (notification.type) {
      case 'new_match':
        if (notification.data?.matchId) {
          navigate(`/messages/${notification.data.matchId}`);
        } else {
          navigate('/matches');
        }
        break;
      case 'new_message':
        if (notification.data?.matchId) {
          navigate(`/messages/${notification.data.matchId}`);
        } else {
          navigate('/messages');
        }
        break;
      case 'profile_approved':
      case 'profile_rejected':
        navigate('/profile/me');
        break;
      case 'verification_approved':
      case 'verification_rejected':
        navigate('/verification');
        break;
      case 'guardian_alert':
        if (notification.data?.matchId) {
          navigate(`/messages/${notification.data.matchId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!notifications) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="secondary" className="text-sm">
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`card p-4 cursor-pointer hover:shadow-md transition-all ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium mb-1">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete notification"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BellAlertIcon className="mx-auto h-24 w-24 text-gray-300 stroke-1" />
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              No Notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default NotificationList;
