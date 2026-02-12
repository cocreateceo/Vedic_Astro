'use client';

import { useState, useEffect } from 'react';
import { PanchangData, RahuKaalData } from '@/types';
import { calculatePanchang, calculateRahuKaal } from '@/lib/panchang';

export function usePanchang() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [rahuKaal, setRahuKaal] = useState<RahuKaalData | null>(null);
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    const today = new Date();
    setPanchang(calculatePanchang(today));
    setRahuKaal(calculateRahuKaal(today));
    setDateString(today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  return { panchang, rahuKaal, dateString };
}
