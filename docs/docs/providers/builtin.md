# Builtin

Core triggers available in every Floww installation. No additional setup required.

```typescript
import { getProvider } from "floww";
```

## Webhook Trigger

**Purpose**: Handle HTTP requests at custom endpoints
**Use cases**: API webhooks, form submissions, service integrations, external callbacks

```typescript
builtin.triggers.onWebhook({
  handler: (ctx, event) => {
    // Process the incoming request
    return { success: true };
  },
  path: '/my-endpoint'
})
```

### Configuration

- **`path`** - Endpoint path (becomes `/webhooks{path}`)
- **`method`** - HTTP method (GET, POST, PUT, DELETE, PATCH) - default: POST
- **`validation`** - Optional function to validate requests before processing

### HTTP Methods

- **GET** - Status checks, simple triggers
- **POST** - Most webhooks, data submission
- **PUT/PATCH** - Update operations
- **DELETE** - Deletion callbacks

### Validation

Secure your endpoints with validation:

```typescript
builtin.triggers.onWebhook({
  validation: (event) => event.headers['x-api-key'] === process.env.API_KEY,
  handler: (ctx, event) => {
    // Only runs if validation passes
  }
})
```

### Event Data

- `event.body` - Request body (parsed JSON)
- `event.headers` - HTTP headers
- `event.query` - Query parameters
- `event.method` - HTTP method
- `event.path` - Request path

### Type Safety

```typescript
interface MyPayload {
  action: string;
  data: { id: string; name: string; };
}

builtin.triggers.onWebhook<MyPayload>({
  handler: (ctx, event) => {
    // event.body is typed as MyPayload
    console.log(event.body.action, event.body.data.name);
  }
})
```

## Cron Trigger

**Purpose**: Execute code on schedules
**Use cases**: Cleanup tasks, reports, data synchronization, monitoring, backups

```typescript
builtin.triggers.onCron({
  expression: "0 9 * * 1-5", // 9 AM on weekdays
  handler: (ctx, event) => {
    // Run scheduled task
  }
})
```

### Cron Expressions

Format: `second minute hour day month dayOfWeek` (second is optional)

**Common patterns**:
- `"*/30 * * * * *"` - Every 30 seconds
- `"0 */15 * * *"` - Every 15 minutes
- `"0 0 2 * *"` - Daily at 2 AM
- `"0 0 9 * 1-5"` - Weekdays at 9 AM
- `"0 0 12 1 *"` - Monthly on 1st at noon

### Event Data

- `event.timestamp` - When the job triggered
- `event.expression` - The cron expression used

## Error Handling

### Webhook Errors

Return appropriate HTTP status codes:

```typescript
builtin.triggers.onWebhook({
  handler: async (ctx, event) => {
    try {
      return await processData(event.body);
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        throw new WebhookError(400, 'Invalid data');
      }
      throw new WebhookError(500, 'Processing failed');
    }
  }
})
```

### Cron Errors

Handle failures gracefully to avoid breaking schedules:

```typescript
builtin.triggers.onCron({
  expression: "0 0 * * *",
  handler: async (ctx, event) => {
    try {
      await criticalTask();
    } catch (error) {
      ctx.logger.error('Task failed', { error });
      await sendAlert(error.message);
      // Don't re-throw to keep cron running
    }
  }
})
```