"use client";

import { useEffect, useRef } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/components/editor/use-project-dialogs";

interface ProjectSidebarProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export default function ProjectSidebar({
  id,
  isOpen,
  onClose,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const ownedProjects = projects.filter((project) => project.access === "owned");
  const sharedProjects = projects.filter((project) => project.access === "shared");

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  return (
    <aside
      id={id}
      aria-labelledby={`${id}-title`}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
      className={cn(
        "absolute inset-y-3 left-3 z-40 flex w-80 max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-lg backdrop-blur-sm transition-transform duration-200 motion-reduce:transition-none",
        isOpen ? "translate-x-0" : "pointer-events-none -translate-x-[calc(100%+1rem)]"
      )}
    >
      <div className="flex min-h-12 shrink-0 items-center justify-between border-b border-surface-border px-4">
        <h2 id={`${id}-title`} className="font-medium">Projects</h2>
        <Button ref={closeRef} className="rounded-xl" variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
          <X className="size-5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="my-projects">
          <TabsList className="w-full rounded-xl">
            <TabsTrigger className="rounded-xl" value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger className="rounded-xl" value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects">
            {ownedProjects.length === 0 ? (
              <p className="py-8 text-center text-sm text-copy-muted">No projects yet</p>
            ) : (
              <ul className="mt-3 space-y-1">
                {ownedProjects.map((project) => (
                  <li key={project.id} className="flex min-w-0 items-center gap-1 rounded-xl px-2 py-1 hover:bg-elevated">
                    <span className="min-w-0 flex-1 truncate py-1.5 text-sm text-copy-secondary" title={project.name}>
                      {project.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-lg text-copy-muted hover:text-copy-primary"
                      aria-label={`Rename ${project.name}`}
                      title={`Rename ${project.name}`}
                      onClick={() => onRenameProject(project)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-lg text-copy-muted hover:text-error"
                      aria-label={`Delete ${project.name}`}
                      title={`Delete ${project.name}`}
                      onClick={() => onDeleteProject(project)}
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="shared">
            {sharedProjects.length === 0 ? (
              <p className="py-8 text-center text-sm text-copy-muted">No shared projects</p>
            ) : (
              <ul className="mt-3 space-y-1">
                {sharedProjects.map((project) => (
                  <li key={project.id} className="truncate rounded-xl px-2 py-2 text-sm text-copy-secondary" title={project.name}>
                    {project.name}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="shrink-0 p-4">
        <Button className="w-full rounded-xl" onClick={onCreateProject}>
          <Plus className="size-5" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
