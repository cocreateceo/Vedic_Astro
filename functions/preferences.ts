import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { PreferencesRequest, Frequency } from './lib/types';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const VALID_FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly', 'all'];

export async function handler(event: {
  body?: string;
  requestContext?: { http?: { method?: string } };
}) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const body: PreferencesRequest = JSON.parse(event.body || '{}');
    const email = body.email?.trim().toLowerCase();
    const frequency = body.frequency;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Please enter a valid email address.' }),
      };
    }

    if (!frequency || !VALID_FREQUENCIES.includes(frequency)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid frequency. Must be daily, weekly, monthly, or all.' }),
      };
    }

    await client.send(
      new UpdateCommand({
        TableName: Resource.Subscribers.name,
        Key: { email },
        UpdateExpression: 'SET #freq = :freq',
        ExpressionAttributeNames: { '#freq': 'frequency' },
        ExpressionAttributeValues: { ':freq': frequency },
        ConditionExpression: 'attribute_exists(email)',
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: `Frequency updated to ${frequency}.` }),
    };
  } catch (err: any) {
    if (err.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Email not found. Please subscribe first.' }),
      };
    }
    console.error('Preferences error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
}
