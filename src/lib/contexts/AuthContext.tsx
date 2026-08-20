"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginParams, RegisterParams } from '../types';
import { authService, setAccessToken } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasRefreshToken = !!localStorage.getItem('refreshToken');
        if (hasRefreshToken) {
          const userData = await authService.me();
          setUser(userData);
        }
      } catch (error) {
        // me() failed, meaning refreshToken is likely invalid or expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (params: LoginParams) => {
    try {
      const res = await authService.login(params);
      setAccessToken(res.tokens.accessToken);
      localStorage.setItem('refreshToken', res.tokens.refreshToken);
      setUser(res.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (params: RegisterParams) => {
    try {
      const res = await authService.register(params);
      setAccessToken(res.tokens.accessToken);
      localStorage.setItem('refreshToken', res.tokens.refreshToken);
      setUser(res.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
