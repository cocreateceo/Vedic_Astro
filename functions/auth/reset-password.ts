import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { hashPassword, validateEmail, validatePassword, CORS_HEADERS, ok, err } from '../lib/auth-utils';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const MAX_RESET_ATTEMPTS = 5;

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();
    const newPassword = body.newPassword;

    if (!email || !validateEmail(email)) return err(400, 'Please enter a valid email address.');
    if (!code) return err(400, 'Reset code is required.');
    const pwErr = validatePassword(newPassword);
    if (pwErr) return err(400, pwErr);

    const result = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    const user = result.Items?.[0];
    if (!user || !user.resetCode) return err(400, 'Invalid or expired reset code.');

    // Brute-force protection
    if ((user.resetAttempts || 0) >= MAX_RESET_ATTEMPTS) {
      return err(429, 'Too many attempts. Please request a new reset code.');
    }

    // Increment attempts
    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
      UpdateExpression: 'SET resetAttempts = if_not_exists(resetAttempts, :zero) + :one',
      ExpressionAttributeValues: { ':zero': 0, ':one': 1 },
    }));

    if (user.resetCode !== code) return err(400, 'Invalid reset code.');

    if (new Date(user.resetCodeExpiry) < new Date()) {
      return err(400, 'Reset code has expired. Please request a new one.');
    }

    // Update password and clear reset fields
    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
      UpdateExpression: 'SET passwordHash = :pw, updatedAt = :now REMOVE resetCode, resetCodeExpiry, resetAttempts',
      ExpressionAttributeValues: {
        ':pw': hashPassword(newPassword),
        ':now': new Date().toISOString(),
      },
    }));

    return ok({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
