import Link from "next/link";
import { FileText, Network, Sparkles, UsersRound } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-svh w-full bg-base text-copy-primary lg:grid-cols-[46%_54%]">
      <section className="hidden min-h-svh flex-col justify-between border-r border-surface-border bg-elevated px-12 py-12 lg:flex xl:px-20 xl:py-16">
        <Link href="/" className="flex w-fit items-center gap-3 text-xl font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-background">
            <Network className="size-5" aria-hidden="true" />
          </span>
          <span>archi<span className="text-brand">AI</span></span>
        </Link>
        <div className="max-w-xl py-12">
          <h1 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-5 max-w-xl text-[length:1rem] leading-7 text-copy-muted xl:text-lg">
            Describe a system in plain English, then shape the architecture with your team on a shared canvas.
          </p>
          <ul className="mt-12 space-y-7 xl:mt-14 xl:space-y-8">
            <li className="flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-subtle-border bg-accent-dim text-brand">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-medium text-copy-primary">AI architecture generation</h2>
                <p className="mt-1 text-sm leading-6 text-copy-muted">Turn a prompt into editable nodes and connections.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-subtle-border bg-accent-dim text-brand">
                <UsersRound className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-medium text-copy-primary">Real-time collaboration</h2>
                <p className="mt-1 text-sm leading-6 text-copy-muted">Refine the same canvas with live presence and shared edits.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-subtle-border bg-accent-dim text-brand">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-medium text-copy-primary">Technical specs on demand</h2>
                <p className="mt-1 text-sm leading-6 text-copy-muted">Create a Markdown spec from the finished design.</p>
              </div>
            </li>
          </ul>
        </div>
        <p className="text-xs text-copy-faint">© {new Date().getFullYear()} archi AI</p>
      </section>
      <section className="flex min-h-svh items-center justify-center px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        {children}
      </section>
    </main>
  );
}
