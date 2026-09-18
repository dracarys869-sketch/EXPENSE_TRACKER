import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Tag, Target, BarChart3, Settings, ShieldCheck } from 'lucide-react';

const MobileNav = () => {
  const { user } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Budgets', path: '/budgets', icon: Target },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
    ...(user?.is_admin ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-brand-800/90 backdrop-blur-lg border-t border-brand-200 dark:border-brand-700 z-40 px-2 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg text-xs font-medium transition-colors ${isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-brand-500 dark:text-brand-400 hover:text-brand-900 dark:hover:text-white'
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
