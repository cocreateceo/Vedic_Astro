/**
 * Vedic Astronomy Engine — Orchestrator
 *
 * Computes a complete sidereal birth chart from date/time/location.
 * Calls all sub-modules: Julian Day → tropical positions → ayanamsa → sidereal positions.
 *
 * Zero external dependencies. All algorithms from:
 *   - Meeus, "Astronomical Algorithms" (2nd ed.)
 *   - Standish (1992) orbital elements
 *   - Lahiri ayanamsa (IAU precession)
 */

import { dateToJD, jdToT, localToJD } from './julian';
import { solarLongitude, solarDailyMotion } from './solar';
import { lunarLongitude, lunarDailyMotion } from './lunar';
import { allPlanetPositions } from './planets';
import { rahuLongitude, ketuLongitude, rahuDailyMotion } from './nodes';
import { lahiriAyanamsa, tropicalToSidereal } from './ayanamsa';
import { localSiderealTime } from './sidereal-time';
import { ascendantDegree, meanObliquity } from './ascendant';

export interface BirthData {
  dateStr: string;         // "YYYY-MM-DD"
  timeStr: string;         // "HH:MM"
  lat: number;             // degrees North (negative for South)
  lng: number;             // degrees East (negative for West)
  utcOffsetHours: number;  // e.g. 5.5 for IST
}

export interface BodyPosition {
  longitude: number;       // sidereal ecliptic degrees [0, 360)
  speed: number;           // degrees/day (negative = retrograde)
  signIndex: number;       // 0-11 (Aries=0 ... Pisces=11)
  degreeInSign: number;    // 0-30 within sign
}

export interface AstroResult {
  sun: BodyPosition;
  moon: BodyPosition;
  mars: BodyPosition;
  mercury: BodyPosition;
  jupiter: BodyPosition;
  venus: BodyPosition;
  saturn: BodyPosition;
  rahu: BodyPosition;
  ketu: BodyPosition;
  ascendant: BodyPosition;
  ayanamsa: number;        // Lahiri ayanamsa used
  julianDay: number;       // JD for reference
}

function makeBodyPosition(sidLng: number, speed: number): BodyPosition {
  const lng = ((sidLng % 360) + 360) % 360;
  const signIndex = Math.floor(lng / 30) % 12;
  const degreeInSign = lng - signIndex * 30;
  return { longitude: lng, speed, signIndex, degreeInSign };
}

/**
 * Compute a complete Vedic (sidereal) birth chart.
 */
export function computeChart(birth: BirthData): AstroResult {
  // Step 1: Convert local time to Julian Day
  const jd = localToJD(birth.dateStr, birth.timeStr, birth.utcOffsetHours);
  const T = jdToT(jd);

  // Step 2: Ayanamsa
  const ayanamsa = lahiriAyanamsa(jd);

  // Step 3: Sun (tropical → sidereal)
  const sunTropical = solarLongitude(T);
  const sunSidereal = tropicalToSidereal(sunTropical, jd);
  const sunSpeed = solarDailyMotion(T);

  // Step 4: Moon (tropical → sidereal)
  const moonTropical = lunarLongitude(T);
  const moonSidereal = tropicalToSidereal(moonTropical, jd);
  const moonSpeed = lunarDailyMotion(T);

  // Step 5: Five planets (tropical → sidereal)
  const planets = allPlanetPositions(T);
  const mercurySid = tropicalToSidereal(planets.Mercury.longitude, jd);
  const venusSid = tropicalToSidereal(planets.Venus.longitude, jd);
  const marsSid = tropicalToSidereal(planets.Mars.longitude, jd);
  const jupiterSid = tropicalToSidereal(planets.Jupiter.longitude, jd);
  const saturnSid = tropicalToSidereal(planets.Saturn.longitude, jd);

  // Step 6: Lunar nodes (already in ecliptic, still subtract ayanamsa)
  const rahuTropical = rahuLongitude(T);
  const rahuSid = tropicalToSidereal(rahuTropical, jd);
  const ketuTropical = ketuLongitude(T);
  const ketuSid = tropicalToSidereal(ketuTropical, jd);
  const nodeSpeed = rahuDailyMotion();

  // Step 7: Ascendant
  const lst = localSiderealTime(jd, birth.lng);
  const obliquity = meanObliquity(T);
  const ascTropical = ascendantDegree(lst, birth.lat, obliquity);
  const ascSidereal = tropicalToSidereal(ascTropical, jd);

  return {
    sun: makeBodyPosition(sunSidereal, sunSpeed),
    moon: makeBodyPosition(moonSidereal, moonSpeed),
    mars: makeBodyPosition(marsSid, planets.Mars.speed),
    mercury: makeBodyPosition(mercurySid, planets.Mercury.speed),
    jupiter: makeBodyPosition(jupiterSid, planets.Jupiter.speed),
    venus: makeBodyPosition(venusSid, planets.Venus.speed),
    saturn: makeBodyPosition(saturnSid, planets.Saturn.speed),
    rahu: makeBodyPosition(rahuSid, nodeSpeed),
    ketu: makeBodyPosition(ketuSid, nodeSpeed),
    ascendant: makeBodyPosition(ascSidereal, 0),
    ayanamsa,
    julianDay: jd,
  };
}
