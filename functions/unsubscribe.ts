import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { verifyUnsubscribeToken } from './lib/token';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { queryStringParameters?: Record<string, string> }) {
  const email = event.queryStringParameters?.email?.trim().toLowerCase();
  const token = event.queryStringParameters?.token;

  // Common HTML styles
  const pageStyle = `
    body { margin:0; padding:40px 20px; background:#110a04; font-family:Georgia,'Times New Roman',serif; color:#e8d5b8; }
    .container { max-width:500px; margin:0 auto; text-align:center; }
    .star { color:#F28C1A; font-size:36px; }
    .title { color:#F28C1A; font-size:24px; font-weight:600; letter-spacing:1px; margin:8px 0 24px; }
    .card { background:#1a1108; border-radius:8px; padding:32px; border:1px solid rgba(242,140,26,0.15); }
    h2 { color:#e8d5b8; font-size:20px; margin:0 0 12px; }
    p { color:#a09080; font-size:14px; line-height:1.6; }
    .btn { display:inline-block; background:linear-gradient(135deg,#F28C1A,#c4700f); color:#110a04; padding:12px 32px; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px; margin-top:16px; }
  `;

  if (!email || !token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head><style>${pageStyle}</style></head><body>
        <div class="container">
          <span class="star">&#10022;</span>
          <div class="title">Vedic_Astro</div>
          <div class="card">
            <h2>Invalid Link</h2>
            <p>This unsubscribe link is missing required information. Please use the link from your email.</p>
          </div>
        </div>
      </body></html>`,
    };
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head><style>${pageStyle}</style></head><body>
        <div class="container">
          <span class="star">&#10022;</span>
          <div class="title">Vedic_Astro</div>
          <div class="card">
            <h2>Invalid Token</h2>
            <p>This unsubscribe link has expired or is invalid. Please use the most recent link from your email.</p>
          </div>
        </div>
      </body></html>`,
    };
  }

  try {
    await client.send(
      new UpdateCommand({
        TableName: Resource.Subscribers.name,
        Key: { email },
        UpdateExpression: 'SET #active = :false, #unsubAt = :now',
        ExpressionAttributeNames: { '#active': 'active', '#unsubAt': 'unsubscribedAt' },
        ExpressionAttributeValues: { ':false': 'false', ':now': new Date().toISOString() },
      })
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head><style>${pageStyle}</style></head><body>
        <div class="container">
          <span class="star">&#10022;</span>
          <div class="title">Vedic_Astro</div>
          <div class="card">
            <h2>Unsubscribed Successfully</h2>
            <p>You have been removed from the Vedic_Astro newsletter. We're sorry to see you go.</p>
            <p>If this was a mistake, you can always resubscribe from our website.</p>
            <a href="https://d3r8o59ewzr723.cloudfront.net" class="btn">Visit Vedic_Astro</a>
          </div>
        </div>
      </body></html>`,
    };
  } catch (err: any) {
    console.error('Unsubscribe error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head><style>${pageStyle}</style></head><body>
        <div class="container">
          <span class="star">&#10022;</span>
          <div class="title">Vedic_Astro</div>
          <div class="card">
            <h2>Something Went Wrong</h2>
            <p>We couldn't process your unsubscribe request. Please try again later or contact us.</p>
          </div>
        </div>
      </body></html>`,
    };
  }
}
