# Google Calendar

Respond to calendar events and manage schedules.

```typescript
import { GoogleCalendar } from "@developerflows/floww-sdk";
const calendar = new GoogleCalendar('user@example.com');
```

## Setup

1. Create a Google Cloud project
2. Enable the Calendar API
3. Set up OAuth2 credentials
4. Configure the provider with user email

## Event Start Trigger

**Purpose**: Execute when calendar events begin
**Use cases**: Meeting reminders, room setup, attendance tracking, automated check-ins

```typescript
calendar.triggers.onEventStart({
  handler: (ctx, event) => {
    console.log(`Event starting: ${event.summary}`);
    console.log(`Attendees: ${event.attendees?.length || 0}`);
  },
  calendarId: 'primary', // optional
  beforeMinutes: 5 // optional - trigger N minutes before start
})
```

### Options

- `calendarId` - Specific calendar to monitor (default: 'primary')
- `beforeMinutes` - Trigger N minutes before event starts (useful for reminders)

### Event Data

- `event.summary` - Event title
- `event.description` - Event description
- `event.start` - Start time
- `event.end` - End time
- `event.attendees` - Array of attendee objects
- `event.location` - Event location
- `event.creator` - Event creator details

## Event End Trigger

**Purpose**: Execute when calendar events conclude
**Use cases**: Cleanup tasks, follow-up actions, time tracking, room cleanup

```typescript
calendar.triggers.onEventEnd({
  handler: (ctx, event) => {
    console.log(`Event ended: ${event.summary}`);
    // Trigger follow-up actions
  },
  calendarId: 'primary' // optional
})
```

### Options

- `calendarId` - Specific calendar to monitor (default: 'primary')

### Event Data

Same as Event Start Trigger - includes all event details.

## Event Created Trigger

**Purpose**: React to new event creation
**Use cases**: Notifications, resource booking, conflict detection, approval workflows

```typescript
calendar.triggers.onEventCreated({
  handler: (ctx, event) => {
    console.log(`New event created: ${event.summary}`);
    console.log(`Creator: ${event.creator?.email}`);
  },
  calendarId: 'primary' // optional
})
```

### Options

- `calendarId` - Specific calendar to monitor (default: 'primary')

### Event Data

Same as other triggers - includes all event details plus creator information.

## Utilities

The Google Calendar provider includes utility methods for calendar management:

### `getEvents(options)`

Fetch calendar events:

```typescript
const events = await calendar.getEvents({
  timeMin: new Date(),
  timeMax: new Date(Date.now() + 24 * 60 * 60 * 1000), // next 24 hours
  maxResults: 10,
  calendarId: 'primary'
});
```

### `createEvent(event)`

Create new calendar events:

```typescript
const event = await calendar.createEvent({
  summary: 'Team Meeting',
  description: 'Weekly team sync',
  start: { dateTime: '2024-01-15T10:00:00Z' },
  end: { dateTime: '2024-01-15T11:00:00Z' },
  attendees: [
    { email: 'attendee@example.com' }
  ],
  location: 'Conference Room A'
});
```

### `updateEvent(eventId, updates)`

Modify existing events:

```typescript
await calendar.updateEvent('event-id', {
  summary: 'Updated Meeting Title',
  location: 'Conference Room B'
});
```

### `deleteEvent(eventId)`

Remove events:

```typescript
await calendar.deleteEvent('event-id');
```
