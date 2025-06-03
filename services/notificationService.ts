import { AffiliateNotification } from '../types';
import { mockAffiliateNotifications } from '../data/mockData';

// Enhanced notification interfaces
export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationOptions {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClick?: () => void;
  onClose?: () => void;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: any;
  actions?: NotificationAction[];
}

interface SystemNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
  metadata?: any;
}

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

class NotificationService {
  private permission: NotificationPermission = 'default';
  private notifications: SystemNotification[] = [];
  private listeners: ((notifications: SystemNotification[]) => void)[] = [];
  private defaultIcon = '/favicon.ico';
  private soundEnabled = true;
  private affiliateNotificationsStore: AffiliateNotification[] = [...mockAffiliateNotifications];

  constructor() {
    this.checkPermission();
    this.loadNotifications();
  }

  // Browser Notification Methods
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async showBrowserNotification(options: NotificationOptions): Promise<Notification | null> {
    if (!('Notification' in window)) {
      console.warn('Browser notifications not supported');
      return null;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return null;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.message,
        icon: options.icon || this.defaultIcon,
        badge: options.badge,
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || !this.soundEnabled,
        data: options.data,
        actions: options.actions || []
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Failed to show browser notification:', error);
      return null;
    }
  }

  // System Notification Methods
  addSystemNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): SystemNotification {
    const newNotification: SystemNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    return newNotification;
  }

  getNotifications(userId?: string): SystemNotification[] {
    if (userId) {
      return this.notifications.filter(n => !n.userId || n.userId === userId);
    }
    return [...this.notifications];
  }

  getUnreadCount(userId?: string): number {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead(userId?: string): void {
    this.notifications.forEach(notification => {
      if (!userId || !notification.userId || notification.userId === userId) {
        notification.read = true;
      }
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  deleteNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  clearAllNotifications(userId?: string): void {
    if (userId) {
      this.notifications = this.notifications.filter(n => n.userId && n.userId !== userId);
    } else {
      this.notifications = [];
    }
    this.saveNotifications();
    this.notifyListeners();
  }

  // Combined Notification Methods (Browser + System)
  async notify(options: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    userId?: string;
    actionUrl?: string;
    metadata?: any;
    showBrowser?: boolean;
    requireInteraction?: boolean;
  }): Promise<void> {
    const {
      title,
      message,
      type = 'info',
      userId,
      actionUrl,
      metadata,
      showBrowser = true,
      requireInteraction = false
    } = options;

    // Add to system notifications
    this.addSystemNotification({
      type,
      title,
      message,
      userId,
      actionUrl,
      metadata
    });

    // Show browser notification if enabled and page is not visible
    if (showBrowser && document.visibilityState === 'hidden') {
      await this.showBrowserNotification({
        title,
        message,
        requireInteraction,
        tag: `review-fighters-${type}`,
        data: { actionUrl, metadata }
      });
    }
  }

  // Specific notification types
  async notifyNewReview(customerName: string, businessName: string, rating: number, userId?: string): Promise<void> {
    const type = rating >= 4 ? 'success' : rating <= 2 ? 'warning' : 'info';
    await this.notify({
      title: 'New Review',
      message: `${customerName} left a ${rating}-star review for ${businessName}`,
      type,
      userId,
      actionUrl: '/staff/items-to-review',
      metadata: { customerName, businessName, rating }
    });
  }

  async notifyUserRegistration(userName: string, userRole: string, adminUserId?: string): Promise<void> {
    await this.notify({
      title: 'New User Registration',
      message: `${userName} registered as ${userRole}`,
      type: 'info',
      userId: adminUserId,
      actionUrl: '/admin/user-management',
      metadata: { userName, userRole }
    });
  }

  async notifyTaskAssignment(taskTitle: string, staffUserId: string): Promise<void> {
    await this.notify({
      title: 'New Task Assigned',
      message: `You have been assigned: ${taskTitle}`,
      type: 'info',
      userId: staffUserId,
      actionUrl: '/staff/tasks',
      metadata: { taskTitle },
      requireInteraction: true
    });
  }

  async notifySystemAlert(message: string, type: 'warning' | 'error' = 'warning'): Promise<void> {
    await this.notify({
      title: 'System Alert',
      message,
      type,
      showBrowser: true,
      requireInteraction: true
    });
  }

  // Event Listeners
  subscribe(callback: (notifications: SystemNotification[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback([...this.notifications]);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Settings
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('notificationSoundEnabled', JSON.stringify(enabled));
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  setDefaultIcon(iconUrl: string): void {
    this.defaultIcon = iconUrl;
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveNotifications(): void {
    try {
      const notificationsToSave = this.notifications.slice(0, 100);
      localStorage.setItem('systemNotifications', JSON.stringify(notificationsToSave));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem('systemNotifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }

      const soundSetting = localStorage.getItem('notificationSoundEnabled');
      if (soundSetting) {
        this.soundEnabled = JSON.parse(soundSetting);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.notifications = [];
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Legacy affiliate notification methods (maintaining compatibility)
  async getNotificationsForAffiliate(affiliateId: string): Promise<AffiliateNotification[]> {
    await delay(300);
    return this.affiliateNotificationsStore
      .filter(notif => notif.recipientAffiliateId === affiliateId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async markAffiliateNotificationAsRead(notificationId: string): Promise<AffiliateNotification | null> {
    await delay(100);
    const index = this.affiliateNotificationsStore.findIndex(n => n.notificationID === notificationId);
    if (index > -1) {
      this.affiliateNotificationsStore[index].isRead = true;
      return { ...this.affiliateNotificationsStore[index] };
    }
    return null;
  }

  async createAffiliateNotification(notificationData: Omit<AffiliateNotification, 'notificationID' | 'timestamp' | 'isRead'>): Promise<AffiliateNotification> {
    await delay(100);
    const newNotification: AffiliateNotification = {
      ...notificationData,
      notificationID: `AFF_NOTIF_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    this.affiliateNotificationsStore.push(newNotification);
    return { ...newNotification };
  }

  show = (options: NotificationOptions & { actions?: NotificationAction[] }) => {
    // Implementation of show method
    this.notify({
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      showBrowser: true,
      requireInteraction: options.requireInteraction
    });
  };

  notifySupportTicket = async (customerName: string, ticketSubject: string) => {
    await this.notify({
      title: 'New Support Ticket',
      message: `${customerName} submitted a ticket: ${ticketSubject}`,
      type: 'info',
      showBrowser: true,
      requireInteraction: true
    });
  };
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export only SystemNotification type since NotificationOptions is already exported above
export type { SystemNotification };
