import { PanchangData, RahuKaalData } from '@/types';
import { computeFullChart } from '@/lib/kundli-calc';
import { nakshatras, tithis, yogas } from '@/lib/vedic-constants';

/**
 * Calculate Panchang for a given date using real Sun/Moon positions.
 * Uses sunrise time (6:00 AM) at Delhi for the daily panchang.
 */
export function calculatePanchang(date: Date): PanchangData {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const fc = computeFullChart(dateStr, '06:00'); // sunrise for daily panchang

  // Derive tithiIndex from the tithi string
  const tithiPart = fc.tithi.replace(/^(Shukla|Krishna)\s+/, '');
  const isKrishna = fc.tithi.startsWith('Krishna');
  const tithiNum = tithis.indexOf(tithiPart);
  const tithiIndex = isKrishna ? (tithiNum >= 0 ? tithiNum + 15 : 15) : (tithiNum >= 0 ? tithiNum : 0);

  return {
    tithi: fc.tithi,
    nakshatra: fc.moonData.nakshatra,
    yoga: fc.yoga,
    karana: fc.karana,
    tithiIndex
  };
}

const rahuKaalTimes = [
  { start: '4:30 PM', end: '6:00 PM', startH: 16.5, endH: 18 },
  { start: '7:30 AM', end: '9:00 AM', startH: 7.5, endH: 9 },
  { start: '3:00 PM', end: '4:30 PM', startH: 15, endH: 16.5 },
  { start: '12:00 PM', end: '1:30 PM', startH: 12, endH: 13.5 },
  { start: '1:30 PM', end: '3:00 PM', startH: 13.5, endH: 15 },
  { start: '10:30 AM', end: '12:00 PM', startH: 10.5, endH: 12 },
  { start: '9:00 AM', end: '10:30 AM', startH: 9, endH: 10.5 }
];

export function calculateRahuKaal(date: Date): RahuKaalData {
  const day = date.getDay();
  const rk = rahuKaalTimes[day];
  const currentHour = date.getHours() + date.getMinutes() / 60;
  const isActive = currentHour >= rk.startH && currentHour < rk.endH;

  return { ...rk, isActive };
}

export function getRahuKaalTimeString(day: number): string {
  const times = [
    '4:30 PM - 6:00 PM', '7:30 AM - 9:00 AM', '3:00 PM - 4:30 PM',
    '12:00 PM - 1:30 PM', '1:30 PM - 3:00 PM', '10:30 AM - 12:00 PM',
    '9:00 AM - 10:30 AM'
  ];
  return times[day];
}

/** Approximate sunrise/sunset for a given date (default: New Delhi 28.6°N) */
export function calculateSunTimes(date: Date): { sunrise: string; sunset: string } {
  const lat = 28.6; // New Delhi latitude
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

  // Solar declination approximation
  const decl = -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  const latRad = (lat * Math.PI) / 180;
  const declRad = (decl * Math.PI) / 180;

  // Hour angle
  const cosH = -Math.tan(latRad) * Math.tan(declRad);
  const clampedCosH = Math.max(-1, Math.min(1, cosH));
  const haDeg = (Math.acos(clampedCosH) * 180) / Math.PI;

  // Sunrise/sunset in hours (solar noon ~12:00)
  const sunriseH = 12 - haDeg / 15;
  const sunsetH = 12 + haDeg / 15;

  function formatTime(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  }

  return { sunrise: formatTime(sunriseH), sunset: formatTime(sunsetH) };
}

export { nakshatras, tithis, yogas };
