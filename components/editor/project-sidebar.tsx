"use client";

import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSidebar({ id, isOpen, onClose }: ProjectSidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

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
            <p className="py-8 text-center text-sm text-copy-muted">No projects yet</p>
          </TabsContent>
          <TabsContent value="shared">
            <p className="py-8 text-center text-sm text-copy-muted">No shared projects</p>
          </TabsContent>
        </Tabs>
      </div>
      <div className="shrink-0 p-4">
        <Button className="w-full rounded-xl" disabled aria-describedby={`${id}-creation-hint`}>
          <Plus className="size-5" />
          New Project
        </Button>
        <p id={`${id}-creation-hint`} className="mt-2 text-center text-xs text-copy-muted">Project creation is coming soon.</p>
      </div>
    </aside>
  );
}
