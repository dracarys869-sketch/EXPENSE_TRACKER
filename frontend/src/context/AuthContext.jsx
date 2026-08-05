import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await api.post('/register', {
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });
      const { access_token, user: userData } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, updateUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
