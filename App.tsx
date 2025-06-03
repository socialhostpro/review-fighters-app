import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import convex from './convex';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignupWizardPage from './pages/SignupWizardPage'; // Import the new Signup Page
import DashboardPage from './pages/DashboardPage';
import ReviewsPage from './pages/ReviewsPage';
import MediaPage from './pages/MediaPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import { ROUTES } from './constants';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Affiliate Pages
import AffiliateDashboardPage from './pages/affiliate/AffiliateDashboardPage';
import AffiliateMarketingToolsPage from './pages/affiliate/AffiliateMarketingToolsPage';
import AffiliateAccountPage from './pages/affiliate/AffiliateAccountPage';
import AffiliateMarketingMaterialsPage from './pages/affiliate/AffiliateMarketingMaterialsPage';

// Admin Affiliate Management Pages
import AdminAffiliatesPage from './pages/admin/AdminAffiliatesPage';
import AdminMarketingMediaPage from './pages/admin/AdminMarketingMediaPage';
import AdminRolePermissionsPage from './pages/admin/AdminRolePermissionsPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminEmailSettingsPage from './pages/admin/AdminEmailSettingsPage';

// Sales Portal Pages
import SalesDashboardPage from './pages/sales/SalesDashboardPage';

// Staff Portal Pages
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import StaffProfilePage from './pages/staff/StaffProfilePage';
import StaffTasksPage from './pages/staff/StaffTasksPage';
import StaffItemsToReviewPage from './pages/staff/StaffItemsToReviewPage';
import StaffNotificationsPage from './pages/staff/StaffNotificationsPage';
import StaffOnboardingReviewsPage from './pages/staff/StaffOnboardingReviewsPage';
// import StaffKnowledgeBasePage from './pages/staff/StaffKnowledgeBasePage'; // Future

// Owner Portal Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerFinancialsPage from './pages/owner/OwnerFinancialsPage';
import OwnerAffiliateOversightPage from './pages/owner/OwnerAffiliateOversightPage';
import OwnerStaffManagementPage from './pages/owner/OwnerStaffManagementPage';
import OwnerSystemSettingsPage from './pages/owner/OwnerSystemSettingsPage';
import OwnerAuditLogsPage from './pages/owner/OwnerAuditLogsPage';
import OwnerLandingPageEditorPage from './pages/owner/OwnerLandingPageEditorPage'; // New import

// Onboarding pages
import OnboardingSignupPage from './pages/onboarding/OnboardingSignupPage';
import OnboardingDemoPage from './pages/onboarding/OnboardingDemoPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: UserRole[];
}

