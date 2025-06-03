import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    Home, Star, FileText as MediaIcon, FileText, UserCircle as ProfileIcon, Settings, BarChart2, Users, Package, DollarSign, ExternalLink,
    Briefcase as StaffIcon, ListChecks, Eye as EyeIcon, Bell, HelpCircle as SupportIcon,
    ShieldCheck, SlidersHorizontal, Banknote, Landmark, Activity, LayoutDashboard, Shield, CreditCard, Share2,
    BarChart3, BarChartHorizontal, TrendingUp, Clock, Crown, UserCheck, Calendar, CheckSquare, ClipboardList, Mail
} from 'lucide-react';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const commonLinkClasses = "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150";
const activeLinkClasses = "bg-primary-light text-white shadow-lg";
const inactiveLinkClasses = "text-gray-600 hover:bg-gray-200 hover:text-primary";
const logoUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
    onClick={onClick}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

interface SidebarProps {
  onNavLinkClick?: () => void; // For closing mobile sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ onNavLinkClick }) => {
  const { user } = useAuth();
  const isAffiliate = user?.role === UserRole.AFFILIATE;
  const isUserRole = user?.role === UserRole.USER;
  const isStaff = user?.role === UserRole.STAFF;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isOwner = user?.role === UserRole.OWNER;
  const isSales = user?.role === UserRole.SALES;

  return (
    <aside className="w-64 h-full bg-surface text-textPrimary p-4 space-y-2 shadow-lg flex flex-col">
      <div className="p-4 mb-4 flex justify-center items-center">
        <img src={logoUrl} alt="Review Fighters Logo" className="max-h-16 w-auto" />
      </div>
      <nav className="flex-grow overflow-y-auto">
        
        {/* USER ROLE - Basic features */}
        {isUserRole && (
          <>
            <SidebarLink to={ROUTES.LANDING} icon={<Home size={20} />} label="Home" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.DASHBOARD} icon={<BarChart2 size={20} />} label="Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.REVIEWS} icon={<Star size={20} />} label="Reviews" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.MEDIA} icon={<MediaIcon size={20} />} label="Media Library" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.PROFILE} icon={<ProfileIcon size={20} />} label="Profile" onClick={onNavLinkClick} />
          </>
        )}

        {/* AFFILIATE ROLE - Profile, Account, Marketing Materials */}
        {isAffiliate && (
          <>
            <SidebarLink to={ROUTES.PROFILE} icon={<ProfileIcon size={20} />} label="Profile" onClick={onNavLinkClick} />
            
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Affiliate Account</p>
            <SidebarLink to={ROUTES.AFFILIATE_DASHBOARD} icon={<BarChart2 size={20} />} label="Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.AFFILIATE_ACCOUNT} icon={<CreditCard size={20} />} label="Account & Balance" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.AFFILIATE_MARKETING_MATERIALS} icon={<Share2 size={20} />} label="Marketing Materials" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.AFFILIATE_MARKETING_TOOLS} icon={<ExternalLink size={20} />} label="Marketing Tools" onClick={onNavLinkClick} />
          </>
        )}

