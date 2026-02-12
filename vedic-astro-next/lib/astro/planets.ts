/**
 * Geocentric ecliptic longitudes for Mercury, Venus, Mars, Jupiter, Saturn.
 * Uses mean orbital elements at J2000.0 (polynomial in T) + Kepler equation.
 * Heliocentric → Geocentric via Earth position subtraction.
 *
 * Orbital elements from Standish (1992) / Meeus Table 31.A.
 * Jupiter-Saturn perturbation terms from Meeus Ch. 31.
 *
 * Accuracy: ~0.1° (inner planets) to ~1° (outer planets) — sufficient for 30° signs.
 * Pure math, zero dependencies.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Orbital elements at J2000.0 + rates per century (T). */
interface OrbitalElements {
  a0: number; a1: number;      // semi-major axis (AU)
  e0: number; e1: number;      // eccentricity
  I0: number; I1: number;      // inclination (deg)
  L0: number; L1: number;      // mean longitude (deg)
  wbar0: number; wbar1: number; // longitude of perihelion (deg)
  O0: number; O1: number;      // longitude of ascending node (deg)
}

// Standish (1992) — valid for 3000 BC to 3000 AD
const ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: {
    a0: 0.38709927, a1: 0.00000037,
    e0: 0.20563593, e1: 0.00001906,
    I0: 7.00497902, I1: -0.00594749,
    L0: 252.25032350, L1: 149472.67411175,
    wbar0: 77.45779628, wbar1: 0.16047689,
    O0: 48.33076593, O1: -0.12534081,
  },
  Venus: {
    a0: 0.72333566, a1: 0.00000390,
    e0: 0.00677672, e1: -0.00004107,
    I0: 3.39467605, I1: -0.00078890,
    L0: 181.97909950, L1: 58517.81538729,
    wbar0: 131.60246718, wbar1: 0.00268329,
    O0: 76.67984255, O1: -0.27769418,
  },
  Earth: {
    a0: 1.00000261, a1: 0.00000562,
    e0: 0.01671123, e1: -0.00004392,
    I0: -0.00001531, I1: -0.01294668,
    L0: 100.46457166, L1: 35999.37244981,
    wbar0: 102.93768193, wbar1: 0.32327364,
    O0: 0.0, O1: 0.0,
  },
  Mars: {
    a0: 1.52371034, a1: 0.00001847,
    e0: 0.09339410, e1: 0.00007882,
    I0: 1.84969142, I1: -0.00813131,
    L0: -4.55343205, L1: 19140.30268499,
    wbar0: -23.94362959, wbar1: 0.44441088,
    O0: 49.55953891, O1: -0.29257343,
  },
  Jupiter: {
    a0: 5.20288700, a1: -0.00011607,
    e0: 0.04838624, e1: -0.00013253,
    I0: 1.30439695, I1: -0.00183714,
    L0: 34.39644051, L1: 3034.74612775,
    wbar0: 14.72847983, wbar1: 0.21252668,
    O0: 100.47390909, O1: 0.20469106,
  },
  Saturn: {
    a0: 9.53667594, a1: -0.00125060,
    e0: 0.05386179, e1: -0.00050991,
    I0: 2.48599187, I1: 0.00193609,
    L0: 49.95424423, L1: 1222.49362201,
    wbar0: 92.59887831, wbar1: -0.41897216,
    O0: 113.66242448, O1: -0.28867794,
  },
};

/**
 * Solve Kepler's equation: E - e·sin(E) = M
 * using Newton-Raphson iteration.
 * @param M  mean anomaly in radians
 * @param e  eccentricity
 * @returns  eccentric anomaly E in radians
 */
