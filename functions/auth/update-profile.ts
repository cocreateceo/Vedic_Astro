import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { verifyToken, CORS_HEADERS, ok, err } from '../lib/auth-utils';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { body?: string; headers?: Record<string, string>; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) return err(401, 'Authentication required.');

    const payload = verifyToken(token);
    if (!payload) return err(401, 'Invalid or expired token.');

    const body = JSON.parse(event.body || '{}');
    const { dob, tob, pob, timezone } = body;

    if (!dob || !tob || !pob) return err(400, 'Date, time, and place of birth are required.');

    // Verify user exists
    const existing = await db.send(new GetCommand({
      TableName: Resource.Users.name,
      Key: { id: payload.sub },
    }));

    if (!existing.Item) return err(404, 'User not found.');

    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: payload.sub },
      UpdateExpression: 'SET dob = :dob, tob = :tob, pob = :pob, #tz = :tz, updatedAt = :now',
      ExpressionAttributeNames: { '#tz': 'timezone' },
      ExpressionAttributeValues: {
        ':dob': dob,
        ':tob': tob,
        ':pob': pob,
        ':tz': timezone || 'Asia/Kolkata',
        ':now': new Date().toISOString(),
      },
    }));

    return ok({
      user: {
        id: existing.Item.id,
        name: existing.Item.name,
        email: existing.Item.email,
        dob,
        tob,
        pob,
        timezone: timezone || 'Asia/Kolkata',
        emailVerified: existing.Item.emailVerified,
        createdAt: existing.Item.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
