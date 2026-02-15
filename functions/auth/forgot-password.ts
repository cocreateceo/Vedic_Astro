import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { generateCode, validateEmail, CORS_HEADERS, ok, err } from '../lib/auth-utils';
import { renderResetPasswordEmail } from '../lib/auth-email-templates';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();

    if (!email || !validateEmail(email)) return err(400, 'Please enter a valid email address.');

    // Generic response to prevent email enumeration
    const genericResponse = ok({ message: 'If an account exists with this email, a reset code has been sent.' });

    const result = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    const user = result.Items?.[0];
    if (!user) return genericResponse;

    const code = generateCode();

    await db.send(new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { id: user.id },
      UpdateExpression: 'SET resetCode = :code, resetCodeExpiry = :exp, resetAttempts = :zero, updatedAt = :now',
      ExpressionAttributeValues: {
        ':code': code,
        ':exp': new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        ':zero': 0,
        ':now': new Date().toISOString(),
      },
    }));

    try {
      const { subject, html } = renderResetPasswordEmail(user.name, code);
      await ses.send(new SendEmailCommand({
        FromEmailAddress: 'Vedic Astro <noreply@cocreateidea.com>',
        Destination: { ToAddresses: [email] },
        Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
      }));
    } catch (emailErr) {
      console.error('Reset password email failed:', emailErr);
    }

    return genericResponse;
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
