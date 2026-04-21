import { Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Accounting() {
  return (
    <PageShell title="Accounting & Finance" description="Invoices, payments, and ledgers.">
      <ComingSoon icon={Wallet} label="Finance suite" />
    </PageShell>
  );
}