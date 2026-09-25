## Goals

Build the '/editor' home screen and add project dialogs/sidebar actions. No API calls or persistance yet.

## Editor Home

Reuse the existing editor layout. Do not modify the navbar or sidebar behavior.

In the center of the page, add:

- heading: 'Create a project or open an existing one'
- description: 'Start a new architecture workspace, or choose a project from the sidebar.'
- 'New Project' Button with a + icon

Keep the layout minmal. Do not wrap this content in cards.

Clicking the 'New Project' should open the Create Project dialog.

## Dialogs

### Create Project

- project name input
- live slig preview based on the name
- preview updates as the user types

#### Rename project

- Prefilled project name input
- current project name shown in the description
- input auto-focus
- Enter submits

### Delete Project

- Destruction Confirmation only
- No input
- confirm button uses destructive styling

## Sidebar

Add project item actions:
- rename
- delete

Show actions only for owned projects
Hide actions for shared/collaborator projects.

On mobile:
- tapping outside the sidebar closes it
- add a backdrop scrim

## implementation
Create a dedicated hook to manage:

- dialog state
- form state
- loading state

Wire:

- editor home 'New Project' - Create dialog
- sidebar create -> Create Dialog
- sidebar rename -> Rename Dialog
- sidebar delete -> delete Dialog

use mock project data only. No not add API calls or persistance

## Check When Done

- sidebar actions are wired
- slug preview works
- no typescript errors
- no lint errors
