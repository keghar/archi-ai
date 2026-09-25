"use client";

import { useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import EditorNavBar from "@/components/editor/editor-nav-bar";
import ProjectSidebar from "@/components/editor/project-sidebar";
import ProjectDialogs from "@/components/editor/project-dialogs";
import { Button } from "@/components/ui/button";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

export default function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const projectDialogs = useProjectDialogs();

  function closeSidebar() {
    toggleRef.current?.focus();
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavBar
        isSidebarOpen={isSidebarOpen}
        sidebarId={sidebarId}
        toggleRef={toggleRef}
        onToggleSidebar={() => isSidebarOpen ? closeSidebar() : setIsSidebarOpen(true)}
      />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <main aria-label="Editor workspace" className="flex h-full items-center justify-center px-6 text-center">
          <div className="flex max-w-lg flex-col items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create a project or open an existing one</h1>
            <p className="text-sm text-copy-muted sm:text-base">Start a new architecture workspace, or choose a project from the sidebar.</p>
            <Button className="mt-2 rounded-xl" onClick={projectDialogs.openCreateDialog}>
              <Plus className="size-5" />
              New Project
            </Button>
          </div>
        </main>
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close projects sidebar"
            className="absolute inset-0 z-30 bg-black/60 md:hidden"
            onClick={closeSidebar}
          />
        )}
        <ProjectSidebar
          id={sidebarId}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          projects={projectDialogs.projects}
          onCreateProject={projectDialogs.openCreateDialog}
          onRenameProject={projectDialogs.openRenameDialog}
          onDeleteProject={projectDialogs.openDeleteDialog}
        />
      </div>
      <ProjectDialogs
        dialog={projectDialogs.dialog}
        activeProject={projectDialogs.activeProject}
        projectName={projectDialogs.projectName}
        setProjectName={projectDialogs.setProjectName}
        isLoading={projectDialogs.isLoading}
        onClose={projectDialogs.closeDialog}
        onSubmitProjectName={projectDialogs.submitProjectName}
        onConfirmDelete={projectDialogs.confirmDelete}
      />
    </div>
  );
}
