import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { Alert } from './Feedback';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirm action', message = 'Are you sure you want to proceed?', confirmLabel = 'Delete', loading = false, error }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" busy={loading}>
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertTriangle className="h-6 w-6" strokeWidth={1.7} /></div>
    <p className="text-sm leading-relaxed text-slate-500">{message}</p>
    {error && <div className="mt-4"><Alert>{error}</Alert></div>}
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button type="button" onClick={onClose} disabled={loading} data-autofocus className="btn-secondary">Cancel</button>
      <button type="button" onClick={onConfirm} disabled={loading} className="btn-danger">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Please wait…' : confirmLabel}</button>
    </div>
  </Modal>
);

export default ConfirmModal;
