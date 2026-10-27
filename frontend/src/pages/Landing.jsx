import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, CheckCircle2, Receipt, Sprout, Target } from 'lucide-react';
import Brand from '../components/Brand';

const features = [
  { icon: Receipt, number: '01', title: 'The little things add up.', text: 'From your morning coffee to your monthly salary, keep every transaction in one beautifully simple place.', color: 'bg-brand-50 text-brand-600', tag: 'Everyday tracking' },
  { icon: Target, number: '02', title: 'Make room for your goals.', text: 'Set a monthly limit, give your categories a budget, and know when it’s time to slow down your spending.', color: 'bg-orange-50 text-orange-500', tag: 'Mindful budgeting' },
  { icon: BarChart3, number: '03', title: 'See the bigger picture.', text: 'Turn your daily habits into clear, useful insights. Understand what comes in, what goes out, and what stays.', color: 'bg-blue-50 text-blue-500', tag: 'Clearer insights' },
];
const steps = [
  ['01', 'Make yourself at home', 'Create your free account. A fresh start for your finances is just a few details away.'],
  ['02', 'Build a little daily habit', 'Log an expense, add your income, and put everything in the right category.'],
  ['03', 'Check in. Feel more in control.', 'Watch your budgets, explore your reports, and make your next money move with confidence.'],
];
const sampleBars = [
  { label: 'Food & dining', amount: '₱4,200', limit: '₱6,000', percentage: 70, color: 'bg-brand-500' },
  { label: 'Transportation', amount: '₱1,800', limit: '₱2,500', percentage: 72, color: 'bg-sky-400' },
  { label: 'Bills & utilities', amount: '₱2,430', limit: '₱3,000', percentage: 81, color: 'bg-amber-400' },
];

