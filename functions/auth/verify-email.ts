import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { generateToken, CORS_HEADERS, ok, err } from '../lib/auth-utils';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();

    if (!email || !code) return err(400, 'Email and verification code are required.');

    const result = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    const user = result.Items?.[0];
    if (!user) return err(400, 'Invalid verification code.');

    if (user.emailVerified) return err(400, 'Email is already verified. Please login.');

    if (user.verificationCode !== code) return err(400, 'Invalid verification code.');

    if (new Date(user.verificationCodeExpiry) < new Date()) {
      return err(400, 'Verification code has expired. Please request a new one.');
    }

    // Mark as verified
    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
      UpdateExpression: 'SET emailVerified = :v, updatedAt = :now REMOVE verificationCode, verificationCodeExpiry',
      ExpressionAttributeValues: { ':v': true, ':now': new Date().toISOString() },
    }));

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
    console.error('Verify email error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
