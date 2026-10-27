import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Archive, BarChart3, Check, Database, Eye, KeyRound, Loader2, Plus, Search, ShieldCheck, Tag, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import CategoryIcon from '../components/CategoryIcon';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import PasswordInput from '../components/PasswordInput';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Admin = () => {
  const { formatAmount } = useTheme();
  const { user: currentUser, updateUserProfile } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userStatus, setUserStatus] = useState('all');
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [newCategory, setNewCategory] = useState({ category_name: '', type: 'Expense' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ full_name: '', email: '' });
  const [resetPassword, setResetPassword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [usersError, setUsersError] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [busy, setBusy] = useState('');

  const loadAdminData = useCallback(async () => {
    if (!currentUser?.is_admin) return;
    setError(''); setLoading(true);
    try {
      const responses = await Promise.all([api.get('/admin/overview'), api.get('/admin/categories'), api.get('/admin/reports'), api.get('/admin/audit-logs')]);
      setOverview(responses[0].data); setCategories(responses[1].data); setReports(responses[2].data); setLogs(responses[3].data);
    } catch (err) { setError(err.response?.data?.message || 'Unable to load administrator data. Please try again.'); }
    finally { setLoading(false); }
  }, [currentUser?.is_admin]);

  useEffect(() => { loadAdminData(); }, [loadAdminData]);
  useEffect(() => {
    if (!currentUser?.is_admin) return;
    let active = true;
    setUsersLoading(true); setUsersError('');
    const timeout = setTimeout(() => {
      api.get('/admin/users', { params: { search: userSearch, status: userStatus } }).then((response) => { if (active) setUsers(response.data); }).catch(() => { if (active) setUsersError('Unable to load users. Please try again.'); }).finally(() => { if (active) setUsersLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timeout); };
  }, [userSearch, userStatus, refreshUsers, currentUser?.is_admin]);

  const refresh = () => { loadAdminData(); setRefreshUsers((value) => value + 1); };
  const selectUser = (user) => { setSelectedUser(user); setUserForm({ full_name: user.full_name, email: user.email }); setResetPassword(''); setFormError(''); };

  const saveUser = async (event) => {
    event.preventDefault(); setFormError(''); setBusy('user');
    try {
      const response = await api.put(`/admin/users/${selectedUser.id}`, userForm);
      if (selectedUser.id === currentUser.id) updateUserProfile({ ...currentUser, ...response.data });
      setMessage(`Account details updated for ${userForm.full_name}.`); setSelectedUser(null); refresh();
    } catch (err) { setFormError(err.response?.data?.message || 'Unable to update account details.'); }
    finally { setBusy(''); }
  };
  const resetUserPassword = async () => {
    setConfirmError(''); setBusy('password');
    try {
      await api.post(`/admin/users/${resetTarget.id}/password`, { password: resetPassword });
      setMessage(`Password updated for ${resetTarget.full_name}.`); setResetPassword(''); setResetTarget(null); setSelectedUser(null); refresh();
    } catch (err) { setConfirmError(err.response?.data?.message || 'Unable to reset this password.'); }
    finally { setBusy(''); }
  };
  const deleteUser = async () => {
    setConfirmError(''); setBusy('delete');
    try { await api.delete(`/admin/users/${deleteTarget.id}`); setMessage(`Account removed for ${deleteTarget.full_name}.`); setDeleteTarget(null); refresh(); }
    catch (err) { setConfirmError(err.response?.data?.message || 'Unable to delete this account.'); }
    finally { setBusy(''); }
  };
  const toggleUser = async (user) => {
    setError(''); setBusy(`status-${user.id}`);
    try { await api.put(`/admin/users/${user.id}/status`, { is_active: !user.is_active }); setMessage(`${user.full_name}’s account is now ${user.is_active ? 'inactive' : 'active'}.`); refresh(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to change account status.'); }
    finally { setBusy(''); }
  };
  const addCategory = async (event) => {
    event.preventDefault(); setError(''); setBusy('category');
    try { await api.post('/admin/categories', { ...newCategory, category_name: newCategory.category_name.trim() }); setNewCategory({ category_name: '', type: 'Expense' }); setMessage('New system category created.'); refresh(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to create this category.'); }
    finally { setBusy(''); }
  };
  const downloadBackup = async () => {
    setError(''); setBusy('backup');
    try {
      const response = await api.get('/admin/backup', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a'); link.href = url; link.download = 'expense-tracker-backup.sqlite3';
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Your database backup has been downloaded.');
    } catch { setError('Unable to download the backup. Please try again.'); }
    finally { setBusy(''); }
  };

  if (!currentUser?.is_admin) return <Navigate to="/" replace />;

  const userActions = (user) => <div className="flex items-center justify-end gap-0.5"><button onClick={() => selectUser(user)} className="icon-button h-9 w-9" aria-label={`View or edit ${user.full_name}`} title="View or edit user"><Eye className="h-4 w-4" /></button><button onClick={() => selectUser(user)} className="icon-button h-9 w-9" aria-label={`Reset password for ${user.full_name}`} title="Reset password"><KeyRound className="h-4 w-4" /></button><button disabled={user.id === currentUser.id} onClick={() => { setConfirmError(''); setDeleteTarget(user); }} className="icon-button h-9 w-9 hover:bg-rose-50 hover:text-rose-500" aria-label={`Delete ${user.full_name}`} title={user.id === currentUser.id ? 'Your account cannot be deleted here' : 'Delete account'}><Trash2 className="h-4 w-4" /></button></div>;
  const statusButton = (user) => <button disabled={user.is_admin || user.id === currentUser.id || Boolean(busy)} onClick={() => toggleUser(user)} className={`${user.is_active ? 'badge-success' : 'badge-danger'} disabled:cursor-default`} aria-label={`${user.full_name} is ${user.is_active ? 'active' : 'inactive'}${!user.is_admin && user.id !== currentUser.id ? '. Click to change status' : ''}`} title={user.is_admin ? 'Administrator account' : user.is_active ? 'Deactivate account' : 'Activate account'}>{user.is_active ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}{user.is_active ? 'Active' : 'Inactive'}</button>;

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title="Administration" description="A clear view of your people, activity, and system health."><span className="badge-success px-3 py-2"><ShieldCheck className="h-4 w-4" />Administrator workspace</span></PageHeader>
        {message && <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert>}
        {error && <Alert onDismiss={() => setError('')}>{error} <button onClick={refresh} className="font-semibold underline">Retry</button></Alert>}
        {!overview || !reports ? loading ? <div className="surface"><LoadingState label="Loading your administrator workspace…" /></div> : <div className="surface"><EmptyState icon={ShieldCheck} title="We couldn’t load your workspace" description="Try again to get an up-to-date system overview."><button onClick={refresh} className="btn-primary">Try again</button></EmptyState></div> : <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Total users', overview.stats.total_users, Users, 'bg-brand-50 text-brand-600'], ['Active accounts', overview.stats.active_users, ShieldCheck, 'bg-blue-50 text-blue-500'], ['Transactions', overview.stats.total_transactions, Activity, 'bg-violet-50 text-violet-500'], ['System expenses', formatAmount(overview.stats.total_expenses), BarChart3, 'bg-orange-50 text-orange-500']].map(([label, value, Icon, color]) => <div key={label} className="surface p-5"><div className="flex items-center justify-between"><p className="text-[11px] text-slate-500">{label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon className="h-[18px] w-[18px]" /></span></div><p className="amount mt-3 text-2xl font-bold text-slate-800">{value}</p><p className="mt-2 text-[10px] text-slate-400">Across the entire workspace</p></div>)}</div>
          <div className="overflow-x-auto pb-1"><div className="segmented-control" role="group" aria-label="Administration section">{[['users', 'Users', Users], ['categories', 'Categories', Tag], ['reports', 'Insights', BarChart3], ['audit', 'Audit log', Archive]].map(([id, label, Icon]) => <button key={id} onClick={() => setActiveTab(id)} className="segmented-option" aria-pressed={activeTab === id}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div></div>

          {activeTab === 'users' && <section className="surface overflow-hidden"><div className="surface-header"><div><h2 className="section-title">User management</h2><p className="section-description">Manage account details, access, and activity.</p></div><span className="badge-neutral">{overview.stats.inactive_users} inactive</span></div><div className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6"><div className="relative flex-1"><Search className="input-icon" /><input aria-label="Search users" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search by name or email…" className="input pl-11" /></div><select aria-label="Filter users by status" value={userStatus} onChange={(event) => setUserStatus(event.target.value)} className="input sm:w-44"><option value="all">All statuses</option><option value="active">Active accounts</option><option value="inactive">Inactive accounts</option></select></div>
            {usersError ? <div className="px-5 pb-5"><Alert>{usersError} <button onClick={() => setRefreshUsers((value) => value + 1)} className="font-semibold underline">Retry</button></Alert></div> : usersLoading ? <LoadingState label="Loading accounts…" /> : !users.length ? <EmptyState icon={Search} title="No accounts found" description="Try another name, email, or account status." /> : <><div className="hidden overflow-x-auto md:block"><table className="data-table"><thead><tr><th scope="col">User</th><th scope="col">Activity</th><th scope="col">Role</th><th scope="col">Status</th><th scope="col" className="text-right">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{user.full_name.charAt(0).toUpperCase()}</span><div><p className="text-xs font-semibold text-slate-700">{user.full_name}{user.id === currentUser.id && <span className="ml-1.5 text-[10px] font-normal text-slate-400">(you)</span>}</p><p className="mt-1 text-[10px] text-slate-400">{user.email}</p></div></div></td><td className="whitespace-nowrap text-[11px] text-slate-500">{user.transaction_count} transactions</td><td><span className="badge-neutral">{user.is_admin ? 'Admin' : 'Member'}</span></td><td>{statusButton(user)}</td><td>{userActions(user)}</td></tr>)}</tbody></table></div><ul className="divide-y divide-slate-100 md:hidden">{users.map((user) => <li key={user.id} className="px-5 py-4"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{user.full_name}</p><p className="mt-1 truncate text-[10px] text-slate-400">{user.email}</p></div>{statusButton(user)}</div><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-slate-400">{user.is_admin ? 'Admin' : 'Member'} · {user.transaction_count} transactions</span>{userActions(user)}</div></li>)}</ul></>}
          </section>}

          {activeTab === 'categories' && <section className="surface"><div className="surface-header"><div><h2 className="section-title">System categories</h2><p className="section-description">Built-in categories available to everyone in the workspace.</p></div><Tag className="h-5 w-5 text-slate-300" /></div><div className="space-y-6 p-5 sm:p-6"><form onSubmit={addCategory} className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto]"><div><label htmlFor="system-category-name" className="field-label">Category name</label><input id="system-category-name" required maxLength={80} value={newCategory.category_name} onChange={(event) => setNewCategory({ ...newCategory, category_name: event.target.value })} placeholder="e.g. Education" className="input" /></div><div><label htmlFor="system-category-type" className="field-label">Type</label><select id="system-category-type" value={newCategory.type} onChange={(event) => setNewCategory({ ...newCategory, type: event.target.value })} className="input"><option>Expense</option><option>Income</option></select></div><button disabled={busy === 'category'} className="btn-primary min-h-[46px]">{busy === 'category' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add category</button></form><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{categories.filter((category) => !category.user_id).map((category) => <div key={category.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5"><CategoryIcon name={category.category_name} type={category.type} /><div><p className="text-xs font-semibold text-slate-600">{category.category_name}</p><p className="mt-1 text-[10px] text-slate-400">{category.type}</p></div></div>)}</div></div></section>}

          {activeTab === 'reports' && (
            <section className="surface overflow-hidden">
              <div className="surface-header"><div><h2 className="section-title">Financial activity by user</h2><p className="section-description">All-time spending and account balances across the system.</p></div><span className="badge-neutral">All time</span></div>
              {reports.by_user.length ? (
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Financial activity by user">
                  <table className="data-table">
                    <thead><tr><th scope="col">Account</th><th scope="col" className="text-right">Expenses</th><th scope="col" className="text-right">Balance</th></tr></thead>
                    <tbody>
                      {reports.by_user.map((row) => (
                        <tr key={row.user_id}>
                          <td><p className="text-xs font-semibold text-slate-700">{row.user_name}</p><p className="mt-1 text-[10px] text-slate-400">{row.email}</p></td>
                          <td className="amount whitespace-nowrap text-right text-xs text-slate-600">{formatAmount(row.expenses)}</td>
                          <td className={`amount whitespace-nowrap text-right text-xs font-semibold ${row.balance < 0 ? 'text-rose-600' : 'text-brand-600'}`}>{formatAmount(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyState icon={BarChart3} title="No financial activity yet" description="User activity will appear here as transactions are recorded." />}
            </section>
          )}

          {activeTab === 'audit' && <section className="surface"><div className="surface-header"><div><h2 className="section-title">Database & activity log</h2><p className="section-description">A record of administrative changes in your workspace.</p></div><button onClick={downloadBackup} disabled={busy === 'backup'} className="btn-secondary">{busy === 'backup' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}Download backup</button></div>{logs.length ? <ul className="divide-y divide-slate-100 px-5 sm:px-6">{logs.map((log) => <li key={log.id} className="flex items-start gap-3 py-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400"><Archive className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs leading-relaxed text-slate-600"><span className="font-semibold text-slate-800">{log.actor_name}</span> · {log.action.replaceAll('_', ' ')}</p><p className="mt-1.5 text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString()}</p></div><Check className="mt-2 h-4 w-4 shrink-0 text-brand-500" /></li>)}</ul> : <EmptyState icon={Archive} title="A fresh activity log" description="Administrative changes will appear here as they happen." />}</section>}
        </>}
      </div>

      <Modal isOpen={Boolean(selectedUser) && !resetTarget} onClose={() => setSelectedUser(null)} title="Account details" description={selectedUser?.email} busy={busy === 'user'}>
        {formError && <div className="mb-5"><Alert>{formError}</Alert></div>}
        <form onSubmit={saveUser} className="space-y-4"><div><label htmlFor="admin-user-name" className="field-label">Full name</label><input id="admin-user-name" data-autofocus required value={userForm.full_name} onChange={(event) => setUserForm({ ...userForm, full_name: event.target.value })} className="input" /></div><div><label htmlFor="admin-user-email" className="field-label">Email address</label><input id="admin-user-email" type="email" required value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} className="input" /></div><button disabled={busy === 'user'} className="btn-primary">{busy === 'user' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save details</button></form>
        <form onSubmit={(event) => { event.preventDefault(); setConfirmError(''); setResetTarget(selectedUser); }} className="mt-6 space-y-4 border-t border-slate-100 pt-5"><div><h3 className="section-title">Reset password</h3><p className="section-description">Set a new password for this account.</p></div><div><label htmlFor="admin-reset-password" className="field-label">New password</label><PasswordInput id="admin-reset-password" required minLength={6} autoComplete="new-password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} placeholder="At least 6 characters" /></div><button disabled={Boolean(busy) || resetPassword.length < 6} className="btn-secondary"><KeyRound className="h-4 w-4" />Reset password</button></form>
      </Modal>
      <ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={deleteUser} loading={busy === 'delete'} error={confirmError} title="Delete user account?" message={deleteTarget ? `This permanently removes ${deleteTarget.email} and their transaction data.` : ''} />
      <ConfirmModal isOpen={Boolean(resetTarget)} onClose={() => setResetTarget(null)} onConfirm={resetUserPassword} loading={busy === 'password'} error={confirmError} title="Reset this password?" confirmLabel="Reset password" message={resetTarget ? `Set the new password for ${resetTarget.email}?` : ''} />
    </MainLayout>
  );
};

export default Admin;
