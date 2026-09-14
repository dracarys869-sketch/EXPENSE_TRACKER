import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'USD');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    PHP: '₱',
  };

  useEffect(() => {
    window.document.documentElement.classList.remove('dark');
    localStorage.removeItem('app_theme');
  }, []);

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  // Sync settings from server if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/settings')
        .then((res) => {
          if (res.data) {
            setCurrency(res.data.currency || 'USD');
            setDateFormat(res.data.date_format || 'YYYY-MM-DD');
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const updateSettings = async (newSettings) => {
    if (newSettings.currency) setCurrency(newSettings.currency);
    if (newSettings.date_format) setDateFormat(newSettings.date_format);

    if (isAuthenticated && !newSettings.theme) {
      try {
        await api.put('/settings', newSettings);
      } catch (err) {
        console.error('Failed to sync settings with server', err);
      }
    }
  };

  const formatAmount = (amount) => {
    const symbol = currencySymbols[currency] || '$';
    const num = Number(amount || 0);
    return `${symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <ThemeContext.Provider value={{ currency, setCurrency, currencySymbols, formatAmount, updateSettings, dateFormat }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