const Landing = () => (
  <div className="min-h-screen bg-[#fafbf9] text-slate-800">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Brand to="/welcome" />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-xs font-medium text-slate-500 lg:flex"><a href="#features" className="hover:text-brand-600">Why ExpenseTracker</a><a href="#how" className="hover:text-brand-600">How it works</a><a href="#sample" className="hover:text-brand-600">A closer look</a></nav>
        <div className="flex items-center gap-4"><Link to="/login" className="hidden text-xs font-semibold text-slate-600 hover:text-brand-600 sm:block">Sign in</Link><Link to="/register" className="btn-primary min-h-10 px-3 text-xs sm:px-4">Get started <ArrowUpRight className="hidden h-3.5 w-3.5 sm:block" /></Link></div>
      </div>
    </header>

    <main id="main-content">
      <section className="relative overflow-hidden border-b border-slate-200/60 px-5 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="page-enter relative mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50 px-3.5 py-2 text-[10px] font-semibold text-brand-700"><Sprout className="h-3.5 w-3.5" />Better money habits start here</div>
          <h1 className="text-[42px] font-extrabold leading-[1.12] tracking-[-0.065em] text-slate-900 sm:text-[62px] lg:text-[76px]">Less guesswork.<br /><span className="text-brand-600">More peace of mind.</span></h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-[1.9] text-slate-500 sm:text-base">A simpler way to track your gastos, plan your month, and feel good about where your money goes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/register" className="btn-primary min-h-12 px-6">Start tracking for free <ArrowRight className="h-4 w-4" /></Link><a href="#how" className="btn-secondary min-h-12 px-6">See how it works <ArrowDown className="h-4 w-4 text-slate-400" /></a></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-slate-400">{['Free to use', 'No credit card needed', 'Made for everyday life'].map((text) => <span key={text} className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-brand-600" />{text}</span>)}</div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <section id="features" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow text-brand-600">Less effort. More clarity.</p><h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">Good habits, made simple.</h2></div><p className="max-w-xs text-xs leading-relaxed text-slate-500">Everything you need to feel a little more in control of your money, every day.</p></div>
          <div className="grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, number, title, text, color, tag }) => <article key={number} className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-float lg:p-7"><div className="flex items-center justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-[21px] w-[21px]" strokeWidth={1.6} /></span><span className="text-[10px] font-semibold text-slate-400">{number}</span></div><p className="eyebrow mt-8 text-[9px]">{tag}</p><h3 className="mt-2 text-base font-bold tracking-tight text-slate-800">{title}</h3><p className="mt-3 text-xs leading-[1.9] text-slate-500">{text}</p></article>)}</div>
        </section>

        <section id="sample" className="grid scroll-mt-24 items-center gap-10 border-y border-slate-200/70 py-16 md:grid-cols-2 md:gap-16 sm:py-20">
          <div><p className="eyebrow text-brand-600">A little intention goes a long way</p><h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl">Your month.<br />With a plan.</h2><p className="mt-5 max-w-sm text-sm leading-[1.9] text-slate-500">More than numbers on a screen. See how your everyday choices fit into the life you’re building.</p><ul className="mt-6 space-y-3">{['Give your essentials a little structure', 'Spot spending before it gets ahead of you', 'Make the next month a little better'].map((text) => <li key={text} className="flex items-center gap-2.5 text-xs text-slate-600"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />{text}</li>)}</ul><Link to="/register" className="text-link mt-7 text-xs">Make a plan of your own <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="relative rounded-[24px] border border-brand-100 bg-brand-50/80 p-4 sm:p-7">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-float sm:p-6">
              <div className="flex items-center justify-between"><span className="section-title">My monthly plan</span><span className="badge-neutral">Example</span></div>
              <div className="mt-5 flex items-end justify-between border-b border-slate-100 pb-5"><div><p className="text-[10px] text-slate-400">Monthly budget</p><p className="amount mt-1 text-[28px] font-extrabold text-slate-800">₱11,500<span className="text-lg text-slate-400">.00</span></p></div><span className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Target className="h-[18px] w-[18px]" /></span></div>
              <div className="mt-5 space-y-5">{sampleBars.map(({ label, amount, limit, percentage, color }) => <div key={label}><div className="mb-2 flex items-center justify-between gap-2 text-[10px]"><span className="font-semibold text-slate-600">{label}</span><span className="amount text-slate-400"><span className="font-semibold text-slate-600">{amount}</span> / {limit}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>)}</div>
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2.5 text-[10px] font-medium text-brand-700"><CheckCircle2 className="h-3.5 w-3.5" />₱3,070 left in your plan. You’ve got this.</div>
            </div>
            <p className="mt-4 text-center text-[9px] text-brand-700">Illustrative budget · Your plan, your numbers</p>
          </div>
        </section>

        <section id="how" className="grid scroll-mt-24 gap-10 py-16 md:grid-cols-2 md:gap-16 sm:py-20">
          <div><p className="eyebrow text-brand-600">Start small. Keep going.</p><h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl">A fresh start.<br />Three simple steps.</h2><p className="mt-5 max-w-sm text-sm leading-[1.9] text-slate-500">You don’t need to be a numbers person. Just bring a little curiosity about where your money goes.</p><Link to="/register" className="btn-secondary mt-7">Let’s get started <ArrowUpRight className="h-4 w-4" /></Link></div>
          <ol className="space-y-0">{steps.map(([number, title, text], index) => <li key={number} className="relative flex gap-5 pb-9 last:pb-0">{index < steps.length - 1 && <span className="absolute bottom-0 left-5 top-12 w-px bg-slate-200" aria-hidden="true" />}<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[11px] font-bold text-brand-700">{number}</span><div className="pt-2"><h3 className="text-sm font-bold text-slate-800">{title}</h3><p className="mt-2 max-w-sm text-xs leading-[1.9] text-slate-500">{text}</p></div></li>)}</ol>
        </section>

        <section className="balance-pattern relative mb-16 overflow-hidden rounded-[24px] bg-brand-900 px-6 py-12 text-center sm:mb-20 sm:px-12 sm:py-16"><Sprout className="relative mx-auto mb-5 h-7 w-7 text-accent-400" strokeWidth={1.5} /><h2 className="relative text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">A better month starts today.</h2><p className="relative mx-auto mt-4 max-w-md text-xs leading-relaxed text-brand-200">One expense, one small habit, one step closer to feeling good about your money.</p><Link to="/register" className="relative mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-400 px-6 py-3 text-xs font-bold text-brand-950 transition hover:bg-accent-500">Create your free account <ArrowRight className="h-4 w-4" /></Link></section>
      </div>
    </main>

    <footer className="border-t border-slate-200/70 bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6"><Brand to="/welcome" /><p className="text-[10px] text-slate-400">A little clarity for your everyday money.</p><div className="flex gap-5 text-[11px] font-medium text-slate-500"><Link to="/login" className="hover:text-brand-600">Sign in</Link><Link to="/register" className="hover:text-brand-600">Create account <span aria-hidden="true">↗</span></Link></div></div></footer>
  </div>
);

export default Landing;
