import { 
  SalesMember, SalesTask, SalesTaskClaim, SalesNotification, SalesTaskStatus, SalesTaskCategory 
} from '../types';
import { 
  mockSalesMembers, mockSalesTasks, mockSalesTaskClaims, mockSalesNotifications 
} from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

// In-memory stores for mock sales data
let salesMembersStore: SalesMember[] = [...mockSalesMembers];
let salesTasksStore: SalesTask[] = [...mockSalesTasks];
let salesTaskClaimsStore: SalesTaskClaim[] = [...mockSalesTaskClaims];
let salesNotificationsStore: SalesNotification[] = [...mockSalesNotifications];

export const salesService = {
  // Sales Member Management
  getSalesMemberDetails: async (salesId: string): Promise<SalesMember | null> => {
    await delay(200);
    return salesMembersStore.find(sm => sm.salesId === salesId) || null;
  },

  getAllSalesMembers: async (): Promise<SalesMember[]> => {
    await delay(300);
    return [...salesMembersStore];
  },

  updateSalesMemberBalance: async (salesId: string, amount: number): Promise<SalesMember> => {
    await delay(200);
    const index = salesMembersStore.findIndex(sm => sm.salesId === salesId);
    if (index === -1) throw new Error('Sales member not found');
    
    salesMembersStore[index].currentBalance += amount;
    salesMembersStore[index].totalEarnings += amount;
    return { ...salesMembersStore[index] };
  },

  // Sales Task Management
  getAvailableTasks: async (salesId?: string): Promise<SalesTask[]> => {
    await delay(300);
    // Return tasks that are available and not at max claims
    return salesTasksStore.filter(task => 
      task.status === 'Available' && 
      task.currentClaims < task.maxClaims &&
      // Don't show tasks already claimed by this sales member
      (!salesId || !salesTaskClaimsStore.some(claim => 
        claim.taskId === task.taskId && claim.salesId === salesId
      ))
    );
  },

  getTasksByCategory: async (category: SalesTaskCategory): Promise<SalesTask[]> => {
    await delay(300);
    return salesTasksStore.filter(task => task.category === category && task.status === 'Available');
  },

  getTaskDetails: async (taskId: string): Promise<SalesTask | null> => {
    await delay(200);
    return salesTasksStore.find(task => task.taskId === taskId) || null;
  },

  // Task Claims Management
  claimTask: async (taskId: string, salesId: string): Promise<SalesTaskClaim> => {
    await delay(300);
    
    // Check if task exists and is available
    const task = salesTasksStore.find(t => t.taskId === taskId);
    if (!task || task.status !== 'Available' || task.currentClaims >= task.maxClaims) {
      throw new Error('Task is not available for claiming');
    }

    // Check if user already claimed this task
    const existingClaim = salesTaskClaimsStore.find(c => c.taskId === taskId && c.salesId === salesId);
    if (existingClaim) {
      throw new Error('You have already claimed this task');
    }

    // Create new claim
    const newClaim: SalesTaskClaim = {
      claimId: `CLAIM_${Date.now()}`,
      taskId,
      salesId,
      claimedDate: new Date().toISOString(),
      status: 'Claimed'
    };

    salesTaskClaimsStore.push(newClaim);

    // Update task current claims
    const taskIndex = salesTasksStore.findIndex(t => t.taskId === taskId);
    salesTasksStore[taskIndex].currentClaims += 1;

    return { ...newClaim };
  },

  getMyTasks: async (salesId: string): Promise<SalesTaskClaim[]> => {
    await delay(300);
    return salesTaskClaimsStore
      .filter(claim => claim.salesId === salesId)
      .sort((a, b) => new Date(b.claimedDate).getTime() - new Date(a.claimedDate).getTime());
  },

  submitTask: async (claimId: string, submissionNotes: string, submissionFiles?: string[]): Promise<SalesTaskClaim> => {
    await delay(300);
    const index = salesTaskClaimsStore.findIndex(c => c.claimId === claimId);
    if (index === -1) throw new Error('Task claim not found');

    salesTaskClaimsStore[index] = {
      ...salesTaskClaimsStore[index],
      submittedDate: new Date().toISOString(),
      submissionNotes,
      submissionFiles: submissionFiles || [],
      status: 'Submitted'
    };

    return { ...salesTaskClaimsStore[index] };
  },

  // Task Review (for staff)
  getTasksForReview: async (): Promise<SalesTaskClaim[]> => {
    await delay(300);
    return salesTaskClaimsStore.filter(claim => claim.status === 'Submitted');
  },

  reviewTask: async (claimId: string, approved: boolean, reviewNotes: string, reviewerStaffId: string): Promise<SalesTaskClaim> => {
    await delay(300);
    const index = salesTaskClaimsStore.findIndex(c => c.claimId === claimId);
    if (index === -1) throw new Error('Task claim not found');

    const claim = salesTaskClaimsStore[index];
    const newStatus: SalesTaskStatus = approved ? 'Approved' : 'Rejected';

    salesTaskClaimsStore[index] = {
      ...claim,
      reviewedDate: new Date().toISOString(),
      reviewerStaffId,
      reviewNotes,
      status: newStatus
    };

    // If approved, add to sales member balance
    if (approved) {
      const task = salesTasksStore.find(t => t.taskId === claim.taskId);
      if (task) {
        await this.updateSalesMemberBalance(claim.salesId, task.reward);
        
        // Mark as paid
        salesTaskClaimsStore[index].paidDate = new Date().toISOString();
        salesTaskClaimsStore[index].paidAmount = task.reward;
        salesTaskClaimsStore[index].status = 'Paid';
      }
    }

    return { ...salesTaskClaimsStore[index] };
  },

  // Notifications
  getNotificationsForSales: async (salesId: string): Promise<SalesNotification[]> => {
    await delay(200);
    return salesNotificationsStore
      .filter(notif => notif.recipientSalesId === salesId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  markNotificationAsRead: async (notificationId: string): Promise<SalesNotification> => {
    await delay(100);
    const index = salesNotificationsStore.findIndex(n => n.notificationId === notificationId);
    if (index === -1) throw new Error('Notification not found');
    
    salesNotificationsStore[index].isRead = true;
    return { ...salesNotificationsStore[index] };
  },

  createNotification: async (notificationData: Omit<SalesNotification, 'notificationId' | 'timestamp' | 'isRead'>): Promise<SalesNotification> => {
    await delay(100);
    const newNotification: SalesNotification = {
      ...notificationData,
      notificationId: `SALES_NOTIF_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    salesNotificationsStore.push(newNotification);
    return { ...newNotification };
  },

  // Statistics
  getSalesStats: async (salesId: string): Promise<{
    totalEarnings: number;
    currentBalance: number;
    tasksCompleted: number;
    tasksInProgress: number;
    averageRating: number;
    recentTasks: SalesTaskClaim[];
  }> => {
    await delay(200);
    const salesMember = await this.getSalesMemberDetails(salesId);
    if (!salesMember) throw new Error('Sales member not found');

    const myTasks = await this.getMyTasks(salesId);
    const tasksInProgress = myTasks.filter(task => 
      ['Claimed', 'In Progress', 'Submitted', 'Under Review'].includes(task.status)
    ).length;

    return {
      totalEarnings: salesMember.totalEarnings,
      currentBalance: salesMember.currentBalance,
      tasksCompleted: salesMember.totalTasksCompleted,
      tasksInProgress,
      averageRating: salesMember.averageRating,
      recentTasks: myTasks.slice(0, 5)
    };
  }
}; 