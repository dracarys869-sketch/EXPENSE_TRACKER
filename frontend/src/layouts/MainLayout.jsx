import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
