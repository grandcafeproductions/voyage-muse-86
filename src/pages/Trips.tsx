import { Plane } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ComingSoon } from "@/components/coming-soon";

export default function Trips() {
  return (
    <PageShell title="Trips" description="Manage scheduled, completed, cancelled and delayed trips.">
      <ComingSoon icon={Plane} label="Trips management" />
    </PageShell>
  );
}