import { useMemo, useState } from "react";
import {
  Activity,
  Bus,
  CheckCircle2,
  Clock,
  Plane,
  RefreshCcw,
  ShoppingBag,
  Train,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
  AlertTriangle,
  Globe,
  Package,
  Hotel,
  BedDouble,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { RangeFilter, type RangeKey } from "@/components/range-filter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const ordersTrend = [
  { m: "May", total: 8, completed: 6, pending: 1, cancelled: 1 },
  { m: "Jun", total: 12, completed: 9, pending: 2, cancelled: 1 },
  { m: "Jul", total: 14, completed: 10, pending: 3, cancelled: 1 },
  { m: "Aug", total: 18, completed: 14, pending: 3, cancelled: 1 },
  { m: "Sep", total: 22, completed: 17, pending: 4, cancelled: 1 },
  { m: "Oct", total: 24, completed: 19, pending: 4, cancelled: 1 },
  { m: "Nov", total: 28, completed: 22, pending: 4, cancelled: 2 },
  { m: "Dec", total: 35, completed: 28, pending: 5, cancelled: 2 },
  { m: "Jan", total: 31, completed: 24, pending: 5, cancelled: 2 },
  { m: "Feb", total: 42, completed: 33, pending: 7, cancelled: 2 },
  { m: "Mar", total: 38, completed: 30, pending: 6, cancelled: 2 },
  { m: "Apr", total: 45, completed: 35, pending: 8, cancelled: 2 },
];

const leadConversionData = [
  { name: "Contacts", value: 250, color: "hsl(var(--info))" },
  { name: "Leads", value: 78, color: "hsl(var(--accent))" },
  { name: "Customers", value: 34, color: "hsl(var(--primary))" },
];

const tripsByMode = {
  Flight: { scheduled: 24, completed: 58, cancelled: 4, delayed: 7 },
  Train: { scheduled: 12, completed: 36, cancelled: 2, delayed: 3 },
  Bus: { scheduled: 8, completed: 22, cancelled: 1, delayed: 2 },
  Other: { scheduled: 3, completed: 9, cancelled: 0, delayed: 1 },
} as const;

type Mode = keyof typeof tripsByMode | "All";

const recentOrders = [
  { id: "ORD-2841", customer: "Emma Rodriguez", trip: "Tokyo · 7 nights", amount: "$3,420", status: "Completed" },
  { id: "ORD-2840", customer: "Marcus Chen", trip: "Iceland Aurora", amount: "$2,890", status: "Pending" },
  { id: "ORD-2839", customer: "Sofia Almeida", trip: "Bali Retreat", amount: "$1,750", status: "Completed" },
  { id: "ORD-2838", customer: "James O'Connor", trip: "Patagonia Trek", amount: "$4,210", status: "Pending" },
  { id: "ORD-2837", customer: "Aisha Patel", trip: "Kyoto Cultural", amount: "$2,140", status: "Cancelled" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-success/10 text-success border-success/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <Badge variant="outline" className={`${map[status] ?? ""} font-medium`}>
      {status}
    </Badge>
  );
}

