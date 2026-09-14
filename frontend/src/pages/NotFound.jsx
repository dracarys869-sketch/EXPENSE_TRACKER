import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 dark:bg-brand-900 p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-brand-500/10">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-900 dark:text-white">404 - Page Not Found</h1>
        <p className="text-brand-500 dark:text-brand-400">
          The requested route doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
