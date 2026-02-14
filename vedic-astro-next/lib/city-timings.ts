export interface CityData {
  name: string;
  region: string;
  lat: number;
  lng: number;
  tz: string;
}

export const CITIES: CityData[] = [
  // --- India (IST) ---
  { name: 'Delhi', region: 'India', lat: 28.61, lng: 77.21, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', region: 'India', lat: 19.08, lng: 72.88, tz: 'Asia/Kolkata' },
  { name: 'Kolkata', region: 'India', lat: 22.57, lng: 88.36, tz: 'Asia/Kolkata' },
  { name: 'Chennai', region: 'India', lat: 13.08, lng: 80.27, tz: 'Asia/Kolkata' },
  { name: 'Bengaluru', region: 'India', lat: 12.97, lng: 77.59, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad', region: 'India', lat: 17.39, lng: 78.49, tz: 'Asia/Kolkata' },
  { name: 'Ahmedabad', region: 'India', lat: 23.02, lng: 72.57, tz: 'Asia/Kolkata' },
  { name: 'Pune', region: 'India', lat: 18.52, lng: 73.86, tz: 'Asia/Kolkata' },
  { name: 'Jaipur', region: 'India', lat: 26.91, lng: 75.79, tz: 'Asia/Kolkata' },
  { name: 'Lucknow', region: 'India', lat: 26.85, lng: 80.95, tz: 'Asia/Kolkata' },
  { name: 'Varanasi', region: 'India', lat: 25.32, lng: 83.01, tz: 'Asia/Kolkata' },
  { name: 'Kochi', region: 'India', lat: 9.93, lng: 76.26, tz: 'Asia/Kolkata' },
  { name: 'Chandigarh', region: 'India', lat: 30.73, lng: 76.78, tz: 'Asia/Kolkata' },
  { name: 'Patna', region: 'India', lat: 25.60, lng: 85.10, tz: 'Asia/Kolkata' },
  { name: 'Guwahati', region: 'India', lat: 26.14, lng: 91.74, tz: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram', region: 'India', lat: 8.52, lng: 76.94, tz: 'Asia/Kolkata' },
  // Tier-2 Indian cities (state capitals & major cities)
  { name: 'Bhopal', region: 'India', lat: 23.26, lng: 77.41, tz: 'Asia/Kolkata' },
  { name: 'Indore', region: 'India', lat: 22.72, lng: 75.86, tz: 'Asia/Kolkata' },
  { name: 'Nagpur', region: 'India', lat: 21.15, lng: 79.09, tz: 'Asia/Kolkata' },
  { name: 'Bhubaneswar', region: 'India', lat: 20.30, lng: 85.82, tz: 'Asia/Kolkata' },
  { name: 'Raipur', region: 'India', lat: 21.25, lng: 81.63, tz: 'Asia/Kolkata' },
  { name: 'Ranchi', region: 'India', lat: 23.34, lng: 85.31, tz: 'Asia/Kolkata' },
  { name: 'Dehradun', region: 'India', lat: 30.32, lng: 78.03, tz: 'Asia/Kolkata' },
  { name: 'Shimla', region: 'India', lat: 31.10, lng: 77.17, tz: 'Asia/Kolkata' },
  { name: 'Srinagar', region: 'India', lat: 34.08, lng: 74.80, tz: 'Asia/Kolkata' },
  { name: 'Jammu', region: 'India', lat: 32.73, lng: 74.87, tz: 'Asia/Kolkata' },
  { name: 'Amritsar', region: 'India', lat: 31.63, lng: 74.87, tz: 'Asia/Kolkata' },
  { name: 'Coimbatore', region: 'India', lat: 11.01, lng: 76.96, tz: 'Asia/Kolkata' },
  { name: 'Madurai', region: 'India', lat: 9.93, lng: 78.12, tz: 'Asia/Kolkata' },
  { name: 'Tiruchirappalli', region: 'India', lat: 10.79, lng: 78.69, tz: 'Asia/Kolkata' },
  { name: 'Salem', region: 'India', lat: 11.65, lng: 78.16, tz: 'Asia/Kolkata' },
  { name: 'Tiruvannamalai', region: 'India', lat: 12.23, lng: 79.07, tz: 'Asia/Kolkata' },
  { name: 'Vellore', region: 'India', lat: 12.92, lng: 79.13, tz: 'Asia/Kolkata' },
  { name: 'Tirunelveli', region: 'India', lat: 8.73, lng: 77.70, tz: 'Asia/Kolkata' },
  { name: 'Erode', region: 'India', lat: 11.34, lng: 77.73, tz: 'Asia/Kolkata' },
  { name: 'Thanjavur', region: 'India', lat: 10.79, lng: 79.14, tz: 'Asia/Kolkata' },
  { name: 'Dindigul', region: 'India', lat: 10.37, lng: 77.97, tz: 'Asia/Kolkata' },
  { name: 'Visakhapatnam', region: 'India', lat: 17.69, lng: 83.22, tz: 'Asia/Kolkata' },
  { name: 'Mysuru', region: 'India', lat: 12.30, lng: 76.66, tz: 'Asia/Kolkata' },
  { name: 'Mangaluru', region: 'India', lat: 12.87, lng: 74.84, tz: 'Asia/Kolkata' },
  { name: 'Surat', region: 'India', lat: 21.17, lng: 72.83, tz: 'Asia/Kolkata' },
  { name: 'Vadodara', region: 'India', lat: 22.31, lng: 73.19, tz: 'Asia/Kolkata' },
  { name: 'Agra', region: 'India', lat: 27.18, lng: 78.02, tz: 'Asia/Kolkata' },
  { name: 'Kanpur', region: 'India', lat: 26.45, lng: 80.35, tz: 'Asia/Kolkata' },
  // --- International ---
  { name: 'New York', region: 'USA', lat: 40.71, lng: -74.01, tz: 'America/New_York' },
  { name: 'Los Angeles', region: 'USA', lat: 34.05, lng: -118.24, tz: 'America/Los_Angeles' },
  { name: 'Houston', region: 'USA', lat: 29.76, lng: -95.37, tz: 'America/Chicago' },
  { name: 'Chicago', region: 'USA', lat: 41.88, lng: -87.63, tz: 'America/Chicago' },
  { name: 'San Francisco', region: 'USA', lat: 37.77, lng: -122.42, tz: 'America/Los_Angeles' },
  { name: 'London', region: 'UK', lat: 51.51, lng: -0.13, tz: 'Europe/London' },
  { name: 'Dubai', region: 'UAE', lat: 25.20, lng: 55.27, tz: 'Asia/Dubai' },
  { name: 'Singapore', region: 'Singapore', lat: 1.35, lng: 103.82, tz: 'Asia/Singapore' },
  { name: 'Sydney', region: 'Australia', lat: -33.87, lng: 151.21, tz: 'Australia/Sydney' },
  { name: 'Toronto', region: 'Canada', lat: 43.65, lng: -79.38, tz: 'America/Toronto' },
  { name: 'Kuala Lumpur', region: 'Malaysia', lat: 3.14, lng: 101.69, tz: 'Asia/Kuala_Lumpur' },
];

export const INDIA_CITIES = CITIES.filter(c => c.region === 'India');
export const INTL_CITIES = CITIES.filter(c => c.region !== 'India');

function getUtcOffsetMinutes(tz: string): number {
  const now = new Date();
  const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = now.toLocaleString('en-US', { timeZone: tz });
  return Math.round((new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 60000);
}

function formatMinutes(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

export interface CityTimingInfo {
  sunriseMin: number;
  sunsetMin: number;
  sunriseText: string;
  sunsetText: string;
  tzLabel: string;
}

export function getCityTimingInfo(city: CityData): CityTimingInfo {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  // Solar declination (simplified astronomical formula)
  const declination = -23.44 * Math.cos(2 * Math.PI / 365 * (dayOfYear + 10));
  const decRad = declination * Math.PI / 180;
  const latRad = city.lat * Math.PI / 180;

  // Hour angle at sunrise/sunset
  const cosHA = -Math.tan(latRad) * Math.tan(decRad);
  const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
  const hourAngle = Math.acos(clampedCosHA);
  const daylightMinutes = 2 * hourAngle * (12 / Math.PI) * 60;

  // Solar noon in local clock time (adjusted for longitude within timezone)
  const utcOffset = getUtcOffsetMinutes(city.tz);
  const tzMeridian = (utcOffset / 60) * 15;
  const solarNoonOffset = (tzMeridian - city.lng) * 4; // 4 min per degree of longitude
  const solarNoon = 12 * 60 + solarNoonOffset;

  const sunriseMin = Math.round(solarNoon - daylightMinutes / 2);
  const sunsetMin = Math.round(solarNoon + daylightMinutes / 2);

  // Timezone abbreviation label
  const tzLabel = new Intl.DateTimeFormat('en-US', { timeZone: city.tz, timeZoneName: 'short' })
    .formatToParts(now)
    .find(p => p.type === 'timeZoneName')?.value || city.tz;

  return {
    sunriseMin,
    sunsetMin,
    sunriseText: formatMinutes(sunriseMin),
    sunsetText: formatMinutes(sunsetMin),
    tzLabel,
  };
}

export function detectCity(): CityData {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = CITIES.find(c => c.tz === tz);
    if (match) return match;
  } catch { /* ignore */ }
  return CITIES[0]; // Default to Delhi
}

// City name aliases (old colonial names → modern names)
export const CITY_ALIASES: Record<string, string> = {
  'bangalore': 'Bengaluru',
  'bombay': 'Mumbai',
  'madras': 'Chennai',
  'calcutta': 'Kolkata',
  'trivandrum': 'Thiruvananthapuram',
  'benares': 'Varanasi',
  'kashi': 'Varanasi',
  'poona': 'Pune',
  'baroda': 'Vadodara',
  'cochin': 'Kochi',
  'mangalore': 'Mangaluru',
  'mysore': 'Mysuru',
  'vizag': 'Visakhapatnam',
  'new delhi': 'Delhi',
  'trichy': 'Tiruchirappalli',
  'trichirappalli': 'Tiruchirappalli',
  'tiruvannamalai district': 'Tiruvannamalai',
  'arni': 'Tiruvannamalai',
  'tirunelveli district': 'Tirunelveli',
  'nellai': 'Tirunelveli',
};

export function findCityByName(name: string): CityData | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  // Direct case-insensitive match
  const direct = CITIES.find(c => c.name.toLowerCase() === lower);
  if (direct) return direct;
  // Try alias
  const aliasTarget = CITY_ALIASES[lower];
  if (aliasTarget) return CITIES.find(c => c.name === aliasTarget);
  // Partial match (city name starts with input)
  const partial = CITIES.find(c => c.name.toLowerCase().startsWith(lower));
  if (partial) return partial;
  return undefined;
}

/**
 * Find city by name, falling back to Delhi with a console warning.
 */
export function findCityOrDefault(name: string): CityData {
  const city = findCityByName(name);
  if (city) return city;
  if (name && typeof console !== 'undefined') {
    console.warn(`City "${name}" not found in database, defaulting to Delhi.`);
  }
  return CITIES[0]; // Delhi
}

/**
 * Get the UTC offset in hours for a timezone string.
 * Uses Intl API when available, falls back to known offsets.
 */
/**
 * Haversine distance between two lat/lng points in kilometres.
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find the nearest city in CITIES array to the given coordinates.
 */
export function findNearestCity(lat: number, lng: number): CityData {
  let best = CITIES[0];
  let bestDist = Infinity;
  for (const city of CITIES) {
    const d = haversineDistance(lat, lng, city.lat, city.lng);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}

const SESSION_KEY = 'vedic-geo-city-v3'; // v3: BigDataCloud + hybrid GPS/IP

/**
 * Get browser geolocation coordinates.
 * Uses enableHighAccuracy: true to get actual GPS fix on mobile
 * instead of rough cell-tower approximation.
 */
function getBrowserGeolocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}

/**
 * Reverse geocode via BigDataCloud (free, no API key, CORS-enabled, excellent India data).
 * When called WITH coordinates → reverse geocodes GPS coords to exact city/town.
 * When called WITHOUT coordinates → uses IP-based geolocation as fallback.
 */
async function bigDataCloudGeocode(lat?: number, lng?: number): Promise<{ city: string | null; region: string | null; lat: number; lng: number } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const params = lat !== undefined && lng !== undefined
      ? `?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      : '?localityLanguage=en'; // no coords = IP-based detection
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client${params}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.locality || data.city || null,
      region: data.principalSubdivision || data.countryName || null,
      lat: data.latitude,
      lng: data.longitude,
    };
  } catch { return null; }
}

/**
 * Hybrid city detection — like Swiggy/OLX:
 * 1. Try GPS (enableHighAccuracy) + BigDataCloud reverse geocode → exact location
 * 2. If GPS denied/fails → BigDataCloud IP-based detection (no coords)
 * 3. If all fails → timezone-based fallback
 * Caches result in sessionStorage per browser session.
 */
export async function detectCityAsync(): Promise<CityData> {
  // Check cache first
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as CityData;
      if (parsed.name && typeof parsed.lat === 'number') return parsed;
    }
  } catch { /* ignore */ }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Phase 1: Try GPS + BigDataCloud reverse geocode
  try {
    const { lat, lng } = await getBrowserGeolocation();
    const geo = await bigDataCloudGeocode(lat, lng);
    if (geo?.city) {
      const city: CityData = { name: geo.city, region: geo.region || 'India', lat, lng, tz };
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(city)); } catch { /* ignore */ }
      return city;
    }
  } catch { /* GPS denied or timeout — fall through to IP */ }

  // Phase 2: BigDataCloud IP-based detection (no GPS needed)
  try {
    const geo = await bigDataCloudGeocode();
    if (geo?.city && geo.lat) {
      const city: CityData = { name: geo.city, region: geo.region || 'India', lat: geo.lat, lng: geo.lng, tz };
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(city)); } catch { /* ignore */ }
      return city;
    }
  } catch { /* ignore */ }

  // Phase 3: Timezone-based fallback
  return detectCity();
}

export function getUtcOffsetHours(tz: string): number {
  const knownOffsets: Record<string, number> = {
    'Asia/Kolkata': 5.5,
    'Asia/Dubai': 4,
    'Asia/Singapore': 8,
    'Asia/Kuala_Lumpur': 8,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'America/Chicago': -6,
    'America/Toronto': -5,
    'Europe/London': 0,
    'Australia/Sydney': 11,
  };
  if (knownOffsets[tz] !== undefined) return knownOffsets[tz];
  try {
    return getUtcOffsetMinutes(tz) / 60;
  } catch {
    return 5.5; // default IST
  }
}
