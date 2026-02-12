/**
 * Side-by-side comparison: Our engine vs Swiss Ephemeris (ground truth)
 * Lakshmi Jagannathan: Jul 30, 1979, 19:30 IST, Bangalore
 */

import { computeChart } from '../engine';

// Swiss Ephemeris values from spike/test-chart.mjs output
const SWEPH: Record<string, { lng: number; retro: boolean }> = {
  sun:       { lng: 103.2471, retro: false },
  moon:      { lng: 174.3228, retro: false },
  mars:      { lng:  60.4109, retro: false },
  mercury:   { lng: 105.1899, retro: true },
  jupiter:   { lng: 113.4457, retro: false },
  venus:     { lng:  96.1160, retro: false },
  saturn:    { lng: 138.6295, retro: false },  // Saturn speed is -ve in SwEph too
  rahu:      { lng: 136.5035, retro: true },
  ketu:      { lng: 316.5035, retro: false },
  ascendant: { lng: 295.6446, retro: false },
};

const chart = computeChart({
  dateStr: '1979-07-30',
  timeStr: '19:30',
  lat: 12.97,
  lng: 77.59,
  utcOffsetHours: 5.5,
});

console.log('=== Engine vs Swiss Ephemeris Comparison ===');
console.log(`Ayanamsa: Ours=${chart.ayanamsa.toFixed(4)}  SwEph=23.5718`);
console.log('');
console.log('Body       Our°        SwEph°      Delta°   Sign Match');
console.log('─'.repeat(60));

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

let maxDelta = 0;
for (const [body, sweph] of Object.entries(SWEPH)) {
  const ours = chart[body as keyof typeof chart] as { longitude: number; signIndex: number };
  const delta = Math.abs(ours.longitude - sweph.lng);
  const ourSign = SIGN_NAMES[ours.signIndex];
  const swSign = SIGN_NAMES[Math.floor(sweph.lng / 30)];
  const signMatch = ourSign === swSign;
  if (delta > maxDelta) maxDelta = delta;

  console.log(
    `${body.padEnd(10)} ${ours.longitude.toFixed(4).padStart(10)}  ${sweph.lng.toFixed(4).padStart(10)}  ${delta.toFixed(4).padStart(8)}   ${signMatch ? 'YES' : 'NO !!!'}`
  );
}

console.log('─'.repeat(60));
console.log(`Max delta: ${maxDelta.toFixed(4)}°`);
console.log(`Threshold for sign accuracy: 30° signs, so < ~15° delta is fine for sign matching.`);
console.log(`Threshold for nakshatra accuracy: 13.33° spans, so < ~6° delta is ideal.`);
