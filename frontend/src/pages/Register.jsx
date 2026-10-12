import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="bg-white border-b border-stone-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/welcome" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-800 text-white">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">ExpenseTracker</span>
          </Link>
          <p className="text-sm text-stone-600">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-green-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-6 py-10 md:py-14">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-1.5 text-sm text-stone-600">Takes less than a minute.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-800 py-2.5 text-sm font-semibold text-white hover:bg-green-900 transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
