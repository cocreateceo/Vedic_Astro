/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "vedic-astro",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // ── Secrets ──────────────────────────────────────────────────────
    const hmacSecret = new sst.Secret("HmacSecret");

    // ── SES Email Identity ──────────────────────────────────────────
    const newsletterEmail = new sst.aws.Email("NewsletterEmail", {
      sender: "cocreateidea.com",
      dns: false,
    });

    // ── DynamoDB Tables ─────────────────────────────────────────────

    // Newsletter subscribers with GSI for active+frequency queries
    const subscribers = new sst.aws.Dynamo("Subscribers", {
      fields: {
        email: "string",
        active: "string",
        frequency: "string",
      },
      primaryIndex: { hashKey: "email" },
      globalIndexes: {
        "active-frequency-index": {
          hashKey: "active",
          rangeKey: "frequency",
        },
      },
    });

    // Contact messages table
    const contactMessages = new sst.aws.Dynamo("ContactMessages", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    // Booking requests table
    const bookings = new sst.aws.Dynamo("Bookings", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    // ── API Gateway ─────────────────────────────────────────────────
    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type"],
      },
    });

    // Newsletter routes
    api.route("POST /newsletter/subscribe", {
      handler: "functions/subscribe.handler",
      link: [subscribers, hmacSecret],
    });

    api.route("GET /newsletter/unsubscribe", {
      handler: "functions/unsubscribe.handler",
      link: [subscribers, hmacSecret],
    });

    api.route("GET /newsletter/status", {
      handler: "functions/subscription-status.handler",
      link: [subscribers],
    });

    api.route("POST /newsletter/preferences", {
      handler: "functions/preferences.handler",
      link: [subscribers],
    });

    // Existing routes
    api.route("POST /contact", {
      handler: "functions/contact.handler",
      link: [contactMessages],
    });

    api.route("POST /booking", {
      handler: "functions/booking.handler",
      link: [bookings, newsletterEmail],
    });

    // ── Cron Jobs ───────────────────────────────────────────────────

    // Daily newsletter: 4 AM UTC (~9:30 AM IST)
    new sst.aws.Cron("DailyNewsletter", {
      schedule: "cron(0 4 * * ? *)",
      function: {
        handler: "functions/send-daily.handler",
        link: [subscribers, newsletterEmail, hmacSecret],
        timeout: "5 minutes",
        environment: {
          API_URL: api.url,
        },
      },
    });

    // Weekly newsletter: Monday 4 AM UTC
    new sst.aws.Cron("WeeklyNewsletter", {
      schedule: "cron(0 4 ? * MON *)",
      function: {
        handler: "functions/send-weekly.handler",
        link: [subscribers, newsletterEmail, hmacSecret],
        timeout: "5 minutes",
        environment: {
          API_URL: api.url,
        },
      },
    });

    // Monthly newsletter: 1st of month 4 AM UTC
    new sst.aws.Cron("MonthlyNewsletter", {
      schedule: "cron(0 4 1 * ? *)",
      function: {
        handler: "functions/send-monthly.handler",
        link: [subscribers, newsletterEmail, hmacSecret],
        timeout: "5 minutes",
        environment: {
          API_URL: api.url,
        },
      },
    });

    // ── Static Site ─────────────────────────────────────────────────
    const site = new sst.aws.StaticSite("VedicAstroSite", {
      path: "vedic-astro-next",
      build: {
        command: "npx next build",
        output: "out",
      },
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
      indexPage: "index.html",
      errorPage: "404.html",
    });

    return {
      site: site.url,
      api: api.url,
    };
  },
});
