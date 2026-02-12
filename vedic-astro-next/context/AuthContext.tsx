'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import * as auth from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: { name: string; email: string; password: string; dob: string; tob: string; pob: string; timezone: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateBirthDetails: (dob: string, tob: string, pob: string, timezone: string) => User | null;
  refreshHoroscope: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: () => ({ success: false }),
  register: () => ({ success: false }),
  logout: () => {},
  updateBirthDetails: () => null,
  refreshHoroscope: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.initUsersStorage();
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      // Recalculate chart if engine was updated since last login
      const migrated = auth.migrateChartIfNeeded();
      const refreshed = auth.refreshHoroscope();
      setUser(migrated || refreshed || currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback((email: string, password: string) => {
    const loggedInUser = auth.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const handleRegister = useCallback((data: { name: string; email: string; password: string; dob: string; tob: string; pob: string; timezone: string }) => {
    const result = auth.register(data);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const handleLogout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const handleUpdateBirthDetails = useCallback((dob: string, tob: string, pob: string, timezone: string) => {
    const updatedUser = auth.updateBirthDetails(dob, tob, pob, timezone);
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
      register: handleRegister,
      logout: handleLogout,
      updateBirthDetails: handleUpdateBirthDetails,
      refreshHoroscope: handleRefreshHoroscope,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
