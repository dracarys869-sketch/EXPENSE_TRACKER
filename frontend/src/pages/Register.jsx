import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2, Mail, Sprout, User } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { Alert } from '../components/Feedback';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); setError('');
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (password !== confirmPassword) { setError('Your passwords don’t match. Please try again.'); return; }
    if (password.length < 6) { setError('Your password needs at least 6 characters.'); return; }
    const result = await register(fullName.trim(), email.trim(), password, confirmPassword);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <AuthLayout register>
      <div className="mb-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600"><Sprout className="h-5 w-5" /></div><h1 className="text-[30px] font-extrabold tracking-[-0.045em] text-slate-900">Start a good habit.</h1><p className="mt-2.5 text-[13px] leading-relaxed text-slate-500">Create your account. A little financial clarity awaits.</p></div>
      {error && <div className="mb-5"><Alert>{error}</Alert></div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label htmlFor="register-name" className="field-label">Full name</label><div className="relative"><User className="input-icon" /><input id="register-name" type="text" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Juan Dela Cruz" className="input pl-11" /></div></div>
        <div><label htmlFor="register-email" className="field-label">Email address</label><div className="relative"><Mail className="input-icon" /><input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input pl-11" /></div></div>
        <div><label htmlFor="register-password" className="field-label">Password</label><PasswordInput id="register-password" autoComplete="new-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" /><p className={`mt-2 flex items-center gap-1 text-[10px] ${password.length >= 6 ? 'text-brand-600' : 'text-slate-400'}`}>{password.length >= 6 && <Check className="h-3 w-3" />}At least 6 characters</p></div>
        <div><label htmlFor="register-confirm" className="field-label">Confirm password</label><PasswordInput id="register-confirm" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" /></div>
        <div className="pt-2"><button type="submit" disabled={loading} className="btn-primary min-h-12 w-full">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Creating your account…' : 'Create your free account'}{!loading && <ArrowRight className="h-4 w-4" />}</button></div>
        <p className="text-center text-xs text-slate-500">Already part of the picture? <Link to="/login" className="font-bold text-brand-700 hover:underline">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
};

export default Register;
