# Test Users for Review Fighters App

## Created Test Users

The following test users have been created in the database for testing different roles and functionality:

### 🔑 Admin User
- **Email:** `admin@reviewfighters.com`
- **Name:** Admin User
- **Role:** admin
- **User ID:** `jh7arws6hhd6y8zxvmngw8r2as7h33am`
- **Access:** 
  - **Full admin dashboard** with basic features (dashboard, reviews, media, chat, profile)
  - **Staff Tasks:** My tasks, items to review, support tickets
  - **Admin Tools:** Manage affiliates, manage marketing media, role permissions, landing page editor
  - **All Owner Features:** Owner dashboard, financials, affiliate oversight, staff management, system settings, audit logs

### 👑 Owner User  
- **Email:** `owner@reviewfighters.com`
- **Name:** Owner User
- **Role:** owner
- **User ID:** `jh7043s6ajb3tb4eyycpjaygvn7h2ar6`
- **Access:** 
  - **Full app access** with basic features (dashboard, reviews, media, chat, profile)
  - **Staff Tasks:** My tasks, support tickets
  - **Admin Tools:** Manage affiliates, manage marketing media, role permissions, landing page editor
  - **Owner Portal:** Owner dashboard, financial management, affiliate program oversight, staff management, system settings, audit logs

### 👥 Staff Member
- **Email:** `staff@reviewfighters.com`
- **Name:** Staff Member
- **Role:** staff
- **User ID:** `jh73arc2d370bkd51ssj9hn09d7h2q82`
- **Access:** 
  - **Chat and Profile** access
  - **Staff Portal Only:** Staff dashboard, my tasks, items to review, support tickets, notifications

### 💼 Test Affiliate
- **Email:** `affiliate@reviewfighters.com`
- **Name:** Test Affiliate
- **Role:** affiliate
- **User ID:** `jh7fkwcnheqr03r2qdhtfrgs317h2s0j`
- **Access:** 
  - **Chat, Profile, and Support Tickets**
  - **🆕 Affiliate Account:** Dashboard with simple performance metrics
  - **🆕 Account & Balance:** Complete earnings management with payout functions
  - **🆕 Marketing Materials:** QR codes, share links with embedded affiliate codes
  - **Marketing Tools:** Advanced tracking and analytics
- **Sample Data:**
  - Current Balance: $1,250.75
  - Pending Earnings: $325.50
  - Total Lifetime Earnings: $5,875.25
  - This Month: $425.75 (45 conversions)
  - Total Clicks: 1,250 (3.6% conversion rate)
  - Active Links: 8
  - Next Payout: 2024-12-15

### 👤 Regular User
- **Email:** `user@reviewfighters.com`
- **Name:** Regular User
- **Role:** user
- **User ID:** `jh7ad1ep52mybdd99ep5gtd08n7h3x3a`
- **Access:** Basic user features (home, dashboard, reviews, media library, chat, profile, support tickets)

## How to Test

1. **Access the app:** http://localhost:5181/ (or check terminal for current port)
2. **Login with any of the test emails above**
3. **Password:** Use any password (the current auth system uses mock authentication)
4. **Explore role-specific features** based on the user role you're testing

## 🆕 Updated Navigation Structure

### Admin Role Features:
- **Basic Features:** Home, dashboard, reviews, media, chat, profile
- **Staff Tasks:** My tasks, items to review, support tickets
- **Admin Tools:** Manage affiliates, manage marketing media, role permissions, landing page editor
- **Owner Features:** Full access to all owner portal features

### Owner Role Features:
- **Basic Features:** Home, dashboard, reviews, media, chat, profile
- **Staff Tasks:** My tasks, support tickets
- **Admin Tools:** Manage affiliates, manage marketing media, role permissions, landing page editor
- **Owner Portal:** Owner dashboard, financial management, affiliate oversight, staff management, system settings, audit logs

### Staff Role Features:
- **Limited Access:** Chat, profile only
- **Staff Portal Only:** Staff dashboard, my tasks, items to review, support tickets, notifications

### 🆕 Enhanced Affiliate Role Features:
- **Basic Access:** Chat, profile, support tickets
- **Simple Dashboard:** Key performance metrics and quick action links
- **🆕 Account & Balance Page:** 
  - Available balance with payout request functionality
  - Pending earnings and payout schedule
  - Performance overview (clicks, conversions, conversion rate)
  - Complete payout history and payment methods management
