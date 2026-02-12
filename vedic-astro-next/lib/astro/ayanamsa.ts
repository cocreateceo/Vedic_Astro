/**
 * Lahiri Ayanamsa — tropical-to-sidereal offset.
 * Based on IAU precession model with Lahiri reference point.
 *
 * The Lahiri ayanamsa is officially adopted by the Indian government (Rashtriya Panchang).
 * Reference: ayanamsa was 23°51'26" at 2000.0 (J2000.0, JD 2451545.0).
 *
 * Pure math, zero dependencies.
 */

/**
 * Compute Lahiri ayanamsa for a given Julian Day.
 * Uses linear + precession model.
 *
 * @param jd  Julian Day number
 * @returns   ayanamsa in degrees
 */
export function lahiriAyanamsa(jd: number): number {
  // Years since J2000.0
  const yearsSince2000 = (jd - 2451545.0) / 365.25;

  // Lahiri ayanamsa at J2000.0: 23.856° (23°51'22")
  // Annual precession rate: ~50.2888" per year = 0.013969° per year
  const ayanamsa = 23.856 + yearsSince2000 * (50.2888 / 3600);

  return ayanamsa;
}

/**
 * Convert tropical longitude to sidereal longitude.
 */
export function tropicalToSidereal(tropicalDeg: number, jd: number): number {
  const aya = lahiriAyanamsa(jd);
  return ((tropicalDeg - aya) % 360 + 360) % 360;
}
