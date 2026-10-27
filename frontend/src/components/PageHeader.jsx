import React from 'react';

const PageHeader = ({ title, description, eyebrow, children }) => (
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div className="min-w-0">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.045em] text-slate-900 lg:text-[29px]">{title}</h1>
      {description && <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{description}</p>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
  </div>
);

export default PageHeader;
