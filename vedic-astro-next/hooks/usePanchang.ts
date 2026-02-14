'use client';

import { useState, useEffect, useCallback } from 'react';
import { PanchangData, RahuKaalData } from '@/types';
import { calculatePanchang, calculateRahuKaal, calculateSunTimes, calculateLocationRahuKaal } from '@/lib/panchang';
import { detectCityAsync, findCityByName, type CityData } from '@/lib/city-timings';

const CITY_STORAGE_KEY = 'vedic-panchang-city';

export function usePanchang() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [rahuKaal, setRahuKaal] = useState<RahuKaalData | null>(null);
  const [dateString, setDateString] = useState('');
  const [city, setCity] = useState<CityData | null>(null);
  const [sunTimes, setSunTimes] = useState<{ sunrise: string; sunset: string } | null>(null);

  const recalcForCity = useCallback((detected: CityData) => {
    const today = new Date();
    setCity(detected);
    const st = calculateSunTimes(today, detected.lat, detected.lng, detected.tz);
    setSunTimes({ sunrise: st.sunrise, sunset: st.sunset });
    setRahuKaal(calculateLocationRahuKaal(today, st.sunriseH, st.sunsetH));
  }, []);

  useEffect(() => {
    const today = new Date();
    setPanchang(calculatePanchang(today));
    setRahuKaal(calculateRahuKaal(today));
    setSunTimes(calculateSunTimes(today));
    setDateString(today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Check localStorage for manual city selection first
    try {
      const saved = localStorage.getItem(CITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CityData;
        if (parsed.name && typeof parsed.lat === 'number') {
          recalcForCity(parsed);
          return; // Don't auto-detect if user has manually selected
        }
      }
    } catch { /* ignore */ }

    // No manual selection — auto-detect
    detectCityAsync().then(recalcForCity);
  }, [recalcForCity]);

  /** Manually set city — saves to localStorage and recalculates panchang */
  const updateCity = useCallback((newCity: CityData) => {
    try { localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(newCity)); } catch { /* ignore */ }
    recalcForCity(newCity);
  }, [recalcForCity]);

  /** Clear manual selection and re-detect automatically */
  const resetCity = useCallback(() => {
    try { localStorage.removeItem(CITY_STORAGE_KEY); } catch { /* ignore */ }
    detectCityAsync().then(recalcForCity);
  }, [recalcForCity]);

  return { panchang, rahuKaal, dateString, city, sunTimes, updateCity, resetCity };
}
