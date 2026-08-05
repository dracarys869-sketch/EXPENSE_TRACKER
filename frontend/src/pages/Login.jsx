import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left side banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ExpenseTracker Pro</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Master your financial flow effortlessly.
          </h1>
          <p className="text-indigo-100 text-lg mb-6">
            Track expenses, manage categories, analyze monthly trends, and export instant reports with clean visual insights.
          </p>
          <div className="space-y-3">
            {['Secure JWT Authentication', 'Real-time Analytics & Interactive Charts', 'Custom Categories & Multi-Currency Support'].map((feat, i) => (
              <div key={i} className="flex items-center space-x-2 text-indigo-50 font-medium">
                <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-200">
          © 2026 ExpenseTracker Pro. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create account
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-3 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
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

export default Login;
