import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CalendarDays, Check, CheckCircle2, Lightbulb, Loader2, Pencil, Plus, Target, Trash2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import CategoryIcon from '../components/CategoryIcon';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const statuses = {
  on_track: { label: 'On track', badge: 'badge-success', bar: 'bg-brand-500', icon: CheckCircle2 },
  warning: { label: 'Near limit', badge: 'badge-warning', bar: 'bg-amber-400', icon: AlertTriangle },
  overspent: { label: 'Over budget', badge: 'badge-danger', bar: 'bg-rose-500', icon: AlertTriangle },
};

const Budgets = () => {
  const { formatAmount, currency, currencySymbols } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const formRef = useRef(null);
  const limitRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetResponse, categoryResponse] = await Promise.all([api.get('/budgets'), api.get('/categories')]);
      setBudgets([...budgetResponse.data].sort((a, b) => Boolean(a.category_id) - Boolean(b.category_id)));
      setCategories(categoryResponse.data.filter((category) => category.type === 'Expense'));
    } catch (err) { setError(err.response?.data?.message || 'Unable to load your budgets. Please try again.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setLimit(''); setCategoryId(''); setEditingBudget(null); };
  const handleSave = async (event) => {
    event.preventDefault();
    setError(''); setMessage(''); setSaving(true);
    try {
      await api.post('/budgets', { monthly_limit: Number(limit), category_id: categoryId || null });
      resetForm();
      setMessage('Your monthly budget has been saved. You’re one step ahead.');
      await fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Unable to save your budget. Please try again.'); }
    finally { setSaving(false); }
  };
  const editBudget = (budget) => {
    setEditingBudget(budget);
    setCategoryId(budget.category_id || '');
    setLimit(budget.monthly_limit);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    limitRef.current?.focus({ preventScroll: true });
  };
  const deleteBudget = async (id) => {
    setDeletingId(id); setError(''); setMessage('');
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets((current) => current.filter((budget) => budget.id !== id));
      if (editingBudget?.id === id) resetForm();
      setMessage('Budget removed. Your transactions are still in your activity.');
    } catch (err) { setError(err.response?.data?.message || 'Unable to remove this budget.'); }
    finally { setDeletingId(null); }
  };
  const onTrack = budgets.filter((budget) => budget.status === 'on_track').length;

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title="Budgets" description="A plan for your spending. More room for what matters."><span className="btn-secondary cursor-default text-xs"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></PageHeader>
        {error && <Alert onDismiss={() => setError('')}>{error} <button onClick={fetchData} className="font-semibold underline">Retry loading</button></Alert>}
        {message && <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert>}
        <section className="grid grid-cols-3 gap-3 sm:gap-4" aria-label="Budget summary">
          {[
            ['Active budgets', budgets.length, Target, 'text-brand-600 bg-brand-50'],
            ['On track', onTrack, CheckCircle2, 'text-brand-600 bg-brand-50'],
            ['Need attention', budgets.length - onTrack, AlertTriangle, 'text-amber-600 bg-amber-50'],
          ].map(([label, value, Icon, color]) => <div key={label} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" strokeWidth={1.7} /></span><div><p className="text-[10px] text-slate-500 sm:text-xs">{label}</p><p className="amount mt-1 text-2xl font-bold text-slate-800">{loading || error ? '—' : value}</p></div></div>)}
        </section>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <section aria-label="Your budgets" className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="section-title">Your monthly plan</h2><span className="text-[10px] text-slate-400">Resets each month</span></div>
            {loading ? <div className="surface"><LoadingState label="Loading your budgets…" /></div> : budgets.length === 0 ? <div className="surface"><EmptyState icon={Target} title="Make a little room for your goals" description="Set an overall spending limit or create a budget for a specific category."><button onClick={() => { formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); limitRef.current?.focus({ preventScroll: true }); }} className="btn-primary"><Plus className="h-4 w-4" />Set your first budget</button></EmptyState></div> : budgets.map((budget) => {
              const status = statuses[budget.status] || statuses.on_track;
              const StatusIcon = status.icon;
              return (
                <article key={budget.id} className={`surface p-5 sm:p-6 ${!budget.category_id ? 'border-brand-200/70' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">{budget.category_id ? <CategoryIcon name={budget.category_name} /> : <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Target className="h-5 w-5" /></span>}<div><h3 className="text-sm font-bold text-slate-800">{budget.category_id ? budget.category_name : 'Overall monthly budget'}</h3><span className={`mt-1.5 ${status.badge}`}><StatusIcon className="h-3 w-3" />{status.label}</span></div></div>
                    <div className="flex shrink-0 items-center"><button onClick={() => editBudget(budget)} className="icon-button h-8 w-8" aria-label={`Edit ${budget.category_name} budget`} title="Edit budget"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => deleteBudget(budget.id)} disabled={deletingId === budget.id} className="icon-button h-8 w-8 hover:bg-rose-50 hover:text-rose-500" aria-label={`Delete ${budget.category_name} budget`} title="Delete budget">{deletingId === budget.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}</button></div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2"><p className="amount text-xl font-bold text-slate-800">{formatAmount(budget.spent_amount)} <span className="text-[10px] font-normal tracking-normal text-slate-400">spent</span></p><p className="text-[11px] text-slate-400">of <span className="amount font-semibold text-slate-600">{formatAmount(budget.monthly_limit)}</span></p></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${budget.category_name} budget used`} aria-valuenow={Math.min(100, Math.max(0, budget.percentage_used))} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${budget.percentage_used}% used`}><div className={`h-full rounded-full transition-[width] duration-500 ${status.bar}`} style={{ width: `${Math.min(100, Math.max(0, budget.percentage_used))}%` }} /></div>
                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-[10px]"><span className="text-slate-400">{budget.percentage_used}% of budget used</span><span className={`font-semibold ${budget.remaining_amount < 0 ? 'text-rose-600' : 'text-brand-600'}`}>{formatAmount(Math.abs(budget.remaining_amount))} {budget.remaining_amount < 0 ? 'over budget' : 'left to spend'}</span></div>
                </article>
              );
            })}
          </section>
          <div className="space-y-4 xl:pt-9">
            <form ref={formRef} onSubmit={handleSave} className="surface p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{editingBudget ? <Pencil className="h-4 w-4" /> : <Plus className="h-5 w-5" />}</span><div><h2 className="section-title">{editingBudget ? 'Adjust your budget' : 'Set a budget'}</h2><p className="section-description">Give your spending a little direction.</p></div></div>
              <fieldset disabled={saving} className="space-y-5"><legend className="sr-only">Budget details</legend><div><label htmlFor="budget-category" className="field-label">Budget category</label><select id="budget-category" value={categoryId} disabled={Boolean(editingBudget) || loading} onChange={(event) => setCategoryId(event.target.value)} className="input"><option value="">Overall monthly spending</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}</select></div><div><label htmlFor="budget-limit" className="field-label">Monthly limit <span className="font-normal text-slate-400">({currency})</span></label><div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{currencySymbols[currency]}</span><input ref={limitRef} id="budget-limit" type="number" inputMode="decimal" min="0.01" step="0.01" required value={limit} onChange={(event) => setLimit(event.target.value)} placeholder="0.00" className="input pl-9" /></div></div><p className="text-[11px] leading-relaxed text-slate-400">Already have a budget for this category? Saving will update its monthly limit.</p><button type="submit" disabled={loading} className="btn-primary w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? 'Saving…' : editingBudget ? 'Update budget' : 'Save budget'}</button>{editingBudget && <button type="button" onClick={resetForm} className="btn-ghost w-full">Cancel editing</button>}</fieldset>
            </form>
            <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /><div><h3 className="text-xs font-bold text-brand-800">A budget that works for you</h3><p className="mt-1.5 text-[11px] leading-relaxed text-brand-700">Start with your essentials, leave a little breathing room, and adjust as you learn your habits.</p></div></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budgets;
