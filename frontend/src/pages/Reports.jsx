import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { BarChart3, FileSpreadsheet, FileText, Download, Calendar, PieChart } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';

const Reports = () => {
  const { formatAmount } = useTheme();
  const [activeTab, setActiveTab] = useState('monthly'); // monthly, yearly, category
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [catType, setCatType] = useState('Expense');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [activeTab, catType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'monthly') {
        const res = await api.get('/reports/monthly');
        setMonthlyData(res.data);
      } else if (activeTab === 'yearly') {
        const res = await api.get('/reports/yearly');
        setYearlyData(res.data);
      } else if (activeTab === 'category') {
        const res = await api.get(`/reports/category?type=${catType}`);
        setCategoryData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:5000/api/reports/export/csv', '_blank');
  };

  const handleExportPDF = () => {
    window.open('http://127.0.0.1:5000/api/reports/export/pdf', '_blank');
  };

  // Chart configs
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBarConfig = {
    labels: monthNames,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        backgroundColor: '#10b981',
      },
      {
        label: 'Expense',
        data: monthlyData.map((d) => d.expense),
        backgroundColor: '#f43f5e',
      },
    ],
  };

  const yearlyLineConfig = {
    labels: yearlyData.map((d) => str(d.year)),
    datasets: [
      {
        label: 'Income',
        data: yearlyData.map((d) => d.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
      {
        label: 'Expense',
        data: yearlyData.map((d) => d.expense),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
      },
    ],
  };

  const categoryPieConfig = {
    labels: categoryData.map((c) => c.category_name),
    datasets: [
      {
        data: categoryData.map((c) => c.total),
        backgroundColor: [
          '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
          '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#64748b'
        ],
      },
    ],
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Reports & Analytics</h2>
            <p className="text-sm text-brand-500 dark:text-brand-400">Generate comprehensive PDF/CSV reports & view trends</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-brand-800 border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-200 font-semibold text-sm hover:bg-brand-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex space-x-2 border-b border-brand-200 dark:border-brand-700 pb-2">
          {[
            { id: 'monthly', label: 'Monthly Report' },
            { id: 'yearly', label: 'Yearly Trend' },
            { id: 'category', label: 'Category Breakdown' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${activeTab === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm">
          {activeTab === 'monthly' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white">Monthly Expense & Income Distribution</h3>
              <div className="h-80">
                <Bar data={monthlyBarConfig} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {activeTab === 'yearly' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white">Year-over-Year Financial Performance</h3>
              <div className="h-80">
                <Line data={yearlyLineConfig} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">Category Expenditure Analysis</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCatType('Expense')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${catType === 'Expense' ? 'bg-rose-500 text-white' : 'bg-brand-100 dark:bg-brand-700 text-brand-600'}`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => setCatType('Income')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${catType === 'Income' ? 'bg-emerald-500 text-white' : 'bg-brand-100 dark:bg-brand-700 text-brand-600'}`}
                  >
                    Income
                  </button>
                </div>
              </div>
              <div className="h-80 flex justify-center">
                {categoryData.length > 0 ? (
                  <Pie data={categoryPieConfig} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                  <div className="flex items-center justify-center text-brand-400">No category breakdown available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
