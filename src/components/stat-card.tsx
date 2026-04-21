import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: number;
  tone?: "primary" | "success" | "warning" | "destructive" | "info" | "muted";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, { icon: string; ring: string }> = {
  primary: { icon: "text-primary bg-primary/10", ring: "ring-primary/20" },
  success: { icon: "text-success bg-success/10", ring: "ring-success/20" },
  warning: { icon: "text-warning bg-warning/10", ring: "ring-warning/20" },
  destructive: { icon: "text-destructive bg-destructive/10", ring: "ring-destructive/20" },
  info: { icon: "text-info bg-info/10", ring: "ring-info/20" },
  muted: { icon: "text-muted-foreground bg-muted", ring: "ring-border" },
};

export function StatCard({ label, value, hint, icon: Icon, trend, tone = "primary" }: StatCardProps) {
  const styles = toneStyles[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-3xl font-semibold text-foreground tabular-nums">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", styles.icon, styles.ring)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {typeof trend === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              trend >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}