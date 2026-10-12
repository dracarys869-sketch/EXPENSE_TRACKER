import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-brand-800 border-b border-brand-200 dark:border-brand-700 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-stone-900 dark:text-white hidden sm:block">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, <span className="text-stone-600 dark:text-stone-300">{user?.full_name?.split(' ')[0]}</span>
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700"
        >
          <div className="w-8 h-8 rounded-md bg-black text-white flex items-center justify-center font-bold text-sm">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left pr-2">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">{user?.full_name}</p>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
