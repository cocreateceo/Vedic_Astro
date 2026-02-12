// Additional calculation tables for birth chart reference
// Maps to ClickAstro Chapter 14: "Additional Calculations and Tables"

import type { Planet } from '@/types';

// ---------- Combustion (Moudhyam) ----------
// A planet is combust when too close to the Sun. Degrees for combustion:
const COMBUSTION_DEGREES: Record<string, number> = {
  Moon: 12,
  Mars: 17,
  Mercury: 14, // 12 when retrograde
  Jupiter: 11,
  Venus: 10, // 8 when retrograde
  Saturn: 15,
};

export interface CombustionEntry {
  planet: string;
  isCombust: boolean;
  distanceFromSun: number;
  combustionThreshold: number;
  effect: string;
}

export function calculateCombustion(positions: Record<string, Planet>): CombustionEntry[] {
  const sun = positions['Sun'];
  if (!sun) return [];

  const sunDeg = sun.signIndex * 30 + parseFloat(sun.degree);
  const results: CombustionEntry[] = [];

  for (const [planet, threshold] of Object.entries(COMBUSTION_DEGREES)) {
    const p = positions[planet];
    if (!p) continue;

    const pDeg = p.signIndex * 30 + parseFloat(p.degree);
    let dist = Math.abs(pDeg - sunDeg);
    if (dist > 180) dist = 360 - dist;

    // Adjust threshold for retrograde Mercury/Venus
    let actualThreshold = threshold;
    if (planet === 'Mercury' && p.retrograde) actualThreshold = 12;
    if (planet === 'Venus' && p.retrograde) actualThreshold = 8;

    const isCombust = dist <= actualThreshold;

    let effect = '';
    if (isCombust) {
      switch (planet) {
        case 'Moon':
          effect = 'Combust Moon weakens mental peace, emotional stability, and maternal relationships. Practice meditation and Moon remedies.';
          break;
        case 'Mars':
          effect = 'Combust Mars reduces courage and physical vitality. Property matters may suffer. Avoid impulsive decisions.';
          break;
        case 'Mercury':
          effect = 'Combust Mercury weakens intellect, communication, and business acumen. Be extra careful in contracts and agreements.';
          break;
        case 'Jupiter':
          effect = 'Combust Jupiter diminishes wisdom, fortune, and spiritual growth. Children may face challenges. Seek guru guidance.';
          break;
        case 'Venus':
          effect = 'Combust Venus affects relationships, luxury, and artistic expression. Marital harmony needs extra effort.';
          break;
        case 'Saturn':
          effect = 'Combust Saturn weakens discipline and longevity significations. Career progress may slow. Practice patience.';
          break;
      }
    } else {
      effect = `${planet} is not combust (${dist.toFixed(1)}° from Sun, threshold: ${actualThreshold}°). No combustion effects.`;
    }

    results.push({
      planet,
      isCombust,
      distanceFromSun: Math.round(dist * 10) / 10,
      combustionThreshold: actualThreshold,
      effect,
    });
  }

  return results;
}

// ---------- Planetary War (Graha Yuddha) ----------
// Occurs when two non-luminary planets are within 1 degree of each other

export interface PlanetaryWarEntry {
  planet1: string;
  planet2: string;
  distance: number;
  winner: string;
  effect: string;
}

const WAR_PLANETS = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export function calculatePlanetaryWar(positions: Record<string, Planet>): PlanetaryWarEntry[] {
  const wars: PlanetaryWarEntry[] = [];

  for (let i = 0; i < WAR_PLANETS.length; i++) {
    for (let j = i + 1; j < WAR_PLANETS.length; j++) {
      const p1 = positions[WAR_PLANETS[i]];
      const p2 = positions[WAR_PLANETS[j]];
      if (!p1 || !p2) continue;

      const deg1 = p1.signIndex * 30 + parseFloat(p1.degree);
      const deg2 = p2.signIndex * 30 + parseFloat(p2.degree);
      let dist = Math.abs(deg1 - deg2);
      if (dist > 180) dist = 360 - dist;

      if (dist <= 1) {
        // The planet with higher longitude (northern latitude) wins
        // Simplified: the one with higher degree in the sign
        const winner = parseFloat(p1.degree) >= parseFloat(p2.degree) ? WAR_PLANETS[i] : WAR_PLANETS[j];
        const loser = winner === WAR_PLANETS[i] ? WAR_PLANETS[j] : WAR_PLANETS[i];

        wars.push({
          planet1: WAR_PLANETS[i],
          planet2: WAR_PLANETS[j],
          distance: Math.round(dist * 100) / 100,
          winner,
          effect: `${winner} wins the planetary war against ${loser}. ${winner}'s significations are strengthened while ${loser}'s are weakened in this chart.`,
        });
      }
    }
  }

  return wars;
}

// ---------- Nirayana Longitude Table ----------

export interface LongitudeEntry {
  planet: string;
  longitude: string;   // e.g., "137°30'08"
  sign: string;
  hindi: string;
  degreeInSign: string; // e.g., "17°30'08"
  nakshatra: string;
  pada: number;
  retrograde: boolean;
}

export function calculateLongitudeTable(positions: Record<string, Planet>): LongitudeEntry[] {
  const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return planetOrder.map(name => {
    const p = positions[name];
    if (!p) return null;
    const absLong = p.signIndex * 30 + parseFloat(p.degree);
    const deg = Math.floor(absLong);
    const minFrac = (absLong - deg) * 60;
    const min = Math.floor(minFrac);
    const sec = Math.round((minFrac - min) * 60);

    const dInSign = parseFloat(p.degree);
    const dDeg = Math.floor(dInSign);
    const dMinFrac = (dInSign - dDeg) * 60;
    const dMin = Math.floor(dMinFrac);
    const dSec = Math.round((dMinFrac - dMin) * 60);

    return {
      planet: name,
      longitude: `${deg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}"`,
      sign: p.sign,
      hindi: p.signHindi,
      degreeInSign: `${dDeg}°${dMin.toString().padStart(2, '0')}'${dSec.toString().padStart(2, '0')}"`,
      nakshatra: p.nakshatra,
      pada: p.nakshatraPada,
      retrograde: p.retrograde,
    };
  }).filter(Boolean) as LongitudeEntry[];
}
