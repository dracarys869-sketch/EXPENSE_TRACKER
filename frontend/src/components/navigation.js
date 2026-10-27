import { LayoutDashboard, Receipt, Tag, Target, BarChart3, UserRound, Settings2, ShieldCheck } from 'lucide-react';

export const mainNavigation = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Budgets', path: '/budgets', icon: Target },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Categories', path: '/categories', icon: Tag },
];

export const accountNavigation = [
  { name: 'My profile', path: '/profile', icon: UserRound },
  { name: 'Settings', path: '/settings', icon: Settings2 },
];

export const adminNavigation = { name: 'Administration', path: '/admin', icon: ShieldCheck };
