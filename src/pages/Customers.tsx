import { Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Customers() {
  return (
    <PageShell title="Customers" description="Your full customer database and history.">
      <ComingSoon icon={Users} label="Customer directory" />
    </PageShell>
  );
}