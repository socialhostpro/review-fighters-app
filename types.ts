export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  OWNER = "owner",
  AFFILIATE = "affiliate", 
  STAFF = "staff",
  SALES = "sales",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string; 
  affiliateId?: string; 
  staffId?: string; 
  salesId?: string;
}

export interface UserProfile {
  id: string; 
  name: string;
  address: string;
  phone: string;
  email: string;
  zipCode: string;
  
  businessName?: string;
  businessAddress?: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
  businessWebsite?: string;
  businessSocials?: { platform: string; link: string }[];
  
  adminNotes?: string; 
  customerNotes?: string;
}

export interface ReviewerInfo {
  handle?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewContent: string;
  rating: number; 
  reviewDate: string; 
  reviewerSource: string; 
  reviewerRelationship?: string; 
  isCustomer: boolean;
  isFormerEmployee?: boolean; 
  knowsReviewerIdentity: boolean;
  reviewerDetails?: ReviewerInfo;
  associatedMediaIds?: string[];
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileType: string; 
  url: string; 
  uploadedDate: string;
  associatedReviewId?: string;
  associatedCustomerId?: string; 
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
  isLoading?: boolean;
  error?: string;
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}


export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string; 
  planName: string;
}

// Affiliate System Types

export interface Affiliate {
  affiliateID: string; // Key, Unique
  name: string; // This might be redundant if User.name is primary, but useful for direct affiliate context
  email: string; // Used for login/filtering, should match User.email
  signupDate: string; // Date
  status: 'Active' | 'Inactive' | 'Pending';
  payoutDetails: string; // e.g., PayPal email, bank info, Stripe Connect ID
  currentBalance: number; // Decimal/Number
  totalClicks: number; // Number
  totalSales: number; // Number
  affiliateLink: string; // URL, Auto-generated: BASE_URL + "?ref=" + [AffiliateID]
  qrCodeLink: string; // Image/QR URL (AppSheet might generate this)
  userId: string; // Link to the User table
  isHighValue?: boolean; // Added for Owner oversight
}

export interface Click {
  clickID: string; // Key, UniqueID()
  affiliateID_Ref: string; // Ref to Affiliates table
  timestamp: string; // DateTime, NOW()
  ipAddress?: string; // Text (Harder to capture reliably)
  userAgent?: string; // Text (Harder to capture reliably)
  sourceTag?: string; // Text, Optional (e.g., "facebook_ad_1")
  targetURL?: string; // URL, Optional
}

export interface Sale {
  saleID: string; // Key, UniqueID()
  affiliateID_Ref: string; // Ref to Affiliates table
  orderID_External: string; // Text, from e-commerce system
  saleTimestamp: string; // DateTime, NOW()
  saleAmount: number; // Decimal/Number
  commissionRate: number; // Percent (e.g., 0.10 for 10%)
  commissionEarned: number; // Decimal/Number (Calculated: [SaleAmount] * [CommissionRate])
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  clickID_Ref?: string; // Ref to Clicks table, Optional
}

export interface MarketingMedia {
  mediaID: string; // Key, UniqueID()
  title: string;
  type: 'Banner' | 'Text Link' | 'Email Template' | 'Video';
  assetURL_Or_Content: string; // URL or LongText
  dimensions?: string; // e.g., "300x250" for banners
  targetAudience?: string[]; // EnumList, Optional
  isActive: boolean; // Yes/No
}

// Staff Portal System Types

export type StaffInternalRole = 'Support' | 'Manager' | 'Reviewer' | 'Admin' | 'Owner'; // Added Owner for clarity, though isOwner flag is primary
export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Pending Review' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type RelatedItemType = 'Affiliate' | 'Ticket' | 'General' | 'PayoutRequest' | 'MarketingContent' | 'SupportEscalation' | 'AffiliateApplication';
export type StaffReviewItemStatus = 'Pending Assignment' | 'Pending Review' | 'Approved' | 'Rejected' | 'Needs More Info';
export type NotificationSeverity = 'Info' | 'Warning' | 'Critical'; // Reused by AffiliateNotification
export type SupportTicketStatus = 'New' | 'Open' | 'In Progress' | 'Pending Customer' | 'Resolved' | 'Closed';
export type SubmittedByType = 'User' | 'Affiliate' | 'Staff' | 'System';


export interface StaffMember {
  staffId: string; 
  userId: string; 
  name: string;
  email: string; 
  internalRole: StaffInternalRole; 
  team?: string; 
  isOwner?: boolean; // Added for Owner role differentiation
}

export interface Task {
  taskID: string; 
  title: string;
  description: string; 
  assignedToStaffId?: string; 
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; 
  createdDate: string; 
  createdByStaffId?: string; 
  relatedItemType?: RelatedItemType;
  relatedItemID?: string; 
}

export interface StaffReviewItem {
  reviewItemID: string; 
  itemToReviewType: RelatedItemType; 
  itemToReviewId: string; 
  assignedToStaffId?: string; 
  status: StaffReviewItemStatus;
  reviewerComments?: string; 
  submittedDate: string; 
  dueDate?: string; 
  completedDate?: string; 
}

