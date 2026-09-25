"use client";

import { useState } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  access: "owned" | "shared";
}

export type ProjectDialogState =
  | { type: "create" }
  | { type: "rename"; projectId: string }
  | { type: "delete"; projectId: string }
  | null;

const initialProjects: Project[] = [
  { id: "project-1", name: "System Design Workspace", slug: "system-design-workspace", access: "owned" },
  { id: "project-2", name: "Payments Platform", slug: "payments-platform", access: "owned" },
  { id: "project-3", name: "Team Architecture", slug: "team-architecture", access: "shared" },
];

export function createProjectSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialog, setDialog] = useState<ProjectDialogState>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function openCreateDialog() {
    setProjectName("");
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: Project) {
    setProjectName(project.name);
    setDialog({ type: "rename", projectId: project.id });
  }

  function openDeleteDialog(project: Project) {
    setProjectName("");
    setDialog({ type: "delete", projectId: project.id });
  }

  function closeDialog() {
    if (isLoading) return;
    setDialog(null);
    setProjectName("");
  }

  function submitProjectName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim();
    const slug = createProjectSlug(name);
    if (!dialog || (dialog.type !== "create" && dialog.type !== "rename") || !name || !slug || isLoading) return;

    setIsLoading(true);
    if (dialog.type === "create") {
      setProjects((current) => [
        ...current,
        { id: `project-${Date.now()}`, name, slug, access: "owned" },
      ]);
    } else {
      setProjects((current) => current.map((project) =>
        project.id === dialog.projectId ? { ...project, name, slug } : project
      ));
    }
    setDialog(null);
    setProjectName("");
    setIsLoading(false);
  }

  function confirmDelete() {
    if (dialog?.type !== "delete" || isLoading) return;
    setIsLoading(true);
    setProjects((current) => current.filter((project) => project.id !== dialog.projectId));
    setDialog(null);
    setIsLoading(false);
  }

  const activeProject = dialog && dialog.type !== "create"
    ? projects.find((project) => project.id === dialog.projectId)
    : undefined;

  return {
    projects,
    dialog,
    activeProject,
    projectName,
    setProjectName,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitProjectName,
    confirmDelete,
  };
}
