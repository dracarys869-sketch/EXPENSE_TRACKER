import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../services/api';

const TransactionModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [type, setType] = useState('Expense');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setType(initialData.type || 'Expense');
        setCategoryId(initialData.category_id || '');
        setAmount(initialData.amount || '');
        setDescription(initialData.description || '');
        setTransactionDate(initialData.transaction_date || new Date().toISOString().split('T')[0]);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories', err);
    }
  };

  const resetForm = () => {
    setType('Expense');
    setCategoryId('');
    setAmount('');
    setDescription('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (!transactionDate) {
      setError('Date is required.');
      return;
    }

    setLoading(true);

    const payload = {
      type,
      category_id: Number(categoryId),
      amount: Number(amount),
      description: description.trim(),
      transaction_date: transactionDate,
    };

    try {
      if (initialData && initialData.id) {
        await api.put(`/transactions/${initialData.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-black hover:text-stone-700 dark:text-white dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-black" />
            <span className="text-rose-800 dark:text-rose-200">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('Expense'); setCategoryId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors ${
                type === 'Expense' ? 'bg-black text-white shadow-sm' : 'text-stone-800 dark:text-stone-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setType('Income'); setCategoryId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors ${
                type === 'Income' ? 'bg-black text-white shadow-sm' : 'text-stone-800 dark:text-stone-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-black/15 outline-none text-lg font-bold"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-1">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-black/15 outline-none"
            >
              <option value="">Select Category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery shopping, Monthly Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-black/15 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-1">Date</label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-black/15 outline-none"
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-black hover:bg-stone-800 text-white font-semibold shadow-md shadow-black/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-white">Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
