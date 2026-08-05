import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
          Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.full_name?.split(' ')[0]}</span> 👋
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick theme toggle for mobile & header */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left pr-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{user?.full_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
