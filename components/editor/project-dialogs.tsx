"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DialogPattern from "@/components/editor/dialog-pattern";
import { createProjectSlug, type ProjectDialogState } from "@/components/editor/use-project-dialogs";

interface ProjectDialogsProps {
  dialog: ProjectDialogState;
  activeProject?: { id: string; name: string };
  projectName: string;
  setProjectName: (name: string) => void;
  isLoading: boolean;
  onClose: () => void;
  onSubmitProjectName: (event: React.FormEvent<HTMLFormElement>) => void;
  onConfirmDelete: () => void;
}

export default function ProjectDialogs({
  dialog,
  activeProject,
  projectName,
  setProjectName,
  isLoading,
  onClose,
  onSubmitProjectName,
  onConfirmDelete,
}: ProjectDialogsProps) {
  const isOpen = dialog !== null;
  const isNameDialog = dialog?.type === "create" || dialog?.type === "rename";
  const slug = createProjectSlug(projectName);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {isNameDialog && (
        <DialogPattern
          title={dialog.type === "create" ? "Create Project" : "Rename Project"}
          description={dialog.type === "rename" ? `Rename “${activeProject?.name ?? "project"}”.` : undefined}
          footer={
            <>
              <Button type="button" variant="outline" className="rounded-xl" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="project-name-form"
                className="rounded-xl"
                disabled={!projectName.trim() || !slug || isLoading}
              >
                {dialog.type === "create" ? "Create Project" : "Save Changes"}
              </Button>
            </>
          }
        >
          <form id="project-name-form" onSubmit={onSubmitProjectName} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium text-copy-secondary">Project name</label>
              <Input
                id="project-name"
                autoFocus={dialog.type === "rename"}
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. Payments Platform"
                className="text-copy-primary placeholder:text-copy-muted"
                maxLength={80}
                required
              />
            </div>
            {dialog.type === "create" && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-copy-muted">Slug preview</p>
                <p aria-live="polite" className="min-h-5 rounded-xl border border-surface-border bg-base px-3 py-2 font-mono text-xs text-copy-secondary">
                  {slug || "your-project-name"}
                </p>
              </div>
            )}
          </form>
        </DialogPattern>
      )}
      {dialog?.type === "delete" && (
        <DialogPattern
          title="Delete Project"
          description={`Are you sure you want to delete “${activeProject?.name ?? "this project"}”? This action cannot be undone.`}
          footer={
            <>
              <Button type="button" variant="outline" className="rounded-xl" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" className="rounded-xl" onClick={onConfirmDelete} disabled={isLoading}>
                Delete Project
              </Button>
            </>
          }
        />
      )}
    </Dialog>
  );
}
