import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('dirtrace_token'));
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    const savedToken = localStorage.getItem('dirtrace_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
      setClub(data.club);
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('dirtrace_token', data.token);
    setToken(data.token);
    setUser(data.user);
    await loadUserData();
    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    localStorage.setItem('dirtrace_token', data.token);
    setToken(data.token);
    setUser(data.user);
    await loadUserData();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dirtrace_token');
    setToken(null);
    setUser(null);
    setClub(null);
    setRegistrations([]);
  };

  const refreshMe = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider value={{
      user,
      club,
      registrations,
      token,
      loading,
      login,
      register,
      logout,
      refreshMe
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
