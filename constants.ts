export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_WIZARD: '/signup-wizard',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  LANDING: '/',
  DASHBOARD: '/dashboard',
  REVIEWS: '/reviews',
  CHAT: '/chat',
  MEDIA: '/media',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Affiliate Routes
  AFFILIATE_DASHBOARD: '/affiliate/dashboard',
  AFFILIATE_MARKETING_TOOLS: '/affiliate/marketing-tools',
  AFFILIATE_BALANCE: '/affiliate/balance', 
  AFFILIATE_ACCOUNT: '/affiliate/account',
  AFFILIATE_MARKETING_MATERIALS: '/affiliate/marketing-materials',

  // Sales Routes
  SALES_DASHBOARD: '/sales/dashboard',
  SALES_TASKS: '/sales/tasks',
  SALES_MY_TASKS: '/sales/my-tasks',
  SALES_ACCOUNT: '/sales/account',
  SALES_NOTIFICATIONS: '/sales/notifications',

  // Onboarding Routes
  ONBOARDING_SIGNUP: '/onboarding/signup',
  ONBOARDING_BUSINESS_INFO: '/onboarding/business-info',
  ONBOARDING_SUBSCRIPTION: '/onboarding/subscription',
  ONBOARDING_REVIEW: '/onboarding/review',
  ONBOARDING_COMPLETE: '/onboarding/complete',
  ONBOARDING_DEMO: '/onboarding/demo',
  
  // Staff Onboarding Review Routes
  STAFF_ONBOARDING_REVIEWS: '/staff/onboarding-reviews',
  ADMIN_ONBOARDING_DASHBOARD: '/admin/onboarding-dashboard',

  // Admin-Affiliate Routes
  ADMIN_AFFILIATES: '/admin/affiliates',
  ADMIN_MARKETING_MEDIA: '/admin/marketing-media',
  ADMIN_ROLE_PERMISSIONS: '/admin/role-permissions',
  ADMIN_CLICKS: '/admin/clicks', 
  ADMIN_SALES: '/admin/sales',   

  // Staff Portal Routes
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_PROFILE: '/staff/profile',
  STAFF_TASKS: '/staff/tasks',
  STAFF_ITEMS_TO_REVIEW: '/staff/items-to-review',
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

  // Admin Management Routes
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_EMAIL_SETTINGS: '/admin/email-settings',
};

export const API_KEY_ENV_VAR = 'API_KEY';