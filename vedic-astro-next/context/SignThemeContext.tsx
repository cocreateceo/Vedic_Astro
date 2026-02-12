'use client';

import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  SignKey, ThemeKey, ThemePalette, SIGN_KEYS, SIGN_PALETTES,
  VISUAL_THEME_KEYS, VISUAL_THEMES, DEFAULT_PALETTE,
  getSignByIndex, getThemePalette, isThemeKey,
} from '@/lib/sign-themes';

interface SignThemeContextType {
  signKey: ThemeKey | null;
  palette: ThemePalette;
  isDefault: boolean;
  overrideKey: ThemeKey | null;
  userSignKey: SignKey | null;
  setOverride: (key: ThemeKey | null) => void;
  allSigns: { key: SignKey; name: string; hindi: string; primary: string }[];
}

export const SignThemeContext = createContext<SignThemeContextType>({
  signKey: null,
  palette: DEFAULT_PALETTE,
  isDefault: true,
  overrideKey: null,
  userSignKey: null,
  setOverride: () => {},
  allSigns: [],
});

const allSigns = SIGN_KEYS.map(k => ({
  key: k,
  name: SIGN_PALETTES[k].name,
  hindi: SIGN_PALETTES[k].hindi,
  primary: SIGN_PALETTES[k].primary,
}));

export function SignThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [overrideKey, setOverrideKey] = useState<ThemeKey | null>(null);

  // Load saved theme override from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem('vedic-theme-override');
    if (saved && isThemeKey(saved)) {
      setOverrideKey(saved as ThemeKey);
    }
  }, []);

  const userSignKey: SignKey | null = useMemo(() => {
    if (!isLoggedIn || !user?.vedicChart?.moonSign) return null;
    return getSignByIndex(user.vedicChart.moonSign.index);
  }, [isLoggedIn, user]);

  // Override takes priority, then user's moon sign, then default (null = vedic ember via :root)
  const activeKey: ThemeKey | null = overrideKey ?? userSignKey;

  const palette = useMemo(() => {
    return activeKey ? getThemePalette(activeKey) : DEFAULT_PALETTE;
  }, [activeKey]);

  const setOverride = useCallback((key: ThemeKey | null) => {
    setOverrideKey(key);
    if (key) {
      localStorage.setItem('vedic-theme-override', key);
    } else {
      localStorage.removeItem('vedic-theme-override');
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.add('theme-loading');
    if (activeKey) {
      body.setAttribute('data-sign-theme', activeKey);
    } else {
      body.removeAttribute('data-sign-theme');
    }
    requestAnimationFrame(() => {
      body.classList.remove('theme-loading');
    });
    return () => {
      body.removeAttribute('data-sign-theme');
    };
  }, [activeKey]);

  return (
    <SignThemeContext.Provider value={{ signKey: activeKey, palette, isDefault: !activeKey, overrideKey, userSignKey, setOverride, allSigns }}>
      {children}
    </SignThemeContext.Provider>
  );
}
