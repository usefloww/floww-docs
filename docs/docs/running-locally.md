# Running Locally

Development setup, debugging, and best practices for local Floww development.

## Development Mode

Start your workflow with auto-reload:

```bash
floww dev main.ts
```

**Features:**
- Automatic file watching and reload
- Detailed error messages with stack traces
- Hot reload when you change your workflow files
- Real webhook URLs for testing with external services

### How floww dev Works

When you run `floww dev`, the CLI:

1. **Registers your triggers** on the Floww server (webhooks, cron schedules, etc.)
2. **Routes events to your local machine** for execution
3. **Watches for file changes** and hot-reloads your code

This means:
- Your webhooks get **real URLs immediately** (e.g., `https://app.usefloww.dev/webhook/w_abc123/custom`)
- Events are **executed in your local environment** with live code changes
- You can **test with real external services** (GitLab webhooks, cron schedules, etc.)
- All **logging happens in your terminal** in real-time

**Example workflow:**
```bash
# Start dev server
floww dev

# Your webhook is registered and you get a URL:
# ✓ Webhook registered: https://app.usefloww.dev/webhook/w_abc123/custom

# Send a request to that URL from anywhere:
curl -X POST https://app.usefloww.dev/webhook/w_abc123/custom \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Event is routed to your local machine and executed
# You see the logs in your terminal immediately
```

### Local-only Testing

For testing without deploying triggers, you can also use localhost:
```bash
curl -X POST http://localhost:3000/webhooks/custom \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Custom Port and Host

```bash
# Custom port
floww dev main.ts --port 8080

# Custom host (accept external connections)
floww dev main.ts --host 0.0.0.0

# Both
floww dev main.ts --port 8080 --host 0.0.0.0
```

## Project Structure

Organize your workflows for maintainability:

```
my-floww-project/
├── main.ts              # Main workflow file
├── workflows/
│   ├── github.ts         # GitHub-specific workflows
│   ├── calendar.ts       # Calendar workflows
│   └── cleanup.ts        # Maintenance tasks
├── utils/
│   ├── notifications.ts  # Shared utilities
│   └── validation.ts     # Input validation
└── package.json
```

### Modular Workflows

Split complex workflows into modules:

```typescript
// main.ts
import { getProvider } from "floww";
import { githubWorkflows } from "./workflows/github";
import { calendarWorkflows } from "./workflows/calendar";

const builtin = getProvider("builtin");

export default [
    ...githubWorkflows,
    ...calendarWorkflows,
    builtin.triggers.onCron({
        expression: "0 2 * * *", // 2 AM daily
        handler: (ctx, event) => {
            ctx.logger.info('Daily cleanup started');
            // Cleanup logic
        }
    })
]
```

```typescript
// workflows/github.ts
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

export const githubWorkflows = [
    gitlab.triggers.onPushEvent({
        handler: (ctx, event) => {
            // Handle push events
        }
    }),
    gitlab.triggers.onMergeRequestEvent({
        handler: (ctx, event) => {
            // Handle MR events
        }
    })
];
```

## Provider Configuration

Floww automatically detects which providers you're using. When you run `floww dev` for the first time with a new provider, you'll be prompted to configure it:

```bash
$ floww dev

⚠ Provider "gitlab" with alias "default" not found in namespace
? Would you like to create it? (Y/n)
? GitLab Access Token: **********************
✓ Provider "gitlab:default" configured successfully
```

### Multiple Provider Instances

You can have multiple instances of the same provider using different aliases:

```typescript
// Personal GitLab account
const gitlabPersonal = getProvider("gitlab", "personal");

// Work GitLab account
const gitlabWork = getProvider("gitlab", "work");
```

See the [Provider Configuration](/docs/advanced/configuration) guide for more details.

## Environment Configuration

Use environment variables for configuration:

```typescript
// .env file
API_URL=https://api.example.com
DEBUG=true
```

```typescript
// In your workflow
import { getProvider } from "floww";

const builtin = getProvider("builtin");

builtin.triggers.onWebhook({
    handler: (ctx, event) => {
        const apiUrl = process.env.API_URL;
        const debug = process.env.DEBUG === 'true';

        if (debug) {
            ctx.logger.debug('Processing webhook', { event });
        }

        // Use apiUrl...
    }
})
```

## Debugging

### Logging

Use structured logging for better debugging:

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

builtin.triggers.onWebhook({
    handler: (ctx, event) => {
        // Log request details
        ctx.logger.info('Webhook received', {
            path: event.path,
            method: event.method,
            userAgent: event.headers['user-agent'],
            bodySize: JSON.stringify(event.body).length
        });

        try {
            const result = processData(event.body);

            ctx.logger.info('Processing completed', {
                result: result.id,
                processingTime: Date.now() - start
            });

            return result;
        } catch (error) {
            ctx.logger.error('Processing failed', {
                error: error.message,
                stack: error.stack,
                input: event.body
            });

            throw error;
        }
    }
})
```

