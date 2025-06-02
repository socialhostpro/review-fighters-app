
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    Home, Star, MessageCircle, FileText as MediaIcon, UserCircle as ProfileIcon, Settings, BarChart2, Users, Package, DollarSign, ExternalLink,
    Briefcase as StaffIcon, ListChecks, Eye as EyeIcon, Bell, HelpCircle as SupportIcon,
    ShieldCheck, SlidersHorizontal, Banknote, Landmark, Activity, LayoutDashboard // Added LayoutDashboard for Landing Page Editor
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
  const isUserRole = user?.role === UserRole.USER; // General user role
  const isStaffOrAdminOrOwner = user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER;


  return (
    <aside className="w-64 h-full bg-surface text-textPrimary p-4 space-y-2 shadow-lg flex flex-col">
      <div className="p-4 mb-4 flex justify-center items-center">
        <img src={logoUrl} alt="Review Fighters Logo" className="max-h-16 w-auto" />
      </div>
      <nav className="flex-grow overflow-y-auto">
        {/* General Links - Shown for USER role if not affiliate or staff/admin/owner. Also for staff/admin/owner */}
        {(isUserRole && !isAffiliate && !isStaffOrAdminOrOwner) || isStaffOrAdminOrOwner ? (
          <>
            <SidebarLink to={ROUTES.LANDING} icon={<Home size={20} />} label="Home" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.DASHBOARD} icon={<BarChart2 size={20} />} label="Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.REVIEWS} icon={<Star size={20} />} label="Reviews" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.MEDIA} icon={<MediaIcon size={20} />} label="Media Library" onClick={onNavLinkClick} />
          </>
        ) : null}


        {/* AI Chat is primary for Affiliates, also available for others */}
        <SidebarLink to={ROUTES.CHAT} icon={<MessageCircle size={20} />} label="AI Chat" onClick={onNavLinkClick} />
        
        {/* Profile is available for all */}
        <SidebarLink to={ROUTES.PROFILE} icon={<ProfileIcon size={20} />} label="Profile" onClick={onNavLinkClick} />

        {/* My Support Tickets for User and Affiliate roles */}
        {(isUserRole || isAffiliate) && !isStaffOrAdminOrOwner && (
            <SidebarLink to={ROUTES.CUSTOMER_SUPPORT_TICKETS} icon={<SupportIcon size={20} />} label="My Support Tickets" onClick={onNavLinkClick} />
        )}


        {/* Affiliate Specific Links - Only shown if the user is an Affiliate (and has an affiliateId) */}
        {isAffiliate && user?.affiliateId && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Affiliate Area</p>
            <SidebarLink to={ROUTES.AFFILIATE_DASHBOARD} icon={<DollarSign size={20} />} label="Affiliate Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.AFFILIATE_MARKETING_TOOLS} icon={<ExternalLink size={20} />} label="Marketing Tools" onClick={onNavLinkClick} />
          </>
        )}
        
        {/* Staff Portal Links - visible to STAFF, ADMIN, OWNER */}
        {isStaffOrAdminOrOwner && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Portal</p>
            <SidebarLink to={ROUTES.STAFF_DASHBOARD} icon={<StaffIcon size={20} />} label="Staff Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_TASKS} icon={<ListChecks size={20} />} label="My Tasks" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_ITEMS_TO_REVIEW} icon={<EyeIcon size={20} />} label="Items to Review" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_SUPPORT_TICKETS} icon={<SupportIcon size={20} />} label="Support Tickets" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.STAFF_NOTIFICATIONS} icon={<Bell size={20} />} label="Notifications" onClick={onNavLinkClick} />
          </>
        )}

        {/* Admin Links - visible to ADMIN or OWNER roles (specific admin tasks for affiliates) */}
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER) && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</p>
            <SidebarLink to={ROUTES.ADMIN_AFFILIATES} icon={<Users size={20} />} label="Manage Affiliates" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.ADMIN_MARKETING_MEDIA} icon={<Package size={20} />} label="Manage Mkt Media" onClick={onNavLinkClick} />
             {/* Landing Page Editor Link for Admin and Owner */}
            <SidebarLink to={ROUTES.OWNER_LANDING_PAGE_EDITOR} icon={<LayoutDashboard size={20} />} label="Landing Page Editor" onClick={onNavLinkClick} />
          </>
        )}

        {/* Owner Oversight Links - visible ONLY to OWNER role */}
        {user?.role === UserRole.OWNER && (
          <>
            <hr className="my-3 border-gray-200" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner Oversight</p>
            <SidebarLink to={ROUTES.OWNER_DASHBOARD} icon={<ShieldCheck size={20} />} label="Owner Dashboard" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_FINANCIALS} icon={<Banknote size={20} />} label="Financial Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AFFILIATE_OVERSIGHT} icon={<Landmark size={20} />} label="Affiliate Program" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_STAFF_MANAGEMENT} icon={<Users size={20} />} label="Staff Management" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_SYSTEM_SETTINGS} icon={<SlidersHorizontal size={20} />} label="System Settings" onClick={onNavLinkClick} />
            <SidebarLink to={ROUTES.OWNER_AUDIT_LOGS} icon={<Activity size={20} />} label="Audit Logs" onClick={onNavLinkClick} />
            {/* The Landing Page Editor link is now above in the Admin Tools section if owner is also admin, or could be duplicated here if desired, but might be redundant */}
          </>
        )}
      </nav>
      <div className="mt-auto">
         {/* Settings Page: Hide for pure Affiliates for now, or adapt its content if needed */}
         {/* Show settings for User (non-affiliate, non-staff) and Staff/Admin/Owner */}
         {((isUserRole && !isAffiliate && !isStaffOrAdminOrOwner) || isStaffOrAdminOrOwner) && (
            <SidebarLink to={ROUTES.SETTINGS} icon={<Settings size={20} />} label="Settings" onClick={onNavLinkClick} />
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
