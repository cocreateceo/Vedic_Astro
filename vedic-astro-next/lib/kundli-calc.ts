import { Planet, MoonSignData, AscendantData, DashaData, AntardashaData, DashaWithAntardasha } from '@/types';
import { computeChart, type AstroResult } from './astro';
import { findCityOrDefault, getUtcOffsetHours } from './city-timings';
import {
  signNames, signSymbols, hindiSignNames, signAbbrev,
  planetNames, planetAbbrev, nakshatras,
  tithis as tithiList, yogas as yogaList, movableKaranas, fixedKaranas,
  dashaOrder, dashaDurations, DASHA_CYCLE_YEARS,
  functionalBeneficsMap, mostMaleficMap,
} from './vedic-constants';
export type { Planet };
export { signNames, signSymbols, hindiSignNames, signAbbrev, planetNames, planetAbbrev };

export function calculateNakshatraPada(signIndex: number, degree: number): { nakshatraIndex: number; pada: number } {
  const absoluteDegree = signIndex * 30 + degree;
  const nakshatraIndex = Math.floor(absoluteDegree / 13.333) % 27;
  const degreeInNakshatra = absoluteDegree % 13.333;
  const pada = Math.min(4, Math.floor(degreeInNakshatra / 3.333) + 1);
  return { nakshatraIndex, pada };
}

export function calculateNavamsaSign(signIndex: number, pada: number): number {
  const navamsaNumber = signIndex * 9 + (pada - 1);
  return navamsaNumber % 12;
}

// ---------- Internal helper: resolve birth location to chart ----------

interface PlaceOptions {
  lat?: number;
  lng?: number;
  tz?: string;
  place?: string;
}

function resolveChart(birthDate: string, birthTime: string, options?: PlaceOptions): AstroResult {
  let lat: number, lng: number, utcOffset: number;

  if (options?.lat !== undefined && options?.lng !== undefined) {
    lat = options.lat;
    lng = options.lng;
    utcOffset = options.tz ? getUtcOffsetHours(options.tz) : 5.5;
  } else if (options?.place) {
    const city = findCityOrDefault(options.place);
    lat = city.lat;
    lng = city.lng;
    utcOffset = getUtcOffsetHours(city.tz);
  } else {
    // Default to Delhi for backward compatibility
    lat = 28.61;
    lng = 77.21;
    utcOffset = 5.5;
  }

  return computeChart({ dateStr: birthDate, timeStr: birthTime, lat, lng, utcOffsetHours: utcOffset });
}

// Map a body key from AstroResult to the standard planet name
const BODY_TO_PLANET: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mars: 'Mars', mercury: 'Mercury',
  jupiter: 'Jupiter', venus: 'Venus', saturn: 'Saturn', rahu: 'Rahu', ketu: 'Ketu',
};

// ---------- Public API ----------

/** Result of a single computeChart() call with all derived data */
export interface FullChartResult {
  moonData: MoonSignData;
  ascendant: AscendantData;
  positions: Record<string, Planet>;
  tithi: string;
  yoga: string;
  karana: string;
  sunSignIndex: number;
}

/**
 * Compute everything from a single engine call.
 * Use this instead of calling calculateMoonSign + calculateAscendant + ... separately.
 */