export interface StaffAIChatLog {
  chatLogID: string; 
  staffId: string; 
  timestamp: string; 
  userQuery: string; 
  aiResponseOrKBResult: string; 
  feedback?: 'Helpful' | 'Not Helpful' | 'Needs Improvement';
}

export interface KnowledgeBaseItem {
  kbID: string; 
  questionPatternOrKeywords: string; 
  answerOrProcedure: string; 
  category?: string;
  lastUpdated: string; 
}

export interface StaffNotification {
  notificationID: string; 
  recipientStaffId: string; 
  message: string;
  timestamp: string; 
  isRead: boolean; 
  severity: NotificationSeverity;
  deepLinkViewName?: string; 
  deepLinkRowID?: string; 
}

export interface AffiliateNotification {
  notificationID: string;
  recipientAffiliateId: string; // Changed from staff to affiliate
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: NotificationSeverity; // Reusing this enum
  deepLinkViewName?: string; // e.g., AFFILIATE_DASHBOARD, AFFILIATE_MARKETING_TOOLS
  deepLinkParams?: Record<string, string>; // e.g., { section: 'sales' }
  relatedQuery?: string; // Pre-defined query for AI on "More Info" click
}


export interface SupportTicket {
  ticketID: string; 
  subject: string;
  description: string; 
  submittedByType: SubmittedByType;
  submittedById?: string; 
  assignedToStaffId?: string; 
  status: SupportTicketStatus;
  priority: Priority;
  category?: string;
  creationDate: string; 
  lastUpdateDate: string; 
  resolutionDetails?: string; 
}

export interface TicketComment {
  commentID: string; 
  ticketID_Ref: string; 
  commentByStaffId?: string; 
  commentByAffiliateId?: string; 
  commentByUserId?: string; // Added for general user comments
  commentText: string; 
  timestamp: string; 
  isInternalNote: boolean; 
}

// Owner Portal System Types

export enum SystemSettingCategory {
  AFFILIATE = "Affiliate",
  FINANCIAL = "Financial",
  STAFF = "Staff",
  SYSTEM = "System",
}

export interface SystemSetting {
  settingID: string; // Key (e.g., "DefaultAffiliateCommission")
  settingName: string; // User-friendly name
  value: string; // Stored as string, parsed as needed
  description: string;
  category: SystemSettingCategory;
  lastModifiedByStaffId?: string; // Ref to StaffMember (Owner's StaffID)
  lastModifiedDate: string; // DateTime
}

export enum AuditLogActionType {
  LOGIN = "Login",
  CREATE = "Create",
  UPDATE = "Update",
  DELETE = "Delete",
  SETTING_CHANGE = "SettingChange",
  PAYOUT_APPROVAL = "PayoutApproval",
  PAYOUT_REJECTION = "PayoutRejection",
  USER_ROLE_CHANGE = "UserRoleChange",
  // Add more as needed
}

export interface AuditLog {
  logID: string; // Key, UniqueID()
  timestamp: string; // DateTime
  userIDPerformingAction?: string; // StaffID or AffiliateID
  userEmailPerformingAction: string;
  actionType: AuditLogActionType;
  targetEntityType?: string; // e.g., "Affiliate", "SystemSetting"
  targetEntityID?: string;
  summaryOfChange: string;
  oldValue?: string; // Optional
  newValue?: string; // Optional
  ipAddress?: string; // Optional
}

export enum PayoutStatus {
  PENDING_APPROVAL = "Pending Owner Approval",
  APPROVED = "Approved",
  PROCESSED = "Processed",
  REJECTED = "Rejected",
  FAILED = "Failed",
}

export interface Payout {
  payoutID: string; // Key, UniqueID()
  affiliateID_Ref: string; // Ref to Affiliates table
  amount: number; // Currency
  requestedDate: string; // DateTime
  status: PayoutStatus;
  approvalDate?: string; // DateTime, Optional
  approvedByStaffId?: string; // Ref to StaffMember (Owner's StaffID)
  processingDate?: string; // DateTime, Optional
  processedByStaffId?: string; // Ref to StaffMember
  transactionID_External?: string;
  notes?: string;
}

// Sales System Types - Similar to affiliate but with paid tasks

export type SalesTaskStatus = 'Available' | 'Claimed' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';
export type SalesTaskCategory = 'Lead Generation' | 'Research' | 'Outreach' | 'Data Collection' | 'Verification' | 'Other';

export interface SalesMember {
  salesId: string; // Key, Unique
  userId: string; // Link to User table
  name: string;
  email: string;
  signupDate: string; // Date
  status: 'Active' | 'Inactive' | 'Suspended';
  currentBalance: number; // Current earnings balance
  totalEarnings: number; // Lifetime earnings
  totalTasksCompleted: number; // Number of completed tasks
  averageRating: number; // Performance rating (1-5)
  payoutDetails: string; // e.g., PayPal email, bank info
  specializations?: SalesTaskCategory[]; // Areas of expertise
}

