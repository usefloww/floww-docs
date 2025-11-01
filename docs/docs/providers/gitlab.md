# GitLab

Integrate with GitLab projects and handle repository events.

```typescript
import { Gitlab } from "floww";
const gitlab = new Gitlab('your-access-token');
```

## Setup

1. Go to GitLab → User Settings → Access Tokens
2. Create a token with `api` scope
3. Use the token when initializing the provider

## Push Event Trigger

**Purpose**: React to code pushes to repositories
**Use cases**: CI/CD automation, deployment triggers, code review automation, build notifications

```typescript
gitlab.triggers.onPushEvent({
  handler: (ctx, event) => {
    console.log(`Push to ${event.project.name} on ${event.ref}`);
    console.log(`${event.commits.length} new commits`);
  },
  projectId: 'your-project-id', // optional - filter to specific project
  branch: 'main' // optional - filter to specific branch
})
```

### Options

- `projectId` - Only trigger for specific project
- `branch` - Only trigger for specific branch (e.g., 'main', 'develop')

### Event Data

- `event.project` - Project information
- `event.ref` - Branch reference (e.g., 'refs/heads/main')
- `event.commits` - Array of commit objects
- `event.repository` - Repository details

## Merge Request Event Trigger

**Purpose**: Handle merge request lifecycle events
**Use cases**: Review automation, status checks, approval workflows, notifications

```typescript
gitlab.triggers.onMergeRequestEvent({
  handler: (ctx, event) => {
    const { action, title } = event.object_attributes;
    console.log(`MR ${action}: ${title}`);
  },
  projectId: 'your-project-id', // optional
  action: 'open' // optional - filter by action
})
```

### Options

- `projectId` - Only trigger for specific project
- `action` - Filter by specific actions: `open`, `close`, `merge`, `update`, `approved`, etc.

### Event Data

- `event.object_attributes` - MR details (title, description, state, action)
- `event.user` - User who triggered the event
- `event.project` - Project information
- `event.assignee` - Assigned user (if any)

## Issue Event Trigger

**Purpose**: Track issue changes and lifecycle
**Use cases**: Project management automation, notifications, workflow integration

```typescript
gitlab.triggers.onIssueEvent({
  handler: (ctx, event) => {
    const { action, title } = event.object_attributes;
    console.log(`Issue ${action}: ${title}`);
  },
  projectId: 'your-project-id', // optional
  action: 'open' // optional
})
```

### Options

- `projectId` - Only trigger for specific project
- `action` - Filter by specific actions: `open`, `close`, `update`, `reopen`

### Event Data

- `event.object_attributes` - Issue details (title, description, state, action)
- `event.user` - User who triggered the event
- `event.project` - Project information
- `event.assignee` - Assigned user (if any)
- `event.labels` - Issue labels

## Utilities

The GitLab provider also includes utility methods for interacting with the GitLab API:

### `getProject(projectId)`

Fetch project details:

```typescript
const project = await gitlab.getProject('project-id');
console.log(project.name, project.description);
```

### `createIssue(projectId, options)`

Create new issues programmatically:

```typescript
const issue = await gitlab.createIssue('project-id', {
  title: 'Bug Report',
  description: 'Description of the bug',
  labels: ['bug', 'urgent'],
  assignee_id: 123
});
```

### `updateMergeRequest(projectId, mrId, options)`

Update merge request status:

```typescript
await gitlab.updateMergeRequest('project-id', 123, {
  state_event: 'merge', // or 'close'
  merge_commit_message: 'Custom merge message'
});
```
