# GitLab

Integrate with GitLab projects and handle repository events.

```typescript
import { getProvider } from "floww";
const gitlab = getProvider("gitlab");
```

## Setup

### Automatic Configuration

Floww automatically detects when you use the GitLab provider. When you run `floww dev` for the first time, you'll be prompted to configure it:

```bash
$ floww dev

⚠ Provider "gitlab" with alias "default" not found in namespace
? Would you like to create it? (Y/n)
? GitLab Access Token: **********************
✓ Provider "gitlab:default" configured successfully
```

### Creating a GitLab Access Token

1. Go to GitLab → User Settings → Access Tokens
2. Create a token with `api` scope
3. Copy the token - you'll need it during setup

### Multiple GitLab Accounts

You can configure multiple GitLab accounts using aliases:

```typescript
import { getProvider } from "floww";

// Personal GitLab account
const gitlabPersonal = getProvider("gitlab", "personal");

// Work GitLab account
const gitlabWork = getProvider("gitlab", "work");

gitlabPersonal.triggers.onPushEvent({
  handler: (ctx, event) => {
    console.log(`Personal project push: ${event.project.name}`);
  }
});

gitlabWork.triggers.onPushEvent({
  handler: (ctx, event) => {
    console.log(`Work project push: ${event.project.name}`);
  }
});
```

When you run `floww dev`, you'll be prompted to configure each alias separately.

## Push Event Trigger

**Purpose**: React to code pushes to repositories
**Use cases**: CI/CD automation, deployment triggers, code review automation, build notifications

```typescript
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

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
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

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
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

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
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

const project = await gitlab.getProject('project-id');
console.log(project.name, project.description);
```

### `createIssue(projectId, options)`

Create new issues programmatically:

```typescript
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

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
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");

await gitlab.updateMergeRequest('project-id', 123, {
  state_event: 'merge', // or 'close'
  merge_commit_message: 'Custom merge message'
});
```

## Complete Example

Here's a complete workflow that handles GitLab events:

```typescript
import { getProvider } from "floww";

const gitlab = getProvider("gitlab");
const slack = getProvider("slack");

// Notify Slack on new merge requests
gitlab.triggers.onMergeRequestEvent({
  action: 'open',
  handler: async (ctx, event) => {
    const { title, url } = event.object_attributes;

    await slack.postMessage({
      channel: '#code-reviews',
      text: `🔍 New merge request: ${title}\n${url}`
    });
  }
});

// Auto-label issues based on content
gitlab.triggers.onIssueEvent({
  action: 'open',
  handler: async (ctx, event) => {
    const { title, description } = event.object_attributes;
    const text = `${title} ${description}`.toLowerCase();

    const labels = [];
    if (text.includes('bug')) labels.push('bug');
    if (text.includes('urgent') || text.includes('critical')) labels.push('urgent');

    if (labels.length > 0) {
      ctx.logger.info('Auto-labeling issue', { labels });
      // Update issue with labels...
    }
  }
});
```
