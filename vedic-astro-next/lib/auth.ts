import { User, VedicChart } from '@/types';
import { generatePersonalizedHoroscope } from '@/lib/horoscope-data';
import { computeFullChart, calculateNavamsaSign, signNames, hindiSignNames, signSymbols } from '@/lib/kundli-calc';

const AUTH_KEY = 'vedic_astro_user';
const USERS_KEY = 'vedic_astro_users';

// Bump this whenever the astronomy engine is updated so cached charts get recalculated
const CHART_ENGINE_VERSION = 2;

export function initUsersStorage(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(AUTH_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export function register(userData: {
  name: string;
  email: string;
  password: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
}): { success: boolean; error?: string; user?: User } {
  const users = getUsers();

  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'Email already registered. Please login.' };
  }

  if (userData.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const vedicChart = calculateVedicChart(userData.dob, userData.tob, userData.pob);

  const initialHoroscope = generatePersonalizedHoroscope(vedicChart, new Date());

  const newUser: User = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    dob: userData.dob,
    tob: userData.tob,
    pob: userData.pob,
    timezone: userData.timezone,
    vedicChart,
    horoscope: initialHoroscope,
    horoscopeHistory: [initialHoroscope],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function calculateVedicChart(dob: string, tob: string, pob: string): VedicChart {
  const fc = computeFullChart(dob, tob, { place: pob });

  // Build planet records with navamsa (VedicChart needs navamsaSign/navamsaSignHindi)
  const planets: VedicChart['planets'] = {};
  for (const [name, p] of Object.entries(fc.positions)) {
    const navamsaSignIdx = calculateNavamsaSign(p.signIndex, p.nakshatraPada);
    planets[name] = {
      sign: p.sign,
      signIndex: p.signIndex,
      signHindi: p.signHindi,
      house: p.house,
      degree: p.degree,
      nakshatra: p.nakshatra,
      nakshatraPada: p.nakshatraPada,
      retrograde: p.retrograde,
      navamsaSign: signNames[navamsaSignIdx],
      navamsaSignHindi: hindiSignNames[navamsaSignIdx],
    };
  }

  const moonIdx = fc.moonData.signIndex;
  const ascIdx = fc.ascendant.signIndex;
  const sunIdx = fc.sunSignIndex;

  return {
    moonSign: { name: signNames[moonIdx], hindi: hindiSignNames[moonIdx], symbol: signSymbols[moonIdx], index: moonIdx },
    sunSign: { name: signNames[sunIdx], hindi: hindiSignNames[sunIdx], symbol: signSymbols[sunIdx] },
    ascendant: { name: signNames[ascIdx], hindi: hindiSignNames[ascIdx], symbol: signSymbols[ascIdx], index: ascIdx },
    nakshatra: fc.moonData.nakshatra,
    nakshatraPada: fc.moonData.nakshatraPada,
    planets,
    birthDetails: { date: dob, time: tob, place: pob },
    engineVersion: CHART_ENGINE_VERSION,
  };
}

/** Recalculate chart if it was computed with an older engine version */
export function migrateChartIfNeeded(): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser?.vedicChart || !currentUser.dob || !currentUser.tob || !currentUser.pob) return null;

  if (currentUser.vedicChart.engineVersion === CHART_ENGINE_VERSION) return null;

  // Recalculate with current engine
  return updateBirthDetails(currentUser.dob, currentUser.tob, currentUser.pob, currentUser.timezone || 'Asia/Kolkata');
}

export function refreshHoroscope(): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.vedicChart) return null;

  const today = new Date().toISOString().split('T')[0];
  const horoscope = currentUser.horoscope;
  const needsRefresh = !horoscope || horoscope.date !== today || !horoscope.weekly || !horoscope.monthly || !horoscope.panchanga
    || (horoscope.weekly?.dayHighlights && !horoscope.weekly.dayHighlights[0]?.detailed);
  if (!needsRefresh) return currentUser;

  const newHoroscope = generatePersonalizedHoroscope(currentUser.vedicChart, new Date());
  const history = currentUser.horoscopeHistory || [];
  history.push(newHoroscope);
  if (history.length > 7) history.shift();

  const updatedUser = { ...currentUser, horoscope: newHoroscope, horoscopeHistory: history };

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) users[userIndex] = updatedUser;
  saveUsers(users);
  setCurrentUser(updatedUser);
  return updatedUser;
}

export function updateBirthDetails(dob: string, tob: string, pob: string, timezone: string): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const vedicChart = calculateVedicChart(dob, tob, pob);
  const newHoroscope = generatePersonalizedHoroscope(vedicChart, new Date());
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  const updatedUser = { ...currentUser, dob, tob, pob, timezone, vedicChart, horoscope: newHoroscope, horoscopeHistory: [newHoroscope] };

  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
  } else {
    users.push(updatedUser);
  }

  saveUsers(users);
  setCurrentUser(updatedUser);
  return updatedUser;
}
