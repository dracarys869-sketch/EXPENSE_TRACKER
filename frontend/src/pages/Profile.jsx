import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Loader2, Mail, Settings2, ShieldCheck, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import PasswordInput from '../components/PasswordInput';
import { Alert } from '../components/Feedback';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const initials = user?.full_name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const handleSubmit = async (event) => {
    event.preventDefault(); setMessage(''); setError('');
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    setLoading(true);
    try {
      const payload = { full_name: fullName.trim(), email: email.trim() };
      if (newPassword) { payload.current_password = currentPassword; payload.new_password = newPassword; }
      const response = await api.put('/profile', payload);
      updateUserProfile(response.data.user);
      setMessage('Your profile is up to date.'); setCurrentPassword(''); setNewPassword('');
    } catch (err) { setError(err.response?.data?.message || 'Unable to save your changes. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="page-stack max-w-5xl">
        <PageHeader title="My profile" description="Your personal details. Your own little corner of the workspace." />
        {message && <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert>}
        {error && <Alert onDismiss={() => setError('')}>{error}</Alert>}
        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="surface overflow-hidden"><div className="h-20 border-b border-brand-100 bg-brand-50" /><div className="px-5 pb-6"><span className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-brand-200 text-xl font-bold text-brand-800">{initials}</span><h2 className="mt-4 break-words text-lg font-bold text-slate-800">{user?.full_name}</h2><p className="mt-1 break-all text-[11px] text-slate-400">{user?.email}</p><span className="badge-success mt-4"><ShieldCheck className="h-3 w-3" />{user?.is_admin ? 'Administrator' : 'Personal account'}</span><div className="mt-6 border-t border-slate-100 pt-5"><Link to="/settings" className="flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-brand-600"><Settings2 className="h-4 w-4" />Account preferences<ArrowRight className="ml-auto h-3.5 w-3.5" /></Link></div></div></aside>
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="surface"><div className="surface-header"><div><h2 className="section-title">Personal information</h2><p className="section-description">The details that make this account yours.</p></div><User className="h-5 w-5 text-slate-300" /></div><fieldset disabled={loading} className="space-y-5 p-5 sm:p-6"><legend className="sr-only">Personal information</legend><div><label htmlFor="profile-name" className="field-label">Full name</label><div className="relative"><User className="input-icon" /><input id="profile-name" type="text" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} className="input pl-11" /></div></div><div><label htmlFor="profile-email" className="field-label">Email address</label><div className="relative"><Mail className="input-icon" /><input id="profile-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input pl-11" /></div></div></fieldset></section>
            <section className="surface"><div className="surface-header"><div><h2 className="section-title">Password & security</h2><p className="section-description">Leave these fields empty to keep your current password.</p></div><ShieldCheck className="h-5 w-5 text-slate-300" /></div><fieldset disabled={loading} className="space-y-5 p-5 sm:p-6"><legend className="sr-only">Change password</legend><div><label htmlFor="profile-current-password" className="field-label">Current password</label><PasswordInput id="profile-current-password" autoComplete="current-password" required={Boolean(newPassword)} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Enter your current password" /></div><div><label htmlFor="profile-new-password" className="field-label">New password</label><PasswordInput id="profile-new-password" autoComplete="new-password" minLength={6} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 6 characters" /></div></fieldset></section>
            <div className="flex justify-end"><button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{loading ? 'Saving changes…' : 'Save changes'}</button></div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
