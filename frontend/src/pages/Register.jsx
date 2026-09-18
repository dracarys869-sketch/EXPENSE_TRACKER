import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await register(fullName, email, password, confirmPassword);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-50 dark:bg-brand-900">
      <div className="w-full flex items-center justify-center p-8 sm:p-12">
        <div className="relative max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-brand-900 dark:text-white">ExpenseTracker Pro</span>
            </div>
            <Link
              to="/login"
              aria-label="Back to login"
              title="Back to login"
              className="absolute top-0 right-0 inline-flex items-center justify-center w-10 h-10 rounded-xl text-brand-500 hover:bg-brand-100 hover:text-brand-900 dark:text-brand-400 dark:hover:bg-brand-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-3xl font-bold text-brand-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-3 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-300 dark:border-brand-700 dark:bg-brand-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-300 dark:border-brand-700 dark:bg-brand-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-300 dark:border-brand-700 dark:bg-brand-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-300 dark:border-brand-700 dark:bg-brand-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
