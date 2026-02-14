const TOKEN_KEY = 'vedic_astro_token';

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T = any>(
  path: string,
  options: { method?: string; body?: Record<string, unknown> } = {},
): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: options.method || (options.body ? 'POST' : 'GET'),
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`API request failed: server returned ${contentType || 'non-JSON'} (status ${res.status}). Check that the API URL is configured correctly.`);
  }

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error(data.error || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
  emailVerified: boolean;
  createdAt: string;
  oauthProvider?: string | null;
  profilePicture?: string | null;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
  userId: string;
  token?: string;
  user?: AuthUser;
}

interface VerifyEmailResponse {
  token: string;
  user: AuthUser;
}

interface MessageResponse {
  message: string;
}

interface MeResponse {
  user: AuthUser;
}

interface UpdateProfileResponse {
  user: AuthUser;
}

export const authApi = {
  register(data: { name: string; email: string; password: string; dob: string; tob: string; pob: string; timezone: string }): Promise<RegisterResponse> {
    return apiFetch('/auth/register', { body: data as any });
  },

  verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
    return apiFetch('/auth/verify-email', { body: { email, code } as any });
  },

  resendVerification(email: string): Promise<MessageResponse> {
    return apiFetch('/auth/resend-verification', { body: { email } as any });
  },

  login(email: string, password: string): Promise<LoginResponse> {
    return apiFetch('/auth/login', { body: { email, password } as any });
  },

  forgotPassword(email: string): Promise<MessageResponse> {
    return apiFetch('/auth/forgot-password', { body: { email } as any });
  },

  resetPassword(email: string, code: string, newPassword: string): Promise<MessageResponse> {
    return apiFetch('/auth/reset-password', { body: { email, code, newPassword } as any });
  },

  getMe(): Promise<MeResponse> {
    return apiFetch('/auth/me');
  },

  updateProfile(data: { dob: string; tob: string; pob: string; timezone: string }): Promise<UpdateProfileResponse> {
    return apiFetch('/auth/update-profile', { body: data as any });
  },
};
