import { Resource } from 'sst';
import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
// import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { hashPassword, generateToken, /* generateCode, */ validateEmail, validatePassword, CORS_HEADERS, ok, err } from '../lib/auth-utils';
// import { renderVerificationEmail } from '../lib/auth-email-templates';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
// const ses = new SESv2Client({}); // Re-enable when SES domain is verified

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const name = body.name?.trim();
    const dob = body.dob;
    const tob = body.tob;
    const pob = body.pob;
    const timezone = body.timezone;

    if (!email || !validateEmail(email)) return err(400, 'Please enter a valid email address.');
    if (!name) return err(400, 'Name is required.');
    const pwErr = validatePassword(password);
    if (pwErr) return err(400, pwErr);
    if (!dob || !tob || !pob) return err(400, 'Date, time, and place of birth are required.');

    // Check email uniqueness via GSI
    const existing = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    if (existing.Items && existing.Items.length > 0) {
      return err(409, 'An account with this email already exists. Please login.');
    }

    const userId = crypto.randomUUID();
    // const code = generateCode(); // Re-enable for email verification
    const now = new Date().toISOString();

    await db.send(new PutCommand({
      TableName: Resource.Users.name,
      Item: {
        id: userId,
        email,
        name,
        passwordHash: hashPassword(password),
        dob,
        tob,
        pob,
        timezone: timezone || 'Asia/Kolkata',
        emailVerified: true, // Set to false when re-enabling email verification
        // verificationCode: code,
        // verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    }));

    // ── Email verification (disabled — re-enable when SES domain is verified) ──
    // try {
    //   const { subject, html } = renderVerificationEmail(name, code);
    //   await ses.send(new SendEmailCommand({
    //     FromEmailAddress: 'Vedic Astro <noreply@cocreateidea.com>',
    //     Destination: { ToAddresses: [email] },
    //     Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
    //   }));
    // } catch (emailErr) {
    //   console.error('Verification email failed:', emailErr);
    // }

    const token = generateToken({ sub: userId, email });

    return ok({
      message: 'Account created successfully!',
      userId,
      token,
      user: { id: userId, name, email, dob, tob, pob, timezone: timezone || 'Asia/Kolkata', emailVerified: true, createdAt: now },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return err(500, 'Something went wrong. Please try again.');
  }
}
