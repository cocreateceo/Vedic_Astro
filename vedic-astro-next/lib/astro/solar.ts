/**
 * Sun's ecliptic longitude — Meeus Ch. 25 (low-precision, ~0.01° accuracy)
 * Pure math, zero dependencies.
 */

const DEG = Math.PI / 180;

/** Normalize angle to [0, 360). */
function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the Sun's geometric ecliptic longitude (tropical, FK5).
 * @param T  Julian centuries since J2000.0
 * @returns  longitude in degrees [0, 360)
 */
export function solarLongitude(T: number): number {
  // Mean anomaly of the Sun (Meeus Eq. 25.3)
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mrad = M * DEG;

  // Sun's equation of center (Meeus Eq. 25.4)
  const C =
    (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.00029 * Math.sin(3 * Mrad);

  // Sun's mean longitude (Meeus Eq. 25.2)
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Sun's true longitude
  const sunTrue = norm360(L0 + C);

  // Apparent longitude: nutation + aberration (simplified)
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunTrue - 0.00569 - 0.00478 * Math.sin(omega * DEG);

  return norm360(apparent);
}

/**
 * Speed of the Sun in degrees/day (approximate).
 * Average ~0.9856°/day; varies ±3%.
 */
export function solarDailyMotion(T: number): number {
  const M = norm360(357.5291092 + 35999.0502909 * T) * DEG;
  // derivative of equation of center approximation
  return 0.9856 + 0.0335 * Math.cos(M) + 0.0003 * Math.cos(2 * M);
}
