import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  Tag,
  Target,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Budgets', path: '/budgets', icon: Target },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    ...(user?.is_admin ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`hidden md:flex flex-col bg-white dark:bg-brand-800 border-r border-brand-200 dark:border-brand-700 transition-all duration-300 z-30 h-screen sticky top-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-brand-100 dark:border-brand-700">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-brand-900 dark:text-white truncate tracking-tight">
              Expense<span className="text-brand-600 dark:text-brand-400">Pro</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-700 dark:text-brand-400 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                  : 'text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-700/50 hover:text-brand-900 dark:hover:text-white'
                }`
              }
              title={collapsed ? item.name : ''}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-brand-100 dark:border-brand-700 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
