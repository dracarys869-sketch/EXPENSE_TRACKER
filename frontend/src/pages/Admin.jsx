import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { Activity, Archive, BarChart3, Check, Database, Shield, Tag, UserCheck, UserX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Admin = () => {
  const { formatAmount } = useTheme();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState(null);
  const [logs, setLogs] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: '', type: 'Expense' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      const responses = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
        api.get('/admin/categories'),
        api.get('/admin/reports'),
        api.get('/admin/audit-logs'),
      ]);
      setOverview(responses[0].data);
      setUsers(responses[1].data);
      setCategories(responses[2].data);
      setReports(responses[3].data);
      setLogs(responses[4].data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load administrator data.');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleUser = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { is_active: !user.is_active });
      setMessage(`${user.email} ${user.is_active ? 'deactivated' : 'activated'}.`);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update account status.');
    }
  };

  const addCategory = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/categories', newCategory);
      setNewCategory({ category_name: '', type: 'Expense' });
      setMessage('System category added.');
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add category.');
    }
  };

  const downloadBackup = async () => {
    try {
      const response = await api.get('/admin/backup', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense-tracker-backup.sqlite3';
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Database backup downloaded.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create database backup.');
    }
  };

  if (!overview || !reports) {
    return <MainLayout><div className="p-8 text-center text-brand-500">Loading administrator dashboard...</div></MainLayout>;
  }

  const statCards = [
    ['Users', overview.stats.total_users, UserCheck],
    ['Active accounts', overview.stats.active_users, Shield],
    ['Transactions', overview.stats.total_transactions, Activity],
    ['System expenses', formatAmount(overview.stats.total_expenses), BarChart3],
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-sm text-brand-500 dark:text-brand-400">System management, activity, and financial reporting.</p>
        </div>
        {message && <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-sm"><Check className="w-4 h-4" />{message}</div>}
        {error && <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-sm">{error}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(([label, value, Icon]) => <div key={label} className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm"><Icon className="w-5 h-5 text-brand-500 mb-3" /><p className="text-xs uppercase font-semibold text-brand-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-brand-900 dark:text-white">{value}</p></div>)}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-brand-900 dark:text-white">User accounts</h3><span className="text-xs text-brand-500">{overview.stats.inactive_users} inactive</span></div>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-brand-100 dark:border-brand-700 text-xs uppercase text-brand-400"><th className="py-2">User</th><th className="py-2">Activity</th><th className="py-2 text-right">Status</th></tr></thead><tbody className="divide-y divide-brand-100 dark:divide-brand-700">{users.map((user) => <tr key={user.id}><td className="py-3"><p className="font-semibold text-brand-900 dark:text-white">{user.full_name}</p><p className="text-xs text-brand-500">{user.email}</p></td><td className="py-3 text-brand-500">{user.transaction_count} transactions</td><td className="py-3 text-right"><button disabled={user.is_admin} onClick={() => toggleUser(user)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'} disabled:opacity-50`} title={user.is_admin ? 'Administrator accounts cannot be changed here' : ''}>{user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}{user.is_active ? 'Active' : 'Inactive'}</button></td></tr>)}</tbody></table></div>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-brand-900 dark:text-white">System categories</h3><Tag className="w-5 h-5 text-brand-500" /></div><form onSubmit={addCategory} className="flex gap-2 mb-4"><input required value={newCategory.category_name} onChange={(event) => setNewCategory({ ...newCategory, category_name: event.target.value })} placeholder="Category name" className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-brand-300 dark:border-brand-600 dark:bg-brand-700 dark:text-white" /><select value={newCategory.type} onChange={(event) => setNewCategory({ ...newCategory, type: event.target.value })} className="px-2 rounded-xl border border-brand-300 dark:border-brand-600 dark:bg-brand-700 dark:text-white"><option>Expense</option><option>Income</option></select><button className="px-3 rounded-xl bg-brand-600 text-white font-semibold">Add</button></form><div className="max-h-64 overflow-y-auto space-y-2">{categories.filter((category) => !category.user_id).map((category) => <div key={category.id} className="flex justify-between p-2.5 rounded-lg bg-brand-50 dark:bg-brand-700/50 text-sm"><span className="text-brand-800 dark:text-brand-200">{category.category_name}</span><span className="text-xs text-brand-500">{category.type}</span></div>)}</div></section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm"><h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">System report by user</h3><div className="space-y-3">{reports.by_user.map((row) => <div key={row.user_id} className="flex items-center justify-between text-sm"><div><p className="font-semibold text-brand-900 dark:text-white">{row.user_name}</p><p className="text-xs text-brand-500">{row.email}</p></div><div className="text-right"><p className="font-semibold text-rose-600">{formatAmount(row.expenses)} expenses</p><p className="text-xs text-brand-500">Balance {formatAmount(row.balance)}</p></div></div>)}</div></section>
          <section className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-brand-900 dark:text-white">Database and audit</h3><button onClick={downloadBackup} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold"><Database className="w-4 h-4" />Backup</button></div><div className="space-y-3 max-h-52 overflow-y-auto">{logs.map((log) => <div key={log.id} className="flex gap-3 text-sm"><Archive className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" /><div><p className="text-brand-800 dark:text-brand-200"><span className="font-semibold">{log.actor_name}</span> {log.action.replaceAll('_', ' ')}</p><p className="text-xs text-brand-500">{new Date(log.created_at).toLocaleString()}</p></div></div>)}</div></section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
