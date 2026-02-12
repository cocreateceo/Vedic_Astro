import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { randomUUID } from "crypto";
import { renderBookingConfirmationEmail } from "./lib/email-templates";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

export async function handler(event: { body?: string }) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, phone, preferredDate, topic, notes, astrologer, tier, question } = body;

    if (!name?.trim() || !email?.trim() || !topic || !astrologer) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please fill in all required fields." }),
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please enter a valid email address." }),
      };
    }

    const bookingId = randomUUID();
    const resolvedTier = tier || "free";

    await dynamo.send(
      new PutCommand({
        TableName: Resource.Bookings.name,
        Item: {
          id: bookingId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || "",
          preferredDate: preferredDate || new Date().toISOString().split("T")[0],
          topic,
          question: question?.trim() || "",
          notes: notes?.trim() || "",
          astrologer,
          tier: resolvedTier,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      })
    );

    // Send confirmation email via SES
    try {
      const { subject, html } = renderBookingConfirmationEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        astrologer,
        topic,
        tier: resolvedTier,
        question: question?.trim() || "",
      });

      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: `Vedic_Astro <noreply@${Resource.NewsletterEmail.sender}>`,
          Destination: { ToAddresses: [email.trim().toLowerCase()] },
          Content: {
            Simple: {
              Subject: { Data: subject },
              Body: { Html: { Data: html } },
            },
          },
        })
      );
    } catch (emailErr) {
      // Log but don't fail the booking if email fails
      console.error("Confirmation email failed:", emailErr);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Booking request submitted successfully!" }),
    };
  } catch (err) {
    console.error("Booking error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Something went wrong. Please try again." }),
    };
  }
}
