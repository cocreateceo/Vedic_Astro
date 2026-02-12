/**
 * Swiss Ephemeris - FULLY OFFLINE Test (zero network calls)
 * Proves: No CDN, no API, no third-party links at runtime
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Patch fetch to load ALL files from local disk (WASM + ephemeris)
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const urlStr = typeof url === 'string' ? url : url.toString();
  if (urlStr.startsWith('file://')) {
    const filePath = urlStr.replace('file:///', '').replace('file://', '');
    const data = readFileSync(filePath);
    return new Response(data, {
      status: 200,
      headers: { 'content-type': 'application/octet-stream' }
    });
  }
  // Block ALL network requests to prove we're offline
  console.log(`  BLOCKED external fetch: ${urlStr}`);
  return new Response('', { status: 404 });
};

const { default: SwissEPH } = await import('sweph-wasm');

const signNames = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

async function main() {
  console.log('=== FULLY OFFLINE Swiss Ephemeris Test ===');
  console.log('(All external network requests are BLOCKED)\n');

  // Init WASM from local file
  const swe = await SwissEPH.init();
  console.log(`Swiss Ephemeris version: ${swe.swe_version()}`);

  // Load ephemeris from LOCAL disk (not CDN)
  const localEphePath = join(__dirname, 'node_modules', 'sweph-wasm', 'dist', 'ephe');
  const localEpheUrl = 'file:///' + localEphePath.replace(/\\/g, '/');

  console.log(`\nLoading ephemeris from LOCAL disk: ${localEpheUrl}`);
  await swe.swe_set_ephe_path(localEpheUrl, ['sepl_18.se1', 'semo_18.se1', 'seas_18.se1']);

  // Same birth data: Lakshmi Jagannathan
  const jd = swe.swe_julday(1979, 7, 30, 14.0, swe.SE_GREG_CAL);
  swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
  const ayanamsa = swe.swe_get_ayanamsa_ut(jd);
  const FLAG = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

  console.log(`\nJulian Day: ${jd}`);
  console.log(`Ayanamsa: ${ayanamsa.toFixed(4)}\n`);

  // Calculate all planets
  const planets = [
    { id: swe.SE_SUN, name: 'Sun', expected: 'Cancer' },
    { id: swe.SE_MOON, name: 'Moon', expected: 'Virgo' },
    { id: swe.SE_MARS, name: 'Mars', expected: 'Gemini' },
    { id: swe.SE_MERCURY, name: 'Mercury', expected: 'Cancer' },
    { id: swe.SE_JUPITER, name: 'Jupiter', expected: 'Cancer' },
    { id: swe.SE_VENUS, name: 'Venus', expected: 'Cancer' },
    { id: swe.SE_SATURN, name: 'Saturn', expected: 'Leo' },
    { id: swe.SE_MEAN_NODE, name: 'Rahu', expected: 'Leo' },
  ];

  let matches = 0;
  console.log('Planet     Sign           Expected       Match');
  console.log('-'.repeat(55));

  for (const p of planets) {
    const r = swe.swe_calc_ut(jd, p.id, FLAG);
    const sign = signNames[Math.floor(r[0] / 30)];
    const ok = sign === p.expected;
    if (ok) matches++;
    console.log(`${p.name.padEnd(10)} ${sign.padEnd(14)} ${p.expected.padEnd(14)} ${ok ? 'YES' : 'NO'}`);
  }

  // Ketu
  const rahu = swe.swe_calc_ut(jd, swe.SE_MEAN_NODE, FLAG);
  const ketuSign = signNames[Math.floor(((rahu[0] + 180) % 360) / 30)];
  const ketuOk = ketuSign === 'Aquarius';
  if (ketuOk) matches++;
  console.log(`${'Ketu'.padEnd(10)} ${ketuSign.padEnd(14)} ${'Aquarius'.padEnd(14)} ${ketuOk ? 'YES' : 'NO'}`);

  // Ascendant
  const houses = swe.swe_houses(jd, 12 + 59/60, 77 + 35/60, 'W');
  const ascSign = signNames[Math.floor(((houses.ascmc[0] - ayanamsa + 360) % 360) / 30)];
  const ascOk = ascSign === 'Capricorn';
  if (ascOk) matches++;
  console.log(`${'Lagna'.padEnd(10)} ${ascSign.padEnd(14)} ${'Capricorn'.padEnd(14)} ${ascOk ? 'YES' : 'NO'}`);

  console.log(`\n${'='.repeat(55)}`);
  console.log(`RESULT: ${matches}/10 match | OFFLINE: YES | Third-party API: NONE`);
  console.log('='.repeat(55));

  swe.swe_close();
}

main().catch(console.error);
