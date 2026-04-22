import { useMemo, useState } from "react";
import { Package, Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Users, CalendarClock } from "lucide-react";
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

type BookingStatus = "confirmed" | "pending" | "ongoing" | "completed" | "cancelled";

interface PackageBooking {
  id: string;
  customer: string;
  packageName: string;
  groupName: string;
  startDate: string;
  durationDays: number;
  pax: number;
  status: BookingStatus;
}

const seed: PackageBooking[] = [
  { id: "PKG-1042", customer: "Aarav Mehta", packageName: "Bali Sunset Escape", groupName: "Mehta Family", startDate: "2026-05-02T08:00:00", durationDays: 6, pax: 4, status: "confirmed" },
  { id: "PKG-1043", customer: "Sara Wilson", packageName: "Swiss Alps Explorer", groupName: "Wilson Honeymoon", startDate: "2026-04-28T06:30:00", durationDays: 9, pax: 2, status: "ongoing" },
  { id: "PKG-1044", customer: "Rahul Singh", packageName: "Rajasthan Heritage Tour", groupName: "Singh Group", startDate: "2026-05-15T07:00:00", durationDays: 7, pax: 12, status: "pending" },
  { id: "PKG-1045", customer: "Maya Chen", packageName: "Tokyo & Kyoto Deluxe", groupName: "Chen Solo", startDate: "2026-04-10T09:00:00", durationDays: 8, pax: 1, status: "completed" },
  { id: "PKG-1046", customer: "David Park", packageName: "Maldives All-Inclusive", groupName: "Park Anniversary", startDate: "2026-06-01T10:00:00", durationDays: 5, pax: 2, status: "confirmed" },
  { id: "PKG-1047", customer: "Lina Costa", packageName: "European Capitals", groupName: "Costa Friends", startDate: "2026-05-20T05:00:00", durationDays: 12, pax: 6, status: "cancelled" },
];

const statusStyle: Record<BookingStatus, string> = {
  confirmed: "bg-primary/15 text-primary border-primary/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  ongoing: "bg-accent/15 text-accent-foreground border-accent/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function PackageBookings() {
  const [bookings, setBookings] = useState<PackageBooking[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    ongoing: bookings.filter((b) => b.status === "ongoing").length,
    pax: bookings.reduce((sum, b) => sum + b.pax, 0),
  }), [bookings]);

  const rows = useMemo(() => {
    return bookings
      .filter((b) => statusFilter === "all" || b.status === statusFilter)
      .filter((b) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          b.customer.toLowerCase().includes(q) ||
          b.packageName.toLowerCase().includes(q) ||
          b.groupName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
  }, [bookings, query, statusFilter]);

  const handleDelete = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success(`Booking ${id} removed`);
  };

  return (
    <PageShell
      title="Package Bookings"
      description="Manage all booked travel packages, group tours and itineraries."
      actions={
        <Button onClick={() => toast.info("New package booking form coming soon")}>
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Bookings" value={stats.total} icon={Package} />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CalendarClock} />
        <StatCard label="Ongoing" value={stats.ongoing} icon={CalendarClock} />
        <StatCard label="Total Pax" value={stats.pax} icon={Users} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customer, package, group…"
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
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-center">Pax</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No package bookings found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => {
                const start = parseISO(b.startDate);
                const daysUntil = differenceInCalendarDays(start, new Date());
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium text-foreground">{b.customer}</span>
                        <span className="text-xs text-muted-foreground">{b.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{b.packageName}</TableCell>
                    <TableCell className="text-muted-foreground">{b.groupName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm tabular-nums">{format(start, "dd MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">
                          {daysUntil > 0 ? `in ${daysUntil}d` : daysUntil === 0 ? "today" : `${Math.abs(daysUntil)}d ago`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">{b.durationDays} days</TableCell>
                    <TableCell className="text-center tabular-nums">{b.pax}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyle[b.status]}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Viewing ${b.id}`)}>
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Editing ${b.id}`)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(b.id)}>
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
