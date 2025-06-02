
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService';
import { StaffNotification } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ROUTES } from '../../constants'; // Import ROUTES

const NotificationItem: React.FC<{ notification: StaffNotification; onMarkAsRead: (id: string) => void }> = 
  ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate(); // Hook for navigation

  const severityColor = {
    Info: 'border-blue-500 bg-blue-50',
    Warning: 'border-yellow-500 bg-yellow-50',
    Critical: 'border-red-500 bg-red-50',
  };

  const handleNotificationClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.notificationID);
    }
    // Navigation logic
    if (notification.deepLinkViewName && notification.deepLinkRowID) {
      // Example: Construct path like /staff/tasks?taskId=TASK_001
      // This requires ROUTES to have a general path and then we append query params
      // For now, a simple navigation based on a known view name
      const pathKey = notification.deepLinkViewName as keyof typeof ROUTES;
      if (ROUTES[pathKey]) {
        navigate(`${ROUTES[pathKey]}?id=${notification.deepLinkRowID}`); // Generic ?id=
      } else {
        console.warn("Deeplink view name not found in ROUTES:", notification.deepLinkViewName);
      }
    } else if (notification.deepLinkViewName) {
      const pathKey = notification.deepLinkViewName as keyof typeof ROUTES;
       if (ROUTES[pathKey]) {
        navigate(ROUTES[pathKey]);
      } else {
        console.warn("Deeplink view name not found in ROUTES:", notification.deepLinkViewName);
      }
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow-md border-l-4 ${severityColor[notification.severity] || 'border-gray-300'} ${notification.isRead ? 'opacity-70 bg-gray-50' : 'bg-surface hover:shadow-lg transition-shadow cursor-pointer'}`}
      onClick={handleNotificationClick}
    >
      <div className="flex justify-between items-start">
        <p className={`text-sm ${notification.isRead ? 'text-textSecondary' : 'text-textPrimary font-medium'}`}>{notification.message}</p>
        {!notification.isRead && (
          <button 
            onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.notificationID);}} 
            className="text-xs text-blue-500 hover:underline p-1"
            title="Mark as read"
          >
            <CheckCircle size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
    </div>
  );
};

const StaffNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user || !user.staffId) {
      setError("User not identified as staff.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await staffService.getNotificationsForStaff(user.staffId);
      setNotifications(fetchedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await staffService.markNotificationAsRead(notificationId);
      // Optimistically update or re-fetch
      setNotifications(prev => 
        prev.map(n => n.notificationID === notificationId ? {...n, isRead: true} : n)
      );
      // Or fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Potentially show an error to the user
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md flex items-center justify-center"><AlertTriangle size={20} className="mr-2"/>{error}</div>;
  }

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);


  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center">
        <Bell size={32} className="text-primary mr-3"/>
        <h1 className="text-3xl font-bold text-textPrimary">My Notifications</h1>
      </div>
      
      {notifications.length === 0 && !isLoading && (
        <p className="text-center text-textSecondary py-10">You have no new notifications.</p>
      )}

      {unreadNotifications.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-textPrimary mb-3">Unread</h2>
          <div className="space-y-3">
            {unreadNotifications.map(notif => (
              <NotificationItem key={notif.notificationID} notification={notif} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        </section>
      )}
      
      {readNotifications.length > 0 && (
         <section className="mt-8">
          <h2 className="text-xl font-semibold text-textSecondary mb-3">Read</h2>
          <div className="space-y-3">
            {readNotifications.map(notif => (
              <NotificationItem key={notif.notificationID} notification={notif} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StaffNotificationsPage;
