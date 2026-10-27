import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, description, children, size = 'md', busy = false, initialFocusRef }) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const root = document.getElementById('root');
    const wasInert = root?.inert;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (root) root.inert = true;
    const frame = requestAnimationFrame(() => {
      (initialFocusRef?.current || dialogRef.current?.querySelector('[data-autofocus]') || dialogRef.current)?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (root) root.inert = wasInert;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen, initialFocusRef]);

  if (!isOpen) return null;

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && !busy) {
      event.preventDefault();
      onCloseRef.current();
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter((element) => element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[4px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} aria-busy={busy} tabIndex={-1} onKeyDown={handleKeyDown} className={`modal-enter relative my-auto max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-2xl bg-white shadow-float outline-none ${size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg'}`}>
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-slate-900">{title}</h2>
            {description && <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="icon-button -mr-1 -mt-1 h-8 w-8" aria-label="Close dialog"><X className="h-[18px] w-[18px]" /></button>
        </header>
        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>,
    document.body,
  );
};

export default Modal;
