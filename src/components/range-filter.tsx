import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RangeKey = "all" | "today" | "week" | "month" | "custom";

const options: { key: RangeKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

interface RangeFilterProps {
  value: RangeKey;
  onChange: (v: RangeKey) => void;
}

export function RangeFilter({ value, onChange }: RangeFilterProps) {
  const [, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-1.5 shadow-sm backdrop-blur">
      {options.map((opt) => (
        <Button
          key={opt.key}
          size="sm"
          variant="ghost"
          onClick={() => onChange(opt.key)}
          className={cn(
            "h-8 rounded-xl px-3 text-xs font-medium transition-all",
            value === opt.key
              ? "bg-gradient-primary text-primary-foreground shadow-sm hover:bg-gradient-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </Button>
      ))}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          onChange("custom");
          setOpen(true);
        }}
        className={cn(
          "h-8 rounded-xl px-3 text-xs font-medium transition-all",
          value === "custom"
            ? "bg-gradient-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
        Custom Range
      </Button>
    </div>
  );
}