export interface SalesTask {
  taskId: string; // Key, Unique
  title: string;
  description: string;
  category: SalesTaskCategory;
  reward: number; // Payment amount for completion
  requirements: string[]; // List of requirements/deliverables
  estimatedTime: string; // e.g., "2-4 hours"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: SalesTaskStatus;
  postedDate: string; // When task was posted
  deadline?: string; // Optional deadline
  maxClaims: number; // How many people can work on this (default 1)
  currentClaims: number; // Current number of people working on it
  createdByStaffId: string; // Staff member who posted the task
  approvedByStaffId?: string; // Staff member who approved completion
  tags?: string[]; // Optional tags for filtering
}

export interface SalesTaskClaim {
  claimId: string; // Key, Unique
  taskId: string; // Reference to SalesTask
  salesId: string; // Reference to SalesMember
  claimedDate: string; // When user claimed the task
  submittedDate?: string; // When user submitted the work
  submissionNotes?: string; // User's notes about the submission
  submissionFiles?: string[]; // URLs to uploaded files/evidence
  reviewedDate?: string; // When staff reviewed the submission
  reviewerStaffId?: string; // Staff member who reviewed
  reviewNotes?: string; // Staff review comments
  status: SalesTaskStatus;
  paidDate?: string; // When payment was processed
  paidAmount?: number; // Actual amount paid (might differ from reward)
}

export interface SalesNotification {
  notificationId: string;
  recipientSalesId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: NotificationSeverity;
  relatedTaskId?: string; // If notification is about a specific task
  actionRequired?: boolean; // If user needs to take action
}

// Onboarding System Types
export type OnboardingStatus = 'Draft' | 'Information_Complete' | 'Subscription_Confirmed' | 'Under_Review' | 'Approved' | 'Rejected' | 'Active';
export type OnboardingStage = 'Signup' | 'Business_Info' | 'Subscription' | 'Review' | 'Completion';
export type NotificationType = 'Email' | 'Web' | 'Both';
export type OnboardingNotificationTrigger = 'Business_Signup' | 'Information_Complete' | 'Subscription_Confirmed' | 'Assigned_For_Review' | 'Review_Accepted' | 'Review_Rejected' | 'Onboarding_Complete';

export interface OnboardingApplication {
  applicationId: string; // Key, Unique
  userId: string; // Link to User table
  businessOwnerId?: string; // Link to future BusinessOwner table
  status: OnboardingStatus;
  currentStage: OnboardingStage;
  submissionDate: string; // When initially submitted
  informationCompleteDate?: string; // When business info was completed
  subscriptionConfirmedDate?: string; // When subscription was confirmed
  assignedToStaffId?: string; // Staff member reviewing the application
  reviewStartedDate?: string; // When staff started reviewing
  reviewCompletedDate?: string; // When review was completed
  approvalDate?: string; // When approved
  rejectionDate?: string; // When rejected
  rejectionReason?: string; // Why it was rejected
  notes?: string; // Internal notes
  priority: Priority; // Reusing existing Priority type
}

export interface OnboardingBusinessInfo {
  applicationId: string; // Link to OnboardingApplication
  businessName: string;
  businessType: string; // e.g., "Restaurant", "Retail", "Service"
  businessDescription: string;
  website?: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  numberOfEmployees?: number;
  annualRevenue?: string; // Range like "50k-100k"
  currentReviewPlatforms?: string[]; // Google, Yelp, etc.
  painPoints?: string; // What challenges they face
  goals?: string; // What they want to achieve
  additionalInfo?: string;
}

export interface OnboardingSubscription {
  applicationId: string; // Link to OnboardingApplication
  planType: string; // e.g., "Basic", "Professional", "Enterprise"
  billingCycle: 'Monthly' | 'Yearly';
  amount: number; // Subscription amount
  paymentMethodId?: string; // Stripe payment method
  subscriptionId?: string; // Stripe subscription ID
  trialEndDate?: string; // If they have a trial period
  confirmedDate: string; // When subscription was confirmed
}

export interface OnboardingNotification {
  notificationId: string;
  applicationId: string; // Link to OnboardingApplication
  trigger: OnboardingNotificationTrigger;
  recipients: {
    userIds?: string[]; // For web notifications
    emails?: string[]; // For email notifications
    roles?: UserRole[]; // Send to all users with these roles
  };
  notificationType: NotificationType;
  message: string;
  emailSubject?: string; // For email notifications
  emailTemplate?: string; // Email template name
  sentDate: string;
  isRead: boolean; // For web notifications
  readDate?: string;
}

export interface OnboardingTask {
  taskId: string;
  applicationId: string; // Link to OnboardingApplication
  assignedToStaffId: string;
  title: string;
  description: string;
  dueDate?: string;
  status: TaskStatus; // Reusing existing TaskStatus
  priority: Priority;
  createdDate: string;
  startedDate?: string;
  completedDate?: string;
  notes?: string;
}