"use strict";
var AstroEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // vedic-astro-next/lib/astro/index.ts
  var astro_exports = {};
  __export(astro_exports, {
    allPlanetPositions: () => allPlanetPositions,
    ascendantDegree: () => ascendantDegree,
    computeChart: () => computeChart,
    dateToJD: () => dateToJD,
    greenwichSiderealTime: () => greenwichSiderealTime,
    jdToT: () => jdToT,
    ketuLongitude: () => ketuLongitude,
    lahiriAyanamsa: () => lahiriAyanamsa,
    localSiderealTime: () => localSiderealTime,
    localToJD: () => localToJD,
    lunarDailyMotion: () => lunarDailyMotion,
    lunarLongitude: () => lunarLongitude,
    meanObliquity: () => meanObliquity,
    planetLongitude: () => planetLongitude,
    rahuDailyMotion: () => rahuDailyMotion,
    rahuLongitude: () => rahuLongitude,
    solarDailyMotion: () => solarDailyMotion,
    solarLongitude: () => solarLongitude,
    tropicalToSidereal: () => tropicalToSidereal
  });

  // vedic-astro-next/lib/astro/julian.ts
  function dateToJD(year, month, day, utHours = 0) {
    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + utHours / 24 + B - 1524.5;
  }
  function jdToT(jd) {
    return (jd - 2451545) / 36525;
  }
  function localToJD(dateStr, timeStr, utcOffsetHours) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const localHours = hh + mm / 60;
    const utHours = localHours - utcOffsetHours;
    let d = day + utHours / 24;
    return dateToJD(year, month, Math.floor(d), (d - Math.floor(d)) * 24);
  }

  // vedic-astro-next/lib/astro/solar.ts
  var DEG = Math.PI / 180;
  function norm360(deg) {
    return (deg % 360 + 360) % 360;
  }
  function solarLongitude(T) {
    const M = norm360(357.5291092 + 35999.0502909 * T - 1536e-7 * T * T);
    const Mrad = M * DEG;
    const C = (1.9146 - 4817e-6 * T - 14e-6 * T * T) * Math.sin(Mrad) + (0.019993 - 101e-6 * T) * Math.sin(2 * Mrad) + 29e-5 * Math.sin(3 * Mrad);
    const L0 = norm360(280.46646 + 36000.76983 * T + 3032e-7 * T * T);
    const sunTrue = norm360(L0 + C);
    const omega = 125.04 - 1934.136 * T;
    const apparent = sunTrue - 569e-5 - 478e-5 * Math.sin(omega * DEG);
    return norm360(apparent);
  }
  function solarDailyMotion(T) {
    const M = norm360(357.5291092 + 35999.0502909 * T) * DEG;
    return 0.9856 + 0.0335 * Math.cos(M) + 3e-4 * Math.cos(2 * M);
  }

  // vedic-astro-next/lib/astro/lunar.ts
  var DEG2 = Math.PI / 180;
  function norm3602(deg) {
    return (deg % 360 + 360) % 360;
  }
  var LUNAR_LONG_TERMS = [
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
    [2, 0, -1, -2, 0]
  ];
  function lunarLongitude(T) {
    const Lp = norm3602(218.3164477 + 481267.88123421 * T - 15786e-7 * T * T + T * T * T / 538841 - T * T * T * T / 65194e3);
    const D = norm3602(297.8501921 + 445267.1114034 * T - 18819e-7 * T * T + T * T * T / 545868 - T * T * T * T / 113065e3);
    const M = norm3602(357.5291092 + 35999.0502909 * T - 1536e-7 * T * T + T * T * T / 2449e4);
    const Mp = norm3602(134.9633964 + 477198.8675055 * T + 87414e-7 * T * T + T * T * T / 69699 - T * T * T * T / 14712e3);
    const F = norm3602(93.272095 + 483202.0175233 * T - 36539e-7 * T * T - T * T * T / 3526e3 + T * T * T * T / 86331e4);
    const E = 1 - 2516e-6 * T - 74e-7 * T * T;
    const E2 = E * E;
    let sumL = 0;
    for (const [tD, tM, tMp, tF, coeff] of LUNAR_LONG_TERMS) {
      const arg = tD * D + tM * M + tMp * Mp + tF * F;
      let term = coeff * Math.sin(arg * DEG2);
      const absM = Math.abs(tM);
      if (absM === 1)
        term *= E;
      else if (absM === 2)
        term *= E2;
      sumL += term;
    }
    const A1 = norm3602(119.75 + 131.849 * T);
    const A2 = norm3602(53.09 + 479264.29 * T);
    const A3 = norm3602(313.45 + 481266.484 * T);
    sumL += 3958 * Math.sin(A1 * DEG2);
    sumL += 1962 * Math.sin((Lp - F) * DEG2);
    sumL += 318 * Math.sin(A2 * DEG2);
    const longitude = Lp + sumL / 1e6;
    return norm3602(longitude);
  }
  function lunarDailyMotion(T) {
    const Mp = norm3602(134.9633964 + 477198.8675055 * T) * DEG2;
    const D = norm3602(297.8501921 + 445267.1114034 * T) * DEG2;
    return 13.176396 + 1.434006 * Math.cos(Mp) + 0.280135 * Math.cos(2 * D) + 0.251632 * Math.cos(2 * D - Mp);
  }

  // vedic-astro-next/lib/astro/planets.ts
  var DEG3 = Math.PI / 180;
  var RAD = 180 / Math.PI;
  function norm3603(deg) {
    return (deg % 360 + 360) % 360;
  }
  var ELEMENTS = {
    Mercury: {
      a0: 0.38709927,
      a1: 37e-8,
      e0: 0.20563593,
      e1: 1906e-8,
      I0: 7.00497902,
      I1: -594749e-8,
      L0: 252.2503235,
      L1: 149472.67411175,
      wbar0: 77.45779628,
      wbar1: 0.16047689,
      O0: 48.33076593,
      O1: -0.12534081
    },
    Venus: {
      a0: 0.72333566,
      a1: 39e-7,
      e0: 677672e-8,
      e1: -4107e-8,
      I0: 3.39467605,
      I1: -7889e-7,
      L0: 181.9790995,
      L1: 58517.81538729,
      wbar0: 131.60246718,
      wbar1: 268329e-8,
      O0: 76.67984255,
      O1: -0.27769418
    },
    Earth: {
      a0: 1.00000261,
      a1: 562e-8,
      e0: 0.01671123,
      e1: -4392e-8,
      I0: -1531e-8,
      I1: -0.01294668,
      L0: 100.46457166,
      L1: 35999.37244981,
      wbar0: 102.93768193,
      wbar1: 0.32327364,
      O0: 0,
      O1: 0
    },
    Mars: {
      a0: 1.52371034,
      a1: 1847e-8,
      e0: 0.0933941,
      e1: 7882e-8,
      I0: 1.84969142,
      I1: -813131e-8,
      L0: -4.55343205,
      L1: 19140.30268499,
      wbar0: -23.94362959,
      wbar1: 0.44441088,
      O0: 49.55953891,
      O1: -0.29257343
    },
    Jupiter: {
      a0: 5.202887,
      a1: -11607e-8,
      e0: 0.04838624,
      e1: -13253e-8,
      I0: 1.30439695,
      I1: -183714e-8,
      L0: 34.39644051,
      L1: 3034.74612775,
      wbar0: 14.72847983,
      wbar1: 0.21252668,
      O0: 100.47390909,
      O1: 0.20469106
    },
    Saturn: {
      a0: 9.53667594,
      a1: -12506e-7,
      e0: 0.05386179,
      e1: -50991e-8,
      I0: 2.48599187,
      I1: 193609e-8,
      L0: 49.95424423,
      L1: 1222.49362201,
      wbar0: 92.59887831,
      wbar1: -0.41897216,
      O0: 113.66242448,
      O1: -0.28867794
    }
  };
  function solveKepler(M, e) {
    let E = M + e * Math.sin(M);
    for (let i = 0; i < 15; i++) {
      const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-12)
        break;
    }
    return E;
  }
  function heliocentricPosition(name, T) {
    const el = ELEMENTS[name];
    const a = el.a0 + el.a1 * T;
    const e = el.e0 + el.e1 * T;
    const I = (el.I0 + el.I1 * T) * DEG3;
    const L = norm3603(el.L0 + el.L1 * T);
    const wbar = norm3603(el.wbar0 + el.wbar1 * T);
    const O = norm3603(el.O0 + el.O1 * T);
    const omega = (wbar - el.O0 - el.O1 * T) * DEG3;
    const Orad = O * DEG3;
    const M = norm3603(L - wbar) * DEG3;
    const E = solveKepler(M, e);
    const xp = a * (Math.cos(E) - e);
    const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const cosO = Math.cos(Orad);
    const sinO = Math.sin(Orad);
    const cosI = Math.cos(I);
    const sinI = Math.sin(I);
    const cosw = Math.cos(omega);
    const sinw = Math.sin(omega);
    const x = (cosO * cosw - sinO * sinw * cosI) * xp + (-cosO * sinw - sinO * cosw * cosI) * yp;
    const y = (sinO * cosw + cosO * sinw * cosI) * xp + (-sinO * sinw + cosO * cosw * cosI) * yp;
    const z = sinw * sinI * xp + cosw * sinI * yp;
    return { x, y, z };
  }
  function jupiterSaturnPerturbation(T) {
    const Mj = norm3603(34.4 + 3034.75 * T) * DEG3;
    const Ms = norm3603(50.08 + 1222.11 * T) * DEG3;
    const jupCorr = -0.332 * Math.sin(2 * Mj - 5 * Ms - 67.6 * DEG3) - 0.056 * Math.sin(2 * Mj - 2 * Ms + 21 * DEG3) + 0.042 * Math.sin(3 * Mj - 5 * Ms + 21 * DEG3) - 0.036 * Math.sin(Mj - 2 * Ms) + 0.022 * Math.cos(Mj - Ms) + 0.023 * Math.sin(2 * (Mj - Ms - 12.22 * DEG3));
    const satCorr = 0.812 * Math.sin(2 * Mj - 5 * Ms - 67.6 * DEG3) + 0.137 * Math.sin(2 * Mj - 2 * Ms + 21 * DEG3) - 0.067 * Math.sin(3 * Mj - 5 * Ms + 21 * DEG3) + 0.05 * Math.sin(Mj - 2 * Ms) + 0.017 * Math.sin(2 * (Mj - Ms - 12.22 * DEG3));
    return { jupCorr, satCorr };
  }
  function planetLongitude(name, T) {
    const planet = heliocentricPosition(name, T);
    const earth = heliocentricPosition("Earth", T);
    const dx = planet.x - earth.x;
    const dy = planet.y - earth.y;
    let lng = Math.atan2(dy, dx) * RAD;
    lng = norm3603(lng);
    if (name === "Jupiter" || name === "Saturn") {
      const { jupCorr, satCorr } = jupiterSaturnPerturbation(T);
      if (name === "Jupiter")
        lng = norm3603(lng + jupCorr);
      else
        lng = norm3603(lng + satCorr);
    }
    const dT = 1 / 36525;
    const planet2 = heliocentricPosition(name, T + dT);
    const earth2 = heliocentricPosition("Earth", T + dT);
    const dx2 = planet2.x - earth2.x;
    const dy2 = planet2.y - earth2.y;
    let lng2 = Math.atan2(dy2, dx2) * RAD;
    lng2 = norm3603(lng2);
    let speed = lng2 - lng;
    if (speed > 180)
      speed -= 360;
    if (speed < -180)
      speed += 360;
    return { longitude: lng, speed };
  }
  function allPlanetPositions(T) {
    const names = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
    const result = {};
    for (const name of names) {
      result[name] = planetLongitude(name, T);
    }
    return result;
  }

  // vedic-astro-next/lib/astro/nodes.ts
  function norm3604(deg) {
    return (deg % 360 + 360) % 360;
  }
  function rahuLongitude(T) {
    const omega = 125.0445479 - 1934.1362891 * T + 20754e-7 * T * T + T * T * T / 467441 - T * T * T * T / 60616e3;
    return norm3604(omega);
  }
  function ketuLongitude(T) {
    return norm3604(rahuLongitude(T) + 180);
  }
  function rahuDailyMotion() {
    return -0.05295;
  }

  // vedic-astro-next/lib/astro/ayanamsa.ts
  function lahiriAyanamsa(jd) {
    const yearsSince2000 = (jd - 2451545) / 365.25;
    const ayanamsa = 23.856 + yearsSince2000 * (50.2888 / 3600);
    return ayanamsa;
  }
  function tropicalToSidereal(tropicalDeg, jd) {
    const aya = lahiriAyanamsa(jd);
    return ((tropicalDeg - aya) % 360 + 360) % 360;
  }

  // vedic-astro-next/lib/astro/sidereal-time.ts
  function norm3605(deg) {
    return (deg % 360 + 360) % 360;
  }
  function greenwichSiderealTime(JD) {
    const JD0 = Math.floor(JD - 0.5) + 0.5;
    const T0 = (JD0 - 2451545) / 36525;
    const UT = (JD - JD0) * 24;
    const theta0 = 100.46061837 + 36000.770053608 * T0 + 387933e-9 * T0 * T0 - T0 * T0 * T0 / 3871e4;
    const gmst = theta0 + 360.98564736629 * (UT / 24);
    return norm3605(gmst);
  }
  function localSiderealTime(JD, lngDeg) {
    return norm3605(greenwichSiderealTime(JD) + lngDeg);
  }

  // vedic-astro-next/lib/astro/ascendant.ts
  var DEG4 = Math.PI / 180;
  var RAD2 = 180 / Math.PI;
  function norm3606(deg) {
    return (deg % 360 + 360) % 360;
  }
  function meanObliquity(T) {
    return 23.439291 - 0.013004167 * T - 1638889e-13 * T * T + 5036111e-13 * T * T * T;
  }
  function ascendantDegree(lstDeg, latDeg, obliquity) {
    const RAMC = lstDeg * DEG4;
    const eps = obliquity * DEG4;
    const phi = latDeg * DEG4;
    const y = Math.cos(RAMC);
    const x = -(Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(RAMC));
    let asc = Math.atan2(y, x) * RAD2;
    asc = norm3606(asc);
    return asc;
  }

  // vedic-astro-next/lib/astro/engine.ts
  function makeBodyPosition(sidLng, speed) {
    const lng = (sidLng % 360 + 360) % 360;
    const signIndex = Math.floor(lng / 30) % 12;
    const degreeInSign = lng - signIndex * 30;
    return { longitude: lng, speed, signIndex, degreeInSign };
  }
  function computeChart(birth) {
    const jd = localToJD(birth.dateStr, birth.timeStr, birth.utcOffsetHours);
    const T = jdToT(jd);
    const ayanamsa = lahiriAyanamsa(jd);
    const sunTropical = solarLongitude(T);
    const sunSidereal = tropicalToSidereal(sunTropical, jd);
    const sunSpeed = solarDailyMotion(T);
    const moonTropical = lunarLongitude(T);
    const moonSidereal = tropicalToSidereal(moonTropical, jd);
    const moonSpeed = lunarDailyMotion(T);
    const planets = allPlanetPositions(T);
    const mercurySid = tropicalToSidereal(planets.Mercury.longitude, jd);
    const venusSid = tropicalToSidereal(planets.Venus.longitude, jd);
    const marsSid = tropicalToSidereal(planets.Mars.longitude, jd);
    const jupiterSid = tropicalToSidereal(planets.Jupiter.longitude, jd);
    const saturnSid = tropicalToSidereal(planets.Saturn.longitude, jd);
    const rahuTropical = rahuLongitude(T);
    const rahuSid = tropicalToSidereal(rahuTropical, jd);
    const ketuTropical = ketuLongitude(T);
    const ketuSid = tropicalToSidereal(ketuTropical, jd);
    const nodeSpeed = rahuDailyMotion();
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
      julianDay: jd
    };
  }
  return __toCommonJS(astro_exports);
})();