// This general ProtectedRoute can be kept for routes accessible by ANY authenticated user
// However, for more granular control, RoleProtectedRoute is better.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
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

  if (!roles.includes(user.role)) {
    console.log(`Access denied: ${user.role} user redirected from ${location.pathname}`);
    
    let defaultRedirectPath = ROUTES.LANDING; // Default for non-recognized roles or general access denial.
    if (user.role === UserRole.AFFILIATE) {
        defaultRedirectPath = ROUTES.AFFILIATE_DASHBOARD;
    } else if (user.role === UserRole.SALES) {
        defaultRedirectPath = ROUTES.SALES_DASHBOARD;
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
    console.log(`Access denied: ${user.role} user redirected from ${location.pathname}`);
    
    let defaultRedirectPath = ROUTES.LANDING; // Default for non-recognized roles or general access denial.
    if (user.role === UserRole.AFFILIATE) {
        defaultRedirectPath = ROUTES.AFFILIATE_DASHBOARD;
    } else if (user.role === UserRole.SALES) {
        defaultRedirectPath = ROUTES.SALES_DASHBOARD;
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
        return <Navigate to={ROUTES.AFFILIATE_DASHBOARD} replace />;
      } else if (user.role === UserRole.SALES) {
        return <Navigate to={ROUTES.SALES_DASHBOARD} replace />;
      } else if (user.role === UserRole.STAFF) {
        return <Navigate to={ROUTES.STAFF_DASHBOARD} replace/>;
      } else if (user.role === UserRole.OWNER) {
        return <Navigate to={ROUTES.OWNER_DASHBOARD} replace/>;
      } else if (user.role === UserRole.ADMIN) {
        return <Navigate to={ROUTES.ADMIN_USER_MANAGEMENT} replace />;
      } else {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
      }
    }

    // If any authenticated user tries to access /login, redirect them
    if (location.pathname === ROUTES.LOGIN) {
      if (user.role === UserRole.AFFILIATE) {
        return <Navigate to={ROUTES.AFFILIATE_DASHBOARD} replace />;
      } else if (user.role === UserRole.SALES) {
        return <Navigate to={ROUTES.SALES_DASHBOARD} replace />;
      } else if (user.role === UserRole.STAFF) {
        return <Navigate to={ROUTES.STAFF_DASHBOARD} replace/>;
      } else if (user.role === UserRole.OWNER) {
        return <Navigate to={ROUTES.OWNER_DASHBOARD} replace/>;
      } else if (user.role === UserRole.ADMIN) {
        return <Navigate to={ROUTES.ADMIN_USER_MANAGEMENT} replace />;
      } else {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
      }
    }
  }


  return (
    <Routes>
      {/* Landing Page */}
      <Route path={ROUTES.LANDING} element={<LandingPage />} />

      {/* Onboarding Routes - Public */}
      <Route path={ROUTES.ONBOARDING_SIGNUP} element={<OnboardingSignupPage />} />
      <Route path={ROUTES.ONBOARDING_DEMO} element={<OnboardingDemoPage />} />
      
      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP_WIZARD} element={<SignupWizardPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute roles={[UserRole.USER]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.REVIEWS}
        element={
          <ProtectedRoute roles={[UserRole.USER]}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MEDIA}
        element={
          <ProtectedRoute roles={[UserRole.USER]}>
            <MediaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute roles={[UserRole.AFFILIATE, UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute roles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.AFFILIATE_DASHBOARD}
        element={
          <ProtectedRoute roles={[UserRole.AFFILIATE]}>
            <AffiliateDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AFFILIATE_MARKETING_TOOLS}
        element={
          <ProtectedRoute roles={[UserRole.AFFILIATE]}>
            <AffiliateMarketingToolsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AFFILIATE_ACCOUNT}
        element={
          <ProtectedRoute roles={[UserRole.AFFILIATE]}>
            <AffiliateAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AFFILIATE_MARKETING_MATERIALS}
        element={
          <ProtectedRoute roles={[UserRole.AFFILIATE]}>
            <AffiliateMarketingMaterialsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.SALES_DASHBOARD}
        element={
          <ProtectedRoute roles={[UserRole.SALES]}>
            <SalesDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_AFFILIATES}
        element={
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.OWNER]}>
            <AdminAffiliatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_MARKETING_MEDIA}
        element={
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.OWNER]}>
            <AdminMarketingMediaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ROLE_PERMISSIONS}
        element={
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.OWNER]}>
            <AdminRolePermissionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_USER_MANAGEMENT}
        element={
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.OWNER]}>
            <AdminUserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_EMAIL_SETTINGS}
        element={
          <ProtectedRoute roles={[UserRole.ADMIN, UserRole.OWNER]}>
            <AdminEmailSettingsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.STAFF_DASHBOARD}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF_PROFILE}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF_TASKS}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffTasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF_ITEMS_TO_REVIEW}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffItemsToReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF_ONBOARDING_REVIEWS}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffOnboardingReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF_NOTIFICATIONS}
        element={
          <ProtectedRoute roles={[UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER]}>
            <StaffNotificationsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.OWNER_DASHBOARD}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_FINANCIALS}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerFinancialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_AFFILIATE_OVERSIGHT}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerAffiliateOversightPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_STAFF_MANAGEMENT}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerStaffManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_SYSTEM_SETTINGS}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerSystemSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_AUDIT_LOGS}
        element={
          <ProtectedRoute roles={[UserRole.OWNER]}>
            <OwnerAuditLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER_LANDING_PAGE_EDITOR}
        element={
          <ProtectedRoute roles={[UserRole.OWNER, UserRole.ADMIN]}>
            <OwnerLandingPageEditorPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


const App: React.FC = () => {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ConvexProvider>
  );
};

export default App;
