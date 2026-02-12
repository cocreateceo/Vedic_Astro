// Planetary strength, dignity, and divisional chart calculations
// Maps to ClickAstro Chapter 14: Additional Calculations and Tables

import type { Planet } from '@/types';
import { signNames } from './vedic-constants';

const signLords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

// ─── Exaltation / Debilitation data ───
const EXALTATION: Record<string, { sign: number; degree: number }> = {
  Sun: { sign: 0, degree: 10 },    // Aries 10°
  Moon: { sign: 1, degree: 3 },    // Taurus 3°
  Mars: { sign: 9, degree: 28 },   // Capricorn 28°
  Mercury: { sign: 5, degree: 15 },// Virgo 15°
  Jupiter: { sign: 3, degree: 5 }, // Cancer 5°
  Venus: { sign: 11, degree: 27 }, // Pisces 27°
  Saturn: { sign: 6, degree: 20 }, // Libra 20°
};
const DEBILITATION: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

// Own signs
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

// Moolatrikona: [sign, startDeg, endDeg]
const MOOLATRIKONA: Record<string, [number, number, number]> = {
  Sun: [4, 0, 20], Moon: [1, 4, 20], Mars: [0, 0, 12],
  Mercury: [5, 16, 20], Jupiter: [8, 0, 10], Venus: [6, 0, 15], Saturn: [10, 0, 20],
};

// Natural friendships
const FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'], Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'], Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'], Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
};
const ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn'], Moon: [],
  Mars: ['Mercury'], Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'], Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
};

// ═══════════════ 1. GRAHAVASTHA ═══════════════

export interface GrahavasthaEntry {
  planet: string;
  sign: string;
  signIndex: number;
  degree: string;
  status: 'exalted' | 'debilitated' | 'moolatrikona' | 'own' | 'friend' | 'enemy' | 'neutral';
  dignity: string;
  retrograde: boolean;
}

function getDignity(planet: string, signIndex: number, degree: number): GrahavasthaEntry['status'] {
  if (planet === 'Rahu' || planet === 'Ketu') return 'neutral';

  // Exaltation
  const exalt = EXALTATION[planet];
  if (exalt && exalt.sign === signIndex) return 'exalted';

  // Debilitation
  if (DEBILITATION[planet] === signIndex) return 'debilitated';

  // Moolatrikona
  const mt = MOOLATRIKONA[planet];
  if (mt && mt[0] === signIndex && degree >= mt[1] && degree <= mt[2]) return 'moolatrikona';

  // Own sign
  if (OWN_SIGNS[planet]?.includes(signIndex)) return 'own';

  // Friend / Enemy / Neutral
  const signLord = signLords[signIndex];
  if (signLord === planet) return 'own';
  if (FRIENDS[planet]?.includes(signLord)) return 'friend';
  if (ENEMIES[planet]?.includes(signLord)) return 'enemy';
  return 'neutral';
}

const DIGNITY_LABELS: Record<string, string> = {
  exalted: 'Exalted (Uchcha)', debilitated: 'Debilitated (Neecha)',
  moolatrikona: 'Moolatrikona', own: 'Own Sign (Swakshetra)',
  friend: "Friend's Sign (Mitra)", enemy: "Enemy's Sign (Shatru)", neutral: 'Neutral',
};

export function calculateGrahavastha(positions: Record<string, Planet>): GrahavasthaEntry[] {
  const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return order.map(name => {
    const p = positions[name];
    if (!p) return null;
    const deg = parseFloat(p.degree);
    const status = getDignity(name, p.signIndex, deg);
    return {
      planet: name, sign: p.sign, signIndex: p.signIndex,
      degree: p.degree, status, dignity: DIGNITY_LABELS[status],
      retrograde: p.retrograde,
    };
  }).filter(Boolean) as GrahavasthaEntry[];
}

// ═══════════════ 2. SHADBALA (Simplified) ═══════════════

export interface ShadbalaEntry {
  planet: string;
  sthanaBala: number;
  digBala: number;
  naisargikaBala: number;
  totalBala: number;
  percentage: number;
  strength: 'very_strong' | 'strong' | 'moderate' | 'weak' | 'very_weak';
}

const STHANA_SCORES: Record<string, number> = {
  exalted: 60, moolatrikona: 45, own: 30, friend: 15, neutral: 0, enemy: -15, debilitated: -30,
};

