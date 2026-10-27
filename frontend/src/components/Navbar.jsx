import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Brand from './Brand';
import { mainNavigation, accountNavigation, adminNavigation } from './navigation';

const Navbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const page = [...mainNavigation, ...accountNavigation, adminNavigation].find((item) => item.path === pathname);
  const initials = user?.full_name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <header className="z-20 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-4 sm:px-6 md:h-20 lg:px-8">
      <div className="md:hidden"><Brand to="/" /></div>
      <nav aria-label="Breadcrumb" className="hidden items-center gap-3 text-xs md:flex">
        <Link to="/" className="rounded-md text-slate-400 hover:text-brand-600" aria-label="Home"><Home className="h-4 w-4" strokeWidth={1.7} /></Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-400">Workspace</span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="font-semibold text-slate-700" aria-current="page">{page?.name || 'Overview'}</span>
      </nav>
      <div className="flex min-w-0 items-center gap-5">
        <span className="hidden items-center gap-2 text-[11px] text-slate-400 xl:flex"><CalendarDays className="h-4 w-4" />{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <div className="hidden h-7 w-px bg-slate-100 xl:block" />
        <Link to="/profile" aria-label="Open your profile" className="flex min-w-0 items-center gap-2.5 rounded-xl p-1 transition hover:bg-slate-50">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-200/60 bg-brand-100/70 text-xs font-bold text-brand-800">{initials}</span>
          <div className="hidden min-w-0 lg:block">
            <p className="max-w-[140px] truncate text-xs font-bold text-slate-700">{user?.full_name}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{user?.is_admin ? 'Administrator' : 'Personal account'}</p>
          </div>
          <ChevronRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
