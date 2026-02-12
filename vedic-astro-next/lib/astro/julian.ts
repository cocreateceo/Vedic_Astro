/**
 * Julian Day conversion — Meeus, "Astronomical Algorithms", Ch. 7
 * All functions are pure math, zero dependencies.
 */

/** Convert a calendar date + UT hours to Julian Day Number. */
export function dateToJD(year: number, month: number, day: number, utHours: number = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregorian correction
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    utHours / 24 +
    B -
    1524.5
  );
}

/** Julian centuries since J2000.0 (JD 2451545.0). */
export function jdToT(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/**
 * Parse local date/time strings and convert to JD.
 * @param dateStr  "YYYY-MM-DD"
 * @param timeStr  "HH:MM"
 * @param utcOffsetHours  e.g. 5.5 for IST
 */
export function localToJD(dateStr: string, timeStr: string, utcOffsetHours: number): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const localHours = hh + mm / 60;
  const utHours = localHours - utcOffsetHours;
  // Handle day rollover
  let d = day + utHours / 24;
  return dateToJD(year, month, Math.floor(d), (d - Math.floor(d)) * 24);
}