// Dig Bala: planet strongest in specific house
const DIG_BALA_HOUSE: Record<string, number> = {
  Jupiter: 1, Mercury: 1, Sun: 10, Mars: 10, Moon: 4, Venus: 4, Saturn: 7,
};

const NAISARGIKA_BALA: Record<string, number> = {
  Sun: 60, Moon: 51.4, Venus: 42.9, Jupiter: 34.3, Mercury: 25.7, Mars: 17.1, Saturn: 8.6,
};

export function calculateShadbala(positions: Record<string, Planet>, ascSignIndex: number): ShadbalaEntry[] {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  return planets.map(name => {
    const p = positions[name];
    if (!p) return null;

    const deg = parseFloat(p.degree);
    const status = getDignity(name, p.signIndex, deg);
    const sthanaBala = STHANA_SCORES[status] ?? 0;

    const house = p.house || (((p.signIndex - ascSignIndex + 12) % 12) + 1);
    const bestHouse = DIG_BALA_HOUSE[name] ?? 1;
    const digBala = house === bestHouse ? 20 : (house === ((bestHouse + 5) % 12 + 1) ? -10 : 0);

    const naisargikaBala = NAISARGIKA_BALA[name] ?? 20;

    const totalBala = sthanaBala + digBala + naisargikaBala;
    const maxPossible = 60 + 20 + 60; // 140
    const minPossible = -30 + -10 + 8.6; // -31.4
    const percentage = Math.round(((totalBala - minPossible) / (maxPossible - minPossible)) * 100);
    const clamped = Math.max(0, Math.min(100, percentage));

    let strength: ShadbalaEntry['strength'];
    if (clamped >= 80) strength = 'very_strong';
    else if (clamped >= 60) strength = 'strong';
    else if (clamped >= 40) strength = 'moderate';
    else if (clamped >= 20) strength = 'weak';
    else strength = 'very_weak';

    return {
      planet: name, sthanaBala, digBala,
      naisargikaBala: Math.round(naisargikaBala * 10) / 10,
      totalBala: Math.round(totalBala * 10) / 10,
      percentage: clamped, strength,
    };
  }).filter(Boolean) as ShadbalaEntry[];
}

// ═══════════════ 3. ISHTA / KASHTA PHALA ═══════════════

export interface IshtaKashtaEntry {
  planet: string;
  ishtaPhala: number;
  kashtaPhala: number;
  netEffect: 'favorable' | 'unfavorable' | 'neutral';
}

export function calculateIshtaKashta(positions: Record<string, Planet>, ascSignIndex: number): IshtaKashtaEntry[] {
  const shadbala = calculateShadbala(positions, ascSignIndex);
  return shadbala.map(s => {
    const ishta = Math.round(s.percentage * 0.6);
    const kashta = 60 - ishta;
    return {
      planet: s.planet, ishtaPhala: ishta, kashtaPhala: kashta,
      netEffect: ishta > kashta + 5 ? 'favorable' : ishta < kashta - 5 ? 'unfavorable' : 'neutral',
    };
  });
}

// ═══════════════ 4. BHAVABALA (House Strength) ═══════════════

export interface BhavabalaEntry {
  house: number;
  sign: string;
  signLord: string;
  strength: number;
  category: 'strong' | 'moderate' | 'weak';
}

const BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];

export function calculateBhavabala(positions: Record<string, Planet>, ascSignIndex: number): BhavabalaEntry[] {
  const shadbala = calculateShadbala(positions, ascSignIndex);
  const shadbalaMap: Record<string, number> = {};
  shadbala.forEach(s => { shadbalaMap[s.planet] = s.percentage; });

  return Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const houseSign = (ascSignIndex + i) % 12;
    const lord = signLords[houseSign];

    let strength = 0;
    // Lord strength contribution (40%)
    strength += (shadbalaMap[lord] ?? 50) * 0.4;

    // Planets in house
    Object.entries(positions).forEach(([name, p]) => {
      const pHouse = p.house || (((p.signIndex - ascSignIndex + 12) % 12) + 1);
      if (pHouse === houseNum) {
        strength += BENEFICS.includes(name) ? 15 : -5;
      }
    });

    strength = Math.round(Math.max(0, Math.min(100, strength)));
    const category = strength >= 55 ? 'strong' : strength >= 35 ? 'moderate' : 'weak';

    return { house: houseNum, sign: signNames[houseSign], signLord: lord, strength, category };
  });
}

// ═══════════════ 5. SHODASAVARGA (16 Divisional Charts) ═══════════════

