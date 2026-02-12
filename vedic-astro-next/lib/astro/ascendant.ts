/**
 * Ascendant (Lagna) calculation from sidereal time + latitude.
 * Uses standard spherical trigonometry formula.
 * Pure math, zero dependencies.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Mean obliquity of the ecliptic (Meeus Eq. 22.2).
 * @param T  Julian centuries since J2000.0
 * @returns  obliquity in degrees
 */
export function meanObliquity(T: number): number {
  return 23.439291 - 0.013004167 * T - 1.638889e-7 * T * T + 5.036111e-7 * T * T * T;
}

/**
 * Compute the tropical ascendant degree.
 *
 * Formula (Swiss Ephemeris convention):
 *   Asc = atan2(cos(RAMC), -(sin(ε)·tan(φ) + cos(ε)·sin(RAMC)))
 *
 * where:
 *   RAMC = Right Ascension of the Midheaven (= Local Sidereal Time)
 *   ε = obliquity of the ecliptic
 *   φ = geographic latitude
 *
 * @param lstDeg    Local Sidereal Time in degrees
 * @param latDeg    Geographic latitude in degrees (North positive)
 * @param obliquity Obliquity of ecliptic in degrees
 * @returns         Tropical ascendant in degrees [0, 360)
 */
export function ascendantDegree(lstDeg: number, latDeg: number, obliquity: number): number {
  const RAMC = lstDeg * DEG;
  const eps = obliquity * DEG;
  const phi = latDeg * DEG;

  const y = Math.cos(RAMC);
  const x = -(Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(RAMC));

  let asc = Math.atan2(y, x) * RAD;
  asc = norm360(asc);

  return asc;
}