const Index = () => {
  const [range, setRange] = useState<RangeKey>("all");
  const [mode, setMode] = useState<Mode>("All");

  const trips = useMemo(() => {
    if (mode === "All") {
      return Object.values(tripsByMode).reduce(
        (acc, t) => ({
          scheduled: acc.scheduled + t.scheduled,
          completed: acc.completed + t.completed,
          cancelled: acc.cancelled + t.cancelled,
          delayed: acc.delayed + t.delayed,
        }),
        { scheduled: 0, completed: 0, cancelled: 0, delayed: 0 }
      );
    }
    return tripsByMode[mode];
  }, [mode]);

  const tripBars = [
    { name: "Scheduled", value: trips.scheduled, color: "hsl(var(--info))" },
    { name: "Completed", value: trips.completed, color: "hsl(var(--success))" },
    { name: "Cancelled", value: trips.cancelled, color: "hsl(var(--destructive))" },
    { name: "Delayed", value: trips.delayed, color: "hsl(var(--warning))" },
  ];

  return (
    <PageShell
      title="Dashboard Overview"
      description="Showing hub activity and travel performance metrics."
      actions={
        <Button variant="outline" size="sm" className="rounded-xl">
          <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
          Refresh
        </Button>
      }
    >
      <div className="mb-6">
        <RangeFilter value={range} onChange={setRange} />
      </div>

      {/* Orders KPIs */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Orders
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Orders" value={31} hint="All time orders" icon={ShoppingBag} tone="primary" trend={12} />
          <StatCard label="Pending Orders" value={30} hint="Active work in progress" icon={Clock} tone="warning" trend={4} />
          <StatCard label="Completed Orders" value={1} hint="Completed and delivered" icon={CheckCircle2} tone="success" trend={-8} />
        </div>
      </section>

      {/* Lead Conversion KPIs */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Lead Conversion
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Contacts" value={250} hint="In CRM database" icon={Users} tone="info" trend={6} />
          <StatCard label="Leads" value={78} hint="Qualified prospects" icon={UserPlus} tone="warning" trend={14} />
          <StatCard label="Customers" value={34} hint="Converted clients" icon={CheckCircle2} tone="success" trend={9} />
        </div>
      </section>

      {/* Trips KPIs with mode tabs */}
      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Trips
            </h2>
          </div>
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="rounded-xl bg-card/60 p-1 backdrop-blur">
              <TabsTrigger value="All" className="rounded-lg text-xs gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                All
              </TabsTrigger>
              <TabsTrigger value="Flight" className="rounded-lg text-xs gap-1.5">
                <Plane className="h-3.5 w-3.5" />
                Flight
              </TabsTrigger>
              <TabsTrigger value="Train" className="rounded-lg text-xs gap-1.5">
                <Train className="h-3.5 w-3.5" />
                Train
              </TabsTrigger>
              <TabsTrigger value="Bus" className="rounded-lg text-xs gap-1.5">
                <Bus className="h-3.5 w-3.5" />
                Bus
              </TabsTrigger>
              <TabsTrigger value="Other" className="rounded-lg text-xs gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Scheduled" value={trips.scheduled} hint="Upcoming bookings" icon={Clock} tone="info" />
          <StatCard label="Completed" value={trips.completed} hint="Successfully delivered" icon={CheckCircle2} tone="success" />
          <StatCard label="Cancelled" value={trips.cancelled} hint="Refunded or voided" icon={XCircle} tone="destructive" />
          <StatCard label="Delayed" value={trips.delayed} hint="Beyond original ETA" icon={AlertTriangle} tone="warning" />
        </div>
      </section>

      {/* Charts */}
      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Orders Trend</h3>
              <p className="text-xs text-muted-foreground">Order movement across the year</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-semibold tabular-nums">317</p>
              <p className="text-xs text-muted-foreground">orders total</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="total" name="Total" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gTotal)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#gComp)" />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--warning))" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="hsl(var(--destructive))" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold">Lead Conversion</h3>
          <p className="mb-4 text-xs text-muted-foreground">From contact to customer</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {leadConversionData.map((d) => (
              <div key={d.name} className="rounded-xl bg-muted/40 p-2 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.name}</p>
                <p className="font-display text-lg font-semibold tabular-nums" style={{ color: d.color }}>
                  {d.value}
                </p>
              </div>
            ))}
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadConversionData}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                >
                  {leadConversionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Trips bar + recent orders */}
      <section className="mb-2 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold">Trip Status</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            {mode === "All" ? "All transport modes" : `Mode: ${mode}`}
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripBars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {tripBars.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Recent Orders</h3>
              <p className="text-xs text-muted-foreground">Latest orders inside the selected filter</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View all
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Trip</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                    <td className="px-4 py-3 font-medium">{o.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.trip}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{o.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
