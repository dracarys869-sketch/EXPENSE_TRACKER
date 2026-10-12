import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wallet, Mail, Lock, AlertCircle, ArrowLeft, Check, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const { login, logout, loading } = useAuth();
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
      if (adminLogin && !result.user.is_admin) {
        logout();
        setError('This account does not have administrator access.');
        return;
      }
      navigate(adminLogin ? '/admin' : '/');
    } else {
      setError(result.message);
    }
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
    setSuccess('');
    setOtpSent(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setRecoveryLoading(true);
    try {
      const res = await api.post('/send-otp', { email });
      setOtpSent(true);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send the verification code.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setRecoveryLoading(true);
    try {
      const res = await api.post('/reset-password-otp', {
        email,
        otp,
        new_password: newPassword,
      });
      setSuccess(res.data.message);
      setShowForgotPassword(false);
      setOtpSent(false);
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset your password.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition';

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
            New here?{' '}
            <Link to="/register" className="font-semibold text-green-800 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl items-start gap-10 px-6 py-10 md:grid-cols-2 md:gap-14 md:py-16">
        <section className="pt-2 md:pt-10">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-[42px]">
            Know where your money goes.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone-600">
            Log daily expenses, set monthly budgets, and check simple reports — all in one place.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-stone-700">
            {[
              'Quick expense entry with categories',
              'Monthly budgets and spending reports',
              'Works on desktop and mobile',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-800/10">
                  <Check className="h-3.5 w-3.5 text-green-800" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {showForgotPassword ? 'Reset password' : 'Sign in'}
          </h2>
          <p className="mt-1.5 text-sm text-stone-600">
            {showForgotPassword ? (
              'Enter your email and we will send you a code.'
            ) : (
              <>
                Welcome back.{' '}
                <Link to="/register" className="font-semibold text-green-800 hover:underline">
                  Create an account
                </Link>
              </>
            )}
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-900">
              <span>{success}</span>
            </div>
          )}

          {showForgotPassword ? (
            <form className="mt-6 space-y-4" onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
              {otpSent && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">6-digit code</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter code" className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">New password</label>
                      <input type="password" minLength="6" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Confirm</label>
                      <input type="password" minLength="6" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repeat password" className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/15 transition" />
                    </div>
                  </div>
                </>
              )}
              <button type="submit" disabled={recoveryLoading} className="w-full rounded-lg bg-green-800 py-2.5 text-sm font-semibold text-white hover:bg-green-900 transition disabled:opacity-50">{recoveryLoading ? 'Please wait…' : otpSent ? 'Update password' : 'Send code'}</button>
              <button type="button" onClick={() => { setShowForgotPassword(false); setError(''); setSuccess(''); }} className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900"><ArrowLeft className="h-4 w-4" /> Back to sign in</button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-stone-700">Password</label>
                  <button type="button" onClick={openForgotPassword} className="text-sm text-stone-500 hover:text-green-800 hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.checked)}
                  className="h-4 w-4 rounded accent-green-800"
                />
                Sign in as admin
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-800 py-2.5 text-sm font-semibold text-white hover:bg-green-900 transition disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="flex items-center gap-1.5 text-xs text-stone-500">
                <KeyRound className="h-3.5 w-3.5" />
                Your session stays signed in for 30 days on this device.
              </p>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default Login;
