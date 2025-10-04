# Core Concepts

Understand the fundamental concepts behind Floww workflows.

## Triggers

Triggers define **when** your code executes. They listen for events and run your handler functions.

### Types of Triggers

**Webhook Triggers** - Handle HTTP requests
- Use for: API integrations, form submissions, service callbacks
- Example: GitHub pushes, form submissions, payment notifications

**Cron Triggers** - Run on schedules
- Use for: Cleanup tasks, reports, data sync, monitoring
- Example: Daily backups, hourly health checks, weekly reports

**Event Triggers** - React to external events
- Use for: Calendar events, repository changes, issue updates
- Example: Meeting reminders, deployment automation, notifications

## Providers

Providers are collections of triggers for specific platforms. They handle authentication and provide convenient methods.

### Available Providers

**Builtin** - Always available
- Webhook and cron triggers
- No setup required

**GitLab** - Repository automation
- Push events, merge requests, issues
- Requires GitLab access token

**Google Calendar** - Schedule-based workflows
- Event start/end/creation triggers
- Requires OAuth2 setup

## Workflows

A workflow is a TypeScript file that exports an array of triggers:

```typescript
import { Builtin, Gitlab } from "@developerflows/floww-sdk";

const builtin = new Builtin();
const gitlab = new Gitlab('token');

export default [
    builtin.triggers.onWebhook({ /* ... */ }),
    gitlab.triggers.onPushEvent({ /* ... */ }),
    builtin.triggers.onCron({ /* ... */ })
]
```

## Handler Functions

Every trigger has a handler function that processes events:

```typescript
builtin.triggers.onWebhook({
    handler: (ctx, event) => {
        // ctx = context (logging, config, storage)
        // event = trigger-specific data

        ctx.logger.info('Processing webhook', { path: event.path });

        return { success: true }; // Response for webhooks
    },
    path: '/process'
})
```

### Context Object

All handlers receive a context object with utilities:

- **`ctx.logger`** - Structured logging
- **`ctx.config`** - Environment variables
- **`ctx.storage`** - Persistent key-value storage
- **`ctx.metrics`** - Performance tracking

## Event Data

Each trigger type provides different event data:

**Webhook Events**:
```typescript
{
    body: {...},        // Request body
    headers: {...},     // HTTP headers
    query: {...},       // Query parameters
    method: "POST",     // HTTP method
    path: "/webhook"    // Request path
}
```

**Cron Events**:
```typescript
{
    timestamp: Date,    // When triggered
    expression: "0 9 *" // Cron expression
}
```

## Development vs Production

**Development Mode** (`floww dev`)
- Auto-reload on file changes
- Detailed error messages
- Runs on localhost

**Production Mode** (`floww start`)
- Optimized performance
- Structured logging
- Runs on all interfaces

## Error Handling

Handle errors appropriately for each trigger type:

```typescript
// Webhook - return HTTP status codes
builtin.triggers.onWebhook({
    handler: async (ctx, event) => {
        try {
            return await processData(event.body);
        } catch (error) {
            throw new WebhookError(400, 'Invalid data');
        }
    }
})

// Cron - log errors but don't break schedule
builtin.triggers.onCron({
    handler: async (ctx, event) => {
        try {
            await criticalTask();
        } catch (error) {
            ctx.logger.error('Task failed', { error });
            // Don't re-throw to keep cron running
        }
    }
})
```

## Next Steps

- **[Running Locally](/using-floww/running-locally/)** - Development setup
- **[Builtin Provider](/reference/builtin/)** - Core triggers reference
- **[GitLab Provider](/reference/gitlab/)** - Repository automation
- **[API Reference](/reference/api/)** - Context and utilities