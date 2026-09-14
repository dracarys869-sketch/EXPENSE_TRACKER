import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Receipt,
  Calendar,
  Filter,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { formatAmount } = useTheme();
  const [summary, setSummary] = useState({
    current_balance: 0,
    total_income: 0,
    total_expenses: 0,
    total_transactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch recent transactions and summary stats
      const resTx = await api.get('/transactions?per_page=5&sort_by=newest');
      setRecentTransactions(resTx.data.transactions);
      setSummary(resTx.data.summary);

      // Fetch monthly overview for bar chart
      const resMonthly = await api.get('/reports/monthly');
      setMonthlyChartData(resMonthly.data);

      // Fetch category breakdown for doughnut chart
      const resCat = await api.get('/reports/category?type=Expense');
      setCategoryChartData(resCat.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
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
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Bar Chart Configuration
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const barChartConfig = {
    labels: monthNames,
    datasets: [
      {
        label: 'Income',
        data: monthlyChartData.map((d) => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Expense',
        data: monthlyChartData.map((d) => d.expense),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  // Doughnut Chart Configuration
  const categoryColors = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#64748b'
  ];
  const doughnutChartConfig = {
    labels: categoryChartData.map((c) => c.category_name),
    datasets: [
      {
        data: categoryChartData.map((c) => c.total),
        backgroundColor: categoryColors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Dashboard</h2>
            <p className="text-sm text-brand-500 dark:text-brand-400">Overview of your financial performance</p>
          </div>
          <button
            onClick={() => { setEditingTx(null); setIsTxModalOpen(true); }}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Balance */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-brand-500 dark:text-brand-400">Current Balance</span>
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className={`text-2xl font-extrabold ${summary.current_balance >= 0 ? 'text-brand-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatAmount(summary.current_balance)}
              </h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Available net funds</p>
            </div>
          </div>

          {/* Income */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-brand-500 dark:text-brand-400">Total Income</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatAmount(summary.total_income)}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> Total cash influx
              </p>
            </div>
          </div>

          {/* Expenses */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-brand-500 dark:text-brand-400">Total Expenses</span>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {formatAmount(summary.total_expenses)}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-0.5" /> Total cash outflow
              </p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-brand-500 dark:text-brand-400">Transactions</span>
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-brand-900 dark:text-white">
                {summary.total_transactions}
              </h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Recorded activities</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Bar Chart (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
            <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">Monthly Income vs Expense</h3>
            <div className="h-72">
              <Bar
                data={barChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          </div>

          {/* Category Pie/Doughnut Chart (1 col) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">Expense by Category</h3>
            <div className="h-64 flex items-center justify-center relative">
              {categoryChartData.length > 0 ? (
                <Doughnut
                  data={doughnutChartConfig}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              ) : (
                <div className="text-center text-brand-400 text-sm">No expense data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand-900 dark:text-white">Recent Transactions</h3>
            <a href="/transactions" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All
            </a>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-brand-500 dark:text-brand-400">
              No recent transactions found. Click "Add Transaction" to start!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-100 dark:border-brand-700 text-xs font-semibold uppercase text-brand-400">
                    <th className="py-3 px-4">Transaction</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 dark:divide-brand-700/50 text-sm">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-700/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-brand-900 dark:text-white">
                        {tx.description}
                      </td>
                      <td className="py-3 px-4 text-brand-600 dark:text-brand-300">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-700 text-brand-700 dark:text-brand-300">
                          {tx.category_name}
                        </span>
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
                            onClick={() => { setEditingTx(tx); setIsTxModalOpen(true); }}
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
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onSuccess={fetchDashboardData}
          initialData={editingTx}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
