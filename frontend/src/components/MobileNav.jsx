import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Ellipsis, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { mainNavigation, accountNavigation, adminNavigation } from './navigation';

const MobileNav = () => {
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const items = mainNavigation.slice(0, 4);
  const moreItems = [mainNavigation[4], ...accountNavigation, ...(user?.is_admin ? [adminNavigation] : [])];
  const moreActive = moreItems.some((item) => item.path === pathname);

  return (
    <>
      <nav aria-label="Mobile navigation" className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {items.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} /><span>{name === 'Transactions' ? 'Activity' : name}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog" aria-expanded={moreOpen} className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold ${moreActive || moreOpen ? 'bg-brand-50 text-brand-700' : 'text-slate-400'}`}><Ellipsis className="h-[19px] w-[19px]" /><span>More</span></button>
        </div>
      </nav>
      <Modal isOpen={moreOpen} onClose={() => setMoreOpen(false)} title="Your workspace" description="Everything you need, in one place." size="sm">
        <nav aria-label="More navigation" className="space-y-1">
          {moreItems.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setMoreOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}><Icon className="h-5 w-5" /><span className="flex-1">{name}</span><ChevronRight className="h-4 w-4 text-slate-400" /></NavLink>
          ))}
          <div className="pt-3"><button type="button" onClick={() => { setMoreOpen(false); logout(); navigate('/login'); }} className="flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-3.5 text-sm font-medium text-rose-600"><LogOut className="h-5 w-5" />Sign out</button></div>
        </nav>
      </Modal>
    </>
  );
};

export default MobileNav;
