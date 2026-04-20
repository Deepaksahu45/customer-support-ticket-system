// Aegis — Authentication context provider
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('aegis_token');
    const savedUser = localStorage.getItem('aegis_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Persist auth state
  const persistAuth = (tokenValue, userValue) => {
    localStorage.setItem('aegis_token', tokenValue);
    localStorage.setItem('aegis_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  // Login
  const login = useCallback(async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    persistAuth(newToken, newUser);
    return res.data;
  }, []);

  // Register — accepts { name, email, password, role }
  const register = useCallback(async (data) => {
    const res = await axiosInstance.post('/auth/register', data);
    const { token: newToken, user: newUser } = res.data.data;
    persistAuth(newToken, newUser);
    return res.data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user');
    setToken(null);
    setUser(null);
  }, []);

  // Role helpers
  const isAdmin = () => user?.role === 'admin';
  const isAgent = () => user?.role === 'agent';
  const isCustomer = () => user?.role === 'customer';

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    isAdmin,
    isAgent,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
