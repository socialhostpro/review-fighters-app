
export const ROUTES = {
  LOGIN: '/login',
  LANDING: '/',
  SIGNUP: '/signup', // New route for the signup wizard
  DASHBOARD: '/dashboard',
  REVIEWS: '/reviews',
  CHAT: '/chat',
  MEDIA: '/media',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Customer/User specific
  CUSTOMER_SUPPORT_TICKETS: '/my-support-tickets',

  // Affiliate Routes
  AFFILIATE_DASHBOARD: '/affiliate/dashboard',
  AFFILIATE_MARKETING_TOOLS: '/affiliate/marketing-tools',
  AFFILIATE_BALANCE: '/affiliate/balance', 

  // Admin-Affiliate Routes
  ADMIN_AFFILIATES: '/admin/affiliates',
  ADMIN_MARKETING_MEDIA: '/admin/marketing-media',
  ADMIN_CLICKS: '/admin/clicks', 
  ADMIN_SALES: '/admin/sales',   

  // Staff Portal Routes
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_TASKS: '/staff/tasks',
  STAFF_ITEMS_TO_REVIEW: '/staff/items-to-review',
  STAFF_SUPPORT_TICKETS: '/staff/support-tickets',
  STAFF_NOTIFICATIONS: '/staff/notifications',
  // STAFF_KNOWLEDGE_BASE: '/staff/knowledge-base', // Future

  // Owner Portal Routes
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_FINANCIALS: '/owner/financials',
  OWNER_AFFILIATE_OVERSIGHT: '/owner/affiliate-oversight',
  OWNER_STAFF_MANAGEMENT: '/owner/staff-management',
  OWNER_SYSTEM_SETTINGS: '/owner/system-settings',
  OWNER_AUDIT_LOGS: '/owner/audit-logs',
  OWNER_LANDING_PAGE_EDITOR: '/owner/landing-page-editor', // New route
};

export const API_KEY_ENV_VAR = 'API_KEY';