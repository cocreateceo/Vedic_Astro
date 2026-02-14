import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { generateToken } from '../lib/auth-utils';
import { providers, VALID_PROVIDERS } from '../lib/oauth-providers';
import crypto from 'crypto';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface ApiGatewayEvent {
  queryStringParameters?: Record<string, string>;
  requestContext?: { http?: { method?: string }; domainName?: string };
  headers?: Record<string, string>;
}

function redirect(url: string) {
  return { statusCode: 302, headers: { Location: url }, body: '' };
}

export async function handler(event: ApiGatewayEvent) {
  const siteUrl = Resource.SiteUrl.value.replace(/\/$/, '');
  const loginUrl = `${siteUrl}/login/`;

  try {
    const { code, state, error: oauthError } = event.queryStringParameters || {};

    if (oauthError) {
      return redirect(`${loginUrl}?error=${encodeURIComponent(oauthError)}`);
    }

    if (!code || !state) {
      return redirect(`${loginUrl}?error=${encodeURIComponent('Missing authorization code')}`);
    }

    // Parse provider from state
    const [provider] = state.split(':');
    if (!provider || !(VALID_PROVIDERS as readonly string[]).includes(provider)) {
      return redirect(`${loginUrl}?error=${encodeURIComponent('Invalid OAuth state')}`);
    }

    // Rebuild callback URL
    const domain = event.requestContext?.domainName || event.headers?.host || '';
    const callbackUrl = `https://${domain}/auth/oauth/callback`;

    // Exchange code for tokens
    const tokens = await providers[provider]!.exchangeCode(code, callbackUrl);

    // Fetch user profile from provider
    const profile = await providers[provider]!.getProfile(tokens.access_token, tokens.id_token);

    if (!profile.email) {
      return redirect(`${loginUrl}?error=${encodeURIComponent('Email not provided by ' + provider)}`);
    }

    // Lookup existing user by email
    const existingResult = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': profile.email.toLowerCase() },
      Limit: 1,
    }));

    let userId: string;
    let needsProfile: boolean;

    const existingUser = existingResult.Items?.[0];

    if (existingUser) {
      // Account linking: update existing user with OAuth details
      userId = existingUser.id;
      await db.send(new UpdateCommand({
        TableName: Resource.Users.name,
        Key: { id: userId },
        UpdateExpression: 'SET oauthProvider = :provider, oauthProviderId = :pid, emailVerified = :ev' +
          (profile.picture ? ', profilePicture = :pic' : ''),
        ExpressionAttributeValues: {
          ':provider': profile.provider,
          ':pid': profile.providerId,
          ':ev': true,
          ...(profile.picture ? { ':pic': profile.picture } : {}),
        },
      }));
      needsProfile = !existingUser.dob || !existingUser.tob || !existingUser.pob;
    } else {
      // Create new user
      userId = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.send(new PutCommand({
        TableName: Resource.Users.name,
        Item: {
          id: userId,
          email: profile.email.toLowerCase(),
          name: profile.name,
          oauthProvider: profile.provider,
          oauthProviderId: profile.providerId,
          profilePicture: profile.picture || '',
          emailVerified: true,
          dob: '',
          tob: '',
          pob: '',
          timezone: '',
          createdAt: now,
        },
      }));
      needsProfile = true;
    }

    // Generate JWT
    const token = generateToken({ sub: userId, email: profile.email.toLowerCase() });

    return redirect(
      `${loginUrl}?oauth_token=${encodeURIComponent(token)}&provider=${provider}&needs_profile=${needsProfile ? '1' : '0'}`,
    );
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return redirect(`${loginUrl}?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
  }
}
