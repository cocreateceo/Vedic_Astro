/**
 * Greenwich & Local Sidereal Time — Meeus Ch. 12
 * Pure math, zero dependencies.
 */

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Greenwich Mean Sidereal Time (GMST) in degrees.
 * @param JD  Julian Day number (including fractional day for UT)
 * @returns   GMST in degrees [0, 360)
 */
export function greenwichSiderealTime(JD: number): number {
  // Meeus Eq. 12.4 — GMST at 0h UT, then add rotation for UT fraction
  const JD0 = Math.floor(JD - 0.5) + 0.5; // JD at 0h UT
  const T0 = (JD0 - 2451545.0) / 36525;
  const UT = (JD - JD0) * 24; // hours of UT

  // GMST at 0h UT in seconds of time
  const theta0 = 100.46061837
    + 36000.770053608 * T0
    + 0.000387933 * T0 * T0
    - T0 * T0 * T0 / 38710000;

  // Add Earth rotation for elapsed UT hours (360.98564736629° per day)
  const gmst = theta0 + 360.98564736629 * (UT / 24);

  return norm360(gmst);
}

/**
 * Local Sidereal Time in degrees.
 * @param JD      Julian Day number
 * @param lngDeg  Observer's longitude in degrees East (negative for West)
 * @returns       LST in degrees [0, 360)
 */
export function localSiderealTime(JD: number, lngDeg: number): number {
  return norm360(greenwichSiderealTime(JD) + lngDeg);
}
