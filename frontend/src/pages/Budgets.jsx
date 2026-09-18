import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { AlertTriangle, CheckCircle2, DollarSign, Plus, Target, Trash2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const statusStyles = {
  on_track: {
    label: 'On track',
    color: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  warning: {
    label: 'Near limit',
    color: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
    icon: AlertTriangle,
  },
  overspent: {
    label: 'Overspent',
    color: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
    icon: AlertTriangle,
  },
};

const Budgets = () => {
  const { formatAmount } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetResponse, categoryResponse] = await Promise.all([
        api.get('/budgets'),
        api.get('/categories'),
      ]);
      setBudgets(budgetResponse.data);
      setCategories(categoryResponse.data.filter((category) => category.type === 'Expense'));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api.post('/budgets', {
        monthly_limit: Number(limit),
        category_id: categoryId || null,
      });
      setLimit('');
      setCategoryId('');
      setMessage('Budget saved successfully.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      await api.delete(`/budgets/${budgetId}`);
      setBudgets((current) => current.filter((budget) => budget.id !== budgetId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete budget.');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Budget Management</h2>
          <p className="text-sm text-brand-500 dark:text-brand-400">Set monthly spending limits and keep every category on track.</p>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss error"><X className="w-4 h-4" /></button>
          </div>
        )}
        {message && <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-sm">{message}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSave} className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm space-y-4 h-fit">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400"><Plus className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-brand-900 dark:text-white">Set a budget</h3>
                <p className="text-xs text-brand-500 dark:text-brand-400">Updates an existing matching budget.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-500 mb-1">Budget type</label>
              <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-300 dark:border-brand-600 dark:bg-brand-700 dark:text-white outline-none">
                <option value="">Overall monthly budget</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-500 mb-1">Monthly limit</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input type="number" min="0.01" step="0.01" required value={limit} onChange={(event) => setLimit(event.target.value)} placeholder="0.00" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-300 dark:border-brand-600 dark:bg-brand-700 dark:text-white outline-none" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save budget'}</button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="p-10 text-center text-brand-500">Loading budgets...</div>
            ) : budgets.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 text-brand-500">No budgets set yet.</div>
            ) : budgets.map((budget) => {
              const status = statusStyles[budget.status] || statusStyles.on_track;
              const StatusIcon = status.icon;
              const progress = Math.min(budget.percentage_used, 100);
              return (
                <div key={budget.id} className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400"><Target className="w-5 h-5" /></div>
                      <div><h3 className="font-bold text-brand-900 dark:text-white">{budget.category_name}</h3><p className="text-xs text-brand-500 dark:text-brand-400">{formatAmount(budget.spent_amount)} of {formatAmount(budget.monthly_limit)} used</p></div>
                    </div>
                    <button onClick={() => handleDelete(budget.id)} className="p-2 text-brand-400 hover:text-rose-600" title="Delete budget"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-brand-100 dark:bg-brand-700 overflow-hidden"><div className={`h-full ${status.bar} transition-all`} style={{ width: `${progress}%` }} /></div>
                  <div className="mt-3 flex items-center justify-between text-sm"><span className={`flex items-center font-semibold ${status.color}`}><StatusIcon className="w-4 h-4 mr-1.5" />{status.label}</span><span className={budget.remaining_amount < 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-brand-600 dark:text-brand-300'}>{budget.remaining_amount < 0 ? `${formatAmount(Math.abs(budget.remaining_amount))} over` : `${formatAmount(budget.remaining_amount)} remaining`}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budgets;
