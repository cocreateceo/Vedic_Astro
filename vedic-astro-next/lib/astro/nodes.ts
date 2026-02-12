/**
 * Mean lunar node (Rahu/Ketu) — Meeus Ch. 47
 * Traditional Vedic astrology uses the mean node, not the true (oscillating) node.
 * Pure math, zero dependencies.
 */

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Mean longitude of the ascending node (Rahu).
 * @param T  Julian centuries since J2000.0
 * @returns  degrees [0, 360)
 */
export function rahuLongitude(T: number): number {
  // Meeus Eq. 47.7 — mean ascending node
  const omega = 125.0445479
    - 1934.1362891 * T
    + 0.0020754 * T * T
    + T * T * T / 467441
    - T * T * T * T / 60616000;
  return norm360(omega);
}

/**
 * Ketu longitude = Rahu + 180°
 */
export function ketuLongitude(T: number): number {
  return norm360(rahuLongitude(T) + 180);
}

/**
 * Rahu's daily motion (approximately -0.053° per day, always retrograde).
 */
export function rahuDailyMotion(): number {
  return -0.05295;
}
