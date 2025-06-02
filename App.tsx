
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignupWizardPage from './pages/SignupWizardPage'; // Import the new Signup Page
import DashboardPage from './pages/DashboardPage';
import ReviewsPage from './pages/ReviewsPage';
import ChatPage from './pages/ChatPage';
import MediaPage from './pages/MediaPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import { ROUTES } from './constants';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types';

// User specific pages
import UserSupportTicketsPage from './pages/user/UserSupportTicketsPage';

// Affiliate Pages
import AffiliateDashboardPage from './pages/affiliate/AffiliateDashboardPage';
import AffiliateMarketingToolsPage from './pages/affiliate/AffiliateMarketingToolsPage';

// Admin Affiliate Management Pages
import AdminAffiliatesPage from './pages/admin/AdminAffiliatesPage';
import AdminMarketingMediaPage from './pages/admin/AdminMarketingMediaPage';

// Staff Portal Pages
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import StaffTasksPage from './pages/staff/StaffTasksPage';
import StaffItemsToReviewPage from './pages/staff/StaffItemsToReviewPage';
import StaffSupportTicketsPage from './pages/staff/StaffSupportTicketsPage';
import StaffNotificationsPage from './pages/staff/StaffNotificationsPage';
// import StaffKnowledgeBasePage from './pages/staff/StaffKnowledgeBasePage'; // Future

// Owner Portal Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerFinancialsPage from './pages/owner/OwnerFinancialsPage';
import OwnerAffiliateOversightPage from './pages/owner/OwnerAffiliateOversightPage';
import OwnerStaffManagementPage from './pages/owner/OwnerStaffManagementPage';
import OwnerSystemSettingsPage from './pages/owner/OwnerSystemSettingsPage';
import OwnerAuditLogsPage from './pages/owner/OwnerAuditLogsPage';
import OwnerLandingPageEditorPage from './pages/owner/OwnerLandingPageEditorPage'; // New import


interface ProtectedRouteProps {
  children: React.ReactNode;
}

// This general ProtectedRoute can be kept for routes accessible by ANY authenticated user
// However, for more granular control, RoleProtectedRoute is better.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) { 
    return (
      <div className="flex justify-center items-center h-screen">
        Loading application... 
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Layout>{children}</Layout>;
};

interface RoleProtectedRouteProps extends ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
     return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.warn(`User with role ${user.role} tried to access ${location.pathname} (allowed for ${allowedRoles.join(', ')}). Redirecting...`);
    
    let defaultRedirectPath = ROUTES.LANDING; // Default for non-recognized roles or general access denial.
    if (user.role === UserRole.AFFILIATE) {
        defaultRedirectPath = ROUTES.CHAT;
    } else if (user.role === UserRole.USER || user.role === UserRole.ADMIN ) {
        defaultRedirectPath = ROUTES.DASHBOARD;
    } else if (user.role === UserRole.STAFF) {
        defaultRedirectPath = ROUTES.STAFF_DASHBOARD;
    } else if (user.role === UserRole.OWNER) {
        defaultRedirectPath = ROUTES.OWNER_DASHBOARD;
    }
    
    return <Navigate to={defaultRedirectPath} replace />; 
  }

  return <Layout>{children}</Layout>;
};


const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading application state...</div>;
  }
  
  // Handle redirects for authenticated users
  if (user) {
    // If any authenticated user tries to access the public landing page or signup page, redirect them
    if (location.pathname === ROUTES.LANDING || location.pathname === ROUTES.SIGNUP) {
      if (user.role === UserRole.AFFILIATE) {
        return <Navigate to={ROUTES.CHAT} replace />;
      } else if (user.role === UserRole.STAFF) {
        return <Navigate to={ROUTES.STAFF_DASHBOARD} replace/>;
      } else if (user.role === UserRole.OWNER) {
        return <Navigate to={ROUTES.OWNER_DASHBOARD} replace/>;
      }
       else {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
      }
    }

    // If any authenticated user tries to access /login, redirect them
    if (location.pathname === ROUTES.LOGIN) {
      if (user.role === UserRole.AFFILIATE) {
        return <Navigate to={ROUTES.CHAT} replace />;
      } else if (user.role === UserRole.STAFF) {
        return <Navigate to={ROUTES.STAFF_DASHBOARD} replace/>;
      } else if (user.role === UserRole.OWNER) {
        return <Navigate to={ROUTES.OWNER_DASHBOARD} replace/>;
      }
       else {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
      }
    }
  }


  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupWizardPage />} /> {/* New Signup Route */}
      
      {/* Landing Page - Public, no Layout wrapper. Authenticated users are redirected above. */}
      <Route 
        path={ROUTES.LANDING} 
        element={<LandingPage />} 
      />
      
      {/* Authenticated Routes using RoleProtectedRoute and Layout */}
      <Route 
        path={ROUTES.DASHBOARD} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><DashboardPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.REVIEWS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><ReviewsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.MEDIA} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><MediaPage /></RoleProtectedRoute>} 
      />
      
      <Route 
        path={ROUTES.CHAT} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.AFFILIATE, UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><ChatPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.PROFILE} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.AFFILIATE, UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><ProfilePage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.SETTINGS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><SettingsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.CUSTOMER_SUPPORT_TICKETS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.USER, UserRole.AFFILIATE]}><UserSupportTicketsPage /></RoleProtectedRoute>} 
      />

      <Route 
        path={ROUTES.AFFILIATE_DASHBOARD} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.AFFILIATE]}><AffiliateDashboardPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.AFFILIATE_MARKETING_TOOLS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.AFFILIATE]}><AffiliateMarketingToolsPage /></RoleProtectedRoute>} 
      />

      <Route 
        path={ROUTES.ADMIN_AFFILIATES} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.OWNER]}><AdminAffiliatesPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.ADMIN_MARKETING_MEDIA} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.OWNER]}><AdminMarketingMediaPage /></RoleProtectedRoute>} 
      />
      
      <Route 
        path={ROUTES.STAFF_DASHBOARD} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><StaffDashboardPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.STAFF_TASKS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><StaffTasksPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.STAFF_ITEMS_TO_REVIEW} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><StaffItemsToReviewPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.STAFF_SUPPORT_TICKETS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><StaffSupportTicketsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.STAFF_NOTIFICATIONS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}><StaffNotificationsPage /></RoleProtectedRoute>} 
      />
      
      <Route 
        path={ROUTES.OWNER_DASHBOARD} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerDashboardPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_FINANCIALS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerFinancialsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_AFFILIATE_OVERSIGHT} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerAffiliateOversightPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_STAFF_MANAGEMENT} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerStaffManagementPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_SYSTEM_SETTINGS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerSystemSettingsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_AUDIT_LOGS} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER]}><OwnerAuditLogsPage /></RoleProtectedRoute>} 
      />
      <Route 
        path={ROUTES.OWNER_LANDING_PAGE_EDITOR} 
        element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.ADMIN]}><OwnerLandingPageEditorPage /></RoleProtectedRoute>} 
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