- **🆕 Marketing Materials Page:**
  - **QR Codes:** Automatically generated for all affiliate links (landing, signup, pricing, features)
  - **Share Links:** Pre-formatted with embedded affiliate codes
  - **Marketing Assets:** Banners, logos, videos, email templates, social media posts, infographics
  - **Category Filtering:** Organized by type (banners, logos, videos, emails, social media, infographics)
  - **Copy/Download Functions:** One-click sharing and asset downloads
- **Marketing Tools:** Advanced tracking and analytics

### User Role Features:
- **Full Basic Access:** Home, dashboard, reviews, media, chat, profile, support tickets

## 🆕 New Affiliate Features

### QR Code Generation
- **Automatic Generation:** QR codes created for all affiliate links
- **Embedded Tracking:** All QR codes contain affiliate ID and code
- **Download Functionality:** High-quality PNG downloads available
- **Perfect for:** Print materials, business cards, offline promotions

### Marketing Materials Library
- **6 Categories:** Banners, logos, videos, email templates, social media posts, infographics
- **Ready-to-Use Content:** Pre-formatted marketing assets
- **Affiliate Link Integration:** All materials include embedded affiliate tracking
- **Copy & Share:** One-click copying and sharing functionality

### Account Management
- **Real-time Balance:** Current available balance display
- **Payout Requests:** One-click payout request with minimum threshold checking
- **Payment Methods:** PayPal and bank transfer management
- **Performance Tracking:** Clicks, conversions, and commission analytics

## Database Status

All users have been created with:
- ✅ User records in the `users` table
- ✅ User profiles in the `userProfiles` table  
- ✅ Role-specific data (affiliate records, staff records)
- ✅ Sample data for testing functionality
- ✅ **Role permissions management system ready for testing**
- ✅ **🆕 Enhanced affiliate features with QR codes and marketing materials**

The app is now ready for comprehensive testing across all user roles with the new navigation structure and enhanced affiliate functionality!

# Test Users Guide 📋

## Quick Login Credentials
- **User:** user@example.com / password123
- **Affiliate:** affiliate@example.com / password123  
- **Staff:** staff@example.com / password123
- **Admin:** admin@example.com / password123
- **Owner:** owner@example.com / password123

---

## 🔐 Role-Based Navigation Structure

### 👤 **USER Role** (user@example.com)
**Full Basic Access:**
- ✅ Home, Dashboard, Reviews, Media Library, Profile
- ✅ My Support Tickets

### 🤝 **AFFILIATE Role** (affiliate@example.com) 
**Affiliate Tools & Account Management:**
- ✅ Profile, My Support Tickets
- ✅ **Affiliate Dashboard** - Performance metrics, balance overview
- ✅ **Account & Balance** - $1,250.75 balance, payout requests ($100 min), payment methods
- ✅ **Marketing Materials** - Auto-generated QR codes, share links with embedded affiliate codes
- ✅ **Marketing Tools** - Additional promotional resources

**Key Features:**
- **Balance Management:** Current: $1,250.75, Pending: $325.50, Lifetime: $5,875.25
- **QR Code Generation:** Auto-generated for landing, signup, pricing, features pages
- **Affiliate Links:** `?ref=RF-AFF-12345&aid=jh7fkwcnheqr03r2qdhtfrgs317h2s0j`

### 👷 **STAFF Role** (staff@example.com)
**Staff Portal Only:**
- ✅ **Staff Dashboard** - Task overview, performance metrics  
- ✅ **Staff Profile** - Employment details (ID: ST-2024-001), performance stats, permissions
- ✅ **My Tasks** - Assigned work items
- ✅ **Items to Review** - Content moderation queue
- ✅ **Support Tickets** - Customer service queue
- ✅ **Notifications** - System alerts and updates

### 🛡️ **ADMIN Role** (admin@example.com)
**Everything Staff Has + Admin Tools + Owner Features:**

**Basic Features:**
- ✅ Home, Dashboard, Reviews, Media Library, Profile

**Staff Tasks Access:**
- ✅ My Tasks, Items to Review, Support Tickets

**Admin Tools:**
- ✅ **Manage Affiliates** - Affiliate program oversight
- ✅ **Manage Marketing Media** - Content management  
- ✅ **Role Permissions** - Access control settings
- ✅ **👥 User Management** - **NEW FEATURE** (See details below)
- ✅ **Landing Page Editor** - Homepage content management

**Owner Features Access:**
- ✅ **Owner Dashboard** - Business metrics
- ✅ **Financial Management** - Revenue tracking
- ✅ **Affiliate Program** - Complete affiliate oversight
- ✅ **Staff Management** - HR functions
- ✅ **System Settings** - Platform configuration
- ✅ **Audit Logs** - Security tracking

