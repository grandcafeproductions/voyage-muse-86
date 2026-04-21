import { ShoppingBag } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Orders() {
  return (
    <PageShell title="Orders" description="Bookings and order pipeline.">
      <ComingSoon icon={ShoppingBag} label="Orders board" />
    </PageShell>
  );
}