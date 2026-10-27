import React, { useState } from 'react';
import { Check, CheckCircle2, Globe2, Info, Loader2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import { Alert } from '../components/Feedback';
import { useTheme } from '../context/ThemeContext';

const currencies = [
  { code: 'PHP', name: 'Philippine peso', symbol: '₱' },
  { code: 'USD', name: 'US dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

const Settings = () => {
  const { currency, formatAmount, updateSettings } = useTheme();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(null);

  const changeCurrency = async (value) => {
    if (value === currency || saving) return;
    setError(''); setMessage(''); setSaving(value);
    try { await updateSettings({ currency: value }); setMessage('Your currency preference has been saved.'); }
    catch { setError('Unable to save your preference. Please try again.'); }
    finally { setSaving(null); }
  };

  return (
    <MainLayout>
      <div className="page-stack max-w-4xl">
        <PageHeader title="Settings" description="The little preferences that make your workspace feel like you." />
        {message && <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert>}
        {error && <Alert onDismiss={() => setError('')}>{error}</Alert>}
        <section className="surface overflow-hidden">
          <div className="surface-header"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Globe2 className="h-5 w-5" /></span><div><h2 className="section-title">Currency preferences</h2><p className="section-description">Choose how amounts appear across your workspace.</p></div></div></div>
          <div className="space-y-6 p-5 sm:p-6">
            <div><p className="field-label mb-3">Display currency</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group" aria-label="Display currency">{currencies.map(({ code, name, symbol }) => <button key={code} onClick={() => changeCurrency(code)} disabled={Boolean(saving)} aria-pressed={currency === code} className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:opacity-60 sm:flex-col sm:items-start ${currency === code ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl font-semibold ${currency === code ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>{symbol}</span><span><span className={`block text-sm font-bold ${currency === code ? 'text-brand-800' : 'text-slate-700'}`}>{code}</span><span className="mt-1 block text-[10px] text-slate-500">{name}</span></span><span className="absolute right-3 top-3">{saving === code ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> : currency === code ? <CheckCircle2 className="h-4 w-4 text-brand-600" /> : <span className="block h-4 w-4 rounded-full border border-slate-200" />}</span></button>)}</div></div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"><div><p className="text-xs font-semibold text-slate-600">A little preview</p><p className="mt-1 text-[10px] text-slate-400">This is how your amounts will look.</p></div><p className="amount text-2xl font-bold text-slate-800">{formatAmount(12345.67)}</p></div>
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />This changes the currency symbol shown with your amounts. It does not convert transaction values or apply exchange rates.</p>
          </div>
        </section>
        <p className="flex items-center gap-1.5 text-[10px] text-slate-400"><Check className="h-3.5 w-3.5 text-brand-500" />Preferences are saved to your account.</p>
      </div>
    </MainLayout>
  );
};

export default Settings;
