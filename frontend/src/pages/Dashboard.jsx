import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, BarChart3, Plus, Receipt, RefreshCw, Wallet } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import TransactionList from '../components/TransactionList';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { cartesianOptions, chartColors, doughnutOptions, expenseColor, incomeColor, monthNames } from '../utils/charts';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatAmount } = useTheme();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [summary, setSummary] = useState({ current_balance: 0, total_income: 0, total_expenses: 0, total_transactions: 0 });
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartError, setChartError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const monthlyRequest = useRef(0);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [txResponse, categoryResponse] = await Promise.all([api.get('/transactions?per_page=5&sort_by=newest'), api.get('/reports/category?type=Expense')]);
      setTransactions(txResponse.data.transactions);
      setSummary(txResponse.data.summary);
      setCategoryData([...categoryResponse.data].sort((a, b) => b.total - a.total));
    } catch { setError('We couldn’t load your overview. Please try again.'); }
    finally { setLoading(false); }
  }, []);

  const fetchMonthly = useCallback(async () => {
    const request = ++monthlyRequest.current;
    setChartLoading(true);
    setChartError('');
    try {
      const response = await api.get(`/reports/monthly?year=${year}`);
      if (request === monthlyRequest.current) setMonthlyData(response.data);
    } catch {
      if (request === monthlyRequest.current) setChartError('Unable to load this year’s cash flow.');
    } finally {
      if (request === monthlyRequest.current) setChartLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => { fetchMonthly(); return () => { monthlyRequest.current += 1; }; }, [fetchMonthly]);

  const refresh = () => { fetchDashboard(); fetchMonthly(); };
  const openTransaction = (tx = null) => { setEditingTx(tx); setIsModalOpen(true); };
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try { await api.delete(`/transactions/${deleteId}`); setDeleteId(null); refresh(); }
    catch (err) { setDeleteError(err.response?.data?.message || 'Unable to delete this transaction.'); }
    finally { setDeleteLoading(false); }
  };

  const barData = {
    labels: monthNames,
    datasets: [
      { label: 'Income', data: monthlyData.map((row) => row.income), backgroundColor: incomeColor, borderRadius: 4, maxBarThickness: 14, categoryPercentage: 0.65 },
      { label: 'Expenses', data: monthlyData.map((row) => row.expense), backgroundColor: expenseColor, borderRadius: 4, maxBarThickness: 14, categoryPercentage: 0.65 },
    ],
  };
  const categoryTotal = categoryData.reduce((total, category) => total + Number(category.total), 0);
  const doughnutData = { labels: categoryData.map((row) => row.category_name), datasets: [{ data: categoryData.map((row) => row.total), backgroundColor: chartColors, borderWidth: 3, borderColor: '#fff', borderRadius: 3, hoverOffset: 4 }] };
  const hasMonthlyData = monthlyData.some((row) => row.income > 0 || row.expense > 0);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title={`${greeting}, ${user?.full_name?.trim().split(/\s+/)[0] || 'there'}`} description="Here’s the big picture. A little clarity goes a long way.">
          <button type="button" onClick={() => openTransaction()} className="btn-primary"><Plus className="h-4 w-4" />Add transaction</button>
        </PageHeader>

        {error && <Alert><div className="flex flex-wrap items-center justify-between gap-2">{error}<button onClick={refresh} className="inline-flex items-center gap-1.5 font-semibold underline"><RefreshCw className="h-3.5 w-3.5" />Retry</button></div></Alert>}

        <section aria-label="Financial summary" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <div className="balance-pattern relative col-span-2 overflow-hidden rounded-2xl bg-brand-900 p-5 text-white shadow-card sm:col-span-1 lg:p-6">
            <div className="relative z-10 flex items-center justify-between"><span className="text-xs font-medium text-brand-100/80">Total balance</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Wallet className="h-[18px] w-[18px] text-brand-200" /></span></div>
            <p className="amount relative z-10 mt-5 truncate text-[27px] font-bold leading-tight tracking-[-0.045em]" title={formatAmount(summary.current_balance)}>{loading ? <span className="block h-8 w-32 animate-pulse rounded-lg bg-white/10" /> : error ? '—' : formatAmount(summary.current_balance)}</p>
            <div className="relative z-10 mt-5 flex items-center gap-1.5 border-t border-white/10 pt-3.5 text-[10px] text-brand-200"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />All-time income minus expenses</div>
          </div>
          {[
            { title: 'Total income', value: formatAmount(summary.total_income), icon: ArrowDownLeft, color: 'bg-brand-50 text-brand-600', note: 'All-time money in', dot: 'bg-brand-500' },
            { title: 'Total expenses', value: formatAmount(summary.total_expenses), icon: ArrowUpRight, color: 'bg-orange-50 text-orange-500', note: 'All-time money out', dot: 'bg-orange-400' },
            { title: 'Transactions', value: summary.total_transactions.toLocaleString(), icon: Receipt, color: 'bg-blue-50 text-blue-500', note: 'Your activity, organized', dot: 'bg-blue-400' },
          ].map(({ title, value, icon: Icon, color, note, dot }, index) => (
            <div key={title} className={`surface p-4 sm:p-5 lg:p-6 ${index === 2 ? 'hidden sm:block' : ''}`}><div className="flex items-center justify-between gap-1"><span className="text-[10px] font-medium text-slate-500 sm:text-xs">{title}</span><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${color}`}><Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></span></div><p className="amount mt-4 break-words text-[clamp(1rem,5vw,1.25rem)] font-bold leading-tight tracking-[-0.045em] text-slate-800 sm:mt-5 sm:text-[27px]" title={String(value)}>{loading ? <span className="block h-8 w-24 animate-pulse rounded-lg bg-slate-100 sm:w-32" /> : error ? '—' : value}</p><p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[9px] text-slate-400 sm:mt-5 sm:pt-3.5 sm:text-[10px]"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />{note}</p></div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <section className="surface">
            <div className="surface-header border-0 pb-2">
              <div><h2 className="section-title">Cash flow</h2><p className="section-description">A month-by-month look at money in and out.</p></div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5"><CalendarDays className="h-3.5 w-3.5 text-slate-400" /><select aria-label="Cash flow year" value={year} onChange={(event) => setYear(Number(event.target.value))} className="rounded bg-white pr-1 text-xs font-medium text-slate-600 outline-none">{Array.from({ length: 6 }, (_, index) => currentYear - index).map((value) => <option key={value}>{value}</option>)}</select></div>
            </div>
            <div className="flex gap-5 px-5 pb-1 pt-3 text-[10px] text-slate-500 sm:px-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-600" />Income</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent-500" />Expenses</span></div>
            <div className="h-[285px] px-3 pb-4 pt-4 sm:px-5">
              {chartLoading ? <LoadingState label="Loading cash flow…" /> : chartError ? <EmptyState title="Cash flow unavailable" description={chartError} compact><button onClick={fetchMonthly} className="text-link">Try again <RefreshCw className="h-3.5 w-3.5" /></button></EmptyState> : hasMonthlyData ? <Bar data={barData} options={cartesianOptions(formatAmount)} role="img" aria-label={`Monthly income and expenses for ${year}`} /> : <EmptyState icon={BarChart3} title="Your story starts with a transaction" description={`Add income or expenses dated in ${year} to see your cash flow here.`} compact><button onClick={() => openTransaction()} className="text-link">Add a transaction <ArrowRight className="h-3.5 w-3.5" /></button></EmptyState>}
            </div>
          </section>

          <section className="surface">
            <div className="surface-header border-0 pb-2"><div><h2 className="section-title">Spending breakdown</h2><p className="section-description">Where your money goes · All time</p></div><Link to="/reports" className="icon-button h-8 w-8" aria-label="View spending reports"><ArrowUpRight className="h-4 w-4" /></Link></div>
            {loading ? <LoadingState label="Loading your categories…" /> : categoryTotal > 0 ? (
              <div className="px-5 pb-5 sm:px-6">
                <div className="relative mx-auto my-3 h-[170px] max-w-[200px]"><Doughnut data={doughnutData} options={doughnutOptions(formatAmount)} role="img" aria-label="Expenses by category" /><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[10px] text-slate-400">Total spent</span><span className="amount mt-1 max-w-[125px] truncate text-lg font-bold text-slate-800" title={formatAmount(categoryTotal)}>{formatAmount(categoryTotal)}</span></div></div>
                <div className="space-y-2.5">{categoryData.slice(0, 3).map((category, index) => <div key={category.category_name} className="flex items-center gap-2 text-[11px]"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index] }} /><span className="min-w-0 flex-1 truncate text-slate-500">{category.category_name}</span><span className="amount font-semibold text-slate-700">{formatAmount(category.total)}</span><span className="w-9 text-right text-slate-400">{Math.round(category.total / categoryTotal * 100)}%</span></div>)}</div>
                {categoryData.length > 3 && <Link to="/reports" className="text-link mt-3">View all {categoryData.length} categories <ArrowRight className="h-3 w-3" /></Link>}
              </div>
            ) : <EmptyState icon={Receipt} title={error ? 'Breakdown unavailable' : 'A clearer picture is on its way'} description={error ? 'Retry loading your overview to see your categories.' : 'Your expense categories will appear here as you track your spending.'} />}
          </section>
        </div>

        <section className="surface overflow-hidden">
          <div className="surface-header"><div className="flex items-center gap-2.5"><h2 className="section-title">Recent transactions</h2>{!loading && <span className="badge-neutral">{summary.total_transactions}</span>}</div><Link to="/transactions" className="text-link">View all transactions <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          {loading ? <LoadingState label="Loading recent activity…" /> : error ? <EmptyState title="Recent activity unavailable" description="Try loading your overview again." /> : transactions.length ? <TransactionList transactions={transactions} onEdit={openTransaction} onDelete={(id) => { setDeleteError(''); setDeleteId(id); }} /> : <EmptyState icon={Receipt} title="Make your first money move" description="Track an expense or add your income. Your recent activity will live here."><button onClick={() => openTransaction()} className="btn-primary"><Plus className="h-4 w-4" />Add your first transaction</button></EmptyState>}
        </section>
        <p className="text-center text-[10px] text-slate-400">A little awareness today. More confidence tomorrow.</p>
      </div>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refresh} initialData={editingTx} />
      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleteLoading} error={deleteError} title="Delete transaction?" message="This transaction will be removed from your activity and financial totals. This cannot be undone." />
    </MainLayout>
  );
};

export default Dashboard;
