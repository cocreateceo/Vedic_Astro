import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { verifyToken, CORS_HEADERS, ok, err } from '../lib/auth-utils';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { headers?: Record<string, string>; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) return err(401, 'Authentication required.');

    const payload = verifyToken(token);
    if (!payload) return err(401, 'Invalid or expired token.');

    const result = await db.send(new GetCommand({
      TableName: Resource.Users.name,
      Key: { id: payload.sub },
    }));

    const user = result.Item;
    if (!user) return err(404, 'User not found.');

    return ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob || '',
        tob: user.tob || '',
        pob: user.pob || '',
        timezone: user.timezone || '',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        oauthProvider: user.oauthProvider || null,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
