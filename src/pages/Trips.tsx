import { useMemo, useState } from "react";
import {
  Plane,
  TrainFront,
  Bus,
  Ship,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  MapPin,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Bell,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type TransportMode = "flight" | "train" | "bus" | "cruise";
type TripStatus = "scheduled" | "in-transit" | "completed" | "cancelled" | "delayed";

interface Trip {
  id: string;
  reference: string;
  customer: string;
  pax: number;
  mode: TransportMode;
  carrier: string;
  origin: string;
  destination: string;
  departure: string; // ISO
  arrival: string;
  actualDeparture?: string; // ISO — actual time when delayed/in-transit
  actualArrival?: string; // ISO — actual time when delayed/in-transit
  status: TripStatus;
  delayMinutes?: number;
  notes?: string;
}

const MODE_META: Record<TransportMode, { label: string; icon: typeof Plane; tint: string }> = {
  flight: { label: "Flight", icon: Plane, tint: "text-info bg-info/10" },
  train: { label: "Train", icon: TrainFront, tint: "text-primary bg-primary/10" },
  bus: { label: "Bus", icon: Bus, tint: "text-warning bg-warning/10" },
  cruise: { label: "Cruise", icon: Ship, tint: "text-accent bg-accent/10" },
};

const STATUS_META: Record<TripStatus, { label: string; className: string; icon: typeof Clock }> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-info/10 text-info ring-1 ring-inset ring-info/30",
    icon: CalendarClock,
  },
  "in-transit": {
    label: "In Transit",
    className: "bg-primary/15 text-primary ring-1 ring-inset ring-primary/30",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success ring-1 ring-inset ring-success/30",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/30",
    icon: XCircle,
  },
  delayed: {
    label: "Delayed",
    className: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/30",
    icon: AlertTriangle,
  },
};

const SEED: Trip[] = [
  {
    id: "t1",
    reference: "VYR-10421",
    customer: "Aiko Tanaka",
    pax: 2,
    mode: "flight",
    carrier: "Emerald Airlines · EM 204",
    origin: "London (LHR)",
    destination: "Reykjavík (KEF)",
    departure: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    arrival: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
    actualDeparture: new Date(Date.now() + 1000 * 60 * 60 * 6 + 1000 * 60 * 75).toISOString(),
    actualArrival: new Date(Date.now() + 1000 * 60 * 60 * 9 + 1000 * 60 * 75).toISOString(),
    status: "delayed",
    delayMinutes: 75,
    notes: "Crew rotation pending. Notify customer.",
  },
  {
    id: "t2",
    reference: "VYR-10418",
    customer: "Mateo Rivas",
    pax: 4,
    mode: "train",
    carrier: "Eurostar · 9032",
    origin: "Paris (Gare du Nord)",
    destination: "Amsterdam Centraal",
    departure: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    arrival: new Date(Date.now() + 1000 * 60 * 60 * 29).toISOString(),
    status: "scheduled",
  },
  {
    id: "t3",
    reference: "VYR-10399",
    customer: "Priya Shah",
    pax: 1,
    mode: "flight",
    carrier: "SkyWave · SW 88",
    origin: "Mumbai (BOM)",
    destination: "Dubai (DXB)",
    departure: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    arrival: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
    status: "in-transit",
  },
  {
    id: "t4",
    reference: "VYR-10377",
    customer: "Hannah Becker",
    pax: 3,
    mode: "bus",
    carrier: "AlpenLine · AL 12",
    origin: "Munich",
    destination: "Zürich",
    departure: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    arrival: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "completed",
  },
  {
    id: "t5",
    reference: "VYR-10362",
    customer: "Lucas Pereira",
    pax: 2,
    mode: "cruise",
    carrier: "Aurora Lines · Nordic Star",
    origin: "Bergen",
    destination: "Tromsø",
    departure: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    arrival: new Date(Date.now() + 1000 * 60 * 60 * 168).toISOString(),
    status: "scheduled",
  },
  {
    id: "t6",
    reference: "VYR-10311",
    customer: "Noor Al-Sayed",
    pax: 1,
    mode: "flight",
    carrier: "Levant Air · LV 401",
    origin: "Amman (AMM)",
    destination: "Istanbul (IST)",
    departure: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    arrival: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    status: "cancelled",
    notes: "Refund processed.",
  },
  {
    id: "t7",
    reference: "VYR-10298",
    customer: "Sven Lindqvist",
    pax: 5,
    mode: "train",
    carrier: "NordRail · 511",
    origin: "Stockholm",
    destination: "Copenhagen",
    departure: new Date(Date.now() + 1000 * 60 * 60 * 50).toISOString(),
    arrival: new Date(Date.now() + 1000 * 60 * 60 * 55).toISOString(),
    actualDeparture: new Date(Date.now() + 1000 * 60 * 60 * 50 + 1000 * 60 * 30).toISOString(),
    actualArrival: new Date(Date.now() + 1000 * 60 * 60 * 55 + 1000 * 60 * 30).toISOString(),
    status: "delayed",
    delayMinutes: 30,
  },
];

