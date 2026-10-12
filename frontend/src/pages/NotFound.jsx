import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 bg-white border border-stone-200 text-stone-400 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-stone-600">
          This page doesn't exist or was moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-800 hover:bg-green-900 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back home</span>
          </Link>
          <Link
            to="/welcome"
            className="px-5 py-2.5 bg-white border border-stone-300 hover:border-stone-400 text-sm font-semibold rounded-lg transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
