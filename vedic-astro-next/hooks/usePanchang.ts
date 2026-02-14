'use client';

import { useState, useEffect } from 'react';
import { PanchangData, RahuKaalData } from '@/types';
import { calculatePanchang, calculateRahuKaal, calculateSunTimes, calculateLocationRahuKaal } from '@/lib/panchang';
import { detectCityAsync, type CityData } from '@/lib/city-timings';

export function usePanchang() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [rahuKaal, setRahuKaal] = useState<RahuKaalData | null>(null);
  const [dateString, setDateString] = useState('');
  const [city, setCity] = useState<CityData | null>(null);
  const [sunTimes, setSunTimes] = useState<{ sunrise: string; sunset: string } | null>(null);

  useEffect(() => {
    const today = new Date();
    setPanchang(calculatePanchang(today));
    // Default Rahu Kaal (Delhi, hardcoded fallback)
    setRahuKaal(calculateRahuKaal(today));
    setSunTimes(calculateSunTimes(today));
    setDateString(today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Detect user location and recalculate with location-based data
    detectCityAsync().then((detected) => {
      setCity(detected);
      const st = calculateSunTimes(today, detected.lat, detected.lng, detected.tz);
      setSunTimes({ sunrise: st.sunrise, sunset: st.sunset });
      setRahuKaal(calculateLocationRahuKaal(today, st.sunriseH, st.sunsetH));
    });
  }, []);

  return { panchang, rahuKaal, dateString, city, sunTimes };
}
