/**
 * Moon's ecliptic longitude — Meeus Ch. 47 (ELP2000 truncated, ~0.07° accuracy)
 * 60 periodic terms from Table 47.A, eccentricity corrections, additive terms.
 * Pure math, zero dependencies.
 */

const DEG = Math.PI / 180;

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Periodic terms for lunar longitude (Meeus Table 47.A)
// Each entry: [D, M, Mp, F, coeffSin] where
//   D = mean elongation, M = Sun mean anomaly, Mp = Moon mean anomaly, F = Moon argument of latitude
//   coeffSin is in units of 0.000001 degrees (microDegrees)
const LUNAR_LONG_TERMS: [number, number, number, number, number][] = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602],
  [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348],
  [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069],
  [2, -2, -1, 0, 2048],
  [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595],
  [4, -1, -1, 0, 1215],
  [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810],
  [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713],
  [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596],
  [4, 0, 1, 0, 549],
  [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520],
  [1, 0, -2, 0, -487],
  [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351],
  [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330],
  [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299],
  [2, 0, 3, 0, 294],
  [2, 0, -1, -2, 0],
];

/**
 * Compute the Moon's geocentric ecliptic longitude (tropical).
 * @param T  Julian centuries since J2000.0
 * @returns  longitude in degrees [0, 360)
 */
export function lunarLongitude(T: number): number {
  // Fundamental arguments (Meeus Eq. 47.1-47.4)
  const Lp = norm360(218.3164477 + 481267.88123421 * T
    - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000);
  const D = norm360(297.8501921 + 445267.1114034 * T
    - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000);
  const M = norm360(357.5291092 + 35999.0502909 * T
    - 0.0001536 * T * T + T * T * T / 24490000);
  const Mp = norm360(134.9633964 + 477198.8675055 * T
    + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000);
  const F = norm360(93.2720950 + 483202.0175233 * T
    - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000);

  // Eccentricity of Earth's orbit
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const E2 = E * E;

  // Sum periodic terms
  let sumL = 0;
  for (const [tD, tM, tMp, tF, coeff] of LUNAR_LONG_TERMS) {
    const arg = tD * D + tM * M + tMp * Mp + tF * F;
    let term = coeff * Math.sin(arg * DEG);
    // Apply eccentricity correction for terms involving M
    const absM = Math.abs(tM);
    if (absM === 1) term *= E;
    else if (absM === 2) term *= E2;
    sumL += term;
  }

  // Additive corrections (Meeus p. 342)
  const A1 = norm360(119.75 + 131.849 * T);
  const A2 = norm360(53.09 + 479264.290 * T);
  const A3 = norm360(313.45 + 481266.484 * T);

  sumL += 3958 * Math.sin(A1 * DEG);
  sumL += 1962 * Math.sin((Lp - F) * DEG);
  sumL += 318 * Math.sin(A2 * DEG);

  // Convert from 0.000001° to degrees and add to mean longitude
  const longitude = Lp + sumL / 1000000;

  return norm360(longitude);
}

/**
 * Moon's daily motion (approximate, degrees/day).
 * Average ~13.176°/day.
 */
export function lunarDailyMotion(T: number): number {
  const Mp = norm360(134.9633964 + 477198.8675055 * T) * DEG;
  const D = norm360(297.8501921 + 445267.1114034 * T) * DEG;
  // Approximate from derivative of first few terms
  return 13.176396 + 1.434006 * Math.cos(Mp) + 0.280135 * Math.cos(2 * D)
    + 0.251632 * Math.cos(2 * D - Mp);
}
