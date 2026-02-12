import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { generateDailyContent, getPanchang, getRahuKaal } from './lib/horoscope-engine';
import { renderDailyEmail } from './lib/email-templates';
import { buildUnsubscribeUrl } from './lib/token';
import type { Subscriber } from './lib/types';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

const SITE_URL = 'https://d3r8o59ewzr723.cloudfront.net';
const DASHBOARD_URL = `${SITE_URL}/dashboard`;
const SENDER = `Vedic_Astro <noreply@${Resource.NewsletterEmail.sender}>`;

async function querySubscribers(frequency: string): Promise<Subscriber[]> {
  const items: Subscriber[] = [];

  // Query for specific frequency
  const result = await dynamo.send(
    new QueryCommand({
      TableName: Resource.Subscribers.name,
      IndexName: 'active-frequency-index',
      KeyConditionExpression: '#active = :active AND #freq = :freq',
      ExpressionAttributeNames: { '#active': 'active', '#freq': 'frequency' },
      ExpressionAttributeValues: { ':active': 'true', ':freq': frequency },
    })
  );
  if (result.Items) items.push(...(result.Items as Subscriber[]));

  // Also query for "all" frequency
  const allResult = await dynamo.send(
    new QueryCommand({
      TableName: Resource.Subscribers.name,
      IndexName: 'active-frequency-index',
      KeyConditionExpression: '#active = :active AND #freq = :freq',
      ExpressionAttributeNames: { '#active': 'active', '#freq': 'frequency' },
      ExpressionAttributeValues: { ':active': 'true', ':freq': 'all' },
    })
  );
  if (allResult.Items) items.push(...(allResult.Items as Subscriber[]));

  return items;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handler() {
  const today = new Date();
  const subscribers = await querySubscribers('daily');
  console.log(`Daily newsletter: ${subscribers.length} subscribers`);

  // Compute shared panchang data once
  const panchang = getPanchang(today);
  const rahuKaal = getRahuKaal(today);

  let sent = 0;
  let errors = 0;

  // Get the API URL for unsubscribe links
  const apiUrl = process.env.API_URL || '';

  for (const sub of subscribers) {
    try {
      const moonSignIndex = sub.moonSignIndex ?? 0;
      const nakshatraName = sub.nakshatraName ?? 'Ashwini';
      const name = sub.name || 'Friend';

      const content = generateDailyContent(moonSignIndex, nakshatraName, today);
      content.name = name;
      content.panchang = panchang;
      content.rahuKaal = rahuKaal;
      content.unsubscribeUrl = buildUnsubscribeUrl(apiUrl, sub.email);
      content.dashboardUrl = DASHBOARD_URL;

      const { subject, html } = renderDailyEmail(content);

      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: SENDER,
          Destination: { ToAddresses: [sub.email] },
          Content: {
            Simple: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: { Html: { Data: html, Charset: 'UTF-8' } },
            },
          },
        })
      );

      sent++;
      // Rate limit: 100ms between sends (SES sandbox: 1/sec)
      await sleep(100);
    } catch (err) {
      errors++;
      console.error(`Failed to send to ${sub.email}:`, err);
    }
  }

  console.log(`Daily newsletter complete: ${sent} sent, ${errors} errors`);
  return { sent, errors, total: subscribers.length };
}
