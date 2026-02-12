/**
 * Swiss Ephemeris Spike Test
 * Verify: Lakshmi Jagannathan birth chart
 * Birth: Jul 30, 1979, 7:30 PM IST (+5:30), Bangalore (12°59'N, 77°35'E)
 * Ayanamsa: Lahiri
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Patch global fetch to handle file:// URLs (Node.js WASM loading workaround)
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const urlStr = typeof url === 'string' ? url : url.toString();
  if (urlStr.startsWith('file://')) {
    const filePath = urlStr.replace('file:///', '').replace('file://', '');
    const data = readFileSync(filePath);
    return new Response(data, {
      status: 200,
      headers: { 'content-type': 'application/wasm' }
    });
  }
  return originalFetch(url, opts);
};

const { default: SwissEPH } = await import('sweph-wasm');

const signNames = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

function lonToSign(lon) {
  return Math.floor(((lon % 360) + 360) % 360 / 30);
}

function lonToDegInSign(lon) {
  return ((lon % 360) + 360) % 360 % 30;
}

function lonToNakshatra(lon) {
  const normLon = ((lon % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27;
  const idx = Math.floor(normLon / nakshatraSpan) % 27;
  const degInNak = normLon % nakshatraSpan;
  const pada = Math.min(4, Math.floor(degInNak / (nakshatraSpan / 4)) + 1);
  return { name: nakshatras[idx], pada };
}

async function main() {
  console.log('=== Swiss Ephemeris Spike Test ===\n');
  console.log('Initializing Swiss Ephemeris (WASM)...');

  const swe = await SwissEPH.init();
  console.log(`Swiss Ephemeris version: ${swe.swe_version()}`);

  // Download ephemeris files from CDN
  console.log('\nDownloading ephemeris files from CDN...');
  await swe.swe_set_ephe_path();

  // --- Birth Data ---
  // Jul 30, 1979, 7:30:00 PM IST (+5:30)
  // Convert to UTC: 19:30 - 5:30 = 14:00 UTC
  const year = 1979;
  const month = 7;
  const day = 30;
  const utcHour = 14.0; // 7:30 PM IST = 2:00 PM UTC

  // Bangalore coordinates
  const latitude = 12 + 59/60;    // 12°59'N
  const longitude = 77 + 35/60;   // 77°35'E

  // Calculate Julian Day (Gregorian calendar)
  const jd = swe.swe_julday(year, month, day, utcHour, swe.SE_GREG_CAL);
  console.log(`\nJulian Day: ${jd}`);

  // Set Lahiri Ayanamsa
  swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

  const ayanamsa = swe.swe_get_ayanamsa_ut(jd);
  console.log(`Lahiri Ayanamsa: ${ayanamsa.toFixed(4)} deg (expected ~23.57 for 1979)\n`);

  // --- Planet Positions (Sidereal) ---
  const SIDEREAL_FLAG = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

  const planetDefs = [
    { id: swe.SE_SUN,       name: 'Sun',     expected: 'Cancer' },
    { id: swe.SE_MOON,      name: 'Moon',    expected: 'Virgo' },
    { id: swe.SE_MARS,      name: 'Mars',    expected: 'Gemini' },
    { id: swe.SE_MERCURY,   name: 'Mercury', expected: 'Cancer' },
    { id: swe.SE_JUPITER,   name: 'Jupiter', expected: 'Cancer' },
    { id: swe.SE_VENUS,     name: 'Venus',   expected: 'Cancer' },
    { id: swe.SE_SATURN,    name: 'Saturn',  expected: 'Leo' },
    { id: swe.SE_MEAN_NODE, name: 'Rahu',    expected: 'Leo' },
  ];

  console.log('--- Planet Positions (Sidereal / Lahiri) ---');
  console.log(
    'Planet'.padEnd(10) + 'Longitude'.padEnd(12) + 'Sign'.padEnd(14) +
    'Deg'.padEnd(10) + 'Nakshatra'.padEnd(22) + 'Pada '.padEnd(6) +
    'Retro'.padEnd(6) + 'Expected'.padEnd(14) + 'Match?'
  );
  console.log('-'.repeat(100));

  let matchCount = 0;
  let totalCount = 0;

  for (const planet of planetDefs) {
    const result = swe.swe_calc_ut(jd, planet.id, SIDEREAL_FLAG);
    const lon = result[0];
    const speed = result[3];
    const signIdx = lonToSign(lon);
    const degInSign = lonToDegInSign(lon);
    const nak = lonToNakshatra(lon);
    const retrograde = speed < 0;
    const signName = signNames[signIdx];
    const match = signName === planet.expected;

    if (match) matchCount++;
    totalCount++;

    console.log(
      planet.name.padEnd(10) +
      lon.toFixed(4).padEnd(12) +
      signName.padEnd(14) +
      degInSign.toFixed(2).padEnd(10) +
      nak.name.padEnd(22) +
      String(nak.pada).padEnd(6) +
      (retrograde ? 'R' : '').padEnd(6) +
      planet.expected.padEnd(14) +
      (match ? 'YES' : 'NO !!!')
    );
  }

  // Ketu = Rahu + 180
  const rahuResult = swe.swe_calc_ut(jd, swe.SE_MEAN_NODE, SIDEREAL_FLAG);
  const ketuLon = (rahuResult[0] + 180) % 360;
  const ketuSignIdx = lonToSign(ketuLon);
  const ketuDeg = lonToDegInSign(ketuLon);
  const ketuNak = lonToNakshatra(ketuLon);
  const ketuSign = signNames[ketuSignIdx];
  const ketuMatch = ketuSign === 'Aquarius';
  if (ketuMatch) matchCount++;
  totalCount++;

  console.log(
    'Ketu'.padEnd(10) +
    ketuLon.toFixed(4).padEnd(12) +
    ketuSign.padEnd(14) +
    ketuDeg.toFixed(2).padEnd(10) +
    ketuNak.name.padEnd(22) +
    String(ketuNak.pada).padEnd(6) +
    ''.padEnd(6) +
    'Aquarius'.padEnd(14) +
    (ketuMatch ? 'YES' : 'NO !!!')
  );

  // --- Ascendant ---
  console.log('\n--- Ascendant ---');
  const houses = swe.swe_houses(jd, latitude, longitude, 'W');
  const tropAsc = houses.ascmc[0];
  const sidAsc = (tropAsc - ayanamsa + 360) % 360;
  const ascSignIdx = lonToSign(sidAsc);
  const ascDeg = lonToDegInSign(sidAsc);
  const ascSign = signNames[ascSignIdx];
  const ascMatch = ascSign === 'Capricorn';
  if (ascMatch) matchCount++;
  totalCount++;

  console.log(`Tropical Asc:  ${tropAsc.toFixed(4)}`);
  console.log(`Sidereal Asc:  ${sidAsc.toFixed(4)} => ${ascSign} ${ascDeg.toFixed(2)}`);
  console.log(`Expected: Capricorn  ${ascMatch ? 'YES' : 'NO !!!'}`);

  // --- Moon Nakshatra ---
  const moonResult = swe.swe_calc_ut(jd, swe.SE_MOON, SIDEREAL_FLAG);
  const moonLon = moonResult[0];
  const moonNak = lonToNakshatra(moonLon);
  console.log(`\n--- Moon (for Dasha) ---`);
  console.log(`Moon: ${signNames[lonToSign(moonLon)]} ${lonToDegInSign(moonLon).toFixed(2)} deg`);
  console.log(`Nakshatra: ${moonNak.name} Pada ${moonNak.pada}`);

  // --- Summary ---
  console.log(`\n${'='.repeat(60)}`);
  console.log(`RESULT: ${matchCount}/${totalCount} positions match reference`);
  console.log('='.repeat(60));

  if (matchCount === totalCount) {
    console.log('\n>>> PERFECT MATCH! Ready for production integration. <<<');
  } else {
    console.log(`\n>>> ${totalCount - matchCount} mismatches. Investigate. <<<`);
  }

  swe.swe_close();
}

main().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
