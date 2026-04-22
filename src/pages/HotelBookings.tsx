import { useMemo, useState } from "react";
import { Hotel, Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Users, BedDouble } from "lucide-react";
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

type HotelStatus = "confirmed" | "pending" | "checked-in" | "checked-out" | "cancelled";

interface HotelBooking {
  id: string;
  customer: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  pax: number;
  status: HotelStatus;
}

const seed: HotelBooking[] = [
  { id: "HTL-2071", customer: "Aarav Mehta", hotelName: "The Oberoi, Bali", checkIn: "2026-05-02T14:00:00", checkOut: "2026-05-08T11:00:00", rooms: 2, pax: 4, status: "confirmed" },
  { id: "HTL-2072", customer: "Sara Wilson", hotelName: "Hotel Schweizerhof Zermatt", checkIn: "2026-04-28T15:00:00", checkOut: "2026-05-05T11:00:00", rooms: 1, pax: 2, status: "checked-in" },
  { id: "HTL-2073", customer: "Rahul Singh", hotelName: "Taj Lake Palace, Udaipur", checkIn: "2026-05-15T14:00:00", checkOut: "2026-05-18T11:00:00", rooms: 6, pax: 12, status: "pending" },
  { id: "HTL-2074", customer: "Maya Chen", hotelName: "Park Hyatt Tokyo", checkIn: "2026-04-10T15:00:00", checkOut: "2026-04-14T11:00:00", rooms: 1, pax: 1, status: "checked-out" },
  { id: "HTL-2075", customer: "David Park", hotelName: "Soneva Fushi Maldives", checkIn: "2026-06-01T14:00:00", checkOut: "2026-06-06T11:00:00", rooms: 1, pax: 2, status: "confirmed" },
  { id: "HTL-2076", customer: "Lina Costa", hotelName: "Hotel de Crillon, Paris", checkIn: "2026-05-20T15:00:00", checkOut: "2026-05-24T11:00:00", rooms: 3, pax: 6, status: "cancelled" },
];

const statusStyle: Record<HotelStatus, string> = {
  confirmed: "bg-primary/15 text-primary border-primary/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  "checked-in": "bg-accent/15 text-accent-foreground border-accent/30",
  "checked-out": "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function HotelBookings() {
  const [bookings, setBookings] = useState<HotelBooking[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | HotelStatus>("all");

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    checkedIn: bookings.filter((b) => b.status === "checked-in").length,
    rooms: bookings.reduce((sum, b) => sum + b.rooms, 0),
  }), [bookings]);

  const rows = useMemo(() => {
    return bookings
      .filter((b) => statusFilter === "all" || b.status === statusFilter)
      .filter((b) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          b.customer.toLowerCase().includes(q) ||
          b.hotelName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => parseISO(a.checkIn).getTime() - parseISO(b.checkIn).getTime());
  }, [bookings, query, statusFilter]);

  const handleDelete = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success(`Booking ${id} removed`);
  };

  return (
    <PageShell
      title="Hotel Bookings"
      description="Manage all hotel reservations, check-ins and room allocations."
      actions={
        <Button onClick={() => toast.info("New hotel booking form coming soon")}>
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Bookings" value={stats.total} icon={Hotel} />
        <StatCard label="Confirmed" value={stats.confirmed} icon={BedDouble} />
        <StatCard label="Checked-in" value={stats.checkedIn} icon={BedDouble} />
        <StatCard label="Total Rooms" value={stats.rooms} icon={Users} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customer, hotel…"
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
              <SelectItem value="checked-in">Checked-in</SelectItem>
              <SelectItem value="checked-out">Checked-out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead className="text-center">Rooms</TableHead>
              <TableHead className="text-center">Pax</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No hotel bookings found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => {
                const ci = parseISO(b.checkIn);
                const co = parseISO(b.checkOut);
                const nights = differenceInCalendarDays(co, ci);
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium text-foreground">{b.customer}</span>
                        <span className="text-xs text-muted-foreground">{b.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{b.hotelName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm tabular-nums">{format(ci, "dd MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{format(ci, "HH:mm")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm tabular-nums">{format(co, "dd MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{nights} nights</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{b.rooms}</TableCell>
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
