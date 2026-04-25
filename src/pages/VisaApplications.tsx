import { useMemo, useState } from "react";
import { FileCheck, Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Globe2, Clock } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type VisaStatus = "draft" | "submitted" | "in-review" | "approved" | "rejected";

interface VisaApplication {
  id: string;
  customer: string;
  country: string;
  visaType: string;
  status: VisaStatus;
  travelDate: string;
}

const seed: VisaApplication[] = [
  { id: "VA-2041", customer: "Aarav Mehta", country: "United States", visaType: "B1/B2 Tourist", status: "in-review", travelDate: "2026-06-12T00:00:00" },
  { id: "VA-2042", customer: "Sara Wilson", country: "Schengen (France)", visaType: "Short-stay Tourist", status: "approved", travelDate: "2026-05-04T00:00:00" },
  { id: "VA-2043", customer: "Rahul Singh", country: "United Kingdom", visaType: "Standard Visitor", status: "submitted", travelDate: "2026-07-21T00:00:00" },
  { id: "VA-2044", customer: "Maya Chen", country: "Japan", visaType: "eVisa Tourist", status: "approved", travelDate: "2026-04-18T00:00:00" },
  { id: "VA-2045", customer: "David Park", country: "Australia", visaType: "Subclass 600", status: "draft", travelDate: "2026-08-09T00:00:00" },
  { id: "VA-2046", customer: "Lina Costa", country: "Canada", visaType: "Visitor (TRV)", status: "rejected", travelDate: "2026-05-30T00:00:00" },
  { id: "VA-2047", customer: "Hiro Tanaka", country: "United Arab Emirates", visaType: "30-day Tourist", status: "approved", travelDate: "2026-05-10T00:00:00" },
  { id: "VA-2048", customer: "Priya Nair", country: "Singapore", visaType: "eVisa", status: "in-review", travelDate: "2026-06-02T00:00:00" },
];

const statusStyle: Record<VisaStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-primary/15 text-primary border-primary/30",
  "in-review": "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const statusLabel: Record<VisaStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  "in-review": "In Review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function VisaApplications() {
  const [apps, setApps] = useState<VisaApplication[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VisaStatus>("all");

  const stats = useMemo(() => ({
    total: apps.length,
    inReview: apps.filter((a) => a.status === "in-review" || a.status === "submitted").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  }), [apps]);

  const rows = useMemo(() => {
    return apps
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          a.customer.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => parseISO(a.travelDate).getTime() - parseISO(b.travelDate).getTime());
  }, [apps, query, statusFilter]);

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Application ${id} removed`);
  };

  return (
    <PageShell
      title="Visa Applications"
      description="Track and manage customer visa applications across destinations."
      actions={
        <Button onClick={() => toast.info("New visa application form coming soon")}>
          <Plus className="h-4 w-4" /> New Application
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Applications" value={stats.total} icon={FileCheck} />
        <StatCard label="In Progress" value={stats.inReview} icon={Clock} />
        <StatCard label="Approved" value={stats.approved} icon={Globe2} />
        <StatCard label="Rejected" value={stats.rejected} icon={FileCheck} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customer, country, visa type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Application ID</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Visa Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead className="w-12 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No visa applications found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((a) => {
                const travel = parseISO(a.travelDate);
                const daysUntil = differenceInCalendarDays(travel, new Date());
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.customer}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{a.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.visaType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyle[a.status]}>
                        {statusLabel[a.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm tabular-nums">{format(travel, "dd MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">
                          {daysUntil > 0 ? `in ${daysUntil}d` : daysUntil === 0 ? "today" : `${Math.abs(daysUntil)}d ago`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Viewing ${a.id}`)}>
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Editing ${a.id}`)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(a.id)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
