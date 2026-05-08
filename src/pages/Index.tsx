import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Globe,
  Package,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  XCircle,
  AlertTriangle,
  Boxes,
  Store,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageShell } from "@/components/page-shell";
import { RangeFilter, type RangeKey } from "@/components/range-filter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const salesTrend = [
  { m: "May", revenue: 18.2, orders: 142, fulfilled: 128, returns: 4, cancelled: 6 },
  { m: "Jun", revenue: 22.8, orders: 166, fulfilled: 149, returns: 5, cancelled: 7 },
  { m: "Jul", revenue: 24.1, orders: 174, fulfilled: 160, returns: 4, cancelled: 8 },
  { m: "Aug", revenue: 28.9, orders: 201, fulfilled: 185, returns: 6, cancelled: 9 },
  { m: "Sep", revenue: 31.5, orders: 224, fulfilled: 207, returns: 5, cancelled: 10 },
  { m: "Oct", revenue: 36.4, orders: 259, fulfilled: 239, returns: 7, cancelled: 11 },
  { m: "Nov", revenue: 39.8, orders: 288, fulfilled: 266, returns: 8, cancelled: 12 },
  { m: "Dec", revenue: 45.2, orders: 326, fulfilled: 301, returns: 9, cancelled: 13 },
  { m: "Jan", revenue: 41.6, orders: 297, fulfilled: 274, returns: 8, cancelled: 12 },
  { m: "Feb", revenue: 48.7, orders: 341, fulfilled: 315, returns: 10, cancelled: 14 },
  { m: "Mar", revenue: 44.9, orders: 318, fulfilled: 295, returns: 8, cancelled: 13 },
  { m: "Apr", revenue: 52.3, orders: 372, fulfilled: 346, returns: 11, cancelled: 15 },
];

const fulfillmentByChannel = [
  { name: "Website", orders: 186, revenue: 22.8, color: "hsl(var(--primary))" },
  { name: "POS", orders: 141, revenue: 18.7, color: "hsl(var(--accent))" },
  { name: "WhatsApp", orders: 96, revenue: 11.4, color: "hsl(var(--success))" },
  { name: "CRM", orders: 74, revenue: 9.2, color: "hsl(var(--warning))" },
];

const recentOrders = [
  { id: "ORD-4821", customer: "Ananya Sharma", item: "iPhone 15 Pro", amount: "$1,299", status: "Paid" },
  { id: "ORD-4820", customer: "Rahul Mehta", item: "Cotton Casual Shirt", amount: "$34", status: "Packed" },
  { id: "ORD-4819", customer: "Sara Khan", item: "Goa Beach Holiday 5N", amount: "$499", status: "Pending" },
  { id: "ORD-4818", customer: "David Miller", item: "Non-Stick Cookware Set", amount: "$79", status: "Refund" },
  { id: "ORD-4817", customer: "Priya Verma", item: "Floral Summer Dress", amount: "$42", status: "Shipped" },
];

const topProducts = [
  { name: "Cotton Casual Shirt", sku: "FAS-MS-CS-01", orders: 206, trend: "+14%", tone: "primary" as const },
  { name: "Slim Fit Jeans", sku: "FAS-MS-JN-04", orders: 172, trend: "+12%", tone: "success" as const },
  { name: "Floral Summer Dress", sku: "FAS-WS-DR-12", orders: 143, trend: "+11%", tone: "accent" as const },
  { name: "iPhone 15 Pro", sku: "APL-IP15P-256", orders: 138, trend: "+18%", tone: "success" as const },
  { name: "Samsung Galaxy S24", sku: "SAM-GS24-128", orders: 94, trend: "+9%", tone: "primary" as const },
];

const lowProducts = [
  { name: "Dell XPS 15", sku: "DEL-XPS15-I7", orders: 29, trend: "-8%", tone: "destructive" as const },
  { name: "Non-Stick Cookware Set", sku: "HK-CK-01", orders: 19, trend: "-5%", tone: "warning" as const },
  { name: "Resistance Band Set", sku: "SPO-FIT-RB-02", orders: 33, trend: "-7%", tone: "muted" as const },
  { name: "Electric Kettle", sku: "HK-AP-EK-03", orders: 24, trend: "-6%", tone: "warning" as const },
  { name: "Travel Adapter Pro", sku: "TRV-ACC-01", orders: 21, trend: "-4%", tone: "destructive" as const },
];

