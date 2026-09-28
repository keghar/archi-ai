"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProject, deleteProject, ProjectApiError, renameProject } from "@/lib/project-api";
import { createProjectRoomId } from "@/lib/project-utils";
import type { ProjectSummary } from "@/types/project";

export type ProjectDialogState =
  | { type: "create"; suffix: string }
  | { type: "rename"; project: ProjectSummary }
  | { type: "delete"; project: ProjectSummary }
  | null;

export function useProjectActions(currentProjectId?: string) {
  const router = useRouter();
  const requestInFlight = useRef(false);
  const [dialog, setDialog] = useState<ProjectDialogState>(null);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isLoading || isPending;
  const name = projectName.trim();
  const roomId = dialog?.type === "create" && name
    ? createProjectRoomId(name, dialog.suffix)
    : "";
  const canSubmit = Boolean(name) && !isBusy
    && (dialog?.type === "create" || dialog?.type === "rename");

  function resetDialog() {
    setDialog(null);
    setProjectName("");
    setError(null);
  }

  function openCreateDialog() {
    if (requestInFlight.current || isBusy) return;
    setProjectName("");
    setError(null);
    setDialog({ type: "create", suffix: crypto.randomUUID().slice(0, 8) });
  }

  function openRenameDialog(project: ProjectSummary) {
    if (requestInFlight.current || isBusy) return;
    setProjectName(project.name);
    setError(null);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: ProjectSummary) {
    if (requestInFlight.current || isBusy) return;
    setProjectName("");
    setError(null);
    setDialog({ type: "delete", project });
  }

  function closeDialog() {
    if (!requestInFlight.current && !isBusy) resetDialog();
  }

  async function submitProjectName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog || dialog.type === "delete" || requestInFlight.current || !canSubmit) return;

    requestInFlight.current = true;
    setIsLoading(true);
    setError(null);
    try {
      if (dialog.type === "create") {
        const project = await createProject(name, roomId);
        resetDialog();
        startTransition(() => {
          router.push(`/editor/${encodeURIComponent(project.roomId)}`);
          router.refresh();
        });
      } else {
        await renameProject(dialog.project.id, name);
        resetDialog();
        startTransition(() => router.refresh());
      }
    } catch (caught) {
      if (dialog.type === "create" && caught instanceof ProjectApiError && caught.status === 409) {
        setDialog({ type: "create", suffix: crypto.randomUUID().slice(0, 8) });
        setError("That room ID was taken. A new one is ready; try again.");
      } else {
        setError(caught instanceof Error ? caught.message : "Could not save the project.");
      }
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (dialog?.type !== "delete" || requestInFlight.current || isBusy) return;
    requestInFlight.current = true;
    setIsLoading(true);
    setError(null);
    try {
      await deleteProject(dialog.project.id);
      resetDialog();
      startTransition(() => {
        if (currentProjectId === dialog.project.id) router.replace("/editor");
        router.refresh();
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete the project.");
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  }

  return {
    dialog,
    targetProject: dialog && dialog.type !== "create" ? dialog.project : undefined,
    projectName,
    setProjectName,
    roomId,
    canSubmit,
    error,
    isLoading: isBusy,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitProjectName,
    confirmDelete,
  };
}
