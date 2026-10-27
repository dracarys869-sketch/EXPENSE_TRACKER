import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleCollapsed = (value) => {
    setCollapsed(value);
    localStorage.setItem('sidebar_collapsed', String(value));
  };

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-canvas text-slate-800">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Sidebar navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={toggleCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] outline-none sm:p-6 sm:pb-24 md:pb-8 lg:p-8">
          <div className="page-enter mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
