
import { 
    SystemSetting, AuditLog, Payout, PayoutStatus, Affiliate, StaffMember
} from '../types';
import { 
    mockSystemSettings, mockAuditLogs, mockPayouts, mockAffiliates, mockStaffMembers
} from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

let systemSettingsStore: SystemSetting[] = [...mockSystemSettings];
let auditLogsStore: AuditLog[] = [...mockAuditLogs];
let payoutsStore: Payout[] = [...mockPayouts];

export const ownerService = {
  // System Settings
  getSystemSettings: async (): Promise<SystemSetting[]> => {
    await delay(300);
    return [...systemSettingsStore];
  },

  updateSystemSetting: async (settingID: string, value: string, ownerStaffId: string): Promise<SystemSetting> => {
    await delay(400);
    const index = systemSettingsStore.findIndex(s => s.settingID === settingID);
    if (index === -1) throw new Error('System setting not found');
    systemSettingsStore[index].value = value;
    systemSettingsStore[index].lastModifiedByStaffId = ownerStaffId;
    systemSettingsStore[index].lastModifiedDate = new Date().toISOString();
    // TODO: Create AuditLog entry
    return { ...systemSettingsStore[index] };
  },

  // Audit Logs
  getAuditLogs: async (filters?: { userEmail?: string; actionType?: string; entityType?: string; entityId?: string; dateFrom?: string; dateTo?: string }): Promise<AuditLog[]> => {
    await delay(500);
    let logs = [...auditLogsStore];
    if (filters) {
        if(filters.userEmail) logs = logs.filter(log => log.userEmailPerformingAction.toLowerCase().includes(filters.userEmail!.toLowerCase()));
        if(filters.actionType) logs = logs.filter(log => log.actionType === filters.actionType);
        if(filters.entityType) logs = logs.filter(log => log.targetEntityType && log.targetEntityType.toLowerCase().includes(filters.entityType!.toLowerCase()));
        if(filters.entityId) logs = logs.filter(log => log.targetEntityID === filters.entityId);
        // Add date filtering if needed
    }
    return logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest first
  },
  
  // Create Audit Log (internal use by other services or direct for owner actions)
  createAuditLogEntry: async(logData: Omit<AuditLog, 'logID' | 'timestamp'>): Promise<AuditLog> => {
    await delay(100);
    const newLog: AuditLog = {
      ...logData,
      logID: `AUDIT_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
      timestamp: new Date().toISOString()
    };
    auditLogsStore.push(newLog);
    return {...newLog};
  },


  // Payouts
  getPayoutsByStatus: async (status: PayoutStatus): Promise<Payout[]> => {
    await delay(400);
    return payoutsStore.filter(p => p.status === status)
        .sort((a,b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
  },

  getAllPayouts: async (): Promise<Payout[]> => {
    await delay(400);
    return [...payoutsStore].sort((a,b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
  },

  updatePayoutStatus: async (payoutID: string, newStatus: PayoutStatus, ownerStaffId: string, notes?: string): Promise<Payout> => {
    await delay(500);
    const index = payoutsStore.findIndex(p => p.payoutID === payoutID);
    if (index === -1) throw new Error('Payout not found');
    
    payoutsStore[index].status = newStatus;
    if (newStatus === PayoutStatus.APPROVED) {
      payoutsStore[index].approvedByStaffId = ownerStaffId;
      payoutsStore[index].approvalDate = new Date().toISOString();
    } else if (newStatus === PayoutStatus.REJECTED) {
      // Potentially refund balance to affiliate if it was deducted on request
       payoutsStore[index].approvedByStaffId = ownerStaffId; // Or person who rejected
       payoutsStore[index].approvalDate = new Date().toISOString(); // Rejection date
    } else if (newStatus === PayoutStatus.PROCESSED) {
        // This would likely be done by finance staff, but owner might oversee
        payoutsStore[index].processedByStaffId = ownerStaffId; // Or actual processor
        payoutsStore[index].processingDate = new Date().toISOString();
    }
    if (notes) payoutsStore[index].notes = notes;

    // TODO: Create AuditLog entry for payout status change
    return { ...payoutsStore[index] };
  },

  // Helper to get affiliate details for payouts list
  getAffiliateForPayout: async(affiliateId: string): Promise<Affiliate | null> => {
    await delay(50); // very quick, local data
    return mockAffiliates.find(a => a.affiliateID === affiliateId) || null;
  },
   // Helper to get staff details for payouts list
  getStaffForPayout: async(staffId: string): Promise<StaffMember | null> => {
    await delay(50);
    return mockStaffMembers.find(s => s.staffId === staffId) || null;
  }
};
