
import { 
  User, UserProfile, Review, MediaItem, StripeSubscription, UserRole,
  Affiliate, Click, Sale, MarketingMedia,
  StaffMember, Task, StaffReviewItem, KnowledgeBaseItem, StaffNotification, SupportTicket, TicketComment,
  SystemSetting, AuditLog, Payout, PayoutStatus, SystemSettingCategory, AuditLogActionType, StaffInternalRole,
  AffiliateNotification, Priority, StaffReviewItemStatus, SupportTicketStatus, SubmittedByType, NotificationSeverity
} from '../types';

export const mockUsers: User[] = [
  { id: 'user1', email: 'user@example.com', role: UserRole.USER, name: 'John Doe' }, // Role changed to USER
  { id: 'user2', email: 'admin@example.com', role: UserRole.ADMIN, name: 'Alice Admin', staffId: 'STAFF_AA_001' },
  { id: 'user3', email: 'owner@example.com', role: UserRole.OWNER, name: 'Bob Owner', staffId: 'STAFF_BO_000' },
  { id: 'user4', email: 'staff.support@example.com', role: UserRole.STAFF, name: 'Sarah Staff', staffId: 'STAFF_SS_101'},
  { id: 'user5', email: 'staff.manager@example.com', role: UserRole.STAFF, name: 'Mike Manager', staffId: 'STAFF_MM_102'},
  { id: 'user6', email: 'another.affiliate@example.com', role: UserRole.AFFILIATE, name: 'Jane Affiliate', affiliateId: 'AFF_JA_456' },
  { id: 'user7', email: 'regular.customer@example.com', role: UserRole.USER, name: 'Charlie Customer' },
];

export const mockUserProfiles: UserProfile[] = [
  { 
    id: 'user1', name: 'John Doe', address: '123 Main St, Anytown, USA', phone: '555-1234', email: 'user@example.com', zipCode: '12345',
    businessName: "John's Gadgets", businessAddress: "100 Commerce Way", businessPhoneNumber: "555-0011", businessEmail: "sales@johnsgadgets.com", businessWebsite: "https://johnsgadgets.com",
    businessSocials: [{platform: "Twitter", link: "https://twitter.com/johnsgadgets"}],
    customerNotes: "Prefers email communication. Interested in bulk review analysis.",
  },
  { 
    id: 'user2', name: 'Alice Admin', address: '456 Oak Ave, Anytown, USA', phone: '555-5678', email: 'admin@example.com', zipCode: '12345',
    adminNotes: "System administrator with full access.",
  },
  { 
    id: 'user3', name: 'Bob Owner', address: '789 Pine Rd, Anytown, USA', phone: '555-9012', email: 'owner@example.com', zipCode: '12345',
    adminNotes: "Business owner. Oversees all operations.",
  },
  { 
    id: 'user4', name: 'Sarah Staff', address: '111 Maple Dr, Anytown, USA', phone: '555-3322', email: 'staff.support@example.com', zipCode: '12345',
    adminNotes: "Support team lead. Manages tickets and user queries.",
  },
   { 
    id: 'user6', name: 'Jane Affiliate', address: '222 Birch Ln, Anytown, USA', phone: '555-4455', email: 'another.affiliate@example.com', zipCode: '12345',
    customerNotes: "Active affiliate, focuses on social media promotions.",
  },
  {
    id: 'user7', name: 'Charlie Customer', address: '333 Elm St, Otherville, USA', phone: '555-7788', email: 'regular.customer@example.com', zipCode: '54321',
    businessName: "Charlie's Cafe", businessAddress: "1 Cafe Lane", businessPhoneNumber: "555-1100", businessEmail: "info@charliescafe.com", businessWebsite: "https://charliescafe.com",
    businessSocials: [{platform: "Instagram", link: "https://instagram.com/charliescafe"}],
    customerNotes: "Loyal customer. Often provides detailed feedback.",
  }
];

