import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-brand-800 border-b border-brand-200 dark:border-brand-700 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-brand-800 dark:text-white hidden sm:block">
          Welcome back, <span className="text-brand-600 dark:text-brand-400">{user?.full_name?.split(' ')[0]}</span> 👋
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors border border-brand-200 dark:border-brand-700"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left pr-2">
            <p className="text-sm font-semibold text-brand-800 dark:text-brand-200 leading-tight">{user?.full_name}</p>
            <p className="text-xs text-brand-500 dark:text-brand-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
