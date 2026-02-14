import { Resource } from 'sst';
import crypto from 'crypto';

// ── Password Hashing (scrypt) ─────────────────────────────────────────

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_COST }).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_COST }).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

// ── JWT (HMAC-SHA256) ─────────────────────────────────────────────────

const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str: string): Buffer {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

export function generateToken(payload: { sub: string; email: string }): string {
  const secret = Resource.HmacSecret.value;
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(Buffer.from(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  })));
  const sig = base64url(crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const secret = Resource.HmacSecret.value;
    const [header, body, sig] = token.split('.');
    if (!header || !body || !sig) return null;

    const expectedSig = base64url(crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest());
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

    const payload = JSON.parse(base64urlDecode(body).toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

// ── Verification Code ─────────────────────────────────────────────────

export function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// ── Validation ────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (!password || password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 128) return 'Password is too long';
  return null;
}

// ── CORS ──────────────────────────────────────────────────────────────

export const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ── Response Helpers ──────────────────────────────────────────────────

export function ok(body: Record<string, unknown>) {
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function err(statusCode: number, error: string) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify({ error }) };
}
