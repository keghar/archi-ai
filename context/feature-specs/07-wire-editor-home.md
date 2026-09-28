Wire the editor home sidebar and dialogs to the real project API.

## Data Fetching

The editor home page is a server component.

Fetch owned and shared projects server-side using the existing project data helper and pass both lists to the sidebar

No client-side fetching for initial load.

### 'Use Project Actions'

**Create**

- manage create dialog state
- manage project name input
- generate a short unique suffix
- slugify the name to create the room ID
- call 'POST /api/projects'
- navigate to the new workspace

The database project ID keeps the schema's existing ID strategy. The Liveblocks room ID is a separate, unique, persisted slug plus a short random suffix. Workspace routes use `/editor/[roomId]`, and renaming a project does not change its room ID.

**Rename**

- store target project
- call 'PATCH /api/projects/[id]'
- refreash on success

**Delete**

- store target project
- call 'DELETE /api/projects/[id]'
- redirect to '/editor' if deleting the active workspace
- otherwise refresh

### Wiring

Connect the hook to the other sidebar and dialogs.

- create dialog shows room ID preview
- rename dialog pre-fills current name
- delete dialog shows project name

## Check When Done

- sidebar uses real project data
- create navigates to workspace
- rename updates correctly
- delete refreshes or redirects correctly
- 'npm run build' passes
