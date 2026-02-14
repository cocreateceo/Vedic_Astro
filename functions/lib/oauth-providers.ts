import { Resource } from 'sst';
import crypto from 'crypto';

export interface OAuthUserProfile {
  email: string;
  name: string;
  providerId: string;
  provider: string;
  emailVerified: boolean;
  picture?: string;
}

interface OAuthTokens {
  access_token: string;
  id_token?: string;
}

interface OAuthProvider {
  authorizeUrl(redirectUri: string, state: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens>;
  getProfile(accessToken: string, idToken?: string): Promise<OAuthUserProfile>;
}

// ── Google ─────────────────────────────────────────────────────────────

const google: OAuthProvider = {
  authorizeUrl(redirectUri, state) {
    const params = new URLSearchParams({
      client_id: Resource.GoogleClientId.value,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  async exchangeCode(code, redirectUri) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: Resource.GoogleClientId.value,
        client_secret: Resource.GoogleClientSecret.value,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
    return res.json();
  },

  async getProfile(accessToken) {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Google userinfo failed: ${res.status}`);
    const data = await res.json();
    return {
      email: data.email,
      name: data.name || data.email.split('@')[0],
      providerId: data.id,
      provider: 'google',
      emailVerified: data.verified_email ?? true,
      picture: data.picture,
    };
  },
};

// ── Facebook ───────────────────────────────────────────────────────────

const facebook: OAuthProvider = {
  authorizeUrl(redirectUri, state) {
    const params = new URLSearchParams({
      client_id: Resource.FacebookAppId.value,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email,public_profile',
      state,
    });
    return `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
  },

  async exchangeCode(code, redirectUri) {
    const params = new URLSearchParams({
      code,
      client_id: Resource.FacebookAppId.value,
      client_secret: Resource.FacebookAppSecret.value,
      redirect_uri: redirectUri,
    });
    const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params}`);
    if (!res.ok) throw new Error(`Facebook token exchange failed: ${res.status}`);
    return res.json();
  },

  async getProfile(accessToken) {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`,
    );
    if (!res.ok) throw new Error(`Facebook profile failed: ${res.status}`);
    const data = await res.json();
    return {
      email: data.email,
      name: data.name || 'Facebook User',
      providerId: data.id,
      provider: 'facebook',
      emailVerified: true,
      picture: data.picture?.data?.url,
    };
  },
};

// ── Apple ──────────────────────────────────────────────────────────────

function generateAppleClientSecret(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({
    alg: 'ES256',
    kid: Resource.AppleKeyId.value,
  })).toString('base64url');

  const payload = Buffer.from(JSON.stringify({
    iss: Resource.AppleTeamId.value,
    iat: now,
    exp: now + 15777000, // ~6 months
    aud: 'https://appleid.apple.com',
    sub: Resource.AppleServiceId.value,
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;

  // The private key is stored as a base64-encoded PEM string
  const privateKeyPem = Buffer.from(Resource.ApplePrivateKey.value, 'base64').toString('utf8');
  const sign = crypto.createSign('SHA256');
  sign.update(signingInput);
  const derSig = sign.sign(privateKeyPem);

  // Convert DER signature to raw r||s (64 bytes) for ES256 JWT
  const rawSig = derToRaw(derSig);
  const sig = Buffer.from(rawSig).toString('base64url');

  return `${header}.${payload}.${sig}`;
}

function derToRaw(derSig: Buffer): Buffer {
  // DER: 0x30 [len] 0x02 [rlen] [r...] 0x02 [slen] [s...]
  let offset = 2; // skip 0x30 + length byte
  if (derSig[1]! > 128) offset++; // long form length

  // r
  offset++; // skip 0x02
  const rLen = derSig[offset]!;
  offset++;
  let r = derSig.subarray(offset, offset + rLen);
  offset += rLen;

  // s
  offset++; // skip 0x02
  const sLen = derSig[offset]!;
  offset++;
  let s = derSig.subarray(offset, offset + sLen);

  // Trim leading zero padding
  if (r.length === 33 && r[0] === 0) r = r.subarray(1);
  if (s.length === 33 && s[0] === 0) s = s.subarray(1);

  // Pad to 32 bytes each
  const raw = Buffer.alloc(64);
  r.copy(raw, 32 - r.length);
  s.copy(raw, 64 - s.length);
  return raw;
}

function decodeJwtPayload(token: string): Record<string, any> {
  const parts = token.split('.');
  if (!parts[1]) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
}

const apple: OAuthProvider = {
  authorizeUrl(redirectUri, state) {
    const params = new URLSearchParams({
      client_id: Resource.AppleServiceId.value,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'name email',
      state,
      response_mode: 'query',
    });
    return `https://appleid.apple.com/auth/authorize?${params}`;
  },

  async exchangeCode(code, redirectUri) {
    const clientSecret = generateAppleClientSecret();
    const res = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: Resource.AppleServiceId.value,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!res.ok) throw new Error(`Apple token exchange failed: ${res.status}`);
    return res.json();
  },

  async getProfile(_accessToken, idToken) {
    if (!idToken) throw new Error('Apple id_token missing');
    const claims = decodeJwtPayload(idToken);
    return {
      email: claims.email,
      name: claims.email?.split('@')[0] || 'Apple User',
      providerId: claims.sub,
      provider: 'apple',
      emailVerified: claims.email_verified === 'true' || claims.email_verified === true,
      picture: undefined,
    };
  },
};

// ── Export ──────────────────────────────────────────────────────────────

export const providers: Record<string, OAuthProvider> = { google, facebook, apple };

export const VALID_PROVIDERS = ['google', 'facebook', 'apple'] as const;
export type ProviderName = (typeof VALID_PROVIDERS)[number];
