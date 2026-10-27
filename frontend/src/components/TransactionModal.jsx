import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal';
import { Alert } from './Feedback';
import { localDateString } from '../utils/dates';

const TransactionModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const { currency, currencySymbols } = useTheme();
  const [type, setType] = useState('Expense');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(localDateString());
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setError('');
    setType(initialData?.type || 'Expense');
    setCategoryId(initialData?.category_id || '');
    setAmount(initialData?.amount || '');
    setDescription(initialData?.description || '');
    setTransactionDate(initialData?.transaction_date || localDateString());
    setCategoriesLoading(true);
    api.get('/categories').then((res) => { if (active) setCategories(res.data); }).catch(() => { if (active) setError('Unable to load categories. Close this dialog and try again.'); }).finally(() => { if (active) setCategoriesLoading(false); });
    return () => { active = false; };
  }, [isOpen, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) { setError('Enter an amount greater than zero.'); return; }
    if (!description.trim()) { setError('Add a short description for this transaction.'); return; }
    if (!categoryId || !transactionDate) { setError('Choose a category and a date to continue.'); return; }
    setLoading(true);
    const payload = { type, category_id: Number(categoryId), amount: Number(amount), description: description.trim(), transaction_date: transactionDate };
    try {
      if (initialData?.id) await api.put(`/transactions/${initialData.id}`, payload);
      else await api.post('/transactions', payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your transaction. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit transaction' : 'Add a transaction'} description="A small check-in for a clearer financial picture." busy={loading}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <fieldset disabled={loading} className="space-y-5">
          <legend className="sr-only">Transaction details</legend>
          <div className="segmented-control grid grid-cols-2" role="group" aria-label="Transaction type">
            <button type="button" onClick={() => { setType('Expense'); setCategoryId(''); }} aria-pressed={type === 'Expense'} className="segmented-option"><ArrowUpRight className="h-4 w-4" />Expense</button>
            <button type="button" onClick={() => { setType('Income'); setCategoryId(''); }} aria-pressed={type === 'Income'} className="segmented-option"><ArrowDownLeft className="h-4 w-4" />Income</button>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4">
            <label htmlFor="tx-amount" className="field-label">Amount <span className="font-normal text-slate-400">({currency})</span></label>
            <div className="flex items-center gap-2.5"><span className="text-2xl font-medium text-slate-400">{currencySymbols[currency]}</span><input id="tx-amount" data-autofocus type="number" inputMode="decimal" min="0.01" step="0.01" required placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} className="amount w-full rounded-md bg-transparent text-3xl font-bold text-slate-800 outline-none placeholder:text-slate-400" /></div>
          </div>
          <div><label htmlFor="tx-description" className="field-label">Description</label><input id="tx-description" type="text" required maxLength={255} placeholder="What was this transaction for?" value={description} onChange={(event) => setDescription(event.target.value)} className="input" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label htmlFor="tx-category" className="field-label">Category</label><select id="tx-category" required value={categoryId} disabled={categoriesLoading} onChange={(event) => setCategoryId(event.target.value)} className="input"><option value="">{categoriesLoading ? 'Loading…' : 'Select a category'}</option>{categories.filter((category) => category.type === type).map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}</select></div>
            <div><label htmlFor="tx-date" className="field-label">Date</label><input id="tx-date" type="date" required value={transactionDate} onChange={(event) => setTransactionDate(event.target.value)} className="input" /></div>
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading || categoriesLoading} className="btn-primary">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{loading ? 'Saving…' : initialData ? 'Save changes' : 'Save transaction'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
