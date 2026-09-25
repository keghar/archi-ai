"use client";

import type { ReactNode } from "react";
import { DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DialogPatternProps {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

/** Compose inside Dialog, alongside its trigger. */
export function DialogPattern({ title, description, children, footer }: DialogPatternProps) {
  return (
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle className="text-copy-primary text-[length:1rem]">{title}</DialogTitle>
        {description && <DialogDescription className="text-copy-muted">{description}</DialogDescription>}
      </DialogHeader>
      {children && <div className="py-4">{children}</div>}
      {footer && <DialogFooter className="rounded-b-3xl">{footer}</DialogFooter>}
    </DialogContent>
  );
}

export default DialogPattern;
