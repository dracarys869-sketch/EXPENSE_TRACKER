import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { currency, setCurrency, updateSettings } = useTheme();
  const [message, setMessage] = useState('');

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    updateSettings({ currency: newCurrency });
    setMessage('Currency setting updated.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Settings</h2>
          <p className="text-sm text-brand-500 dark:text-brand-400">Customize currency and preferences</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white dark:bg-brand-800 border border-brand-100 dark:border-brand-700 shadow-sm space-y-6">
          {/* Currency Selection */}
          <div>
            <h3 className="text-sm font-bold uppercase text-brand-400 tracking-wider mb-3">Currency Symbol</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'USD', name: 'USD ($)' },
                { code: 'PHP', name: 'PHP (₱)' },
                { code: 'EUR', name: 'EUR (€)' },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all ${
                    currency === c.code
                      ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                      : 'border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