export function computeFullChart(birthDate: string, birthTime: string, options?: PlaceOptions): FullChartResult {
  const chart = resolveChart(birthDate, birthTime, options);
  const ascSignIndex = chart.ascendant.signIndex;

  // Positions
  const positions: Record<string, Planet> = {};
  for (const [bodyKey, planetName] of Object.entries(BODY_TO_PLANET)) {
    const body = chart[bodyKey as keyof AstroResult] as { longitude: number; speed: number; signIndex: number; degreeInSign: number };
    const signIndex = body.signIndex;
    const degree = body.degreeInSign;
    const house = ((signIndex - ascSignIndex + 12) % 12) + 1;
    const { nakshatraIndex, pada } = calculateNakshatraPada(signIndex, degree);
    const retrograde = body.speed < 0 && ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(planetName);

    positions[planetName] = {
      name: planetName,
      sign: signNames[signIndex],
      signIndex,
      signHindi: hindiSignNames[signIndex],
      degree: degree.toFixed(2),
      house,
      nakshatra: nakshatras[nakshatraIndex],
      nakshatraPada: pada,
      retrograde,
    };
  }

  // Moon sign
  const moonSignIndex = chart.moon.signIndex;
  const moonDegree = chart.moon.degreeInSign;
  const moonNak = calculateNakshatraPada(moonSignIndex, moonDegree);
  const moonData: MoonSignData = {
    sign: signNames[moonSignIndex],
    signIndex: moonSignIndex,
    signHindi: hindiSignNames[moonSignIndex],
    symbol: signSymbols[moonSignIndex],
    nakshatra: nakshatras[moonNak.nakshatraIndex],
    nakshatraPada: moonNak.pada,
  };

  // Ascendant
  const ascendant: AscendantData = {
    sign: signNames[ascSignIndex],
    signIndex: ascSignIndex,
    signHindi: hindiSignNames[ascSignIndex],
    symbol: signSymbols[ascSignIndex],
  };

  // Tithi
  const sunLng = chart.sun.longitude;
  const moonLng = chart.moon.longitude;
  let tithiDiff = moonLng - sunLng;
  if (tithiDiff < 0) tithiDiff += 360;
  const tithiIndex = Math.floor(tithiDiff / 12);
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const tithi = `${paksha} ${tithiList[tithiIndex % 15]}`;

  // Yoga
  const yogaSum = (sunLng + moonLng) % 360;
  const yogaIndex = Math.floor(yogaSum / (800 / 60)) % 27;
  const yoga = yogaList[yogaIndex];

  // Karana
  let karanaDiff = moonLng - sunLng;
  if (karanaDiff < 0) karanaDiff += 360;
  const karanaIndex = Math.floor(karanaDiff / 6) % 60;
  let karana: string;
  if (karanaIndex === 0) karana = fixedKaranas[0];
  else if (karanaIndex === 57) karana = fixedKaranas[1];
  else if (karanaIndex === 58) karana = fixedKaranas[2];
  else if (karanaIndex === 59) karana = fixedKaranas[3];
  else karana = movableKaranas[(karanaIndex - 1) % 7];

  return { moonData, ascendant, positions, tithi, yoga, karana, sunSignIndex: chart.sun.signIndex };
}

// Legacy wrappers — each still works independently but prefer computeFullChart() for efficiency

export function calculatePlanetaryPositions(birthDate: string, birthTime: string, options?: PlaceOptions): Record<string, Planet> {
  return computeFullChart(birthDate, birthTime, options).positions;
}

export function calculateAscendant(birthDate: string, birthTime: string, options?: PlaceOptions): AscendantData {
  return computeFullChart(birthDate, birthTime, options).ascendant;
}

export function calculateMoonSign(birthDate: string, birthTime: string, options?: PlaceOptions): MoonSignData {
  return computeFullChart(birthDate, birthTime, options).moonData;
}

export function calculateDasha(birthDate: string, moonNakshatra: string): DashaData[] {
  const nakshatraIndex = nakshatras.indexOf(moonNakshatra);
  const dashaLordIndex = nakshatraIndex % 9;
  const dashas: DashaData[] = [];
  let currentYear = new Date(birthDate).getFullYear();
  const balanceYears = dashaDurations[dashaLordIndex] * 0.6;

  for (let i = 0; i < 9; i++) {
    const index = (dashaLordIndex + i) % 9;
    const planet = dashaOrder[index];
    const duration = i === 0 ? balanceYears : dashaDurations[index];
    const endYear = currentYear + duration;

    dashas.push({
      planet,
      startYear: Math.floor(currentYear),
      endYear: Math.floor(endYear),
      duration,
      isCurrent: new Date().getFullYear() >= currentYear && new Date().getFullYear() < endYear
    });

    currentYear = endYear;
  }

  return dashas;
}