export const mockReviews: Review[] = [
  { 
    id: 'review1', 
    reviewerName: 'Jane Smith', 
    reviewContent: 'Excellent service and great product! Highly recommend.', 
    rating: 5, 
    reviewDate: '2023-03-15T10:00:00Z', 
    reviewerSource: 'Google', 
    isCustomer: true, 
    knowsReviewerIdentity: true,
    reviewerDetails: { name: 'Jane Smith', email: 'jane@example.com', notes: "Verified purchase on 2023-03-10" },
    associatedMediaIds: ['media1']
  },
  { 
    id: 'review2', 
    reviewerName: 'Anonymous User', 
    reviewContent: 'The product broke after one week. Very disappointed.', 
    rating: 1, 
    reviewDate: '2023-03-20T14:30:00Z', 
    reviewerSource: 'TrustPilot', 
    isCustomer: false,
    isFormerEmployee: true,
    knowsReviewerIdentity: false,
    reviewerRelationship: "Claims to be a former disgruntled employee from 2 years ago. No records match."
  },
  { 
    id: 'review3', 
    reviewerName: 'Mark Johnson', 
    reviewContent: 'Good value for money, but shipping was a bit slow.', 
    rating: 4, 
    reviewDate: '2023-03-22T09:15:00Z', 
    reviewerSource: 'Website', 
    isCustomer: true,
    knowsReviewerIdentity: true,
    reviewerDetails: { name: 'Mark Johnson', phone: '555-1212', notes: "Frequent buyer." },
    associatedMediaIds: ['media2', 'media3']
  },
  { 
    id: 'review4', 
    reviewerName: 'BotReviewerX', 
    reviewContent: 'Amazing amazing amazing! Best ever! Five stars! You must buy this now wow!', 
    rating: 5, 
    reviewDate: '2023-02-10T11:00:00Z', 
    reviewerSource: 'Unknown Blog', 
    isCustomer: false, 
    knowsReviewerIdentity: false,
    reviewerRelationship: "Suspicious activity detected. Likely a paid or bot review."
  },
];

export const mockMediaItems: MediaItem[] = [
  { id: 'media1', fileName: 'product_image.jpg', fileType: 'image/jpeg', url: 'https://picsum.photos/seed/media1/200/150', uploadedDate: '2023-03-15T10:05:00Z', associatedReviewId: 'review1', associatedCustomerId: 'user1' },
  { id: 'media2', fileName: 'damage_report.pdf', fileType: 'application/pdf', url: 'https://example.com/placeholder/damage_report.pdf', uploadedDate: '2023-03-20T14:35:00Z', associatedReviewId: 'review3' },
  { id: 'media3', fileName: 'unboxing_video.mp4', fileType: 'video/mp4', url: 'https://example.com/placeholder/unboxing.mp4', uploadedDate: '2023-03-21T10:00:00Z', associatedReviewId: 'review3', associatedCustomerId: 'user1' },
  { id: 'media4', fileName: 'logo.png', fileType: 'image/png', url: 'https://picsum.photos/seed/media4/100/100', uploadedDate: '2023-01-10T10:00:00Z', associatedCustomerId: 'user2' },
];

export const mockStripeSubscription: StripeSubscription = {
  id: 'sub_123abc',
  status: 'active',
  currentPeriodEnd: '2024-12-31T23:59:59Z',
  planName: 'Premium Monthly'
};


// Affiliate System Mock Data
export const mockAffiliates: Affiliate[] = [
  {
    affiliateID: 'AFF_JD_123', // This ID is still tied to John Doe in UserProfiles, etc.
    name: 'John Doe (Affiliate Account)', // Name distinction if needed
    email: 'user@example.com', // User email
    signupDate: '2023-01-15T00:00:00Z',
    status: 'Active',
    payoutDetails: 'paypal@johndoe.com',
    currentBalance: 125.50,
    totalClicks: 1500,
    totalSales: 75,
    affiliateLink: 'https://reviewfighters.com/?ref=AFF_JD_123',
    qrCodeLink: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://reviewfighters.com/?ref=AFF_JD_123',
    userId: 'user1', // Links to John Doe
    isHighValue: true,
  },
  {
    affiliateID: 'AFF_JA_456',
    name: 'Jane Affiliate',
    email: 'another.affiliate@example.com', // Matches a User
    signupDate: '2023-02-20T00:00:00Z',
    status: 'Active',
    payoutDetails: 'stripe_acc_janeaff',
    currentBalance: 70.20,
    totalClicks: 800,
    totalSales: 30,
    affiliateLink: 'https://reviewfighters.com/?ref=AFF_JA_456',
    qrCodeLink: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://reviewfighters.com/?ref=AFF_JA_456',
    userId: 'user6',
  },
  {
    affiliateID: 'AFF_PEND_789',
    name: 'Pending Pete',
    email: 'pete.pending@example.net', 
    signupDate: '2023-03-10T00:00:00Z',
    status: 'Pending',
    payoutDetails: 'Waiting for approval',
    currentBalance: 0,
    totalClicks: 10,
    totalSales: 0,
    affiliateLink: 'https://reviewfighters.com/?ref=AFF_PEND_789',
    qrCodeLink: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://reviewfighters.com/?ref=AFF_PEND_789',
    userId: 'new_user_pete_id', 
  }
];

