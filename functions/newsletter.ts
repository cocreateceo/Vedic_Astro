import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: { body?: string }) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please enter a valid email address." }),
      };
    }

    await client.send(
      new PutCommand({
        TableName: Resource.Subscribers.name,
        Item: {
          email,
          subscribedAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(email)",
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successfully subscribed!" }),
    };
  } catch (err: any) {
    if (err.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "You're already subscribed!" }),
      };
    }

    console.error("Newsletter subscribe error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Something went wrong. Please try again." }),
    };
  }
}
