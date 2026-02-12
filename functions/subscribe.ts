import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { computeMoonSignIndex, computeNakshatraIndex, getNakshatraName } from './lib/horoscope-engine';
import type { SubscribeRequest, Frequency } from './lib/types';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } }) {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body: SubscribeRequest = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Please enter a valid email address.' }),
      };
    }

    const frequency: Frequency = body.frequency || 'weekly';
    const name = body.name?.trim() || undefined;
    const dob = body.dob || undefined;
    const tob = body.tob || undefined;
    const pob = body.pob || undefined;

    // Compute astro data if DOB provided
    let moonSignIndex: number | undefined;
    let nakshatraIndex: number | undefined;
    let nakshatraName: string | undefined;
    if (dob) {
      moonSignIndex = computeMoonSignIndex(dob);
      nakshatraIndex = computeNakshatraIndex(dob);
      nakshatraName = getNakshatraName(nakshatraIndex);
    }

    // Check if subscriber already exists
    const existing = await client.send(
      new GetCommand({
        TableName: Resource.Subscribers.name,
        Key: { email },
      })
    );

    if (existing.Item) {
      // Resubscribe: update with new data, set active
      const updateExprParts = ['#active = :active', '#freq = :freq', '#subscribedAt = :now'];
      const exprNames: Record<string, string> = {
        '#active': 'active',
        '#freq': 'frequency',
        '#subscribedAt': 'subscribedAt',
      };
      const exprValues: Record<string, any> = {
        ':active': 'true',
        ':freq': frequency,
        ':now': new Date().toISOString(),
      };

      if (name) { updateExprParts.push('#name = :name'); exprNames['#name'] = 'name'; exprValues[':name'] = name; }
      if (dob) { updateExprParts.push('#dob = :dob'); exprNames['#dob'] = 'dob'; exprValues[':dob'] = dob; }
      if (tob) { updateExprParts.push('#tob = :tob'); exprNames['#tob'] = 'tob'; exprValues[':tob'] = tob; }
      if (pob) { updateExprParts.push('#pob = :pob'); exprNames['#pob'] = 'pob'; exprValues[':pob'] = pob; }
      if (moonSignIndex !== undefined) { updateExprParts.push('#msi = :msi'); exprNames['#msi'] = 'moonSignIndex'; exprValues[':msi'] = moonSignIndex; }
      if (nakshatraIndex !== undefined) { updateExprParts.push('#ni = :ni'); exprNames['#ni'] = 'nakshatraIndex'; exprValues[':ni'] = nakshatraIndex; }
      if (nakshatraName) { updateExprParts.push('#nn = :nn'); exprNames['#nn'] = 'nakshatraName'; exprValues[':nn'] = nakshatraName; }

      await client.send(
        new UpdateCommand({
          TableName: Resource.Subscribers.name,
          Key: { email },
          UpdateExpression: 'SET ' + updateExprParts.join(', '),
          ExpressionAttributeNames: exprNames,
          ExpressionAttributeValues: exprValues,
        })
      );

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Subscription updated successfully!' }),
      };
    }

    // New subscriber
    const item: Record<string, any> = {
      email,
      frequency,
      active: 'true',
      subscribedAt: new Date().toISOString(),
    };
    if (name) item.name = name;
    if (dob) item.dob = dob;
    if (tob) item.tob = tob;
    if (pob) item.pob = pob;
    if (moonSignIndex !== undefined) item.moonSignIndex = moonSignIndex;
    if (nakshatraIndex !== undefined) item.nakshatraIndex = nakshatraIndex;
    if (nakshatraName) item.nakshatraName = nakshatraName;

    await client.send(
      new PutCommand({
        TableName: Resource.Subscribers.name,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Successfully subscribed!' }),
    };
  } catch (err: any) {
    console.error('Subscribe error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
}
