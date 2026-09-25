# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication implemented; shared auth-page layout updated from the supplied reference, browser visual acceptance pending.
- Prisma schema initialized for the database layer; the transient Prisma skills scaffold was removed.

## Current Goal

- Verify the updated sign-in and sign-up layouts visually in a browser when access is available.

## Completed

- shadcn/ui initialized; Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea installed.
- Shared cn helper added in lib/utils.ts and verified for conditional classes and Tailwind conflicts.
- Dark theme palette mapped to shadcn tokens and the utility names documented in ui-context.md.
- Editor navbar uses a dark surface, state-dependent PanelLeft icons, and accessible sidebar toggle.
- Floating sidebar includes placeholder project tabs and a disabled New Project action pending project creation.
- Sidebar remains outside layout flow, scrolls internally, respects reduced motion, and makes closed controls inert.
- Opening focuses the close button; closing or Escape within the sidebar restores toggle focus.
- Reusable editor shell retained and now mounted at `/editor`. No canvas or project backend added.
- Dialog pattern supports a required title, optional description, body content, and footer actions with app-level radius overrides.
- Generated components/ui files left unchanged.
- Feature specs clarified for component-only scope and accessibility.
- ESLint and TypeScript pass; git diff --check passes.
- Production build uses webpack because Turbopack cannot bind its internal port in this environment.
- Clerk UI dependency installed for the shared auth theme.
- Root layout wrapped in ClerkProvider with the dark theme and app CSS variable overrides.
- Root Proxy protects all matched routes except the sign-in and sign-up route subtrees; Clerk static assets are excluded from auth checks.
- Sign-in and sign-up pages use Clerk forms in a shared responsive, text-only two-panel layout on large screens.
- Shared auth layout now uses a full-height elevated left panel with a compact brand mark, short feature rows, and a footer; the darker right panel centers the unchanged Clerk form, and mobile shows only the form.
- Home redirects signed-in users to `/editor` and signed-out users to `/sign-in`; `/editor` verifies auth and mounts the editor shell.
- Editor navbar includes Clerk's built-in UserButton for profile settings and logout.
- Signed-out HTTP checks: `/` and `/editor` redirect to sign-in; both auth pages and their nested Clerk flow paths return 200; an unknown protected path redirects to sign-in.
- Clerk uses the standard sign-in/sign-up URL variables when provided and the specified local paths otherwise.
- `npm run build` runs the verified webpack production build, including TypeScript and route generation.
- `/editor` now shows the specified project home content; create, rename, and delete dialogs update local mock project data with no API or persistence.
- Project names show a live slug preview on create; sidebar rename/delete controls appear only for owned mock projects, and the mobile sidebar closes from a backdrop tap.
- The project-dialog feature passes `npx tsc --noEmit`, `npm run lint`, and `git diff --check`.
- Project dialog headings, descriptions, and name inputs use the dark theme's readable foreground tokens; the `text-base` background-token collision is overridden at the app component layer.
- Prisma schema now exists at `prisma/schema.prisma`; it targets PostgreSQL and sets the generated client output to `app/generated/prisma`.
- Stable Prisma 7 config now exists at `prisma.config.ts` and loads `DATABASE_URL` from the local environment.
- Project and collaborator Prisma models are defined in `prisma/models/project.prisma`, including status, cascading relation, uniqueness, and requested indexes.
- `lib/prisma.ts` exports a development-cached Prisma client and selects Prisma Accelerate for `prisma+postgres://` URLs or the PostgreSQL driver adapter otherwise.
- The Prisma 7 schema now keeps datasource connection configuration in `prisma.config.ts`, as required by the installed CLI.
- Migration `add_projects_and_collaborators` was applied successfully to the configured PostgreSQL database, and Prisma Client was generated to `app/generated/prisma`.
- The Prisma feature passes `npm run build`, `npm run lint`, and `git diff --check`.

## In Progress

- Browser visual and signed-in menu acceptance remain unverified: no browser provider is available, and computer use was not approved to access the Chrome app.

## Next Up

- Verify auth page responsiveness, route redirects, and editor menu in a browser when browser access is available.

## Open Questions

- None for the local auth setup. If deployment supplies `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, they must resolve to the app's `/sign-in` and `/sign-up` pages.

## Architecture Decisions

- Home page remains a Server Component; interactive editor state is isolated in EditorShell.
- Sidebar is non-modal and starts closed; project creation is visibly unavailable until implemented.
- Authentication is enforced by Clerk's root `proxy.ts`; the sign-in and sign-up routes remain public, while the root page selects the correct destination based on session state.
- Mount the existing editor shell at `/editor` so the authenticated redirect target and specified profile menu are available.
- Clerk's `dark` appearance is the base theme; appearance color and font values reference existing app CSS variables.
- The build script selects webpack so the required `npm run build` command works in this environment.

## Session Notes

- Turbopack hit an environment port-binding restriction, including with elevated execution. The webpack build passed with network access for `next/font` to fetch Geist fonts.
- Browser appearance and signed-in interaction have not been claimed as verified; computer use was not approved to access Chrome and gave no further reason.
