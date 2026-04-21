import { Package } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Services() {
  return (
    <PageShell title="Services & Packages" description="Catalog of trip packages and services.">
      <ComingSoon icon={Package} label="Catalog management" />
    </PageShell>
  );
}