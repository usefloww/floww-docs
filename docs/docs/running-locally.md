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
- Runs on `localhost:3000` by default

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
import { Builtin } from "floww";
import { githubWorkflows } from "./workflows/github";
import { calendarWorkflows } from "./workflows/calendar";

const builtin = new Builtin();

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
import { Gitlab } from "floww";

const gitlab = new Gitlab(process.env.GITLAB_TOKEN);

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

## Environment Configuration

Use environment variables for configuration:

```typescript
// .env file
GITLAB_TOKEN=your_token_here
API_URL=https://api.example.com
DEBUG=true
```

```typescript
// In your workflow
builtin.triggers.onWebhook({
    handler: (ctx, event) => {
        const apiUrl = ctx.config.get('API_URL');
        const debug = ctx.config.has('DEBUG');

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
# Test basic webhook
curl -X POST http://localhost:3000/webhooks/test \
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
// Development - every 10 seconds
builtin.triggers.onCron({
    expression: "*/10 * * * * *",
    handler: (ctx, event) => {
        if (ctx.config.has('DEBUG')) {
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
# Production mode
floww start main.ts

# With custom settings
floww start main.ts --port 3000 --host 0.0.0.0
```

**Production differences:**
- No auto-reload
- Optimized performance
- Structured logging
- Listens on all interfaces by default