import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 h-screen sticky top-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-gray-900 dark:text-white truncate tracking-tight">
              Expense<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
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
                `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
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

      {/* Footer / Theme & Logout */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400 shrink-0" /> : <Moon className="w-5 h-5 text-indigo-500 shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

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