        {/* SALES ROLE - Profile, Dashboard, Tasks, Account */}
        {isSales && (
          <>
            <SidebarLink to={ROUTES.PROFILE} icon={<ProfileIcon size={20} />} label="Profile" onClick={onNavLinkClick} />
            
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales Portal</p>
            <SidebarLink to={ROUTES.SALES_DASHBOARD} icon={<BarChart2 size={20} />} label="Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.SALES_TASKS} icon={<ListChecks size={20} />} label="Available Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.SALES_MY_TASKS} icon={<CheckSquare size={20} />} label="My Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.SALES_ACCOUNT} icon={<DollarSign size={20} />} label="Account & Balance" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.SALES_NOTIFICATIONS} icon={<Bell size={20} />} label="Notifications" onClick={onNavLinkClick} />
          </>
        )}

        {/* STAFF ROLE - Only Staff Portal */}
        {isStaff && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Portal</p>
            <SidebarLink to={ROUTES.STAFF_DASHBOARD} icon={<StaffIcon size={20} />} label="Staff Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_PROFILE} icon={<ProfileIcon size={20} />} label="Staff Profile" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_TASKS} icon={<ListChecks size={20} />} label="My Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ITEMS_TO_REVIEW} icon={<EyeIcon size={20} />} label="Items to Review" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ONBOARDING_REVIEWS} icon={<UserCheck size={20} />} label="Onboarding Reviews" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_NOTIFICATIONS} icon={<Bell size={20} />} label="Notifications" onClick={onNavLinkClick} />
          </>
        )}

        {/* ADMIN ROLE - Staff Tasks + Admin Tools + Owner Features (no customer dashboard) */}
        {isAdmin && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Tasks</p>
            <SidebarLink to={ROUTES.STAFF_TASKS} icon={<ListChecks size={20} />} label="My Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ITEMS_TO_REVIEW} icon={<EyeIcon size={20} />} label="Items to Review" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ONBOARDING_REVIEWS} icon={<UserCheck size={20} />} label="Onboarding Reviews" onClick={onNavLinkClick} />

            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</p>
            <SidebarLink to={ROUTES.ADMIN_AFFILIATES} icon={<Users size={20} />} label="Manage Affiliates" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_MARKETING_MEDIA} icon={<Package size={20} />} label="Manage Marketing Media" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_ROLE_PERMISSIONS} icon={<Shield size={20} />} label="Role Permissions" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_USER_MANAGEMENT} icon={<UserCheck size={20} />} label="User Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_EMAIL_SETTINGS} icon={<Mail size={20} />} label="Email Settings" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_ONBOARDING_DASHBOARD} icon={<LayoutDashboard size={20} />} label="Onboarding Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_LANDING_PAGE_EDITOR} icon={<LayoutDashboard size={20} />} label="Landing Page Editor" onClick={onNavLinkClick} />

            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner Features</p>
            <SidebarLink to={ROUTES.OWNER_DASHBOARD} icon={<ShieldCheck size={20} />} label="Owner Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_FINANCIALS} icon={<Banknote size={20} />} label="Financial Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AFFILIATE_OVERSIGHT} icon={<Activity size={20} />} label="Affiliate Oversight" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_STAFF_MANAGEMENT} icon={<StaffIcon size={20} />} label="Staff Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_SYSTEM_SETTINGS} icon={<Settings size={20} />} label="System Settings" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AUDIT_LOGS} icon={<FileText size={20} />} label="Audit Logs" onClick={onNavLinkClick} />
          </>
        )}

        {/* OWNER ROLE - All Administrative and Management Features */}
        {isOwner && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Tasks</p>
            <SidebarLink to={ROUTES.STAFF_TASKS} icon={<ListChecks size={20} />} label="My Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ONBOARDING_REVIEWS} icon={<UserCheck size={20} />} label="Onboarding Reviews" onClick={onNavLinkClick} />

            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</p>
            <SidebarLink to={ROUTES.ADMIN_AFFILIATES} icon={<Users size={20} />} label="Manage Affiliates" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_MARKETING_MEDIA} icon={<Package size={20} />} label="Manage Marketing Media" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_ROLE_PERMISSIONS} icon={<Shield size={20} />} label="Role Permissions" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_USER_MANAGEMENT} icon={<UserCheck size={20} />} label="User Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_EMAIL_SETTINGS} icon={<Mail size={20} />} label="Email Settings" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_ONBOARDING_DASHBOARD} icon={<LayoutDashboard size={20} />} label="Onboarding Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_LANDING_PAGE_EDITOR} icon={<LayoutDashboard size={20} />} label="Landing Page Editor" onClick={onNavLinkClick} />

            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner Portal</p>
            <SidebarLink to={ROUTES.OWNER_DASHBOARD} icon={<ShieldCheck size={20} />} label="Owner Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_FINANCIALS} icon={<Banknote size={20} />} label="Financial Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AFFILIATE_OVERSIGHT} icon={<Activity size={20} />} label="Affiliate Oversight" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_STAFF_MANAGEMENT} icon={<StaffIcon size={20} />} label="Staff Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_SYSTEM_SETTINGS} icon={<Settings size={20} />} label="System Settings" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AUDIT_LOGS} icon={<FileText size={20} />} label="Audit Logs" onClick={onNavLinkClick} />
          </>
        )}
      </nav>
      
      <div className="mt-auto">
         {/* Settings Page: Available for User, Staff, Admin, Owner (not Affiliate or Sales) */}
         {!isAffiliate && !isSales && (
            <SidebarLink to={ROUTES.SETTINGS} icon={<Settings size={20} />} label="Settings" onClick={onNavLinkClick} />
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