export const mockClicks: Click[] = [
  { clickID: 'CLICK_001', affiliateID_Ref: 'AFF_JD_123', timestamp: '2023-03-01T10:00:00Z', sourceTag: 'facebook_ad_1' },
  { clickID: 'CLICK_002', affiliateID_Ref: 'AFF_JD_123', timestamp: '2023-03-01T12:00:00Z', sourceTag: 'twitter_post' },
  { clickID: 'CLICK_003', affiliateID_Ref: 'AFF_JA_456', timestamp: '2023-03-02T14:00:00Z', sourceTag: 'blog_review' },
];

export const mockSales: Sale[] = [
  { saleID: 'SALE_001', affiliateID_Ref: 'AFF_JD_123', orderID_External: 'ORD_XYZ123', saleTimestamp: '2023-03-01T11:00:00Z', saleAmount: 100.00, commissionRate: 0.10, commissionEarned: 10.00, status: 'Approved', clickID_Ref: 'CLICK_001'},
  { saleID: 'SALE_002', affiliateID_Ref: 'AFF_JD_123', orderID_External: 'ORD_XYZ456', saleTimestamp: '2023-03-03T15:00:00Z', saleAmount: 50.00, commissionRate: 0.10, commissionEarned: 5.00, status: 'Pending' },
  { saleID: 'SALE_003', affiliateID_Ref: 'AFF_JA_456', orderID_External: 'ORD_ABC789', saleTimestamp: '2023-03-02T18:00:00Z', saleAmount: 200.00, commissionRate: 0.15, commissionEarned: 30.00, status: 'Approved' },
];

export const mockMarketingMedia: MarketingMedia[] = [
  { mediaID: 'MM_BANNER_001', title: 'Standard Banner 300x250', type: 'Banner', assetURL_Or_Content: 'https://via.placeholder.com/300x250.png?text=ReviewFighters+Banner', dimensions: '300x250', targetAudience: ['General'], isActive: true },
  { mediaID: 'MM_TEXTLINK_001', title: 'Simple Text Link', type: 'Text Link', assetURL_Or_Content: 'Protect Your Reviews with ReviewFighters!', isActive: true },
  { mediaID: 'MM_EMAIL_001', title: 'Email Template for New Customers', type: 'Email Template', assetURL_Or_Content: 'Subject: Secure Your Online Reputation!\n\nHi [Name],\n\nAre fake reviews hurting your business? ReviewFighters can help! Learn more and sign up here: [Your Affiliate Link Here]\n\nThanks,\nReviewFighters Team', isActive: true },
  { mediaID: 'MM_VIDEO_001', title: 'ReviewFighters Explainer Video', type: 'Video', assetURL_Or_Content: 'https://www.youtube.com/embed/zSyx4RBRvVw', isActive: true }, 
  { mediaID: 'MM_BANNER_002', title: 'Leaderboard Banner 728x90', type: 'Banner', assetURL_Or_Content: 'https://via.placeholder.com/728x90.png?text=ReviewFighters+Leaderboard', dimensions: '728x90', targetAudience: ['Blogs', 'Forums'], isActive: true },
  { mediaID: 'MM_TEXTLINK_002', title: 'Discount Offer Text Link', type: 'Text Link', assetURL_Or_Content: 'Get 10% Off ReviewFighters with this link!', isActive: false }, 
];

// Staff Portal Mock Data
export const mockStaffMembers: StaffMember[] = [
  { staffId: 'STAFF_BO_000', userId: 'user3', name: 'Bob Owner', email: 'owner@example.com', internalRole: 'Owner', isOwner: true },
  { staffId: 'STAFF_AA_001', userId: 'user2', name: 'Alice Admin', email: 'admin@example.com', internalRole: 'Admin' },
  { staffId: 'STAFF_SS_101', userId: 'user4', name: 'Sarah Staff', email: 'staff.support@example.com', internalRole: 'Support', team: 'Customer Success' },
  { staffId: 'STAFF_MM_102', userId: 'user5', name: 'Mike Manager', email: 'staff.manager@example.com', internalRole: 'Manager', team: 'Review Operations' },
];