const inventorySignals = [
  { label: "Total SKUs", value: 1284, icon: Boxes, tone: "info" as const },
  { label: "Low stock", value: 36, icon: AlertTriangle, tone: "warning" as const },
  { label: "Out of stock", value: 12, icon: XCircle, tone: "destructive" as const },
  { label: "Reorder today", value: 18, icon: Truck, tone: "accent" as const },
];

const abandonedCartTrend = [
  { m: "May", abandoned: 42, recovered: 9, rate: 21 },
  { m: "Jun", abandoned: 48, recovered: 11, rate: 23 },
  { m: "Jul", abandoned: 51, recovered: 12, rate: 24 },
  { m: "Aug", abandoned: 55, recovered: 14, rate: 25 },
  { m: "Sep", abandoned: 58, recovered: 15, rate: 26 },
  { m: "Oct", abandoned: 63, recovered: 18, rate: 29 },
  { m: "Nov", abandoned: 67, recovered: 20, rate: 30 },
  { m: "Dec", abandoned: 74, recovered: 24, rate: 32 },
  { m: "Jan", abandoned: 69, recovered: 22, rate: 31 },
  { m: "Feb", abandoned: 78, recovered: 26, rate: 33 },
  { m: "Mar", abandoned: 72, recovered: 23, rate: 32 },
  { m: "Apr", abandoned: 81, recovered: 28, rate: 35 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-success/10 text-success border-success/20",
    Packed: "bg-info/10 text-info border-info/20",
    Shipped: "bg-primary/10 text-primary border-primary/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Refund: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <Badge variant="outline" className={`${map[status] ?? ""} font-medium`}>
      {status}
    </Badge>
  );
}

type Tone = "primary" | "success" | "warning" | "destructive" | "info" | "muted" | "accent";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary bg-primary/10 ring-primary/20",
  success: "text-success bg-success/10 ring-success/20",
  warning: "text-warning bg-warning/10 ring-warning/20",
  destructive: "text-destructive bg-destructive/10 ring-destructive/20",
  info: "text-info bg-info/10 ring-info/20",
  muted: "text-muted-foreground bg-muted ring-border",
  accent: "text-accent bg-accent/10 ring-accent/20",
};

