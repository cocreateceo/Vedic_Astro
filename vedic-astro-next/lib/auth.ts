import { User, VedicChart } from '@/types';
import { generatePersonalizedHoroscope } from '@/lib/horoscope-data';
import { computeFullChart, calculateNavamsaSign, signNames, hindiSignNames, signSymbols } from '@/lib/kundli-calc';
import { authApi, getToken, setToken, clearToken } from '@/lib/api';

const AUTH_KEY = 'vedic_astro_user';

// Bump this whenever the astronomy engine is updated so cached charts get recalculated
const CHART_ENGINE_VERSION = 2;

// ── Cached User (localStorage) ────────────────────────────────────────

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
  clearToken();
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken() && getCurrentUser() !== null;
}

// ── API-backed Auth ───────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }> {
  try {
    const data = await authApi.login(email, password);
    setToken(data.token);

    // Compute chart client-side from birth details
    const vedicChart = calculateVedicChart(data.user.dob, data.user.tob, data.user.pob);
    const horoscope = generatePersonalizedHoroscope(vedicChart, new Date());

    const user: User = {
      ...data.user,
      vedicChart,
      horoscope,
      horoscopeHistory: [horoscope],
    };
    setCurrentUser(user);
    return { success: true };
  } catch (err: any) {
    if (err.data?.needsVerification) {
      return { success: false, error: err.message, needsVerification: true, email: err.data.email };
    }
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const data = await authApi.register(userData);
    return { success: true, userId: data.userId };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

export async function verifyEmail(email: string, code: string): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const data = await authApi.verifyEmail(email, code);
    setToken(data.token);

    const vedicChart = calculateVedicChart(data.user.dob, data.user.tob, data.user.pob);
    const horoscope = generatePersonalizedHoroscope(vedicChart, new Date());

    const user: User = {
      ...data.user,
      vedicChart,
      horoscope,
      horoscopeHistory: [horoscope],
    };
    setCurrentUser(user);
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Verification failed' };
  }
}

export async function resendVerification(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await authApi.resendVerification(email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resend code' };
  }
}

export async function forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await authApi.forgotPassword(email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send reset code' };
  }
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    await authApi.resetPassword(email, code, newPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reset password' };
  }
}

export async function loginWithOAuthToken(token: string): Promise<{ success: boolean; needsProfile?: boolean; error?: string }> {
  try {
    setToken(token);
    const data = await authApi.getMe();

    const hasBirthDetails = !!(data.user.dob && data.user.tob && data.user.pob);

    if (hasBirthDetails) {
      const vedicChart = calculateVedicChart(data.user.dob, data.user.tob, data.user.pob);
      const horoscope = generatePersonalizedHoroscope(vedicChart, new Date());
      const user: User = {
        ...data.user,
        vedicChart,
        horoscope,
        horoscopeHistory: [horoscope],
      };
      setCurrentUser(user);
      return { success: true };
    } else {
      const user: User = {
        ...data.user,
        vedicChart: null,
        horoscope: null,
        horoscopeHistory: [],
      };
      setCurrentUser(user);
      return { success: true, needsProfile: true };
    }
  } catch (err: any) {
    clearToken();
    return { success: false, error: err.message || 'OAuth login failed' };
  }
}

export async function validateSession(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const data = await authApi.getMe();
    // Re-compute chart from cached user if available, or compute fresh
    const cached = getCurrentUser();
    if (cached && cached.id === data.user.id && cached.vedicChart) {
      return cached;
    }

    const hasBirthDetails = !!(data.user.dob && data.user.tob && data.user.pob);

    if (hasBirthDetails) {
      const vedicChart = calculateVedicChart(data.user.dob, data.user.tob, data.user.pob);
      const horoscope = generatePersonalizedHoroscope(vedicChart, new Date());
      const user: User = {
        ...data.user,
        vedicChart,
        horoscope,
        horoscopeHistory: [horoscope],
      };
      setCurrentUser(user);
      return user;
    } else {
      // OAuth user without birth details
      const user: User = {
        ...data.user,
        vedicChart: null,
        horoscope: null,
        horoscopeHistory: [],
      };
      setCurrentUser(user);
      return user;
    }
  } catch {
    // Token invalid/expired — clear session
    logout();
    return null;
  }
}

// ── Chart Computation (stays client-side) ─────────────────────────────

export function calculateVedicChart(dob: string, tob: string, pob: string): VedicChart {
  const fc = computeFullChart(dob, tob, { place: pob });

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

export function migrateChartIfNeeded(): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser?.vedicChart || !currentUser.dob || !currentUser.tob || !currentUser.pob) return null;

  if (currentUser.vedicChart.engineVersion === CHART_ENGINE_VERSION) return null;

  return updateBirthDetailsLocal(currentUser.dob, currentUser.tob, currentUser.pob, currentUser.timezone || 'Asia/Kolkata');
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
  setCurrentUser(updatedUser);
  return updatedUser;
}

/** Local-only birth details update (recalculate chart without API) */
function updateBirthDetailsLocal(dob: string, tob: string, pob: string, timezone: string): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const vedicChart = calculateVedicChart(dob, tob, pob);
  const newHoroscope = generatePersonalizedHoroscope(vedicChart, new Date());

  const updatedUser = { ...currentUser, dob, tob, pob, timezone, vedicChart, horoscope: newHoroscope, horoscopeHistory: [newHoroscope] };
  setCurrentUser(updatedUser);
  return updatedUser;
}

/** Update birth details via API + recalculate chart locally */
export async function updateBirthDetails(dob: string, tob: string, pob: string, timezone: string): Promise<User | null> {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  // Update server-side first
  try {
    await authApi.updateProfile({ dob, tob, pob, timezone });
  } catch (err) {
    console.error('Failed to update profile on server:', err);
    // Still update locally so the user sees their new chart
  }

  return updateBirthDetailsLocal(dob, tob, pob, timezone);
}
