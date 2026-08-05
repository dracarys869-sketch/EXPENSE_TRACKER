import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title || 'Confirm Action'}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message || 'Are you sure you want to proceed?'}</p>

          <div className="flex space-x-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
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
                <span>Delete</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
