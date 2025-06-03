import { 
    StaffMember, Task, StaffReviewItem, StaffNotification, SupportTicket, TicketComment, 
    User, UserRole, SubmittedByType 
} from '../types';
import { 
    mockStaffMembers, mockTasks, mockStaffReviewItems, mockStaffNotifications, 
    mockSupportTickets, mockTicketComments, mockUsers
} from '../data/mockData';
import { api } from '../convex/_generated/api';
import convex from '../convex';
import { generateRandomPassword } from '../utils/auth';
import { sendInvitationEmail } from '../utils/email';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

// In-memory stores for mock staff data
let staffMembersStore: StaffMember[] = [...mockStaffMembers];
let tasksStore: Task[] = [...mockTasks];
let staffReviewItemsStore: StaffReviewItem[] = [...mockStaffReviewItems];
let staffNotificationsStore: StaffNotification[] = [...mockStaffNotifications];
let supportTicketsStore: SupportTicket[] = [...mockSupportTickets];
let ticketCommentsStore: TicketComment[] = [...mockTicketComments];

export const staffService = {
  // Staff Member Management (Primarily for Admin view, or staff viewing their own limited profile)
  getStaffMemberDetails: async (staffId: string): Promise<StaffMember | null> => {
    await delay(200);
    return staffMembersStore.find(sm => sm.staffId === staffId) || null;
  },

  getAllStaffMembers: async (): Promise<StaffMember[]> => {
    try {
      const staffMembers = await convex.query(api.staff.getAllStaffMembers);
      return staffMembers.map(staff => ({
        staffId: staff._id,
        userId: staff.userId,
        name: staff.name,
        email: staff.email,
        internalRole: staff.internalRole,
        team: staff.team,
      }));
    } catch (error) {
      console.error('Error fetching staff members:', error);
      throw error;
    }
  },

  // Task Management
  getTasksForStaff: async (staffId: string): Promise<Task[]> => {
    await delay(400);
    return tasksStore.filter(task => task.assignedToStaffId === staffId || !task.assignedToStaffId); // Show unassigned too or filter as needed
  },
  
  getAllTasks: async (): Promise<Task[]> => { // For managers/admins
    await delay(400);
    return [...tasksStore];
  },

  createTask: async (taskData: Omit<Task, 'taskID' | 'createdDate'>): Promise<Task> => {
    await delay(300);
    const newTask: Task = {
      ...taskData,
      taskID: `TASK_${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    tasksStore.push(newTask);
    return { ...newTask };
  },

  updateTask: async (taskId: string, taskUpdate: Partial<Task>): Promise<Task> => {
    await delay(300);
    const index = tasksStore.findIndex(t => t.taskID === taskId);
    if (index === -1) throw new Error('Task not found');
    tasksStore[index] = { ...tasksStore[index], ...taskUpdate };
    return { ...tasksStore[index] };
  },

  // Staff Review Item Management
  getReviewItemsForStaff: async (staffId: string): Promise<StaffReviewItem[]> => {
    await delay(400);
    return staffReviewItemsStore.filter(item => item.assignedToStaffId === staffId || item.status === 'Pending Assignment');
  },
  
  getAllReviewItems: async (): Promise<StaffReviewItem[]> => { // For managers/admins
     await delay(400);
     return [...staffReviewItemsStore];
  },

  updateStaffReviewItemStatus: async (itemId: string, status: StaffReviewItem['status'], comments?: string): Promise<StaffReviewItem> => {
    await delay(300);
    const index = staffReviewItemsStore.findIndex(item => item.reviewItemID === itemId);
    if (index === -1) throw new Error('Review item not found');
    staffReviewItemsStore[index].status = status;
    if (comments) staffReviewItemsStore[index].reviewerComments = comments;
    if (status === 'Approved' || status === 'Rejected') {
        staffReviewItemsStore[index].completedDate = new Date().toISOString();
    }
    return { ...staffReviewItemsStore[index] };
  },

  // Notification Management
  getNotificationsForStaff: async (staffId: string): Promise<StaffNotification[]> => {
    await delay(200);
    return staffNotificationsStore.filter(notif => notif.recipientStaffId === staffId && !notif.isRead)
      .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest first
  },

  markNotificationAsRead: async (notificationId: string): Promise<StaffNotification> => {
    await delay(100);
    const index = staffNotificationsStore.findIndex(n => n.notificationID === notificationId);
    if (index === -1) throw new Error('Notification not found');
    staffNotificationsStore[index].isRead = true;
    return { ...staffNotificationsStore[index] };
  },

  // Support Ticket Management
  getSupportTicketsForStaff: async (staffId: string): Promise<SupportTicket[]> => { // Staff sees tickets assigned to them or unassigned
    await delay(500);
    return supportTicketsStore.filter(ticket => 
        ticket.assignedToStaffId === staffId || 
        (!ticket.assignedToStaffId && ticket.status === 'New') // Show new unassigned tickets
    ).sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  },

  getSupportTicketsForUser: async (userId: string): Promise<SupportTicket[]> => {
    await delay(500);
    return supportTicketsStore.filter(ticket => 
        (ticket.submittedById === userId && (ticket.submittedByType === 'User' || ticket.submittedByType === 'Affiliate'))
    ).sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  },
  
  getAllSupportTickets: async (): Promise<SupportTicket[]> => { // For managers/admins
    await delay(500);
    return [...supportTicketsStore].sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  },

  getSupportTicketById: async (ticketId: string): Promise<SupportTicket | null> => {
    await delay(200);
    return supportTicketsStore.find(t => t.ticketID === ticketId) || null;
  },
  
  getCommentsForTicket: async (ticketId: string): Promise<TicketComment[]> => {
    await delay(200);
    return ticketCommentsStore.filter(c => c.ticketID_Ref === ticketId)
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Oldest first for chat flow
  },

  addTicketComment: async (commentData: Omit<TicketComment, 'commentID' | 'timestamp'>): Promise<TicketComment> => {
    await delay(300);
    const newComment: TicketComment = {
      ...commentData, // Includes ticketID_Ref, commentText, isInternalNote, and potentially commentByStaffId, commentByAffiliateId, or commentByUserId
      commentID: `CMT_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    ticketCommentsStore.push(newComment);
    // Also update ticket's lastUpdateDate
    const ticketIndex = supportTicketsStore.findIndex(t => t.ticketID === newComment.ticketID_Ref);
    if (ticketIndex > -1) supportTicketsStore[ticketIndex].lastUpdateDate = newComment.timestamp;
    return { ...newComment };
  },

  updateSupportTicket: async (ticketId: string, ticketUpdate: Partial<SupportTicket>): Promise<SupportTicket> => {
    await delay(300);
    const index = supportTicketsStore.findIndex(t => t.ticketID === ticketId);
    if (index === -1) throw new Error('Support ticket not found');
    supportTicketsStore[index] = { ...supportTicketsStore[index], ...ticketUpdate, lastUpdateDate: new Date().toISOString() };
    return { ...supportTicketsStore[index] };
  },
  
  createSupportTicket: async (ticketData: Omit<SupportTicket, 'ticketID' | 'creationDate' | 'lastUpdateDate'>): Promise<SupportTicket> => {
    await delay(300);
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
        ...ticketData, // Includes subject, description, status, priority, submittedByType, submittedById, assignedToStaffId, category
        ticketID: `TKT_${Date.now()}`,
        creationDate: now,
        lastUpdateDate: now,
    };
    supportTicketsStore.push(newTicket);
    return {...newTicket};
  },

  createStaffMember: async (staffData: Partial<StaffMember> & { sendInvite?: boolean }): Promise<StaffMember> => {
    try {
      // First create the user account
      const userId = await convex.mutation(api.auth.createUser, {
        email: staffData.email!,
        name: staffData.name!,
        role: UserRole.STAFF,
        sendInvite: staffData.sendInvite,
      });

      // Then create the staff record
      const staffId = await convex.mutation(api.staff.createStaffMember, {
        userId,
        name: staffData.name!,
        email: staffData.email!,
        internalRole: staffData.internalRole || 'Support',
        team: staffData.team || '',
      });

      return {
        staffId,
        userId,
        name: staffData.name!,
        email: staffData.email!,
        internalRole: staffData.internalRole || 'Support',
        team: staffData.team || '',
      };
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  },

  updateStaffMember: async (staffId: string, staffData: Partial<StaffMember>): Promise<void> => {
    try {
      await convex.mutation(api.staff.updateStaffMember, {
        staffId,
        ...staffData,
      });
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  resetStaffPassword: async (staffId: string): Promise<void> => {
    try {
      // Get staff member details
      const staff = await convex.query(api.staff.getStaffMember, { staffId });
      if (!staff) {
        throw new Error('Staff member not found');
      }

      // Generate new password
      const newPassword = generateRandomPassword();

      // Update password in database
      await convex.mutation(api.auth.updatePassword, {
        userId: staff.userId,
        newPassword,
      });

      // Send email with new password
      await sendInvitationEmail({
        name: staff.name,
        email: staff.email,
        password: newPassword,
        role: 'Staff',
      });
    } catch (error) {
      console.error('Error resetting staff password:', error);
      throw error;
    }
  },

  deactivateStaffMember: async (staffId: string): Promise<void> => {
    try {
      await convex.mutation(api.staff.updateStaffMember, {
        staffId,
        status: 'disabled',
      });
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      throw error;
    }
  },

  activateStaffMember: async (staffId: string): Promise<void> => {
    try {
      await convex.mutation(api.staff.updateStaffMember, {
        staffId,
        status: 'active',
      });
    } catch (error) {
      console.error('Error activating staff member:', error);
      throw error;
    }
  },
};