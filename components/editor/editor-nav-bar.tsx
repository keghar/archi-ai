"use client";

import type { Ref } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  sidebarId: string;
  toggleRef?: Ref<HTMLButtonElement>;
}

export default function EditorNavBar({
  isSidebarOpen,
  onToggleSidebar,
  sidebarId,
  toggleRef,
}: EditorNavBarProps) {
  return (
    <header className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-3">
      <div>
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          aria-controls={sidebarId}
        >
          {isSidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
        </Button>
      </div>
      <div className="text-sm font-medium">Editor</div>
      <div className="flex justify-end">
        <UserButton />
      </div>
    </header>
  );
}
