import React from 'react';
import { AlertCircle, CheckCircle2, Inbox, Loader2, X } from 'lucide-react';

export const Alert = ({ children, variant = 'error', onDismiss }) => {
  const success = variant === 'success';
  const Icon = success ? CheckCircle2 : AlertCircle;
  return (
    <div role={success ? 'status' : 'alert'} className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed ${success ? 'border-brand-200 bg-brand-50 text-brand-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="shrink-0 rounded-md p-1 transition hover:bg-black/5"><X className="h-4 w-4" /></button>}
    </div>
  );
};

export const LoadingState = ({ label = 'Loading your data…', compact = false }) => (
  <div role="status" className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${compact ? 'py-10' : 'min-h-[220px] py-16'}`}>
    <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
    <span className="text-xs">{label}</span>
  </div>
);

export const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description, children, compact = false }) => (
  <div className={`flex flex-col items-center justify-center px-5 text-center ${compact ? 'py-8' : 'py-14'}`}>
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400"><Icon className="h-6 w-6" strokeWidth={1.5} /></div>
    <h3 className="text-sm font-bold text-slate-700">{title}</h3>
    {description && <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>}
    {children && <div className="mt-5">{children}</div>}
  </div>
);
