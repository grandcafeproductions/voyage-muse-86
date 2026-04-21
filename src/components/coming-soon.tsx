import type { LucideIcon } from "lucide-react";

export function ComingSoon({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        This module is being built. Connect Lovable Cloud to enable persistence.
      </p>
    </div>
  );
}