export interface ShodasavargaEntry {
  planet: string;
  d1: string; d2: string; d3: string; d4: string;
  d7: string; d9: string; d10: string; d12: string;
  d16: string; d20: string; d24: string; d27: string; d30: string; d60: string;
}

function divChart(signIndex: number, degree: number, div: number, oddStart: number, evenStart: number): number {
  const part = Math.floor(degree / (30 / div));
  const isOdd = signIndex % 2 === 0; // Aries=0 is odd sign
  const startSign = isOdd ? (signIndex + oddStart) % 12 : (signIndex + evenStart) % 12;
  return (startSign + part) % 12;
}

function navamsaSign(signIndex: number, degree: number): number {
  const pada = Math.floor(degree / (30 / 9));
  const navStart = [0, 9, 6, 3]; // Fire=Ar, Earth=Cap, Air=Li, Water=Ca
  const element = signIndex % 4;
  return (navStart[element] + (signIndex % 3) * 9 + pada) % 12;
}

function trimsamsa(signIndex: number, degree: number): number {
  const isOdd = signIndex % 2 === 0;
  if (isOdd) {
    if (degree < 5) return 0;       // Mars → Aries
    if (degree < 10) return 10;     // Saturn → Aquarius
    if (degree < 18) return 8;      // Jupiter → Sagittarius
    if (degree < 25) return 2;      // Mercury → Gemini
    return 1;                        // Venus → Taurus
  } else {
    if (degree < 5) return 1;       // Venus → Taurus
    if (degree < 12) return 5;      // Mercury → Virgo
    if (degree < 20) return 11;     // Jupiter → Pisces
    if (degree < 25) return 9;      // Saturn → Capricorn
    return 7;                        // Mars → Scorpio
  }
}

export function calculateShodasavarga(positions: Record<string, Planet>): ShodasavargaEntry[] {
  const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return order.map(name => {
    const p = positions[name];
    if (!p) return null;
    const si = p.signIndex;
    const deg = parseFloat(p.degree);

    return {
      planet: name,
      d1: signNames[si].slice(0, 3),
      d2: deg < 15 ? 'Leo' : 'Can',  // Hora
      d3: signNames[divChart(si, deg, 3, 0, 0)].slice(0, 3),
      d4: signNames[divChart(si, deg, 4, 0, 0)].slice(0, 3),
      d7: signNames[divChart(si, deg, 7, 0, 6)].slice(0, 3),
      d9: signNames[navamsaSign(si, deg)].slice(0, 3),
      d10: signNames[divChart(si, deg, 10, 0, 8)].slice(0, 3),
      d12: signNames[divChart(si, deg, 12, 0, 0)].slice(0, 3),
      d16: signNames[divChart(si, deg, 16, 0, 0)].slice(0, 3),
      d20: signNames[divChart(si, deg, 20, 0, 0)].slice(0, 3),
      d24: signNames[divChart(si, deg, 24, 0, 0)].slice(0, 3),
      d27: signNames[divChart(si, deg, 27, 0, 0)].slice(0, 3),
      d30: signNames[trimsamsa(si, deg)].slice(0, 3),
      d60: signNames[divChart(si, deg, 60, 0, 0)].slice(0, 3),
    };
  }).filter(Boolean) as ShodasavargaEntry[];
}

// ═══════════════ 6. SAYANA (Tropical) LONGITUDE ═══════════════

export interface SayanaEntry {
  planet: string;
  nirayana: string;
  ayanamsa: string;
  sayana: string;
  tropicalSign: string;
}

export function calculateSayanaLongitude(positions: Record<string, Planet>, birthYear: number): SayanaEntry[] {
  // Lahiri ayanamsa approximation
  const ayanamsa = 24.12 - (2026 - birthYear) * 0.01397;
  const ayanDeg = Math.floor(ayanamsa);
  const ayanMin = Math.round((ayanamsa - ayanDeg) * 60);
  const ayanStr = `${ayanDeg}°${ayanMin.toString().padStart(2, '0')}'`;

  const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return order.map(name => {
    const p = positions[name];
    if (!p) return null;

    const nirLong = p.signIndex * 30 + parseFloat(p.degree);
    const sayLong = (nirLong + ayanamsa) % 360;

    const nirDeg = Math.floor(nirLong);
    const nirMin = Math.round((nirLong - nirDeg) * 60);
    const sayDeg = Math.floor(sayLong);
    const sayMin = Math.round((sayLong - sayDeg) * 60);

    const tropSign = signNames[Math.floor(sayLong / 30)];

    return {
      planet: name,
      nirayana: `${nirDeg}°${nirMin.toString().padStart(2, '0')}'`,
      ayanamsa: ayanStr,
      sayana: `${sayDeg}°${sayMin.toString().padStart(2, '0')}'`,
      tropicalSign: tropSign,
    };
  }).filter(Boolean) as SayanaEntry[];
}

