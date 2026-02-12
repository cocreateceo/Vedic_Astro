'use client';

import { useContext } from 'react';
import { SignThemeContext } from '@/context/SignThemeContext';

export function useSignTheme() {
  return useContext(SignThemeContext);
}
