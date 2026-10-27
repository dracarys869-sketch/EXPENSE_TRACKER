import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Brand = ({ to = '/', compact = false, inverse = false }) => (
  <Link to={to} className="inline-flex shrink-0 items-center gap-2.5 rounded-xl" aria-label="ExpenseTracker home">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${inverse ? 'bg-white/10 text-accent-400' : 'bg-brand-600 text-white shadow-sm'}`}>
      <Wallet className="h-[21px] w-[21px]" strokeWidth={1.8} />
    </span>
    {!compact && (
      <span className={`text-[16px] font-extrabold tracking-[-0.06em] ${inverse ? 'text-white' : 'text-slate-800'}`}>
        Expense<span className={inverse ? 'text-accent-400' : 'text-brand-600'}>Tracker</span>
      </span>
    )}
  </Link>
);

export default Brand;
