import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tag, BarChart3, Settings } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40 px-2 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
