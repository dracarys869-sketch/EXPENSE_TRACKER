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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('Expense'); setCategoryId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors ${
                type === 'Expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setType('Income'); setCategoryId(''); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors ${
                type === 'Income' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery shopping, Monthly Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