const STATUS_TABS: { key: TripStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Scheduled" },
  { key: "in-transit", label: "In Transit" },
  { key: "delayed", label: "Delayed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function StatusPill({ status }: { status: TripStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        meta.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: TransportMode }) {
  const meta = MODE_META[mode];
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium", meta.tint)}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

interface TripFormState {
  customer: string;
  pax: string;
  mode: TransportMode;
  carrier: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: TripStatus;
  notes: string;
}

const EMPTY_FORM: TripFormState = {
  customer: "",
  pax: "1",
  mode: "flight",
  carrier: "",
  origin: "",
  destination: "",
  departure: "",
  arrival: "",
  status: "scheduled",
  notes: "",
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>(SEED);
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [modeFilter, setModeFilter] = useState<TransportMode | "all">("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TripFormState>(EMPTY_FORM);
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);

  const counts = useMemo(() => {
    const base = { scheduled: 0, "in-transit": 0, completed: 0, cancelled: 0, delayed: 0 } as Record<TripStatus, number>;
    trips.forEach((t) => (base[t.status] += 1));
    return base;
  }, [trips]);

  const delayedTrips = useMemo(() => trips.filter((t) => t.status === "delayed"), [trips]);

  const filtered = useMemo(() => {
    return trips
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .filter((t) => (modeFilter === "all" ? true : t.mode === modeFilter))
      .filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          t.reference.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.origin.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.carrier.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(a.departure) - +new Date(b.departure));
  }, [trips, statusFilter, modeFilter, search]);

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer || !form.origin || !form.destination || !form.departure) {
      toast.error("Please fill in customer, origin, destination and departure.");
      return;
    }
    const newTrip: Trip = {
      id: `t${Date.now()}`,
      reference: `VYR-${Math.floor(10000 + Math.random() * 89999)}`,
      customer: form.customer,
      pax: Number(form.pax) || 1,
      mode: form.mode,
      carrier: form.carrier || "—",
      origin: form.origin,
      destination: form.destination,
      departure: new Date(form.departure).toISOString(),
      arrival: form.arrival ? new Date(form.arrival).toISOString() : new Date(form.departure).toISOString(),
      status: form.status,
      notes: form.notes || undefined,
    };
    setTrips((prev) => [newTrip, ...prev]);
    toast.success(`Trip ${newTrip.reference} added`);
    setDialogOpen(false);
    resetForm();
  }

  function updateStatus(id: string, status: TripStatus) {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Marked as ${STATUS_META[status].label.toLowerCase()}`);
  }

  function deleteTrip(id: string) {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success("Trip removed");
    if (detailTrip?.id === id) setDetailTrip(null);
  }

  return (
    <PageShell
      title="Trips"
      description="Track every journey across flights, trains, buses and cruises."
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Plus className="h-4 w-4" />
              New Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add a new trip</DialogTitle>
              <DialogDescription>Capture itinerary details, transport mode and current status.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-2 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={form.customer}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  placeholder="e.g. Aiko Tanaka"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Transport mode</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v as TransportMode })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(MODE_META) as TransportMode[]).map((m) => (
                      <SelectItem key={m} value={m}>{MODE_META[m].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pax">Passengers</Label>
                <Input
                  id="pax"
                  type="number"
                  min={1}
                  value={form.pax}
                  onChange={(e) => setForm({ ...form, pax: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="carrier">Carrier / Service</Label>
                <Input
                  id="carrier"
                  value={form.carrier}
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  placeholder="Emerald Airlines · EM 204"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  placeholder="London (LHR)"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Reykjavík (KEF)"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="departure">Departure</Label>
                <Input
                  id="departure"
                  type="datetime-local"
                  value={form.departure}
                  onChange={(e) => setForm({ ...form, departure: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="arrival">Arrival</Label>
                <Input
                  id="arrival"
                  type="datetime-local"
                  value={form.arrival}
                  onChange={(e) => setForm({ ...form, arrival: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TripStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_META) as TripStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Internal notes (optional)"
                />
              </div>
              <DialogFooter className="sm:col-span-2">
                <Button type="button" variant="ghost" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                  Save trip
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Scheduled" value={counts.scheduled} icon={CalendarClock} tone="info" hint="Upcoming departures" />
        <StatCard label="In Transit" value={counts["in-transit"]} icon={Clock} tone="primary" hint="Travelling now" />
        <StatCard label="Delayed" value={counts.delayed} icon={AlertTriangle} tone="warning" hint="Needs attention" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} tone="success" hint="Last 30 days" />
        <StatCard label="Cancelled" value={counts.cancelled} icon={XCircle} tone="destructive" hint="Refunds tracked" />
      </div>

      {/* Delay notifications */}
      {delayedTrips.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {delayedTrips.length} trip{delayedTrips.length > 1 ? "s" : ""} delayed
                </h3>
                <Badge variant="outline" className="border-warning/40 text-warning">Action required</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Notify customers and update itineraries before departure.
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {delayedTrips.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {t.reference} · {t.customer}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.origin} → {t.destination} · +{t.delayMinutes ?? 0} min
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 shrink-0"
                      onClick={() => toast.success(`Notification sent to ${t.customer}`)}
                    >
                      Notify
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <TabsList className="h-auto flex-wrap bg-muted/60 p-1">
            {STATUS_TABS.map((s) => (
              <TabsTrigger key={s.key} value={s.key} className="text-xs">
                {s.label}
                {s.key !== "all" && (
                  <span className="ml-1.5 rounded-md bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                    {counts[s.key as TripStatus]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips, customers, routes…"
              className="h-9 w-full pl-9 sm:w-72"
            />
          </div>
          <Select value={modeFilter} onValueChange={(v) => setModeFilter(v as typeof modeFilter)}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="All modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              {(Object.keys(MODE_META) as TransportMode[]).map((m) => (
                <SelectItem key={m} value={m}>{MODE_META[m].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Customer</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No trips match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => {
                const dep = parseISO(t.departure);
                const arr = parseISO(t.arrival);
                const actualDep = t.actualDeparture ? parseISO(t.actualDeparture) : null;
                const actualArr = t.actualArrival ? parseISO(t.actualArrival) : null;
                const rowTint =
                  t.status === "delayed"
                    ? "bg-warning/10 hover:bg-warning/15"
                    : t.status === "cancelled"
                      ? "bg-destructive/10 hover:bg-destructive/15"
                      : "";
                return (
                  <TableRow key={t.id} className={cn("group", rowTint)}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{t.customer}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" /> {t.pax} pax · {t.reference}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell><ModeBadge mode={t.mode} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{t.origin}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="truncate">{t.destination}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.carrier}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm tabular-nums text-foreground">{format(dep, "dd MMM, HH:mm")}</span>
                        {actualDep ? (
                          <span className="text-xs font-medium tabular-nums text-warning">
                            Actual {format(actualDep, "dd MMM, HH:mm")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Scheduled</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm tabular-nums text-foreground">{format(arr, "dd MMM, HH:mm")}</span>
                        {actualArr ? (
                          <span className="text-xs font-medium tabular-nums text-warning">
                            Actual {format(actualArr, "dd MMM, HH:mm")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Scheduled</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <StatusPill status={t.status} />
                        {t.status === "delayed" && t.delayMinutes && (
                          <span className="text-xs text-warning">+{t.delayMinutes} min</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setDetailTrip(t)}>
                            <Eye className="h-4 w-4" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit coming soon")}>
                            <Pencil className="h-4 w-4" /> Edit trip
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground">Set status</DropdownMenuLabel>
                          {(Object.keys(STATUS_META) as TripStatus[])
                            .filter((s) => s !== t.status)
                            .map((s) => (
                              <DropdownMenuItem key={s} onClick={() => updateStatus(t.id, s)}>
                                {STATUS_META[s].label}
                              </DropdownMenuItem>
                            ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteTrip(t.id)}
                            className="text-destructive focus:text-destructive"
                          >
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

      {/* Detail sheet */}
      <Sheet open={!!detailTrip} onOpenChange={(o) => !o && setDetailTrip(null)}>
        <SheetContent className="sm:max-w-md">
          {detailTrip && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <ModeBadge mode={detailTrip.mode} />
                  <StatusPill status={detailTrip.status} />
                </div>
                <SheetTitle className="mt-2">{detailTrip.reference}</SheetTitle>
                <SheetDescription>{detailTrip.carrier}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Customer</p>
                  <p className="mt-1 font-medium text-foreground">{detailTrip.customer} · {detailTrip.pax} pax</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Origin</p>
                    <p className="mt-1 font-medium text-foreground">{detailTrip.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Destination</p>
                    <p className="mt-1 font-medium text-foreground">{detailTrip.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Departure</p>
                    <p className="mt-1 font-medium tabular-nums text-foreground">
                      {format(parseISO(detailTrip.departure), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Arrival</p>
                    <p className="mt-1 font-medium tabular-nums text-foreground">
                      {format(parseISO(detailTrip.arrival), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
                {detailTrip.status === "delayed" && (
                  <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-warning">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <AlertTriangle className="h-4 w-4" /> Delayed by {detailTrip.delayMinutes} minutes
                    </p>
                  </div>
                )}
                {detailTrip.notes && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Notes</p>
                    <p className="mt-1 text-foreground">{detailTrip.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-gradient-primary text-primary-foreground"
                    onClick={() => toast.success(`Notification sent to ${detailTrip.customer}`)}
                  >
                    <Bell className="h-4 w-4" /> Notify customer
                  </Button>
                  <Button variant="outline" onClick={() => setDetailTrip(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}