import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, description, actions, children }: PageShellProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-glow" />
      <div className="relative mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
        <div className="animate-fade-in">{children}</div>
      </div>
    </div>
  );
}