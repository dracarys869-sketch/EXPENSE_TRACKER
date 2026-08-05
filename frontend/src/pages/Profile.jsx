import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email: email,
      };

      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await api.put('/profile', payload);
      updateUserProfile(res.data.user);
      setMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal account details & password</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Change Password (Optional)</h4>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex justify-center items-center mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
