import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Brand from './Brand';
import { mainNavigation, accountNavigation, adminNavigation } from './navigation';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const accountItems = [...accountNavigation, ...(user?.is_admin ? [adminNavigation] : [])];

  const renderLink = ({ name, path, icon: Icon }) => (
    <NavLink key={path} to={path} end={path === '/'} title={collapsed ? name : undefined} aria-label={collapsed ? name : undefined} className={({ isActive }) => `group flex min-h-11 items-center rounded-xl text-[13px] transition duration-150 ${collapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} ${isActive ? 'bg-brand-600 font-semibold text-white shadow-sm' : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
      <Icon className="h-[19px] w-[19px] shrink-0" strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{name}</span>}
    </NavLink>
  );

  return (
    <aside className={`relative z-30 hidden h-full shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-200 md:flex ${collapsed ? 'w-20' : 'w-[244px]'}`}>
      <div className={`flex h-20 shrink-0 items-center ${collapsed ? 'justify-center' : 'px-6'}`}><Brand compact={collapsed} /></div>
      <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-3' : 'px-4'}`}>
        <nav aria-label="Main navigation" className="pt-5">
          {!collapsed && <p className="eyebrow mb-4 px-3.5">Workspace</p>}
          <div className="space-y-1.5">{mainNavigation.map(renderLink)}</div>
        </nav>
        <nav aria-label="Account navigation" className="mt-8">
          {!collapsed && <p className="eyebrow mb-4 px-3.5">Account</p>}
          <div className="space-y-1.5">{accountItems.map(renderLink)}</div>
        </nav>
      </div>
      {!collapsed && (
        <Link to="/budgets" className="group mx-5 mb-5 mt-6 rounded-xl border border-brand-100 bg-brand-50/80 p-4 transition hover:bg-brand-100/70">
          <div className="mb-3 flex items-center justify-between text-brand-600"><Sprout className="h-5 w-5" /><ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
          <p className="text-xs font-bold text-brand-900">Small steps. Better habits.</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-brand-700/80">Give every peso a purpose with a monthly budget.</p>
        </Link>
      )}
      <div className={`flex shrink-0 items-center border-t border-slate-100 p-3 ${collapsed ? 'flex-col gap-1' : 'justify-between'}`}>
        <button type="button" onClick={() => { logout(); navigate('/login'); }} className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 ${collapsed ? 'w-full justify-center' : ''}`} title="Sign out" aria-label="Sign out">
          <LogOut className="h-[18px] w-[18px]" />{!collapsed && 'Sign out'}
        </button>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="icon-button h-8 w-8" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
