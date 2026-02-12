import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { generateMonthlyContent } from './lib/horoscope-engine';
import { renderMonthlyEmail } from './lib/email-templates';
import { buildUnsubscribeUrl } from './lib/token';
import type { Subscriber } from './lib/types';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

const SITE_URL = 'https://d3r8o59ewzr723.cloudfront.net';
const DASHBOARD_URL = `${SITE_URL}/dashboard`;
const SENDER = `Vedic_Astro <noreply@${Resource.NewsletterEmail.sender}>`;

async function querySubscribers(frequency: string): Promise<Subscriber[]> {
  const items: Subscriber[] = [];

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
  const subscribers = await querySubscribers('monthly');
  console.log(`Monthly newsletter: ${subscribers.length} subscribers`);

  let sent = 0;
  let errors = 0;
  const apiUrl = process.env.API_URL || '';

  for (const sub of subscribers) {
    try {
      const moonSignIndex = sub.moonSignIndex ?? 0;
      const nakshatraName = sub.nakshatraName ?? 'Ashwini';
      const dob = sub.dob ?? '1990-01-01';
      const name = sub.name || 'Friend';

      const content = generateMonthlyContent(moonSignIndex, nakshatraName, dob, today);
      content.name = name;
      content.unsubscribeUrl = buildUnsubscribeUrl(apiUrl, sub.email);
      content.dashboardUrl = DASHBOARD_URL;

      const { subject, html } = renderMonthlyEmail(content);

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
      await sleep(100);
    } catch (err) {
      errors++;
      console.error(`Failed to send to ${sub.email}:`, err);
    }
  }

  console.log(`Monthly newsletter complete: ${sent} sent, ${errors} errors`);
  return { sent, errors, total: subscribers.length };
}