### Testing Webhooks

Use curl or tools like Postman to test your webhooks:

```bash
# Test basic webhook (locally)
curl -X POST http://localhost:3000/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test with your deployed webhook URL
curl -X POST https://app.usefloww.dev/webhook/w_abc123/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test with headers
curl -X POST http://localhost:3000/webhooks/secure \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"data": "test"}'

# Test with query parameters
curl -X POST "http://localhost:3000/webhooks/process?userId=123&action=update" \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

### Testing Cron Jobs

For testing cron triggers, use short intervals during development:

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

// Development - every 10 seconds
builtin.triggers.onCron({
    expression: "*/10 * * * * *",
    handler: (ctx, event) => {
        if (process.env.DEBUG === 'true') {
            ctx.logger.debug('Cron test trigger');
        }
        // Your logic here
    }
})

// Production - every hour
// Change to: "0 0 * * *"
```

## Error Handling

### Graceful Error Handling

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

builtin.triggers.onWebhook({
    handler: async (ctx, event) => {
        try {
            // Main processing logic
            const result = await processRequest(event.body);
            return { success: true, data: result };

        } catch (error) {
            // Log the error with context
            ctx.logger.error('Request processing failed', {
                error: error.message,
                requestId: event.headers['x-request-id'],
                userId: event.body?.userId
            });

            // Return appropriate error response
            if (error.code === 'VALIDATION_ERROR') {
                throw new WebhookError(400, 'Invalid request data');
            }

            if (error.code === 'NOT_FOUND') {
                throw new WebhookError(404, 'Resource not found');
            }

            // Generic server error
            throw new WebhookError(500, 'Internal server error');
        }
    }
})
```

### Retry Logic for Cron Jobs

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

builtin.triggers.onCron({
    expression: "0 */2 * * *", // Every 2 hours
    handler: async (ctx, event) => {
        const maxRetries = 3;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                await performTask();
                ctx.logger.info('Task completed successfully');
                break;

            } catch (error) {
                retries++;
                ctx.logger.warn('Task failed, retrying', {
                    attempt: retries,
                    maxRetries,
                    error: error.message
                });

                if (retries >= maxRetries) {
                    ctx.logger.error('Task failed after all retries', {
                        error: error.message
                    });
                    // Could send alert here
                } else {
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 1000 * retries));
                }
            }
        }
    }
})
```

## Performance Tips

### Lightweight Handlers

Keep handlers fast and lightweight:

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

// Good - lightweight handler
builtin.triggers.onWebhook({
    handler: async (ctx, event) => {
        // Quick validation
        if (!event.body.id) {
            throw new WebhookError(400, 'Missing ID');
        }

        // Queue heavy processing
        await enqueueJob('process-data', event.body);

        return { queued: true };
    }
})

// Avoid - heavy processing in handler
builtin.triggers.onWebhook({
    handler: async (ctx, event) => {
        // This blocks other requests
        await heavyDatabaseOperation();
        await sendEmailsToAllUsers();
        await generateReport();
        return { completed: true };
    }
})
```

### Use Storage for State

```typescript
import { getProvider } from "floww";

const builtin = getProvider("builtin");

builtin.triggers.onWebhook({
    handler: async (ctx, event) => {
        // Store processing state
        await ctx.storage.set(`request:${event.body.id}`, {
            status: 'processing',
            startTime: Date.now()
        });

        try {
            const result = await processData(event.body);

            await ctx.storage.set(`request:${event.body.id}`, {
                status: 'completed',
                result,
                completedTime: Date.now()
            });

            return result;
        } catch (error) {
            await ctx.storage.set(`request:${event.body.id}`, {
                status: 'failed',
                error: error.message,
                failedTime: Date.now()
            });

            throw error;
        }
    }
})
```

## Production Deployment

When ready for production:

```bash
# Deploy to Floww cloud
floww deploy

# View logs
floww logs [workflow-id]           # Recent logs
floww logs [workflow-id] --follow  # Live tail
```

See the [Deployment](/docs/getting-started/quick-start#deployment) guide for more details.
