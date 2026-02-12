/**
 * Validation test — Lakshmi Jagannathan reference chart
 * Jul 30, 1979, 19:30 IST (14:00 UT), Bangalore (12.97°N, 77.59°E)
 *
 * Expected placements (from professional Vedic chart software):
 *   Sun      → Cancer     (90–120°)
 *   Moon     → Virgo      (150–180°)
 *   Mars     → Gemini     (60–90°)
 *   Mercury  → Cancer (R) (90–120°)
 *   Jupiter  → Cancer     (90–120°)
 *   Venus    → Cancer     (90–120°)
 *   Saturn   → Leo        (120–150°)
 *   Rahu     → Leo        (120–150°)
 *   Ketu     → Aquarius   (300–330°)
 *   Lagna    → Capricorn  (270–300°)
 *
 * Run with: npx tsx vedic-astro-next/lib/astro/__tests__/validate.ts
 */

import { computeChart } from '../engine';

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const birth = {
  dateStr: '1979-07-30',
  timeStr: '19:30',
  lat: 12.97,
  lng: 77.59,
  utcOffsetHours: 5.5,
};

const chart = computeChart(birth);

const expected: Record<string, { sign: string; signIndex: number }> = {
  sun:       { sign: 'Cancer',     signIndex: 3 },
  moon:      { sign: 'Virgo',      signIndex: 5 },
  mars:      { sign: 'Gemini',     signIndex: 2 },
  mercury:   { sign: 'Cancer',     signIndex: 3 },
  jupiter:   { sign: 'Cancer',     signIndex: 3 },
  venus:     { sign: 'Cancer',     signIndex: 3 },
  saturn:    { sign: 'Leo',        signIndex: 4 },
  rahu:      { sign: 'Leo',        signIndex: 4 },
  ketu:      { sign: 'Aquarius',   signIndex: 10 },
  ascendant: { sign: 'Capricorn',  signIndex: 9 },
};

console.log('=== Vedic Astronomy Engine Validation ===');
console.log(`Birth: Jul 30, 1979, 19:30 IST, Bangalore`);
console.log(`JD: ${chart.julianDay.toFixed(4)}`);
console.log(`Ayanamsa: ${chart.ayanamsa.toFixed(4)}°`);
console.log('');

let passed = 0;
let failed = 0;

for (const [body, exp] of Object.entries(expected)) {
  const pos = chart[body as keyof typeof chart] as { longitude: number; speed: number; signIndex: number; degreeInSign: number };
  const actual = SIGN_NAMES[pos.signIndex];
  const ok = pos.signIndex === exp.signIndex;
  const status = ok ? 'PASS' : 'FAIL';
  const retro = (body !== 'ascendant' && body !== 'rahu' && body !== 'ketu' && pos.speed < 0) ? ' (R)' : '';

  console.log(
    `${status}  ${body.padEnd(10)} → ${actual.padEnd(12)} ${pos.longitude.toFixed(2).padStart(7)}° ${pos.degreeInSign.toFixed(2).padStart(6)}° in sign${retro}` +
    (ok ? '' : `  ← expected ${exp.sign}`)
  );

  if (ok) passed++;
  else failed++;
}

console.log('');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
if (failed > 0) {
  process.exit(1);
}
