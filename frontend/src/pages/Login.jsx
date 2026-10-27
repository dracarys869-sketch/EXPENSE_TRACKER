import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { Alert } from '../components/Feedback';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setSuccess('');
    const result = await login(email.trim(), password);
    if (result.success) {
      if (adminLogin && !result.user.is_admin) { logout(); setError('This account does not have administrator access.'); return; }
      navigate(adminLogin ? '/admin' : '/');
    } else setError(result.message);
  };
  const handleSendOtp = async (event) => {
    event.preventDefault(); setError(''); setSuccess(''); setRecoveryLoading(true);
    try { const response = await api.post('/send-otp', { email: email.trim() }); setOtpSent(true); setSuccess(response.data.message); }
    catch (err) { setError(err.response?.data?.message || 'Unable to send your verification code. Please try again.'); }
    finally { setRecoveryLoading(false); }
  };
  const handleResetPassword = async (event) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (newPassword !== confirmNewPassword) { setError('Your passwords don’t match. Please try again.'); return; }
    setRecoveryLoading(true);
    try {
      const response = await api.post('/reset-password-otp', { email: email.trim(), otp, new_password: newPassword });
      setSuccess(response.data.message); setShowForgotPassword(false); setOtpSent(false); setPassword(''); setOtp(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (err) { setError(err.response?.data?.message || 'Unable to reset your password. Please try again.'); }
    finally { setRecoveryLoading(false); }
  };
  const goBack = () => { setShowForgotPassword(false); setError(''); setSuccess(''); };

  return (
    <AuthLayout>
      <div className="mb-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">{showForgotPassword ? <KeyRound className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}</div><h1 className="text-[30px] font-extrabold tracking-[-0.045em] text-slate-900">{showForgotPassword ? otpSent ? 'Check your inbox' : 'Let’s get you back in' : 'Welcome back.'}</h1><p className="mt-2.5 text-[13px] leading-relaxed text-slate-500">{showForgotPassword ? otpSent ? 'Enter your verification code and choose a new password.' : 'Enter your email and we’ll send a password reset code.' : 'A little check-in. A clearer picture of your money.'}</p></div>
      {error && <div className="mb-5"><Alert>{error}</Alert></div>}
      {success && <div className="mb-5"><Alert variant="success">{success}</Alert></div>}
      {showForgotPassword ? (
        <form onSubmit={otpSent ? handleResetPassword : handleSendOtp} className="space-y-5">
          <div><label htmlFor="recovery-email" className="field-label">Email address</label><div className="relative"><Mail className="input-icon" /><input id="recovery-email" type="email" autoComplete="email" required readOnly={otpSent} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input pl-11 read-only:bg-slate-100" /></div>{otpSent && <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setSuccess(''); setError(''); }} className="text-link mt-2">Use a different email</button>}</div>
          {otpSent && <><div><label htmlFor="recovery-code" className="field-label">6-digit verification code</label><input id="recovery-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" className="input text-center text-lg font-semibold tracking-[0.4em]" /></div><div><label htmlFor="recovery-password" className="field-label">New password</label><PasswordInput id="recovery-password" autoComplete="new-password" minLength={6} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 6 characters" /></div><div><label htmlFor="recovery-confirm" className="field-label">Confirm new password</label><PasswordInput id="recovery-confirm" autoComplete="new-password" minLength={6} required value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} placeholder="Re-enter your new password" /></div></>}
          <button type="submit" disabled={recoveryLoading} className="btn-primary w-full">{recoveryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}{recoveryLoading ? 'Please wait…' : otpSent ? 'Update password' : 'Send verification code'}</button><button type="button" onClick={goBack} className="btn-ghost w-full"><ArrowLeft className="h-4 w-4" />Back to sign in</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label htmlFor="login-email" className="field-label">Email address</label><div className="relative"><Mail className="input-icon" /><input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input pl-11" /></div></div>
          <div><div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="login-password" className="field-label mb-0">Password</label><button type="button" onClick={() => { setShowForgotPassword(true); setError(''); setSuccess(''); setOtpSent(false); }} className="text-link text-[11px]">Forgot password?</button></div><PasswordInput id="login-password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[11px] text-slate-500"><input type="checkbox" checked={adminLogin} onChange={(event) => setAdminLogin(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />Sign in as administrator</label>
          <button type="submit" disabled={loading} className="btn-primary min-h-12 w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{loading ? 'Signing in…' : 'Sign in to your account'}{!loading && <ArrowRight className="h-4 w-4" />}</button>
          <p className="text-center text-xs text-slate-500">Your first time here? <Link to="/register" className="font-bold text-brand-700 hover:underline">Create an account</Link></p>
          <p className="flex items-start justify-center gap-1.5 text-[10px] leading-relaxed text-slate-400"><KeyRound className="mt-0.5 h-3 w-3 shrink-0" />You’ll stay signed in for 30 days on this device.</p>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;
