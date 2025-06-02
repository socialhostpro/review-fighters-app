import React from 'react';
import { LogOut, UserCircle, Bell, Menu } from 'lucide-react'; // Added Menu icon
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

interface NavbarProps {
  toggleMobileSidebar?: () => void; // Prop to toggle mobile sidebar
}

const Navbar: React.FC<NavbarProps> = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-surface shadow-md p-4 flex justify-between items-center sticky top-0 z-20"> {/* Increased z-index for navbar */}
      <div className="flex items-center">
        {/* Hamburger menu button for mobile */}
        {toggleMobileSidebar && (
          <button
            onClick={toggleMobileSidebar}
            className="text-textPrimary p-2 mr-2 md:hidden rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-textPrimary hidden sm:block">Company Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-textSecondary hover:text-primary p-1 rounded-full hover:bg-primary-light/10">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <UserCircle size={24} className="text-textSecondary" />
          <span className="text-textPrimary text-sm sm:text-base">{user?.name || user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-textSecondary hover:text-red-500 transition-colors duration-150 p-1 rounded-md hover:bg-red-100"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="ml-1 hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;