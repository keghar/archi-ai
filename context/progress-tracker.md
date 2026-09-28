# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication implemented; shared auth-page layout updated from the supplied reference, browser visual acceptance pending.
- Prisma feature 05 implemented and audited: project models, cached client, generated client, and first applied migration are complete.
- Project API feature 06 implemented and audited: production build, lint, 29 mocked handler/proxy checks, and live signed-out HTTP checks pass.
- Editor home feature 07 implemented: owned/shared projects load server-side, dialogs call the project API, unique room IDs persist, and workspaces route by room ID.

## Current Goal

- Verify signed-in editor project flows and auth page responsiveness in a browser when access is available.

## Completed

- shadcn/ui initialized; Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea installed.
- Shared cn helper added in lib/utils.ts and verified for conditional classes and Tailwind conflicts.
- Dark theme palette mapped to shadcn tokens and the utility names documented in ui-context.md.
- Editor navbar uses a dark surface, state-dependent PanelLeft icons, and accessible sidebar toggle.
- Floating sidebar shows server-loaded owned and shared projects and opens each project workspace.
- Sidebar remains outside layout flow, scrolls internally, respects reduced motion, and makes closed controls inert.
- Opening focuses the close button; closing or Escape within the sidebar restores toggle focus.
- Reusable editor shell is mounted at `/editor` and `/editor/[roomId]`; canvas implementation remains out of scope for this feature.
- Dialog pattern supports a required title, optional description, body content, and footer actions with app-level radius overrides.
- Generated components/ui files left unchanged.
- Feature specs clarified for component-only scope and accessibility.
- ESLint and TypeScript pass; git diff --check passes.
- Production build uses webpack because Turbopack cannot bind its internal port in this environment.
- Clerk UI dependency installed for the shared auth theme.
- Root layout wrapped in ClerkProvider with the dark theme and app CSS variable overrides.
- Root Proxy protects matched page routes except the sign-in and sign-up route subtrees; API handlers enforce their own authentication, and Clerk static assets are excluded from auth checks.
- Sign-in and sign-up pages use Clerk forms in a shared responsive, text-only two-panel layout on large screens.
- Shared auth layout now uses a full-height elevated left panel with a compact brand mark, short feature rows, and a footer; the darker right panel centers the unchanged Clerk form, and mobile shows only the form.
- Home redirects signed-in users to `/editor` and signed-out users to `/sign-in`; `/editor` verifies auth and mounts the editor shell.
- Editor navbar includes Clerk's built-in UserButton for profile settings and logout.
- Signed-out HTTP checks: `/` and `/editor` redirect to sign-in; both auth pages and their nested Clerk flow paths return 200; an unknown protected path redirects to sign-in.
- Clerk uses the standard sign-in/sign-up URL variables when provided and the specified local paths otherwise.
- `npm run build` runs the verified webpack production build, including TypeScript and route generation.
- The project home has create, rename, and delete dialogs wired to the project API, with server data refreshed after mutations.
- Project names show a live room ID preview on create; sidebar rename/delete controls appear only for owned projects, and the mobile sidebar closes from a backdrop tap.
- The project-dialog feature passes `npx tsc --noEmit`, `npm run lint`, and `git diff --check`.
- Project dialog headings, descriptions, and name inputs use the dark theme's readable foreground tokens; the `text-base` background-token collision is overridden at the app component layer.
- Prisma schema now exists at `prisma/schema.prisma`; it targets PostgreSQL and sets the generated client output to `app/generated/prisma`.
- Stable Prisma 7 config now exists at `prisma.config.ts` and loads `DATABASE_URL` from the local environment.
- Project and collaborator Prisma models are defined in `prisma/models/project.prisma`, including status, cascading relation, uniqueness, and requested indexes.
- `lib/prisma.ts` exports a development-cached Prisma client and selects Prisma Accelerate for `prisma+postgres://` URLs or the PostgreSQL driver adapter otherwise.
- The Prisma 7 schema now keeps datasource connection configuration in `prisma.config.ts`, as required by the installed CLI.
- Migration `add_projects_and_collaborators` was applied successfully to the configured PostgreSQL database, and Prisma Client was generated to `app/generated/prisma`.
- The Prisma feature passes `npm run build`, `npm run lint`, and `git diff --check`.
- Prisma spec audit: schema validation and a fresh production build pass; migration status is up to date, and the live database has no schema drift. The application singleton successfully queried both models without changing data.
- Runtime checks confirm development module reloads reuse one client, the Accelerate branch uses HTTP transport with a mocked response, and a missing `DATABASE_URL` fails clearly.
- Feature 06 adds `GET` and `POST /api/projects` plus `PATCH` and `DELETE /api/projects/[projectId]`. All routes return 401 without a Clerk user; listing and creation use that user's ID as `ownerId`, and rename/delete return 403 for projects owned by another user.
- Project creation defaults an omitted name to `Untitled Project`; create/rename validate JSON and non-empty names. Unknown project IDs return 404; successful creation returns 201 and deletion returns 204.
- The Clerk proxy leaves `/api/*` authentication responses to their route handlers so unauthenticated API requests receive the specified JSON 401 response.
- Feature 06 passes `npm run build`; Next.js recognizes both project API routes and TypeScript completes successfully.
- Feature 06 acceptance audit found no spec deviations. All 29 checks against the actual handlers/proxy with mocked Clerk and Prisma pass, covering authenticated owner filtering, default naming, schema-generated IDs, ignored caller-supplied ownership/IDs, input validation, owner mutations, 403 denial without mutations, 404 responses, and proxy dispatch.
- Live signed-out requests through the production server and Clerk proxy return JSON 401 without redirects for GET, POST, PATCH, and DELETE. Fresh `npm run build`, `npm run lint`, and `git diff --check` pass. Signed-in Clerk/database integration was not exercised; mutation checks used mocks and made no database writes.
- Feature 07 adds a server-only project data helper that authenticates the current user and loads owner projects plus projects shared with verified Clerk email addresses. The `/editor` page passes both lists through to the sidebar without client-side initial fetching.
- Create now previews a lowercase slug plus short random suffix, sends that room ID to `POST /api/projects`, and opens `/editor/[roomId]`. The API validates uniqueness and persists the room ID.
- Project workspaces resolve only for owners or collaborators. Sidebar project links open the room route; rename refreshes server data, and deleting the active project returns to `/editor` while other deletes refresh.
- Migration `20260927120000_add_project_room_id` backfilled and uniquely indexed stable room IDs for existing projects; it was applied successfully to the configured PostgreSQL database.
- Feature 07 passes `npm run build`, `npm run lint`, and `git diff --check`.
- Feature 07 audit: development Prisma caching now checks the generated client's constructor and disconnects obsolete instances after regeneration, fixing reuse of a client that does not know about `roomId`. `predev` and `prebuild` regenerate Prisma Client before starting Next.js.
- Project summaries now have one shared contract in `types/project.ts`. Authenticated queries remain in `lib/projects.ts`, request/response handling lives in `lib/project-api.ts`, and interactive mutation state lives in `hooks/use-project-actions.ts`.
- Successful creation closes and resets the dialog before navigating. Mutation requests reject duplicate submissions, report API errors (including non-JSON responses), and retain form state after failure. Room ID conflicts generate a fresh preview for retry.
- Renaming accepts non-ASCII display names without changing room identity. Create previews use the exact submitted room ID, including a safe fallback for names with no ASCII slug. Active-project deletion replaces the workspace route with `/editor` and refreshes its project lists.
- The editor's `text-base` typography collision and raw backdrop color were corrected using documented theme utilities. Generated UI foundation components were not edited.
- Audit validation: a fresh production build (including Prisma generation and TypeScript), lint, and whitespace checks pass. Behavioral regression tests and signed-in runtime acceptance were not completed; see Session Notes.

