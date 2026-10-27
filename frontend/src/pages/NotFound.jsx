import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import Brand from '../components/Brand';

const NotFound = () => (
  <div className="flex min-h-screen flex-col bg-[#fafbf9]">
    <header className="mx-auto w-full max-w-6xl px-6 py-6"><Brand to="/" /></header>
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-500"><Compass className="h-8 w-8" strokeWidth={1.5} /></span><p className="eyebrow mt-7 text-brand-600">Error 404</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-0.045em] text-slate-900">A little off the map.</h1><p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">We couldn’t find that page. Let’s get you back to a clearer picture.</p><Link to="/" className="btn-primary mt-7"><ArrowLeft className="h-4 w-4" />Back to your workspace</Link></main>
  </div>
);

export default NotFound;
