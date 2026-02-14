import crypto from 'crypto';
import { providers, VALID_PROVIDERS } from '../lib/oauth-providers';

interface ApiGatewayEvent {
  queryStringParameters?: Record<string, string>;
  requestContext?: { http?: { method?: string }; domainName?: string };
  headers?: Record<string, string>;
}

export async function handler(event: ApiGatewayEvent) {
  const provider = event.queryStringParameters?.provider;

  if (!provider || !(VALID_PROVIDERS as readonly string[]).includes(provider)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}` }),
    };
  }

  const domain = event.requestContext?.domainName || event.headers?.host || '';
  const stage = event.requestContext?.http?.method ? '' : '';
  const callbackUrl = `https://${domain}/auth/oauth/callback`;

  const nonce = crypto.randomBytes(16).toString('hex');
  const state = `${provider}:${nonce}`;

  const authorizeUrl = providers[provider]!.authorizeUrl(callbackUrl, state);

  return {
    statusCode: 302,
    headers: { Location: authorizeUrl },
    body: '',
  };
}
