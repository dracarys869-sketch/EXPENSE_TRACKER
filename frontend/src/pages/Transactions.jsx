import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar
} from 'lucide-react';

const Transactions = () => {
  const { formatAmount } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, categoryFilter, startDate, endDate, sortBy, page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        per_page: 10,
        sort_by: sortBy,
      });

      if (search) params.append('search', search);
      if (typeFilter) params.append('type', typeFilter);
      if (categoryFilter) params.append('category_id', categoryFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/transactions/${deleteId}`);
      setDeleteId(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-brand-500 dark:text-brand-400">Manage and filter your income & expenses</p>
          </div>
          <button
            onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input
                type="text"
                placeholder="Search description..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">All Types (Income & Expense)</option>
              <option value="Income">Income Only</option>
              <option value="Expense">Expense Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name} ({c.type})
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="highest">Sort by Highest Amount</option>
              <option value="lowest">Sort by Lowest Amount</option>
            </select>
          </div>

          {/* Date Range & Clear Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-100 dark:border-brand-700/50">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-brand-500">Date Range:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white"
              />
              <span className="text-brand-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 dark:bg-brand-900 dark:text-white"
              />
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-brand-500 dark:text-brand-400">
              No transactions match your query filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-100 dark:border-brand-700 text-xs font-semibold uppercase text-brand-400">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 dark:divide-brand-700/50 text-sm">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-700/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-brand-900 dark:text-white">
                        {tx.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.type === 'Income'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-brand-600 dark:text-brand-300">
                        {tx.category_name}
                      </td>
                      <td className="py-3 px-4 text-brand-500 dark:text-brand-400 text-xs">
                        {tx.transaction_date}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {tx.type === 'Income' ? '+' : '-'}{formatAmount(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => { setEditingTx(tx); setIsModalOpen(true); }}
                            className="p-1.5 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-700"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="p-1.5 rounded-lg text-brand-400 hover:text-rose-600 hover:bg-brand-100 dark:hover:bg-brand-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-brand-100 dark:border-brand-700">
              <span className="text-xs text-brand-500 dark:text-brand-400">
                Page {page} of {totalPages} ({totalCount} items)
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Dialogs */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTransactions}
          initialData={editingTx}
        />

        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction?"
        />
      </div>
    </MainLayout>
  );
};

export default Transactions;
