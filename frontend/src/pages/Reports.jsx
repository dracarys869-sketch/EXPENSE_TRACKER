import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, BarChart3, CalendarDays, FileSpreadsheet, FileText, Loader2, PieChart, TrendingUp, Wallet } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { cartesianOptions, chartColors, doughnutOptions, expenseColor, incomeColor, monthNames } from '../utils/charts';

const Reports = () => {
  const { formatAmount } = useTheme();
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState('monthly');
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [categoryType, setCategoryType] = useState('Expense');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setData([]);
    const url = activeTab === 'monthly' ? `/reports/monthly?year=${year}` : activeTab === 'yearly' ? '/reports/yearly' : `/reports/category?type=${categoryType}`;
    api.get(url).then((response) => { if (active) setData(activeTab === 'category' ? [...response.data].sort((a, b) => b.total - a.total) : response.data); }).catch(() => { if (active) setError('Unable to load this report. Please try again.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [activeTab, year, categoryType, retry]);

  const handleExport = async (kind) => {
    setExportError(''); setExporting(kind);
    try {
      const response = await api.get(`/reports/export/${kind}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url; link.download = `ExpenseTracker-transactions.${kind}`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setExportError('Your report couldn’t be downloaded. Please try again.'); }
    finally { setExporting(null); }
  };

  const income = data.reduce((total, row) => total + Number(row.income || 0), 0);
  const expense = data.reduce((total, row) => total + Number(row.expense || 0), 0);
  const categoryTotal = data.reduce((total, row) => total + Number(row.total || 0), 0);
  const isCategory = activeTab === 'category';
  const hasData = isCategory ? categoryTotal > 0 : income > 0 || expense > 0;
  const chartData = {
    labels: activeTab === 'monthly' ? monthNames : data.map((row) => String(row.year)),
    datasets: [
      { label: 'Income', data: data.map((row) => row.income), backgroundColor: activeTab === 'yearly' ? 'rgba(33, 117, 83, 0.07)' : incomeColor, borderColor: incomeColor, borderRadius: 5, maxBarThickness: 22, borderWidth: activeTab === 'yearly' ? 2.5 : 0, tension: 0.35, fill: activeTab === 'yearly', pointRadius: 4, pointBackgroundColor: incomeColor },
      { label: 'Expenses', data: data.map((row) => row.expense), backgroundColor: activeTab === 'yearly' ? 'rgba(190, 217, 129, 0.10)' : expenseColor, borderColor: '#9ebf65', borderRadius: 5, maxBarThickness: 22, borderWidth: activeTab === 'yearly' ? 2.5 : 0, tension: 0.35, fill: activeTab === 'yearly', pointRadius: 4, pointBackgroundColor: '#9ebf65' },
    ],
  };
  const categoryChart = { labels: data.map((row) => row.category_name), datasets: [{ data: data.map((row) => row.total), backgroundColor: chartColors, borderWidth: 4, borderColor: '#fff', borderRadius: 4, hoverOffset: 5 }] };
  const summaryCards = isCategory ? [
    [`Total ${categoryType.toLowerCase()}`, formatAmount(categoryTotal), PieChart, 'bg-brand-50 text-brand-600'],
    ['Active categories', data.length, BarChart3, 'bg-blue-50 text-blue-500'],
    ['Largest category', data[0]?.category_name || '—', TrendingUp, 'bg-orange-50 text-orange-500'],
  ] : [
    ['Total income', formatAmount(income), ArrowDownLeft, 'bg-brand-50 text-brand-600'],
    ['Total expenses', formatAmount(expense), ArrowUpRight, 'bg-orange-50 text-orange-500'],
    ['Net balance', formatAmount(income - expense), Wallet, 'bg-blue-50 text-blue-500'],
  ];

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title="Reports & insights" description="See the patterns. Understand your habits. Plan your next step.">
          <button onClick={() => handleExport('csv')} disabled={Boolean(exporting)} className="btn-secondary">{exporting === 'csv' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}Export CSV</button>
          <button onClick={() => handleExport('pdf')} disabled={Boolean(exporting)} className="btn-primary">{exporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}Export PDF</button>
        </PageHeader>
        {exportError && <Alert onDismiss={() => setExportError('')}>{exportError}</Alert>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="segmented-control" role="group" aria-label="Report view">{[['monthly', 'Monthly', BarChart3], ['yearly', 'Yearly', TrendingUp], ['category', 'Categories', PieChart]].map(([id, label, Icon]) => <button key={id} onClick={() => setActiveTab(id)} className="segmented-option px-3 sm:px-4" aria-pressed={activeTab === id}><Icon className="hidden h-3.5 w-3.5 sm:block" />{label}</button>)}</div>
          {activeTab === 'monthly' ? <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5"><CalendarDays className="h-4 w-4 text-slate-400" /><select value={year} onChange={(event) => setYear(Number(event.target.value))} aria-label="Report year" className="rounded-md bg-white text-xs font-semibold text-slate-600">{Array.from({ length: 6 }, (_, index) => currentYear - index).map((value) => <option key={value}>{value}</option>)}</select></div> : <span className="badge-neutral">All-time data</span>}
        </div>
        {error ? <Alert>{error} <button onClick={() => setRetry((value) => value + 1)} className="font-semibold underline">Try again</button></Alert> : <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {summaryCards.map(([label, value, Icon, color]) => (
              <div className="surface flex items-center gap-4 p-5 sm:flex-col sm:items-start sm:gap-3 sm:p-4 xl:flex-row xl:items-center xl:gap-4 xl:p-5" key={label}>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" strokeWidth={1.7} /></span>
                <div className="min-w-0 max-w-full"><p className="text-[11px] text-slate-500">{label}</p><p className="amount mt-1.5 break-words text-xl font-bold text-slate-800 sm:text-lg xl:text-xl" title={String(value)}>{loading ? '—' : value}</p></div>
              </div>
            ))}
          </div>
          <section className="surface overflow-hidden">
            <div className="surface-header"><div><h2 className="section-title">{activeTab === 'monthly' ? 'Your year in perspective' : activeTab === 'yearly' ? 'The long-term picture' : 'A closer look at your categories'}</h2><p className="section-description">{activeTab === 'monthly' ? `Monthly income and expenses in ${year}` : activeTab === 'yearly' ? 'Income and expenses across every year you’ve tracked.' : `${categoryType === 'Expense' ? 'Spending' : 'Income'} distribution across your complete history.`}</p></div>{isCategory && <div className="segmented-control" role="group" aria-label="Category report type">{['Expense', 'Income'].map((value) => <button key={value} onClick={() => setCategoryType(value)} className="segmented-option" aria-pressed={categoryType === value}>{value === 'Expense' ? 'Expenses' : 'Income'}</button>)}</div>}</div>
            {loading ? <LoadingState label="Putting your report together…" /> : !hasData ? <EmptyState icon={BarChart3} title="Every insight starts with a little activity" description="Your reports will take shape as you add income and expenses for this period." /> : isCategory ? (
              <div className="grid items-center gap-8 p-5 sm:p-6 lg:grid-cols-2 lg:p-8"><div className="relative mx-auto h-[260px] w-full max-w-[300px]"><Doughnut data={categoryChart} options={doughnutOptions(formatAmount)} role="img" aria-label={`${categoryType} by category`} /><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><p className="text-xs text-slate-400">Total {categoryType.toLowerCase()}</p><p className="amount mt-2 max-w-[170px] truncate text-2xl font-bold text-slate-800">{formatAmount(categoryTotal)}</p></div></div><div className="space-y-4">{data.map((row, index) => <div key={row.category_name}><div className="flex items-center gap-2.5 text-xs"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span className="min-w-0 flex-1 truncate text-slate-600">{row.category_name}</span><span className="amount font-semibold text-slate-700">{formatAmount(row.total)}</span><span className="w-10 text-right text-[10px] text-slate-400">{(row.total / categoryTotal * 100).toFixed(1)}%</span></div><div className="ml-5 mt-2 h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${row.total / categoryTotal * 100}%`, backgroundColor: chartColors[index % chartColors.length] }} /></div></div>)}</div></div>
            ) : (
              <div className="p-4 sm:p-6"><div className="mb-5 flex justify-end gap-5 text-[10px] text-slate-500"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-600" />Income</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent-500" />Expenses</span></div><div className="h-[300px] sm:h-[340px]">{activeTab === 'monthly' ? <Bar data={chartData} options={cartesianOptions(formatAmount)} role="img" aria-label={`Monthly income and expenses for ${year}`} /> : <Line data={chartData} options={cartesianOptions(formatAmount)} role="img" aria-label="Income and expenses by year" />}</div></div>
            )}
          </section>
          {!loading && hasData && !isCategory && (
            <section className="surface overflow-hidden">
              <div className="surface-header"><h2 className="section-title">The numbers behind the picture</h2><span className="badge-neutral">{activeTab === 'monthly' ? year : 'All years'}</span></div>
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Detailed financial report">
                <table className="data-table">
                  <caption className="sr-only">Income, expenses, and net balance by {activeTab === 'monthly' ? 'month' : 'year'}</caption>
                  <thead><tr><th scope="col">{activeTab === 'monthly' ? 'Month' : 'Year'}</th><th scope="col" className="text-right">Income</th><th scope="col" className="text-right">Expenses</th><th scope="col" className="text-right">Net balance</th></tr></thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.month || row.year}>
                        <td className="text-xs font-semibold text-slate-600">{activeTab === 'monthly' ? monthNames[row.month - 1] : row.year}</td>
                        <td className="amount whitespace-nowrap text-right text-xs text-brand-600">{formatAmount(row.income)}</td>
                        <td className="amount whitespace-nowrap text-right text-xs text-slate-500">{formatAmount(row.expense)}</td>
                        <td className={`amount whitespace-nowrap text-right text-xs font-semibold ${row.income - row.expense < 0 ? 'text-rose-600' : 'text-slate-700'}`}>{formatAmount(row.income - row.expense)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>}
        <p className="text-[10px] text-slate-400">CSV and PDF exports include your complete transaction history.</p>
      </div>
    </MainLayout>
  );
};

export default Reports;
