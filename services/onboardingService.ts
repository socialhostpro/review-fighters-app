import {
  OnboardingApplication,
  OnboardingBusinessInfo,
  OnboardingSubscription,
  OnboardingNotification,
  OnboardingTask,
  OnboardingStatus,
  OnboardingStage,
  OnboardingNotificationTrigger,
  NotificationType,
  UserRole,
  Priority,
  TaskStatus
} from '../types';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

// In-memory stores for mock onboarding data
let onboardingApplications: OnboardingApplication[] = [];
let onboardingBusinessInfo: OnboardingBusinessInfo[] = [];
let onboardingSubscriptions: OnboardingSubscription[] = [];
let onboardingNotifications: OnboardingNotification[] = [];
let onboardingTasks: OnboardingTask[] = [];

export const onboardingService = {
  // Step 1: Business Owner Signs Up
  initiateOnboarding: async (userId: string, email: string): Promise<OnboardingApplication> => {
    await delay(300);
    
    const applicationId = `APP_${Date.now()}`;
    const newApplication: OnboardingApplication = {
      applicationId,
      userId,
      status: 'Draft',
      currentStage: 'Signup',
      submissionDate: new Date().toISOString(),
      priority: 'Medium'
    };

    onboardingApplications.push(newApplication);

    // Trigger notification to admins and owners
    await onboardingService.sendNotification({
      applicationId,
      trigger: 'Business_Signup',
      recipients: {
        roles: [UserRole.ADMIN, UserRole.OWNER]
      },
      notificationType: 'Both',
      message: `New business owner has started onboarding: ${email}`,
      emailSubject: 'New Business Onboarding Started',
      emailTemplate: 'business_signup'
    });

    return newApplication;
  },

  // Step 2: Complete Business Information
  submitBusinessInfo: async (applicationId: string, businessInfo: Omit<OnboardingBusinessInfo, 'applicationId'>): Promise<OnboardingApplication> => {
    await delay(500);
    
    // Save business info
    const businessInfoRecord: OnboardingBusinessInfo = {
      ...businessInfo,
      applicationId
    };
    onboardingBusinessInfo.push(businessInfoRecord);

    // Update application status
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    onboardingApplications[appIndex] = {
      ...onboardingApplications[appIndex],
      status: 'Information_Complete',
      currentStage: 'Subscription',
      informationCompleteDate: new Date().toISOString()
    };

    return onboardingApplications[appIndex];
  },

  // Step 3: Confirm Subscription
  confirmSubscription: async (applicationId: string, subscriptionInfo: Omit<OnboardingSubscription, 'applicationId' | 'confirmedDate'>): Promise<OnboardingApplication> => {
    await delay(700);
    
    // Save subscription info
    const subscriptionRecord: OnboardingSubscription = {
      ...subscriptionInfo,
      applicationId,
      confirmedDate: new Date().toISOString()
    };
    onboardingSubscriptions.push(subscriptionRecord);

    // Update application status
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    onboardingApplications[appIndex] = {
      ...onboardingApplications[appIndex],
      status: 'Subscription_Confirmed',
      currentStage: 'Review',
      subscriptionConfirmedDate: new Date().toISOString()
    };

    const application = onboardingApplications[appIndex];
    const businessInfo = onboardingBusinessInfo.find(bi => bi.applicationId === applicationId);

    // Send welcome notification to customer
    await onboardingService.sendNotification({
      applicationId,
      trigger: 'Information_Complete',
      recipients: {
        userIds: [application.userId]
      },
      notificationType: 'Both',
      message: `Welcome to Review Fighters! Your application is being reviewed.`,
      emailSubject: 'Welcome to Review Fighters - Application Under Review',
      emailTemplate: 'customer_welcome'
    });

    // Notify admins and owners
    await onboardingService.sendNotification({
      applicationId,
      trigger: 'Subscription_Confirmed',
      recipients: {
        roles: [UserRole.ADMIN, UserRole.OWNER]
      },
      notificationType: 'Both',
      message: `Business application ready for review: ${businessInfo?.businessName || 'Unknown Business'}`,
      emailSubject: 'New Business Application Ready for Review',
      emailTemplate: 'application_ready_for_review'
    });

    // Assign to all staff for review and create review tasks
    await onboardingService.assignForReview(applicationId);

    return application;
  },

  // Step 4: Assign to Staff for Review
  assignForReview: async (applicationId: string): Promise<void> => {
    await delay(300);
    
    const application = onboardingApplications.find(app => app.applicationId === applicationId);
    if (!application) throw new Error('Application not found');

    const businessInfo = onboardingBusinessInfo.find(bi => bi.applicationId === applicationId);

    // Create tasks for all staff members (this would typically fetch from staff database)
    const staffMembers = [
      { staffId: 'STAFF_001', name: 'Sarah Staff' },
      { staffId: 'STAFF_002', name: 'Mike Manager' },
      { staffId: 'STAFF_003', name: 'Alice Admin' }
    ];

    for (const staff of staffMembers) {
      const taskId = `TASK_${Date.now()}_${staff.staffId}`;
      const newTask: OnboardingTask = {
        taskId,
        applicationId,
        assignedToStaffId: staff.staffId,
        title: `Review Business Application: ${businessInfo?.businessName || 'Unknown Business'}`,
        description: `Review and approve/reject the onboarding application for ${businessInfo?.businessName}. Check business information, subscription details, and determine if they meet our criteria.`,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        status: 'To Do',
        priority: 'High',
        createdDate: new Date().toISOString()
      };
      onboardingTasks.push(newTask);
    }

    // Update application status
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === applicationId);
    onboardingApplications[appIndex] = {
      ...onboardingApplications[appIndex],
      status: 'Under_Review'
    };

    // Notify owners and staff
    await onboardingService.sendNotification({
      applicationId,
      trigger: 'Assigned_For_Review',
      recipients: {
        roles: [UserRole.OWNER, UserRole.STAFF, UserRole.ADMIN]
      },
      notificationType: 'Both',
      message: `New business application assigned for review: ${businessInfo?.businessName || 'Unknown Business'}`,
      emailSubject: 'New Business Application Requires Review',
      emailTemplate: 'application_assigned_for_review'
    });
  },

  // Step 5: Staff Accepts Review Task
  acceptReviewTask: async (taskId: string, staffId: string): Promise<OnboardingTask> => {
    await delay(200);
    
    const taskIndex = onboardingTasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    const task = onboardingTasks[taskIndex];
    if (task.assignedToStaffId !== staffId) {
      throw new Error('Task not assigned to this staff member');
    }

    // Update task status
    onboardingTasks[taskIndex] = {
      ...task,
      status: 'In Progress',
      startedDate: new Date().toISOString()
    };

    // Update application to show who's reviewing
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === task.applicationId);
    if (appIndex !== -1) {
      onboardingApplications[appIndex] = {
        ...onboardingApplications[appIndex],
        assignedToStaffId: staffId,
        reviewStartedDate: new Date().toISOString()
      };
    }

    return onboardingTasks[taskIndex];
  },

  // Step 6: Complete Review (Approve/Reject)
  completeReview: async (taskId: string, approved: boolean, notes?: string, rejectionReason?: string): Promise<OnboardingApplication> => {
    await delay(400);
    
    const taskIndex = onboardingTasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    const task = onboardingTasks[taskIndex];
    
    // Update task
    onboardingTasks[taskIndex] = {
      ...task,
      status: 'Completed',
      completedDate: new Date().toISOString(),
      notes
    };

    // Update application
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === task.applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    const newStatus: OnboardingStatus = approved ? 'Approved' : 'Rejected';
    const newStage: OnboardingStage = approved ? 'Completion' : 'Review';

    onboardingApplications[appIndex] = {
      ...onboardingApplications[appIndex],
      status: newStatus,
      currentStage: newStage,
      reviewCompletedDate: new Date().toISOString(),
      notes,
      ...(approved ? { approvalDate: new Date().toISOString() } : { 
        rejectionDate: new Date().toISOString(),
        rejectionReason
      })
    };

    const application = onboardingApplications[appIndex];
    const businessInfo = onboardingBusinessInfo.find(bi => bi.applicationId === application.applicationId);

    // Send notifications
    if (approved) {
      // Notify customer of approval
      await onboardingService.sendNotification({
        applicationId: application.applicationId,
        trigger: 'Review_Accepted',
        recipients: {
          userIds: [application.userId]
        },
        notificationType: 'Both',
        message: `Congratulations! Your business application has been approved. Welcome to Review Fighters!`,
        emailSubject: 'Application Approved - Welcome to Review Fighters!',
        emailTemplate: 'application_approved'
      });

      // Notify admins and owners
      await onboardingService.sendNotification({
        applicationId: application.applicationId,
        trigger: 'Review_Accepted',
        recipients: {
          roles: [UserRole.ADMIN, UserRole.OWNER]
        },
        notificationType: 'Both',
        message: `Business application approved: ${businessInfo?.businessName || 'Unknown Business'}`,
        emailSubject: 'Business Application Approved',
        emailTemplate: 'application_approved_internal'
      });

      // Mark as active
      setTimeout(async () => {
        await onboardingService.activateAccount(application.applicationId);
      }, 1000);

    } else {
      // Notify customer of rejection
      await onboardingService.sendNotification({
        applicationId: application.applicationId,
        trigger: 'Review_Rejected',
        recipients: {
          userIds: [application.userId]
        },
        notificationType: 'Both',
        message: `We're sorry, but your business application has been rejected. ${rejectionReason || 'Please contact support for more information.'}`,
        emailSubject: 'Application Status Update',
        emailTemplate: 'application_rejected'
      });

      // Notify admins and owners
      await onboardingService.sendNotification({
        applicationId: application.applicationId,
        trigger: 'Review_Rejected',
        recipients: {
          roles: [UserRole.ADMIN, UserRole.OWNER]
        },
        notificationType: 'Both',
        message: `Business application rejected: ${businessInfo?.businessName || 'Unknown Business'}`,
        emailSubject: 'Business Application Rejected',
        emailTemplate: 'application_rejected_internal'
      });
    }

    return application;
  },

  // Final step: Activate Account
  activateAccount: async (applicationId: string): Promise<OnboardingApplication> => {
    await delay(200);
    
    const appIndex = onboardingApplications.findIndex(app => app.applicationId === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    onboardingApplications[appIndex] = {
      ...onboardingApplications[appIndex],
      status: 'Active'
    };

    const application = onboardingApplications[appIndex];

    // Send final welcome notification
    await onboardingService.sendNotification({
      applicationId,
      trigger: 'Onboarding_Complete',
      recipients: {
        userIds: [application.userId]
      },
      notificationType: 'Both',
      message: `Your account is now active! You can now access all Review Fighters features.`,
      emailSubject: 'Account Activated - Get Started with Review Fighters',
      emailTemplate: 'account_activated'
    });

    return application;
  },

  // Notification System
  sendNotification: async (notificationData: Omit<OnboardingNotification, 'notificationId' | 'sentDate' | 'isRead'>): Promise<OnboardingNotification> => {
    await delay(100);
    
    const notification: OnboardingNotification = {
      ...notificationData,
      notificationId: `NOTIF_${Date.now()}`,
      sentDate: new Date().toISOString(),
      isRead: false
    };

    onboardingNotifications.push(notification);
    console.log(`📧 Notification sent: ${notification.message}`);
    
    return notification;
  },

  // Query Methods
  getApplication: async (applicationId: string): Promise<OnboardingApplication | null> => {
    await delay(100);
    return onboardingApplications.find(app => app.applicationId === applicationId) || null;
  },

  getApplicationByUser: async (userId: string): Promise<OnboardingApplication | null> => {
    await delay(100);
    return onboardingApplications.find(app => app.userId === userId) || null;
  },

  getBusinessInfo: async (applicationId: string): Promise<OnboardingBusinessInfo | null> => {
    await delay(100);
    return onboardingBusinessInfo.find(bi => bi.applicationId === applicationId) || null;
  },

  getSubscription: async (applicationId: string): Promise<OnboardingSubscription | null> => {
    await delay(100);
    return onboardingSubscriptions.find(sub => sub.applicationId === applicationId) || null;
  },

  getTasksForStaff: async (staffId: string): Promise<OnboardingTask[]> => {
    await delay(200);
    return onboardingTasks.filter(task => task.assignedToStaffId === staffId);
  },

  getAllPendingApplications: async (): Promise<OnboardingApplication[]> => {
    await delay(200);
    return onboardingApplications.filter(app => 
      ['Under_Review', 'Subscription_Confirmed'].includes(app.status)
    );
  },

  getNotificationsForUser: async (userId: string): Promise<OnboardingNotification[]> => {
    await delay(100);
    return onboardingNotifications.filter(notif => 
      notif.recipients.userIds?.includes(userId)
    );
  },

  // Admin methods
  getAllApplications: async (): Promise<OnboardingApplication[]> => {
    await delay(200);
    return [...onboardingApplications];
  },

  getApplicationStats: async (): Promise<{
    total: number;
    draft: number;
    underReview: number;
    approved: number;
    rejected: number;
    active: number;
  }> => {
    await delay(100);
    
    const stats = {
      total: onboardingApplications.length,
      draft: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      active: 0
    };

    onboardingApplications.forEach(app => {
      switch (app.status) {
        case 'Draft':
        case 'Information_Complete':
        case 'Subscription_Confirmed':
          stats.draft++;
          break;
        case 'Under_Review':
          stats.underReview++;
          break;
        case 'Approved':
          stats.approved++;
          break;
        case 'Rejected':
          stats.rejected++;
          break;
        case 'Active':
          stats.active++;
          break;
      }
    });

    return stats;
  }
}; 