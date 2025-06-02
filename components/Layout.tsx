import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Static Sidebar for medium screens and up */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleMobileSidebar}
            aria-hidden="true"
          ></div>
          {/* Sidebar container */}
          <div className="fixed top-0 left-0 h-full z-40 transform transition-transform ease-in-out duration-300 md:hidden"
            style={{ transform: isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            <Sidebar onNavLinkClick={toggleMobileSidebar} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;