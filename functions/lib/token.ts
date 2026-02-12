import { createHmac } from 'crypto';
import { Resource } from 'sst';

export function generateUnsubscribeToken(email: string): string {
  const hmac = createHmac('sha256', Resource.HmacSecret.value);
  hmac.update(email.toLowerCase());
  return hmac.digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email);
  // Constant-time comparison
  if (expected.length !== token.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return mismatch === 0;
}

export function buildUnsubscribeUrl(apiUrl: string, email: string): string {
  const token = generateUnsubscribeToken(email);
  return `${apiUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
