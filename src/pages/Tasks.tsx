import { CheckSquare } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Tasks() {
  return (
    <PageShell title="Tasks" description="Operational tasks across the agency.">
      <ComingSoon icon={CheckSquare} label="Task workspace" />
    </PageShell>
  );
}