// ═══════════════ 7. BHAVA TABLE ═══════════════

export interface BhavaTableEntry {
  house: number;
  sign: string;
  startDegree: string;
  midDegree: string;
  endDegree: string;
  planetsInHouse: string[];
}

function fmtDeg(deg: number): string {
  const d = deg % 360;
  const dd = Math.floor(d);
  const mm = Math.round((d - dd) * 60);
  return `${dd}°${mm.toString().padStart(2, '0')}'`;
}

export function calculateBhavaTable(positions: Record<string, Planet>, ascSignIndex: number, ascDegree: number): BhavaTableEntry[] {
  const ascAbsolute = ascSignIndex * 30 + ascDegree;

  return Array.from({ length: 12 }, (_, i) => {
    const start = (ascAbsolute + i * 30) % 360;
    const mid = (start + 15) % 360;
    const end = (start + 30) % 360;
    const houseSign = signNames[Math.floor(start / 30) % 12];

    const planets: string[] = [];
    Object.entries(positions).forEach(([name, p]) => {
      const pLong = p.signIndex * 30 + parseFloat(p.degree);
      let diff = (pLong - start + 360) % 360;
      if (diff < 30) planets.push(name);
    });

    return {
      house: i + 1, sign: houseSign,
      startDegree: fmtDeg(start), midDegree: fmtDeg(mid), endDegree: fmtDeg(end),
      planetsInHouse: planets,
    };
  });
}

// ═══════════════ 8. KP STAR LORD / SUB-LORD TABLE ═══════════════

export interface KPEntry {
  planet: string;
  signDegree: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
}

const NAKSHATRA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

// Vimshottari dasha durations for sub-lord calculation
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // Ke,Ve,Su,Mo,Ma,Ra,Ju,Sa,Me
const TOTAL_YEARS = 120;

export function calculateKPTable(positions: Record<string, Planet>): KPEntry[] {
  const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  return order.map(name => {
    const p = positions[name];
    if (!p) return null;

    const absLong = p.signIndex * 30 + parseFloat(p.degree);
    const nakIdx = Math.floor(absLong / (360 / 27));
    const nakshatra = NAKSHATRA_NAMES[nakIdx] || 'Unknown';
    const nakshatraLord = NAKSHATRA_LORDS[nakIdx % 9];

    // Sub-lord: position within nakshatra (each 13°20' = 800')
    const nakStart = nakIdx * (360 / 27);
    const posInNak = absLong - nakStart;
    const nakSpan = 360 / 27; // 13.333°

    // Divide nakshatra proportionally among 9 planets starting from nakshatra lord
    const startIdx = nakIdx % 9;
    let accumulated = 0;
    let subLord = NAKSHATRA_LORDS[startIdx];
    let subSubLord = subLord;

    for (let i = 0; i < 9; i++) {
      const lordIdx = (startIdx + i) % 9;
      const span = (DASHA_YEARS[lordIdx] / TOTAL_YEARS) * nakSpan;
      if (accumulated + span > posInNak) {
        subLord = NAKSHATRA_LORDS[lordIdx];
        // Sub-sub-lord: further divide this sub-lord's span
        const subPos = posInNak - accumulated;
        let subAcc = 0;
        for (let j = 0; j < 9; j++) {
          const ssIdx = (lordIdx + j) % 9;
          const ssSpan = (DASHA_YEARS[ssIdx] / TOTAL_YEARS) * span;
          if (subAcc + ssSpan > subPos) {
            subSubLord = NAKSHATRA_LORDS[ssIdx];
            break;
          }
          subAcc += ssSpan;
        }
        break;
      }
      accumulated += span;
    }

    const deg = Math.floor(absLong);
    const min = Math.round((absLong - deg) * 60);

    return {
      planet: name,
      signDegree: `${p.sign} ${p.degree}°`,
      nakshatra, nakshatraLord, subLord, subSubLord,
    };
  }).filter(Boolean) as KPEntry[];
}
