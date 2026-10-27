import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
ChartJS.defaults.font.size = 10;
ChartJS.defaults.color = '#667085';

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const chartColors = ['#217553', '#a8cc86', '#e8b779', '#87b7bd', '#8b93bc', '#df9c93', '#c4b391', '#607f73', '#9bb5df', '#c79bc1'];
export const incomeColor = '#217553';
export const expenseColor = '#bed981';

export const tooltipOptions = (formatAmount) => ({
  backgroundColor: '#163e30',
  titleColor: '#fff',
  bodyColor: '#e2ede6',
  padding: 12,
  cornerRadius: 10,
  boxPadding: 5,
  usePointStyle: true,
  callbacks: { label: (context) => ` ${context.dataset.label || context.label}: ${formatAmount(context.parsed.y ?? context.parsed)}` },
});

export const cartesianOptions = (formatAmount) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  animation: { duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400 },
  plugins: {
    legend: { display: false },
    tooltip: tooltipOptions(formatAmount),
  },
  scales: {
    x: { border: { display: false }, grid: { display: false, drawTicks: false }, ticks: { padding: 12, maxRotation: 0 } },
    y: {
      beginAtZero: true,
      border: { display: false, dash: [4, 4] },
      grid: { color: '#edf0f3', drawTicks: false },
      ticks: { padding: 12, maxTicksLimit: 5, callback: (value) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(value) },
    },
  },
});

export const doughnutOptions = (formatAmount) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '78%',
  plugins: { legend: { display: false }, tooltip: tooltipOptions(formatAmount) },
});
