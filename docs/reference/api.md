# API Reference

Utilities and error handling for building Floww workflows.

## Context API

Available in all trigger handlers via the `ctx` parameter.

```typescript
interface Context {
  logger: Logger;    // Structured logging
  config: Config;    // Environment variables
  metrics: Metrics;  // Performance tracking
  storage: Storage;  // Persistent key-value store
}
```

### Logger

```typescript
ctx.logger.info('Processing request', { userId: '123' });
ctx.logger.warn('Rate limit approaching', { remaining: 5 });
ctx.logger.error('Operation failed', { error: error.message });
```

### Config

```typescript
const apiUrl = ctx.config.get('API_URL');
const port = ctx.config.get('PORT', 3000); // with default
const isDev = ctx.config.has('DEBUG');
```

### Metrics

```typescript
ctx.metrics.increment('requests.processed');
ctx.metrics.gauge('active_users', getUserCount());

const timer = ctx.metrics.timer('api.response_time');
await callAPI();
timer.end();
```

### Storage

```typescript
await ctx.storage.set('user:123', { name: 'John', lastSeen: Date.now() });
const user = await ctx.storage.get('user:123');
const exists = await ctx.storage.has('user:123');
await ctx.storage.delete('user:123');
```

## Error Classes

### WebhookError

Return specific HTTP status codes from webhook handlers:

```typescript
import { WebhookError } from '@developerflows/floww-sdk';

builtin.triggers.onWebhook({
  handler: (ctx, event) => {
    if (!event.body.email) {
      throw new WebhookError(400, 'Email required');
    }

    if (!isValidUser(event.body.email)) {
      throw new WebhookError(404, 'User not found');
    }

    return { success: true };
  }
})
```

### ValidationError & ExecutionError

```typescript
import { ValidationError, ExecutionError } from '@developerflows/floww-sdk';

// For input validation
if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format');
}

// Catch execution errors
try {
  await executeUserProject({ files, entryPoint });
} catch (error) {
  if (error instanceof ExecutionError) {
    console.log('Code execution failed:', error.originalStack);
  }
}
```

## Utility Functions

### `validateSchema(data, schema)`

Validate data against JSON schemas:

```typescript
import { validateSchema } from '@developerflows/floww-sdk';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  required: ['name', 'email']
};

const validation = validateSchema(userData, schema);
if (!validation.valid) {
  throw new WebhookError(400, 'Invalid data', { errors: validation.errors });
}
```

### Testing Utilities

Mock events and context for testing:

```typescript
import { mockWebhookEvent, mockCronEvent, createMockContext } from '@developerflows/floww-sdk';

// Mock webhook event
const event = mockWebhookEvent({
  body: { message: 'test' },
  headers: { 'x-api-key': 'secret' }
});

// Mock cron event
const cronEvent = mockCronEvent({
  expression: '0 9 * * *',
  timestamp: new Date()
});

// Mock context
const ctx = createMockContext({
  config: new Map([['API_URL', 'http://test.com']]),
  storage: new Map([['key', 'value']])
});
```

## Type Definitions

### Event Types

```typescript
interface WebhookEvent<TBody = any> {
  body: TBody;
  headers: Record<string, string>;
  query: Record<string, string>;
  method: string;
  path: string;
}

interface CronEvent {
  timestamp: Date;
  expression: string;
}
```

### Handler Types

```typescript
type WebhookHandler<TBody = any> = (
  ctx: Context,
  event: WebhookEvent<TBody>
) => Promise<any> | any;

type CronHandler = (
  ctx: Context,
  event: CronEvent
) => Promise<void> | void;
```