### 👑 **OWNER Role** (owner@example.com)
**Complete Platform Access:**

**Basic Features:**
- ✅ Home, Dashboard, Reviews, Media Library, Profile

**Staff Tasks:**
- ✅ My Tasks, Support Tickets

**Admin Tools:**
- ✅ Manage Affiliates, Manage Marketing Media, Role Permissions
- ✅ **👥 User Management** - **NEW FEATURE** (See details below)
- ✅ Landing Page Editor

**Owner Portal:**
- ✅ **Owner Dashboard** - Executive overview
- ✅ **Financial Management** - Complete financial control  
- ✅ **Affiliate Program** - Strategic affiliate management
- ✅ **Staff Management** - Team administration
- ✅ **System Settings** - Platform-wide configuration
- ✅ **Audit Logs** - Security and compliance tracking

---

## 🆕 **NEW: User Management System**

### **Available to:** Admin & Owner roles only
### **Access:** `/admin/user-management`

### **🎯 Key Features:**

#### **📊 Dashboard Overview:**
- Total Users: 6
- Active Users: 4  
- Suspended Users: 1
- Disabled Users: 1

#### **👥 User Operations:**
1. **🔍 Search & Filter**
   - Search by name or email
   - Filter by role (User, Affiliate, Staff, Admin, Owner)
   - Filter by status (Active, Suspended, Disabled)

2. **➕ Add New Users**
   - Complete user creation form
   - Role assignment
   - Default active status

3. **✏️ Edit Users**
   - Update name, email, role, status
   - Real-time changes

4. **⚡ Status Management**
   - **Activate** - Enable user access
   - **Suspend** - Temporarily block access  
   - **Disable** - Permanently block access
   - **Delete** - Remove user entirely

5. **🎭 User Impersonation**
   - **Log in as any user** with one click
   - Secure session switching
   - Perfect for testing and support

#### **📋 Mock Users Available:**
1. **John Doe** (user@example.com) - USER - Active
2. **Jane Smith** (affiliate@example.com) - AFFILIATE - Active  
3. **Mike Johnson** (staff@example.com) - STAFF - Active
4. **Sarah Wilson** (admin@example.com) - ADMIN - Active
5. **Robert Brown** (suspended@example.com) - USER - Suspended
6. **Emily Davis** (disabled@example.com) - AFFILIATE - Disabled

#### **🛡️ Security Features:**
- Confirmation prompts for critical actions
- Role-based access control
- Action logging and audit trail
- Safe impersonation with session management

---

## 🧪 **Testing Scenarios**

### **User Management Testing:**
1. **Admin Login** → Navigate to Admin Tools → User Management
2. **Create New User** → Test different roles and statuses
3. **Search & Filter** → Test search functionality with various criteria
4. **Status Changes** → Test activate/suspend/disable operations
5. **User Impersonation** → Click "Log in as user" icon → Verify session switch
6. **Edit Users** → Update user information and verify changes
7. **Delete Users** → Test deletion with confirmation

### **Role Verification:**
- **Staff** should NOT see User Management
- **User/Affiliate** should NOT have access to admin areas  
- **Admin/Owner** should have full User Management access

### **Impersonation Testing:**
1. As Admin/Owner → Impersonate a User → Verify USER navigation
2. As Admin/Owner → Impersonate an Affiliate → Verify AFFILIATE features
3. As Admin/Owner → Impersonate Staff → Verify STAFF portal access

---

## 🎯 **Navigation Quick Reference**

| Role | Dashboard | User Mgmt | Staff Tools | Admin Tools | Owner Tools |
|------|-----------|-----------|-------------|-------------|-------------|
| User | ✅ Basic | ❌ No | ❌ No | ❌ No | ❌ No |
| Affiliate | ✅ Affiliate | ❌ No | ❌ No | ❌ No | ❌ No |
| Staff | ✅ Staff | ❌ No | ✅ Full | ❌ No | ❌ No |
| Admin | ✅ All | ✅ **Full** | ✅ Full | ✅ Full | ✅ View Only |
| Owner | ✅ All | ✅ **Full** | ✅ Limited | ✅ Full | ✅ Full |

---

## 📱 **Access URLs**
- **Login:** `http://localhost:5182/#/login`
- **User Management:** `http://localhost:5182/#/admin/user-management`
- **Staff Profile:** `http://localhost:5182/#/staff/profile`
- **Affiliate Account:** `http://localhost:5182/#/affiliate/account`
- **Marketing Materials:** `http://localhost:5182/#/affiliate/marketing-materials`

**Note:** Port may vary (5180-5182) due to multiple instances 