export const mockTasks: Task[] = [
  { taskID: 'TASK_001', title: 'Review new affiliate applications', description: 'Check KYC for AFF_PEND_789 and two others.', assignedToStaffId: 'STAFF_AA_001', status: 'To Do', priority: 'High', createdDate: '2023-03-20T00:00:00Z', createdByStaffId: 'STAFF_BO_000', relatedItemType: 'AffiliateApplication', relatedItemID: 'AFF_PEND_789' },
  { taskID: 'TASK_002', title: 'Update KB for new Google Review policy', description: 'Research changes and update relevant articles.', assignedToStaffId: 'STAFF_SS_101', status: 'In Progress', priority: 'Medium', dueDate: '2023-04-05T00:00:00Z', createdDate: '2023-03-15T00:00:00Z', createdByStaffId: 'STAFF_MM_102' },
  { taskID: 'TASK_003', title: 'Prepare Q1 Payout Summary', description: 'Aggregate all approved payouts for Q1 for owner review.', assignedToStaffId: 'STAFF_MM_102', status: 'Pending Review', priority: 'High', createdDate: '2023-03-25T00:00:00Z', createdByStaffId: 'STAFF_BO_000', relatedItemType: 'PayoutRequest' },
];

export const mockStaffReviewItems: StaffReviewItem[] = [
  { reviewItemID: 'SRI_001', itemToReviewType: 'MarketingContent', itemToReviewId: 'MM_TEXTLINK_002', assignedToStaffId: 'STAFF_MM_102', status: 'Pending Review', submittedDate: '2023-03-21T00:00:00Z', dueDate: '2023-03-28T00:00:00Z' },
  { reviewItemID: 'SRI_002', itemToReviewType: 'AffiliateApplication', itemToReviewId: 'AFF_PEND_789', status: 'Pending Assignment', submittedDate: '2023-03-22T00:00:00Z' },
];

export const mockAffiliateNotifications: AffiliateNotification[] = [
  { notificationID: 'AFF_NOTIF_001', recipientAffiliateId: 'AFF_JD_123', message: 'Your payout of $50.00 has been processed!', timestamp: '2023-03-18T10:00:00Z', isRead: false, severity: 'Info', deepLinkViewName: 'AFFILIATE_BALANCE' },
  { notificationID: 'AFF_NOTIF_002', recipientAffiliateId: 'AFF_JD_123', message: 'New marketing banner "Spring Sale" available in Marketing Tools.', timestamp: '2023-03-20T14:00:00Z', isRead: true, severity: 'Info', deepLinkViewName: 'AFFILIATE_MARKETING_TOOLS', relatedQuery: "Show me the new Spring Sale banner" },
  { notificationID: 'AFF_NOTIF_003', recipientAffiliateId: 'AFF_JA_456', message: 'Your commission rate has been updated to 12%.', timestamp: '2023-03-22T09:00:00Z', isRead: false, severity: 'Warning', relatedQuery: "What is my current commission rate?" },
];


export const mockStaffNotifications: StaffNotification[] = [
  { 
    notificationID: 'SN_001', 
    recipientStaffId: 'STAFF_AA_001', 
    message: 'TASK_001 (Review new affiliate applications) is overdue.', 
    timestamp: '2023-03-23T09:00:00Z',
    isRead: false,
    severity: 'Warning',
    deepLinkViewName: 'STAFF_TASKS', 
    deepLinkRowID: 'TASK_001' 
  },
  { 
    notificationID: 'SN_002', 
    recipientStaffId: 'STAFF_SS_101', 
    message: 'Support Ticket TKT_HIGH_PRIORITY_001 requires immediate attention.', 
    timestamp: '2023-03-24T11:00:00Z',
    isRead: false,
    severity: 'Critical',
    deepLinkViewName: 'STAFF_SUPPORT_TICKETS',
    deepLinkRowID: 'TKT_HIGH_PRIORITY_001'
  },
];