function MiniRow({
  icon: Icon,
  label,
  value,
  tone = "muted",
  compact = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2">
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-md ring-1", toneClasses[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-sm font-semibold tabular-nums">{value}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-md ring-1", toneClasses[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <span className="font-display text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function PerformanceCard({
  title,
  subtitle,
  items,
  accent,
}: {
  title: string;
  subtitle: string;
  items: Array<{ name: string; sku: string; orders: number; trend: string; tone: Tone }>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`h-10 w-10 rounded-2xl border border-border/60 ${accent}`} />
      </div>
      <div className="overflow-hidden rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-right font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.sku} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg ring-1", toneClasses[item.tone])}>
                      <span className="text-[11px] font-semibold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Rank {index + 1}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{item.orders}</td>
                <td className="px-4 py-3 text-right">
                  <Badge variant="outline" className={cn("font-medium", toneClasses[item.tone])}>
                    {item.trend}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Index = () => {
  const [range, setRange] = useState<RangeKey>("all");
  const [channel, setChannel] = useState<"All" | "Website" | "POS" | "WhatsApp" | "CRM">("All");

  const selectedChannel = useMemo(() => {
    if (channel === "All") {
      return fulfillmentByChannel.reduce(
        (acc, entry) => ({
          orders: acc.orders + entry.orders,
          revenue: acc.revenue + entry.revenue,
        }),
        { orders: 0, revenue: 0 },
      );
    }
    return fulfillmentByChannel.find((entry) => entry.name === channel) ?? { orders: 0, revenue: 0, color: "hsl(var(--muted-foreground))" };
  }, [channel]);

  const headline = useMemo(() => {
    const totalRevenue = salesTrend.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = salesTrend.reduce((sum, item) => sum + item.orders, 0);
    const fulfilled = salesTrend.reduce((sum, item) => sum + item.fulfilled, 0);
    const returns = salesTrend.reduce((sum, item) => sum + item.returns, 0);
    const cancelled = salesTrend.reduce((sum, item) => sum + item.cancelled, 0);
    const conversion = Math.round((fulfilled / totalOrders) * 100);

    return {
      revenue: `$${totalRevenue.toFixed(1)}k`,
      orders: totalOrders.toLocaleString(),
      conversion: `${conversion}%`,
      returns: returns.toLocaleString(),
      cancelled: cancelled.toLocaleString(),
    };
  }, []);

  return (
    <PageShell
      title="Dashboard Overview"
      description="Ecommerce performance at a glance."
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

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Sales Performance</h2>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium">+18%</Badge>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <div>
              <p className="font-display text-3xl font-semibold tabular-nums">{headline.revenue}</p>
              <p className="text-xs text-muted-foreground">Revenue this year</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold tabular-nums">{headline.orders}</p>
              <p className="text-xs text-muted-foreground">Orders processed</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold tabular-nums">{headline.conversion}</p>
              <p className="text-xs text-muted-foreground">Fulfillment rate</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold tabular-nums text-destructive">{headline.cancelled}</p>
              <p className="text-xs text-muted-foreground">Cancelled orders</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
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
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gRevenue)" />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#gOrders)" />
                <Area type="monotone" dataKey="returns" name="Returns" stroke="hsl(var(--destructive))" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#gCancelled)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                <Store className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Channel Focus</h2>
            </div>
            <Tabs value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <TabsList className="h-7 rounded-lg bg-muted/60 p-0.5">
                <TabsTrigger value="All" className="h-6 rounded-md px-2 text-[10px]">All</TabsTrigger>
                <TabsTrigger value="Website" className="h-6 rounded-md px-2 text-[10px]">Web</TabsTrigger>
                <TabsTrigger value="POS" className="h-6 rounded-md px-2 text-[10px]">POS</TabsTrigger>
                <TabsTrigger value="WhatsApp" className="h-6 rounded-md px-2 text-[10px]">WhatsApp</TabsTrigger>
                <TabsTrigger value="CRM" className="h-6 rounded-md px-2 text-[10px]">CRM</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mb-4">
            <p className="font-display text-3xl font-semibold tabular-nums">
              {selectedChannel.orders}
            </p>
            <p className="text-xs text-muted-foreground">
              {channel === "All" ? "Orders across all channels" : `${channel} orders`}
            </p>
          </div>
          <div className="space-y-2">
            <MiniRow icon={Package} tone="info" label="Ready to ship" value={214} />
            <MiniRow icon={Truck} tone="warning" label="In transit" value={48} />
            <MiniRow icon={CheckCircle2} tone="success" label="Delivered today" value={96} />
            <MiniRow icon={Clock3} tone="destructive" label="Pending review" value={17} />
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-4">
        {inventorySignals.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-3xl font-semibold tabular-nums">{item.value}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Ecommerce stock signal</div>
                </div>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", toneClasses[item.tone])}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mb-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Abandoned Cart Performance</h3>
            <p className="text-xs text-muted-foreground">Abandoned carts, recovered checkouts and recovery rate by month</p>
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            +12.6% recovery
          </Badge>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <MiniRow icon={ShoppingBag} tone="warning" label="Abandoned carts" value={abandonedCartTrend.reduce((sum, item) => sum + item.abandoned, 0)} />
          <MiniRow icon={CheckCircle2} tone="success" label="Recovered carts" value={abandonedCartTrend.reduce((sum, item) => sum + item.recovered, 0)} />
          <MiniRow icon={AlertTriangle} tone="destructive" label="Avg recovery rate" value={`${Math.round(abandonedCartTrend.reduce((sum, item) => sum + item.rate, 0) / abandonedCartTrend.length)}%`} />
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={abandonedCartTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gAbandoned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRecovered" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="abandoned" name="Abandoned" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#gAbandoned)" />
              <Area type="monotone" dataKey="recovered" name="Recovered" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#gRecovered)" />
              <Area type="monotone" dataKey="rate" name="Recovery rate" stroke="hsl(var(--primary))" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <PerformanceCard
          title="Top Performing Products"
          subtitle="Products driving the highest demand and revenue"
          items={topProducts}
          accent="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"
        />
        <PerformanceCard
          title="Low Performance Products"
          subtitle="Products needing attention on sales or visibility"
          items={lowProducts}
          accent="bg-gradient-to-br from-rose-500/20 to-rose-500/5"
        />
      </section>

      <section className="mb-2 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold">Fulfillment</h3>
              <p className="mb-4 text-xs text-muted-foreground">Website, POS, WhatsApp and CRM order split</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +9.4%
            </Badge>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fulfillmentByChannel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
                  {fulfillmentByChannel.map((entry, i) => (
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
              <p className="text-xs text-muted-foreground">Latest orders inside the selected time range</p>
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
                  <th className="px-4 py-3 text-left font-medium">Item</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                    <td className="px-4 py-3 font-medium">{order.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.item}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{order.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={order.status} />
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
