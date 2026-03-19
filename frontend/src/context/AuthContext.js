import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('stockai_token'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if token exists
  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('stockai_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Register - creates account, saves token, sets user
  const register = async (name, email, password) => {
    const response = await authAPI.register(name, email, password);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('stockai_token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  // Login - authenticates, saves token, sets user
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('stockai_token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  // Logout - clears everything
  const logout = () => {
    localStorage.removeItem('stockai_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