function solveKepler(M: number, e: number): number {
  let E = M + e * Math.sin(M); // initial guess
  for (let i = 0; i < 15; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

interface HelioPos {
  x: number; // AU in ecliptic plane
  y: number;
  z: number;
}

/**
 * Compute heliocentric ecliptic position for a planet.
 */
function heliocentricPosition(name: string, T: number): HelioPos {
  const el = ELEMENTS[name];

  const a = el.a0 + el.a1 * T;
  const e = el.e0 + el.e1 * T;
  const I = (el.I0 + el.I1 * T) * DEG;
  const L = norm360(el.L0 + el.L1 * T);
  const wbar = norm360(el.wbar0 + el.wbar1 * T);
  const O = norm360(el.O0 + el.O1 * T);

  const omega = (wbar - el.O0 - el.O1 * T) * DEG; // argument of perihelion
  const Orad = O * DEG;

  const M = norm360(L - wbar) * DEG; // mean anomaly in radians
  const E = solveKepler(M, e);

  // Heliocentric coordinates in orbital plane
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Rotate to ecliptic coordinates
  const cosO = Math.cos(Orad);
  const sinO = Math.sin(Orad);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);

  const x = (cosO * cosw - sinO * sinw * cosI) * xp + (-cosO * sinw - sinO * cosw * cosI) * yp;
  const y = (sinO * cosw + cosO * sinw * cosI) * xp + (-sinO * sinw + cosO * cosw * cosI) * yp;
  const z = (sinw * sinI) * xp + (cosw * sinI) * yp;

  return { x, y, z };
}

/**
 * Jupiter–Saturn mutual perturbation corrections (Meeus Ch. 31).
 * These are the largest perturbations for outer planets.
 */
function jupiterSaturnPerturbation(T: number): { jupCorr: number; satCorr: number } {
  const Mj = norm360(34.40 + 3034.75 * T) * DEG; // Jupiter mean anomaly approx
  const Ms = norm360(50.08 + 1222.11 * T) * DEG; // Saturn mean anomaly approx

  // Simplified perturbation terms (degrees)
  const jupCorr =
    -0.332 * Math.sin(2 * Mj - 5 * Ms - 67.6 * DEG) -
    0.056 * Math.sin(2 * Mj - 2 * Ms + 21 * DEG) +
    0.042 * Math.sin(3 * Mj - 5 * Ms + 21 * DEG) -
    0.036 * Math.sin(Mj - 2 * Ms) +
    0.022 * Math.cos(Mj - Ms) +
    0.023 * Math.sin(2 * (Mj - Ms - 12.22 * DEG));

  const satCorr =
    0.812 * Math.sin(2 * Mj - 5 * Ms - 67.6 * DEG) +
    0.137 * Math.sin(2 * Mj - 2 * Ms + 21 * DEG) -
    0.067 * Math.sin(3 * Mj - 5 * Ms + 21 * DEG) +
    0.050 * Math.sin(Mj - 2 * Ms) +
    0.017 * Math.sin(2 * (Mj - Ms - 12.22 * DEG));

  return { jupCorr, satCorr };
}

export interface PlanetPosition {
  longitude: number; // tropical ecliptic degrees [0, 360)
  speed: number;     // degrees/day (negative = retrograde)
}

/**
 * Compute geocentric tropical ecliptic longitude for a planet.
 * @param name  Planet name: Mercury, Venus, Mars, Jupiter, Saturn
 * @param T     Julian centuries since J2000.0
 */
export function planetLongitude(name: string, T: number): PlanetPosition {
  // Get heliocentric positions
  const planet = heliocentricPosition(name, T);
  const earth = heliocentricPosition('Earth', T);

  // Geocentric ecliptic coordinates
  const dx = planet.x - earth.x;
  const dy = planet.y - earth.y;

  let lng = Math.atan2(dy, dx) * RAD;
  lng = norm360(lng);

  // Apply Jupiter-Saturn perturbation corrections
  if (name === 'Jupiter' || name === 'Saturn') {
    const { jupCorr, satCorr } = jupiterSaturnPerturbation(T);
    if (name === 'Jupiter') lng = norm360(lng + jupCorr);
    else lng = norm360(lng + satCorr);
  }

  // Compute speed via finite difference (1 day = T + 1/36525)
  const dT = 1 / 36525;
  const planet2 = heliocentricPosition(name, T + dT);
  const earth2 = heliocentricPosition('Earth', T + dT);
  const dx2 = planet2.x - earth2.x;
  const dy2 = planet2.y - earth2.y;
  let lng2 = Math.atan2(dy2, dx2) * RAD;
  lng2 = norm360(lng2);

  let speed = lng2 - lng;
  // Handle wrap-around
  if (speed > 180) speed -= 360;
  if (speed < -180) speed += 360;

  return { longitude: lng, speed };
}

/**
 * Compute all 5 outer planet positions at once.
 */
export function allPlanetPositions(T: number): Record<string, PlanetPosition> {
  const names = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const result: Record<string, PlanetPosition> = {};
  for (const name of names) {
    result[name] = planetLongitude(name, T);
  }
  return result;
}
