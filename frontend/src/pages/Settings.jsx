import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, DollarSign, Calendar, Bell, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme, currency, setCurrency, updateSettings } = useTheme();
  const [message, setMessage] = useState('');

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    updateSettings({ currency: newCurrency });
    setMessage('Currency setting updated.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
    setMessage('Theme setting updated.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize application theme, currency, and preferences</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
          {/* Appearance / Theme */}
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">Appearance Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 font-bold'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </div>
                {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-950/30 text-indigo-400 font-bold'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </div>
                {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">Currency Symbol</h3>
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
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
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
