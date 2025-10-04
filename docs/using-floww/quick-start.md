# Quick Start

Get up and running with Floww SDK in minutes.

## Installation

Configure npm to use GitHub Package Registry:

```bash
echo "@developerflows:registry=https://npm.pkg.github.com" >> .npmrc
npm install @developerflows/floww-sdk
```

For private repos, add your GitHub token:
```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

## Your First Workflow

Create `main.ts`:

```typescript
import { Builtin } from "@developerflows/floww-sdk";

const builtin = new Builtin();

export default [
    builtin.triggers.onWebhook({
        handler: (ctx, event) => {
            console.log('Received:', event.body);
            return { success: true, message: 'Hello from Floww!' };
        },
        path: '/hello',
    }),
    builtin.triggers.onCron({
        expression: "*/30 * * * * *", // Every 30 seconds
        handler: (ctx, event) => {
            console.log('Scheduled task ran at:', event.timestamp);
        }
    })
]
```

## Run Your Workflow

```bash
floww dev main.ts
```

Your server starts at `http://localhost:3000` with:
- Webhook endpoint: `http://localhost:3000/webhooks/hello`
- Cron job running every 30 seconds

## Test Your Webhook

```bash
curl -X POST http://localhost:3000/webhooks/hello \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

You should see:
- The webhook logs your message
- A JSON response with your success message
- Cron job logs every 30 seconds

## What's Next?

- **[Core Concepts](/using-floww/concepts/)** - Understand triggers and providers
- **[Running Locally](/using-floww/running-locally/)** - Development tips and debugging
- **[Builtin Provider](/reference/builtin/)** - Explore webhook and cron options
- **[GitLab Provider](/reference/gitlab/)** - Add repository automation
- **[Google Calendar Provider](/reference/google_calendar/)** - Schedule-based workflows