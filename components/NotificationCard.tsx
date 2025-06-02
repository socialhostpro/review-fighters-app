import React from 'react';
import { AffiliateNotification } from '../types';
import Button from './Button';
import { Bell, Info, CheckCircle } from 'lucide-react';

interface NotificationCardProps {
  notification: AffiliateNotification;
  onMoreInfo: (query: string) => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMoreInfo, onMarkAsRead }) => {
  const severityClasses = {
    Info: 'bg-blue-50 border-blue-500 text-blue-700',
    Warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    Critical: 'bg-red-50 border-red-500 text-red-700',
  };

  const handleMoreInfoClick = () => {
    if (notification.relatedQuery) {
      onMoreInfo(notification.relatedQuery);
    }
    if (!notification.isRead) {
        onMarkAsRead(notification.notificationID);
    }
  };
  
  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if button is separate
    if (!notification.isRead) {
        onMarkAsRead(notification.notificationID);
    }
  };

  return (
    <div 
        className={`p-3 mb-3 rounded-lg shadow-md border-l-4 relative ${severityClasses[notification.severity] || 'bg-gray-50 border-gray-500 text-gray-700'} ${notification.isRead ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start">
        <Bell size={18} className={`mr-2 mt-0.5 flex-shrink-0 ${severityClasses[notification.severity].split(' ')[2] /* Get text color */}`} />
        <div className="flex-grow">
          <p className="text-sm font-medium">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
        {!notification.isRead && (
            <button
                onClick={handleMarkAsReadClick}
                className="p-1 text-gray-400 hover:text-green-500 absolute top-2 right-2"
                title="Mark as read"
            >
                <CheckCircle size={16} />
            </button>
        )}
      </div>
      {notification.relatedQuery && (
        <div className="mt-2 text-right">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleMoreInfoClick} 
            className={`text-xs ${severityClasses[notification.severity].split(' ')[2]}`}
            leftIcon={<Info size={14}/>}
          >
            More Info
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
