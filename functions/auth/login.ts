import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { verifyPassword, generateToken, validateEmail, CORS_HEADERS, ok, err } from '../lib/auth-utils';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !validateEmail(email)) return err(400, 'Please enter a valid email address.');
    if (!password) return err(400, 'Password is required.');

    const result = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    const user = result.Items?.[0];
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return err(401, 'Invalid email or password.');
    }

    if (!user.emailVerified) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Please verify your email before logging in.',
          needsVerification: true,
          email: user.email,
        }),
      };
    }

    const token = generateToken({ sub: user.id, email: user.email });

    return ok({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        tob: user.tob,
        pob: user.pob,
        timezone: user.timezone,
        emailVerified: true,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
