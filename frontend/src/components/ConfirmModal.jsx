import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-black dark:text-white flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-black dark:text-white" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{title || 'Confirm Action'}</h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">{message || 'Are you sure you want to proceed?'}</p>

          <div className="flex space-x-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{confirmLabel}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
