'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import * as auth from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>;
  loginWithOAuthToken: (token: string) => Promise<{ success: boolean; needsProfile?: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; dob: string; tob: string; pob: string; timezone: string }) => Promise<{ success: boolean; error?: string; userId?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateBirthDetails: (dob: string, tob: string, pob: string, timezone: string) => Promise<User | null>;
  refreshHoroscope: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => ({ success: false }),
  loginWithOAuthToken: async () => ({ success: false }),
  register: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  resendVerification: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: () => {},
  updateBirthDetails: async () => null,
  refreshHoroscope: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Try to restore session from token
      const validated = await auth.validateSession();
      if (validated) {
        const migrated = auth.migrateChartIfNeeded();
        const refreshed = auth.refreshHoroscope();
        setUser(migrated || refreshed || validated);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await auth.login(email, password);
    if (result.success) {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        const refreshed = auth.refreshHoroscope();
        setUser(refreshed || currentUser);
      }
    }
    return result;
  }, []);

  const handleLoginWithOAuthToken = useCallback(async (token: string) => {
    const result = await auth.loginWithOAuthToken(token);
    if (result.success) {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        if (currentUser.vedicChart) {
          const refreshed = auth.refreshHoroscope();
          setUser(refreshed || currentUser);
        } else {
          setUser(currentUser);
        }
      }
    }
    return result;
  }, []);

  const handleRegister = useCallback(async (data: { name: string; email: string; password: string; dob: string; tob: string; pob: string; timezone: string }) => {
    return auth.register(data);
  }, []);

  const handleVerifyEmail = useCallback(async (email: string, code: string) => {
    const result = await auth.verifyEmail(email, code);
    if (result.success && result.user) {
      const refreshed = auth.refreshHoroscope();
      setUser(refreshed || result.user);
    }
    return result;
  }, []);

  const handleResendVerification = useCallback(async (email: string) => {
    return auth.resendVerification(email);
  }, []);

  const handleForgotPassword = useCallback(async (email: string) => {
    return auth.forgotPassword(email);
  }, []);

  const handleResetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    return auth.resetPassword(email, code, newPassword);
  }, []);

  const handleLogout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const handleUpdateBirthDetails = useCallback(async (dob: string, tob: string, pob: string, timezone: string) => {
    const updatedUser = await auth.updateBirthDetails(dob, tob, pob, timezone);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  }, []);

  const handleRefreshHoroscope = useCallback(() => {
    const refreshed = auth.refreshHoroscope();
    if (refreshed) setUser(refreshed);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      loading,
      login: handleLogin,
      loginWithOAuthToken: handleLoginWithOAuthToken,
      register: handleRegister,
      verifyEmail: handleVerifyEmail,
      resendVerification: handleResendVerification,
      forgotPassword: handleForgotPassword,
      resetPassword: handleResetPassword,
      logout: handleLogout,
      updateBirthDetails: handleUpdateBirthDetails,
      refreshHoroscope: handleRefreshHoroscope,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
