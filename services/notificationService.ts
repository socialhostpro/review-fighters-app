import { AffiliateNotification } from '../types';
import { mockAffiliateNotifications } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

let affiliateNotificationsStore: AffiliateNotification[] = [...mockAffiliateNotifications];

export const notificationService = {
  getNotificationsForAffiliate: async (affiliateId: string): Promise<AffiliateNotification[]> => {
    await delay(300);
    // Filter notifications for the specific affiliate and sort by timestamp (newest first)
    return affiliateNotificationsStore
      .filter(notif => notif.recipientAffiliateId === affiliateId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  markAffiliateNotificationAsRead: async (notificationId: string): Promise<AffiliateNotification | null> => {
    await delay(100);
    const index = affiliateNotificationsStore.findIndex(n => n.notificationID === notificationId);
    if (index > -1) {
      affiliateNotificationsStore[index].isRead = true;
      return { ...affiliateNotificationsStore[index] };
    }
    return null;
  },
  
  // Placeholder for creating notifications if needed by other services
  createAffiliateNotification: async (notificationData: Omit<AffiliateNotification, 'notificationID' | 'timestamp' | 'isRead'>): Promise<AffiliateNotification> => {
    await delay(100);
    const newNotification: AffiliateNotification = {
      ...notificationData,
      notificationID: `AFF_NOTIF_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    affiliateNotificationsStore.push(newNotification);
    return { ...newNotification };
  }
};
