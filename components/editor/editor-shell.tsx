"use client";

import { useId, useRef, useState } from "react";
import EditorNavBar from "@/components/editor/editor-nav-bar";
import ProjectSidebar from "@/components/editor/project-sidebar";

export default function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

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
        <main aria-label="Editor workspace" className="flex h-full items-center justify-center">
          <h1 className="text-2xl font-semibold tracking-tight">archiAI</h1>
        </main>
        <ProjectSidebar id={sidebarId} isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>
    </div>
  );
}