## In Progress

- Browser visual and signed-in project-flow acceptance remain unverified: computer use was not approved to access Chrome. The read-only database query was blocked by the sandbox, and the request to rerun it outside the sandbox was declined.

## Next Up

- Verify signed-in editor project flows and auth page responsiveness in a browser when access is available.

## Open Questions

- None for the local auth setup. If deployment supplies `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, they must resolve to the app's `/sign-in` and `/sign-up` pages.

## Architecture Decisions

- Home page remains a Server Component; interactive editor state is isolated in EditorShell.
- Sidebar is non-modal and starts closed; project creation and management use the authenticated project API.
- Clerk's root `proxy.ts` establishes session context and protects page routes; project API handlers call `auth()` directly and return JSON 401 when signed out. The sign-in and sign-up routes remain public, while the root page selects the correct destination based on session state.
- Mount the existing editor shell at `/editor` so the authenticated redirect target and specified profile menu are available.
- Clerk's `dark` appearance is the base theme; appearance color and font values reference existing app CSS variables.
- The build script selects webpack so the required `npm run build` command works in this environment.
- Each project persists a unique slug-plus-random-suffix room ID; editor workspace routes use `/editor/[roomId]`, and the room ID remains stable across renames.

## Session Notes

- Feature 07 audit: the supplied runtime error listed the old Project fields without `roomId`, while the generated client on disk and a fresh type check included it. `lib/prisma.ts` previously reused `globalThis.prisma` without checking whether its generated constructor had changed.
- The temporary behavioral regression-test file write was rejected, so that file was not created and those checks were not run. A standalone read-only Prisma query could not start because the sandbox blocked tsx's IPC pipe; the escalation was declined. No database changes were made during this audit.
- API HTTP verification uses `next start --hostname localhost`: binding to `127.0.0.1` caused a mismatch with Clerk's `localhost` rewrite and a proxy loop during this audit. Matching the host resolved it without application changes.
- Prisma spec identifiers corrected from `DTATBASE_URL` and `prisma+postgress://` to `DATABASE_URL` and `prisma+postgres://`. No implementation changes were needed during the acceptance audit. A live Accelerate connection was not checked because the configured URL uses direct PostgreSQL.
- Turbopack hit an environment port-binding restriction, including with elevated execution. The webpack build passed with network access for `next/font` to fetch Geist fonts.
- Browser appearance and signed-in interaction have not been claimed as verified; computer use was not approved to access Chrome and gave no further reason.
