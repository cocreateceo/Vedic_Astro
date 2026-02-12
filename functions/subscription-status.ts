import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handler(event: {
  queryStringParameters?: Record<string, string>;
  requestContext?: { http?: { method?: string } };
}) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const email = event.queryStringParameters?.email?.trim().toLowerCase();

  if (!email) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Email parameter is required.' }),
    };
  }

  try {
    const result = await client.send(
      new GetCommand({
        TableName: Resource.Subscribers.name,
        Key: { email },
      })
    );

    if (!result.Item) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ subscribed: false }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        subscribed: result.Item.active === 'true',
        frequency: result.Item.frequency || 'weekly',
        name: result.Item.name || '',
      }),
    };
  } catch (err: any) {
    console.error('Status check error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
}
