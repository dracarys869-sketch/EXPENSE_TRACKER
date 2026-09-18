import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wallet, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex bg-white text-black">
      {/* Left side banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EDEAE1] border-r-2 border-[#20321E] p-12 text-black flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#466245] flex items-center justify-center text-black border-2 border-[#20321E] shadow-sm">
              <Wallet className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black text-black tracking-tight">
              ExpenseTracker <span className="text-[#466245]">Pro</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight mb-4 text-black">
            Master your financial flow effortlessly.
          </h1>
          <p className="text-black text-lg mb-6 font-medium">
            Track expenses, manage categories, analyze monthly trends, and export instant reports with clean visual insights.
          </p>
          <div className="space-y-3">
            {['Secure JWT Authentication', 'Real-time Analytics & Interactive Charts', 'Custom Categories & Multi-Currency Support'].map((feat, i) => (
              <div key={i} className="flex items-center space-x-2 text-black font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#466245] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm font-semibold text-black">
          © 2026 ExpenseTracker Pro. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Sign in to your account</h2>
            <p className="mt-2 text-sm text-black font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-black underline hover:text-[#466245]">
                Create account
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-600 flex items-center space-x-3 text-black font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-600 flex items-center space-x-3 text-black font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {showForgotPassword ? (
            <form className="mt-8 space-y-6" onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
              <div>
                <h3 className="flex items-center gap-2 text-xl font-extrabold text-black"><KeyRound className="w-5 h-5" /> Change password</h3>
                <p className="mt-2 text-sm text-black font-medium">We will send a one-time verification code to your email.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#20321E]" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors" />
                </div>
              </div>
              {otpSent && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1.5">Email OTP</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="w-full px-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1.5">New Password</label>
                    <input type="password" minLength="6" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1.5">Confirm New Password</label>
                    <input type="password" minLength="6" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repeat new password" className="w-full px-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors" />
                  </div>
                </>
              )}
              <button type="submit" disabled={recoveryLoading} className="w-full py-3.5 px-4 bg-[#DDD8CA] hover:bg-[#466245] text-black font-extrabold text-base rounded-xl border-2 border-[#20321E] shadow-[4px_4px_0px_#20321E] transition-all disabled:opacity-50">{recoveryLoading ? 'Please wait...' : otpSent ? 'Change Password' : 'Send Email OTP'}</button>
              <button type="button" onClick={() => { setShowForgotPassword(false); setError(''); setSuccess(''); }} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-black hover:text-[#466245]"><ArrowLeft className="w-4 h-4" /> Back to sign in</button>
            </form>
          ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#20321E]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#20321E]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#466245] bg-white text-black font-semibold placeholder-neutral-500 focus:border-[#20321E] focus:ring-2 focus:ring-[#466245]/20 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="text-right -mt-2">
                <button type="button" onClick={openForgotPassword} className="text-sm font-bold text-black underline hover:text-[#466245]">Forgot password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#DDD8CA] hover:bg-[#466245] text-black font-extrabold text-base rounded-xl border-2 border-[#20321E] shadow-[4px_4px_0px_#20321E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#20321E] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 text-black" />
                </>
              )}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
