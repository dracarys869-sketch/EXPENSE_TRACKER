import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Receipt, Target, BarChart3, Check, ArrowRight, Plus } from 'lucide-react';

const features = [
  { icon: Receipt, title: 'Add expenses in seconds', text: 'Amount, category, done. No receipts to scan, no forms to fill out.' },
  { icon: Target, title: 'Monthly budgets that stick', text: 'Set a limit per category and get a nudge before you go over.' },
  { icon: BarChart3, title: 'Reports you will actually read', text: 'One page per month. What came in, what went out, what changed.' },
];

const steps = [
  ['1', 'Create your account', 'Sign up with your email. Your data stays yours.'],
  ['2', 'Log your spending', 'Add expenses as they happen, from your phone or laptop.'],
  ['3', 'Check in weekly', 'Glance at your budget and adjust before month-end.'],
];

const sampleRows = [
  ['Jollibee lunch', 'Food · Oct 8', '₱185'],
  ['Jeep + MRT', 'Transport · Oct 8', '₱95'],
  ['Meralco bill', 'Bills · Oct 7', '₱1,240'],
];

const sampleBars = [
  ['Food', '₱4,200 of ₱6,000', '70%'],
  ['Transport', '₱1,800 of ₱2,500', '72%'],
  ['Bills', '₱2,430 of ₱3,000', '81%'],
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="bg-white border-b border-stone-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/welcome" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-800 text-white">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">ExpenseTracker</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
            <a href="#features" className="hover:text-stone-900">Features</a>
            <a href="#how" className="hover:text-stone-900">How it works</a>
            <a href="#sample" className="hover:text-stone-900">Example</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900">Sign in</Link>
            <Link to="/register" className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">Get started</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              A simpler way to track your gastos.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone-600">
              Write down what you spend, set a monthly budget, and see where your money actually goes. Nothing fancy — just the numbers.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900">
                Start tracking <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold hover:border-stone-400">
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-500">Free to use. No card needed.</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">October spent so far</p>
                <p className="mt-0.5 text-2xl font-bold">₱8,430</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-lg bg-green-800/10 px-2.5 py-1 text-xs font-semibold text-green-800">
                <Plus className="h-3.5 w-3.5" /> Add expense
              </span>
            </div>
            <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-4 text-sm">
              {sampleRows.map(([name, cat, amt]) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100">
                      <Receipt className="h-4 w-4 text-stone-500" />
                    </span>
                    <div>
                      <p className="font-medium leading-tight">{name}</p>
                      <p className="text-xs text-stone-500">{cat}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{amt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-4 border-t border-stone-200 py-12 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-800/10">
                <f.icon className="h-5 w-5 text-green-800" />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.text}</p>
            </div>
          ))}
        </section>

        <section id="how" className="border-t border-stone-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <p className="mt-1.5 text-sm text-stone-600">Three steps, about two minutes of setup.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(([n, t, d]) => (
              <li key={n} className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="text-sm font-bold text-green-800">Step {n}</p>
                <h3 className="mt-1 font-bold">{t}</h3>
                <p className="mt-1.5 text-sm text-stone-600">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="sample" className="grid gap-6 border-t border-stone-200 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">An ordinary month, at a glance.</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              This is what a typical month looks like inside. No charts-for-charts-sake — just your budget against what you spent.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-stone-700">
              {['Separate needs from wants', 'Spot the category that always runs over', 'Carry the lesson into next month'].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-800" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            {sampleBars.map(([label, sub, pct]) => (
              <div key={label} className="border-b border-stone-100 py-3.5 last:border-0 last:pb-1 first:pt-1">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold">{label}</p>
                  <p className="text-stone-500">{sub}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-green-800" style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 rounded-2xl border border-stone-200 bg-white p-8 text-center md:p-10">
          <h2 className="text-2xl font-bold tracking-tight">Start with this month.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">Log your first expense today and see the full picture by the weekend.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900">
            Create a free account <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-800 text-white"><Wallet className="h-4 w-4" /></span>
            ExpenseTracker — made for everyday budgeting.
          </p>
          <p>
            <Link to="/login" className="hover:text-stone-900">Sign in</Link>
            <span className="mx-2">·</span>
            <Link to="/register" className="hover:text-stone-900">Create account</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