export function calculateTithi(birthDate: string, birthTime: string, options?: PlaceOptions): string {
  return computeFullChart(birthDate, birthTime, options).tithi;
}

export function calculateYoga(birthDate: string, birthTime: string, options?: PlaceOptions): string {
  return computeFullChart(birthDate, birthTime, options).yoga;
}

export function calculateKarana(birthDate: string, birthTime: string, options?: PlaceOptions): string {
  return computeFullChart(birthDate, birthTime, options).karana;
}

// ---------- Antardasha (Sub-period) Calculation ----------

export function calculateAntardasha(mahadashaPlanet: string, startYear: number, duration: number): AntardashaData[] {
  const antardashas: AntardashaData[] = [];

  const startIndex = dashaOrder.indexOf(mahadashaPlanet);
  if (startIndex === -1) return antardashas;

  let currentTime = startYear;
  const now = new Date().getFullYear() + (new Date().getMonth() / 12);

  for (let i = 0; i < 9; i++) {
    const idx = (startIndex + i) % 9;
    const planet = dashaOrder[idx];
    const antarDuration = (duration * dashaDurations[idx]) / DASHA_CYCLE_YEARS;

    const endTime = currentTime + antarDuration;
    const startMonth = Math.round((currentTime % 1) * 12);
    const endMonth = Math.round((endTime % 1) * 12);

    antardashas.push({
      planet,
      startYear: Math.floor(currentTime),
      startMonth: startMonth || 1,
      endYear: Math.floor(endTime),
      endMonth: endMonth || 1,
      duration: antarDuration,
      isCurrent: now >= currentTime && now < endTime,
    });

    currentTime = endTime;
  }

  return antardashas;
}

// ---------- Favourable Period Analysis ----------

export function calculateDashaWithRatings(birthDate: string, moonNakshatra: string, ascendantSignIndex: number): DashaWithAntardasha[] {
  const baseDashas = calculateDasha(birthDate, moonNakshatra);
  const benefics = functionalBeneficsMap[ascendantSignIndex] || [];
  const malefic = mostMaleficMap[ascendantSignIndex];

  return baseDashas.map(d => {
    const isBenefic = benefics.includes(d.planet);
    const isMalefic = d.planet === malefic;

    let rating: 'excellent' | 'favourable' | 'mixed' | 'challenging';
    let ratingReason: string;

    if (isMalefic) {
      rating = 'challenging';
      ratingReason = `${d.planet} is the most malefic planet for your ascendant. This period requires extra caution and remedial measures.`;
    } else if (isBenefic) {
      const isYogakaraka = (ascendantSignIndex === 0 && d.planet === 'Jupiter') ||
        (ascendantSignIndex === 1 && d.planet === 'Saturn') ||
        (ascendantSignIndex === 3 && d.planet === 'Mars') ||
        (ascendantSignIndex === 4 && d.planet === 'Mars') ||
        (ascendantSignIndex === 6 && d.planet === 'Saturn') ||
        (ascendantSignIndex === 9 && d.planet === 'Venus') ||
        (ascendantSignIndex === 10 && d.planet === 'Venus');

      if (isYogakaraka) {
        rating = 'excellent';
        ratingReason = `${d.planet} is the Yogakaraka (most auspicious planet) for your ascendant. This period brings exceptional success, recognition, and prosperity.`;
      } else {
        rating = 'favourable';
        ratingReason = `${d.planet} is a functional benefic for your ascendant. This period supports growth, positive developments, and general well-being.`;
      }
    } else {
      rating = 'mixed';
      ratingReason = `${d.planet} gives mixed results for your ascendant. Careful navigation and balanced approach will bring the best outcomes.`;
    }

    const antardashas = calculateAntardasha(d.planet, d.startYear, d.duration);

    return { ...d, antardashas, rating, ratingReason };
  });
}
