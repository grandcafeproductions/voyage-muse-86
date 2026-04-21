import { UserPlus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Leads() {
  return (
    <PageShell title="Leads" description="Track inquiries and qualified prospects.">
      <ComingSoon icon={UserPlus} label="Lead pipeline" />
    </PageShell>
  );
}