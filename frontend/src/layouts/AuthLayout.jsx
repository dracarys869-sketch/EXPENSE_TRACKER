import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Check, Receipt, Sprout, Target } from 'lucide-react';
import Brand from '../components/Brand';

const AuthLayout = ({ children, register = false }) => (
  <div className="min-h-screen bg-[#fafbf9]">
    <header className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6"><Brand to="/welcome" /><div className="flex items-center gap-3"><span className="hidden text-xs text-slate-400 sm:block">{register ? 'Already have an account?' : 'New around here?'}</span><Link to={register ? '/login' : '/register'} className="text-xs font-bold text-brand-700 hover:underline">{register ? 'Sign in' : 'Sign up'} <span aria-hidden="true">↗</span></Link></div></header>
    <main className="mx-auto grid max-w-6xl items-stretch gap-8 px-5 pb-10 pt-3 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-8 lg:pt-5">
      <aside className="balance-pattern relative hidden min-h-[660px] flex-col justify-between overflow-hidden rounded-[28px] bg-brand-900 p-10 text-white lg:flex xl:p-12">
        <div className="relative z-10"><div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-medium text-brand-200"><Sprout className="h-3.5 w-3.5 text-accent-400" />A little clarity, every day</div><h2 className="mt-9 text-[43px] font-extrabold leading-[1.18] tracking-[-0.055em]">Your money.<br />Your pace.<br /><span className="text-accent-400">Your peace of mind.</span></h2><p className="mt-5 max-w-xs text-sm leading-[1.9] text-brand-200/80">Good money habits don’t have to be complicated. Let’s make the everyday a little easier.</p></div>
        <div className="relative z-10 mt-10 space-y-4">{[[Receipt, 'The little things, all in one place', 'Track everyday expenses and income.'], [Target, 'A plan you can actually stick to', 'Build budgets around your real life.'], [BarChart3, 'Your progress, made clear', 'Find the story behind your spending.']].map(([Icon, title, description]) => <div key={title} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-400"><Icon className="h-[18px] w-[18px]" strokeWidth={1.6} /></span><div><p className="text-[11px] font-semibold text-white">{title}</p><p className="mt-1 text-[10px] text-brand-200/70">{description}</p></div></div>)}</div>
        <p className="relative z-10 mt-8 flex items-center gap-2 text-[10px] text-brand-200/70"><Check className="h-3.5 w-3.5 text-accent-400" />A fresh start is always a good idea.</p>
      </aside>
      <section className="flex min-w-0 flex-col justify-center py-4 sm:px-8 lg:px-0 xl:px-6">
        <div className="page-enter mx-auto w-full max-w-[400px]">{children}<div className="mt-7 border-t border-slate-200/70 pt-5"><Link to="/welcome" className="inline-flex items-center gap-2 rounded-md text-[11px] text-slate-400 transition hover:text-brand-600"><ArrowLeft className="h-3.5 w-3.5" />Back to the big picture</Link></div></div>
      </section>
    </main>
    <footer className="pb-6 text-center text-[10px] text-slate-400">ExpenseTracker · Small habits. A brighter financial future.</footer>
  </div>
);

export default AuthLayout;