export const mockKnowledgeBaseItems: KnowledgeBaseItem[] = [
    { kbID: 'KB_001', questionPatternOrKeywords: 'reset password, forgot password', answerOrProcedure: 'To reset your password, go to...', category: 'Account', lastUpdated: '2023-03-01T00:00:00Z' }
];

export const mockSupportTickets: SupportTicket[] = [
    { ticketID: 'TKT_001', subject: 'Login Issue', description: 'User cannot log in.', submittedByType: 'User', submittedById: 'user1', assignedToStaffId: 'STAFF_SS_101', status: 'Open', priority: 'High', category: 'Technical', creationDate: '2023-03-20T00:00:00Z', lastUpdateDate: '2023-03-21T00:00:00Z' },
    { ticketID: 'TKT_HIGH_PRIORITY_001', subject: 'Urgent Billing Question', description: 'User reports incorrect charge.', submittedByType: 'Affiliate', submittedById: 'AFF_JD_123', assignedToStaffId: 'STAFF_SS_101', status: 'New', priority: 'Urgent', category: 'Billing', creationDate: '2023-03-24T10:00:00Z', lastUpdateDate: '2023-03-24T10:00:00Z' },

];
export const mockTicketComments: TicketComment[] = [
    { commentID: 'CMT_001', ticketID_Ref: 'TKT_001', commentByStaffId: 'STAFF_SS_101', commentText: 'Attempted to contact user, left voicemail.', timestamp: '2023-03-21T10:00:00Z', isInternalNote: false }
];

export const mockSystemSettings: SystemSetting[] = [
  { settingID: 'DefaultAffiliateCommission', settingName: 'Default Affiliate Commission Rate', value: '0.10', description: 'Default commission rate for new affiliates (e.g., 0.10 for 10%).', category: SystemSettingCategory.AFFILIATE, lastModifiedDate: '2023-01-01T00:00:00Z' },
  { settingID: 'PayoutThreshold', settingName: 'Minimum Payout Threshold', value: '50', description: 'Minimum balance an affiliate must have to request a payout (USD).', category: SystemSettingCategory.FINANCIAL, lastModifiedDate: '2023-01-01T00:00:00Z', lastModifiedByStaffId: 'STAFF_BO_000' },
];

export const mockAuditLogs: AuditLog[] = [
  { logID: 'AUDIT_001', timestamp: '2023-03-20T10:00:00Z', userEmailPerformingAction: 'owner@example.com', userIDPerformingAction: 'user3', actionType: AuditLogActionType.SETTING_CHANGE, targetEntityType: 'SystemSetting', targetEntityID: 'DefaultAffiliateCommission', summaryOfChange: 'Changed default commission from 0.08 to 0.10', oldValue: '0.08', newValue: '0.10', ipAddress: '192.168.1.1' },
  { logID: 'AUDIT_002', timestamp: '2023-03-21T14:00:00Z', userEmailPerformingAction: 'admin@example.com', userIDPerformingAction: 'user2', actionType: AuditLogActionType.USER_ROLE_CHANGE, targetEntityType: 'User', targetEntityID: 'user1', summaryOfChange: 'User role changed from USER to AFFILIATE', oldValue: 'USER', newValue: 'AFFILIATE', ipAddress: '192.168.1.5' },
];

export const mockPayouts: Payout[] = [
  { payoutID: 'PAY_001', affiliateID_Ref: 'AFF_JD_123', amount: 75.00, requestedDate: '2023-03-15T00:00:00Z', status: PayoutStatus.PENDING_APPROVAL, notes: 'First payout request.' },
  { payoutID: 'PAY_002', affiliateID_Ref: 'AFF_JA_456', amount: 120.50, requestedDate: '2023-03-18T00:00:00Z', status: PayoutStatus.APPROVED, approvalDate: '2023-03-19T00:00:00Z', approvedByStaffId: 'STAFF_BO_000', notes: 'Approved for March earnings.' },
  { payoutID: 'PAY_003', affiliateID_Ref: 'AFF_JD_123', amount: 50.25, requestedDate: '2023-02-10T00:00:00Z', status: PayoutStatus.PROCESSED, approvalDate: '2023-02-11T00:00:00Z', approvedByStaffId: 'STAFF_BO_000', processingDate: '2023-02-12T00:00:00Z', processedByStaffId: 'STAFF_AA_001', transactionID_External: 'txn_abc123xyz', notes: 'February Payout' },
];
