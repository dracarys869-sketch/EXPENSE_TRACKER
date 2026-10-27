import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, Plus, ChevronLeft, ChevronRight, Receipt, X } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import TransactionList from '../components/TransactionList';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const requestId = useRef(0);

  const fetchCategories = () => {
    setCategoryError('');
    api.get('/categories').then((response) => setCategories(response.data)).catch(() => setCategoryError('Category filters couldn’t be loaded. Your transactions are still available.'));
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchTransactions = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const params = { page, per_page: 10, sort_by: sortBy, search: debouncedSearch || undefined, type: type || undefined, category_id: categoryId || undefined, start_date: startDate || undefined, end_date: endDate || undefined };
      const response = await api.get('/transactions', { params });
      if (currentRequest !== requestId.current) return;
      const pages = Math.max(1, response.data.pages);
      if (page > pages) { setPage(pages); return; }
      setTransactions(response.data.transactions);
      setTotalPages(pages);
      setTotalCount(response.data.total);
    } catch { if (currentRequest === requestId.current) setError('We couldn’t load your transactions. Please try again.'); }
    finally { if (currentRequest === requestId.current) setLoading(false); }
  }, [page, sortBy, debouncedSearch, type, categoryId, startDate, endDate]);

  useEffect(() => { fetchTransactions(); return () => { requestId.current += 1; }; }, [fetchTransactions]);

  const clearFilters = () => { setSearch(''); setDebouncedSearch(''); setType(''); setCategoryId(''); setStartDate(''); setEndDate(''); setSortBy('newest'); setPage(1); };
  const openTransaction = (tx = null) => { setEditingTx(tx); setIsModalOpen(true); };
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try { await api.delete(`/transactions/${deleteId}`); setDeleteId(null); fetchTransactions(); }
    catch (err) { setDeleteError(err.response?.data?.message || 'Unable to delete this transaction.'); }
    finally { setDeleteLoading(false); }
  };
  const activeFilters = [categoryId, startDate, endDate].filter(Boolean).length;
  const hasFilters = Boolean(search || type || activeFilters || sortBy !== 'newest');

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title="Transactions" description="Every little expense. Every bit of income. All in one place."><button onClick={() => openTransaction()} className="btn-primary"><Plus className="h-4 w-4" />Add transaction</button></PageHeader>
        {categoryError && <Alert>{categoryError} <button onClick={fetchCategories} className="font-semibold underline">Retry categories</button></Alert>}
        <section className="surface overflow-hidden" aria-label="Transaction activity">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center sm:p-6">
            <div className="segmented-control self-start" role="group" aria-label="Transaction type filter">
              {[['', 'All transactions'], ['Income', 'Income'], ['Expense', 'Expenses']].map(([value, label]) => <button key={value} onClick={() => { setType(value); setCategoryId(''); setPage(1); }} className="segmented-option px-3 sm:px-3.5" aria-pressed={type === value}><span className="sm:hidden">{value ? label : 'All'}</span><span className="hidden sm:inline">{label}</span></button>)}
            </div>
            <div className="flex flex-1 items-center gap-2 lg:max-w-md">
              <div className="relative min-w-0 flex-1"><Search className="input-icon" /><input aria-label="Search transactions" type="search" placeholder="Search…" value={search} onChange={(event) => setSearch(event.target.value)} className="input pl-11" /></div>
              <button onClick={() => setFiltersOpen(!filtersOpen)} aria-label="Toggle transaction filters" aria-expanded={filtersOpen} aria-controls="transaction-filters" className={`btn-secondary ${filtersOpen ? 'border-brand-200 bg-brand-50 text-brand-700' : ''}`}><SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Filters</span>{activeFilters > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] text-white">{activeFilters}</span>}</button>
            </div>
          </div>
          {filtersOpen && (
            <div id="transaction-filters" className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
              <div><label htmlFor="filter-category" className="field-label">Category</label><select id="filter-category" value={categoryId} disabled={Boolean(categoryError)} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} className="input"><option value="">All categories</option>{categories.filter((category) => !type || category.type === type).map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}</select></div>
              <div><label htmlFor="filter-start" className="field-label">From</label><input id="filter-start" type="date" value={startDate} max={endDate || undefined} onChange={(event) => { setStartDate(event.target.value); setPage(1); }} className="input" /></div>
              <div><label htmlFor="filter-end" className="field-label">To</label><input id="filter-end" type="date" value={endDate} min={startDate || undefined} onChange={(event) => { setEndDate(event.target.value); setPage(1); }} className="input" /></div>
              <div><label htmlFor="filter-sort" className="field-label">Sort by</label><select id="filter-sort" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }} className="input"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option></select></div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-6"><p className="text-xs text-slate-400" aria-live="polite">{loading ? 'Finding your transactions…' : <><span className="font-semibold text-slate-600">{totalCount}</span> {totalCount === 1 ? 'transaction' : 'transactions'}{hasFilters ? ' found' : ' in your history'}</>}</p>{hasFilters && <button onClick={clearFilters} className="text-link"><X className="h-3 w-3" />Clear filters</button>}</div>
          {error ? <div className="p-5"><Alert>{error} <button onClick={fetchTransactions} className="font-semibold underline">Try again</button></Alert></div> : loading ? <LoadingState label="Loading transactions…" /> : transactions.length ? <TransactionList transactions={transactions} onEdit={openTransaction} onDelete={(id) => { setDeleteError(''); setDeleteId(id); }} /> : <EmptyState icon={hasFilters ? Search : Receipt} title={hasFilters ? 'No matches this time' : 'Start your financial story'} description={hasFilters ? 'Try another search or adjust your filters to find what you’re looking for.' : 'Add your first transaction to start building a clearer picture of your money.'}>{hasFilters ? <button onClick={clearFilters} className="btn-secondary">Clear all filters</button> : <button onClick={() => openTransaction()} className="btn-primary"><Plus className="h-4 w-4" />Add a transaction</button>}</EmptyState>}
          {!loading && !error && totalCount > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-[11px] text-slate-400">Showing <span className="font-medium text-slate-600">{(page - 1) * 10 + 1}–{Math.min(page * 10, totalCount)}</span> of {totalCount}</p><div className="flex items-center gap-3"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="icon-button h-8 w-8 border border-slate-200" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="text-[11px] font-medium text-slate-500">{page} / {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="icon-button h-8 w-8 border border-slate-200" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>}
        </section>
      </div>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTransactions} initialData={editingTx} />
      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleteLoading} error={deleteError} title="Delete transaction?" message="This transaction will be removed from your activity and financial totals. This cannot be undone." />
    </MainLayout>
  );
};

export default Transactions;
