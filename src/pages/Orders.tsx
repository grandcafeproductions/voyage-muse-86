import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Printer,
  Download,
  RefreshCcw,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  name: string;
  basePrice: number;
  qty: number;
  discount: number;
  gstRate: number;
}

interface Order {
  id: string;
  date: string;
  source: string;
  customer: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    address: string;
    gstn?: string;
  };
  shippingAddress: string;
  shippingAvailable: boolean;
  status: OrderStatus;
  items: OrderItem[];
  payment: {
    method: string;
    status: "paid" | "pending" | "refunded";
    txnId: string;
    paidOn?: string;
  };
}

const seed: Order[] = [
  {
    id: "ORD-10241",
    date: "2026-05-02T10:14:00",
    source: "Web Storefront",
    customer: {
      name: "Aarav Mehta",
      company: "Mehta Trading Co.",
      phone: "+91 98200 11223",
      email: "aarav@mehtatrading.in",
      address: "B-204, Sunrise Heights, Andheri West, Mumbai 400058",
      gstn: "27AABCM1234L1Z5",
    },
    shippingAddress: "B-204, Sunrise Heights, Andheri West, Mumbai, Maharashtra 400058, India",
    shippingAvailable: true,
    status: "processing",
    items: [
      { name: "Bali Explorer Package", basePrice: 45000, qty: 2, discount: 5, gstRate: 5 },
      { name: "Travel Insurance Add-on", basePrice: 1200, qty: 2, discount: 0, gstRate: 18 },
    ],
    payment: { method: "UPI", status: "paid", txnId: "TXN8842110", paidOn: "2026-05-02T10:18:00" },
  },
  {
    id: "ORD-10242",
    date: "2026-05-02T12:48:00",
    source: "Mobile App",
    customer: {
      name: "Sara Wilson",
      phone: "+1 415 555 0132",
      email: "sara.w@example.com",
      address: "1450 Market St, San Francisco, CA 94103",
    },
    shippingAddress: "1450 Market St, Apt 12B, San Francisco, CA 94103, USA",
    shippingAvailable: true,
    status: "shipped",
    items: [
      { name: "Travel Backpack 40L", basePrice: 3499, qty: 1, discount: 10, gstRate: 18 },
      { name: "Universal Adapter", basePrice: 899, qty: 2, discount: 0, gstRate: 18 },
    ],
    payment: { method: "Card", status: "paid", txnId: "TXN8842145", paidOn: "2026-05-02T12:50:00" },
  },
  {
    id: "ORD-10243",
    date: "2026-05-03T09:02:00",
    source: "Web Storefront",
    customer: {
      name: "Rahul Singh",
      company: "Singh Enterprises",
      phone: "+91 99100 44556",
      email: "rahul@singhent.com",
      address: "Plot 12, Sector 44, Gurugram 122003",
      gstn: "06AAACS9988P1ZQ",
    },
    shippingAddress: "Plot 12, Sector 44, Gurugram, Haryana 122003, India",
    shippingAvailable: true,
    status: "pending",
    items: [
      { name: "Dubai Weekend Pack", basePrice: 28000, qty: 1, discount: 0, gstRate: 5 },
    ],
    payment: { method: "Bank Transfer", status: "pending", txnId: "—" },
  },
  {
    id: "ORD-10244",
    date: "2026-05-03T15:31:00",
    source: "Phone Order",
    customer: {
      name: "Maya Chen",
      phone: "+65 8123 4477",
      email: "maya.chen@example.sg",
      address: "88 Orchard Rd, Singapore 238888",
    },
    shippingAddress: "88 Orchard Rd, #14-09, Singapore 238888",
    shippingAvailable: false,
    status: "delivered",
    items: [
      { name: "Japan Cherry Blossom Tour", basePrice: 92000, qty: 1, discount: 8, gstRate: 5 },
    ],
    payment: { method: "Card", status: "paid", txnId: "TXN8842310", paidOn: "2026-05-03T15:35:00" },
  },
  {
    id: "ORD-10245",
    date: "2026-05-04T08:11:00",
    source: "Web Storefront",
    customer: {
      name: "David Park",
      phone: "+61 412 998 100",
      email: "dpark@example.au",
      address: "21 George St, Sydney NSW 2000",
    },
    shippingAddress: "21 George St, Sydney NSW 2000, Australia",
    shippingAvailable: true,
    status: "cancelled",
    items: [
      { name: "Smart Luggage Tag", basePrice: 599, qty: 3, discount: 0, gstRate: 18 },
    ],
    payment: { method: "UPI", status: "refunded", txnId: "TXN8842401", paidOn: "2026-05-04T08:14:00" },
  },
  {
    id: "ORD-10246",
    date: "2026-05-04T11:24:00",
    source: "Mobile App",
    customer: {
      name: "Priya Nair",
      company: "Nair Holidays",
      phone: "+91 90400 22113",
      email: "priya@nairholidays.in",
      address: "MG Road, Kochi 682016",
      gstn: "32AAFCN5566K1Z2",
    },
    shippingAddress: "MG Road, Kochi, Kerala 682016, India",
    shippingAvailable: true,
    status: "processing",
    items: [
      { name: "Maldives Honeymoon Pack", basePrice: 145000, qty: 1, discount: 12, gstRate: 5 },
      { name: "Travel Insurance Add-on", basePrice: 1500, qty: 2, discount: 0, gstRate: 18 },
    ],
    payment: { method: "Card", status: "paid", txnId: "TXN8842508", paidOn: "2026-05-04T11:28:00" },
  },
];

const statusStyle: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  processing: "bg-primary/15 text-primary border-primary/30",
  shipped: "bg-warning/15 text-warning border-warning/30",
  delivered: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const itemsCount = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);

const lineTotals = (i: OrderItem) => {
  const gross = i.basePrice * i.qty;
  const discountAmt = (gross * i.discount) / 100;
  const net = gross - discountAmt;
  const gst = (net * i.gstRate) / 100;
  return { gross, discountAmt, net, gst, total: net + gst };
};

const orderTotal = (o: Order) =>
  o.items.reduce((s, i) => s + lineTotals(i).total, 0);

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing" || o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    revenue: orders
      .filter((o) => o.payment.status === "paid")
      .reduce((s, o) => s + orderTotal(o), 0),
  }), [orders]);

  const rows = useMemo(() => {
    return orders
      .filter((o) => statusFilter === "all" || o.status === statusFilter)
      .filter((o) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [orders, query, statusFilter]);

  const active = orders.find((o) => o.id === openId) ?? null;

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success(`Order ${id} removed`);
  };

  return (
    <PageShell
      title="Orders"
      description="Manage e-commerce orders, fulfillment and payments."
      actions={
        <Button onClick={() => toast.info("New order form coming soon")}>
          <Plus className="h-4 w-4" /> New Order
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} />
        <StatCard label="In Progress" value={stats.processing} icon={Package} />
        <StatCard label="Shipped" value={stats.shipped} icon={Truck} />
        <StatCard label="Revenue (paid)" value={inr(stats.revenue)} icon={CreditCard} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search order, customer, email…"
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((o) => (
                <TableRow
                  key={o.id}
                  className="cursor-pointer"
                  onClick={() => setOpenId(o.id)}
                >
                  <TableCell className="font-mono text-xs font-medium">{o.id}</TableCell>
                  <TableCell className="tabular-nums text-sm text-muted-foreground">
                    {format(parseISO(o.date), "dd MMM yyyy, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{o.customer.name}</span>
                      <span className="text-xs text-muted-foreground">{o.customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{itemsCount(o)}</TableCell>
                  <TableCell>
                    {o.shippingAvailable ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <XCircle className="h-3.5 w-3.5" /> Not available
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {inr(orderTotal(o))}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyle[o.status]}>
                      {statusLabel[o.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOpenId(o.id)}>
                          <Eye className="h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Editing ${o.id}`)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Invoice for ${o.id} downloading`)}>
                          <Download className="h-4 w-4" /> Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(o.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsSheet
        order={active}
        open={!!active}
        onOpenChange={(v) => !v && setOpenId(null)}
      />
    </PageShell>
  );
}

function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!order) return null;
  const subtotals = order.items.reduce(
    (acc, i) => {
      const t = lineTotals(i);
      acc.gross += t.gross;
      acc.discount += t.discountAmt;
      acc.net += t.net;
      acc.gst += t.gst;
      acc.total += t.total;
      return acc;
    },
    { gross: 0, discount: 0, net: 0, gst: 0, total: 0 },
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-2xl"
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="font-mono text-base">{order.id}</SheetTitle>
              <SheetDescription>
                {format(parseISO(order.date), "dd MMM yyyy, HH:mm")} · {order.source}
              </SheetDescription>
            </div>
            <Badge variant="outline" className={statusStyle[order.status]}>
              {statusLabel[order.status]}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Order info + Customer */}
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Order Information">
              <Row label="Order ID" value={<span className="font-mono">{order.id}</span>} />
              <Row label="Date" value={format(parseISO(order.date), "dd MMM yyyy, HH:mm")} />
              <Row label="Source" value={order.source} />
              <Row
                label="Status"
                value={
                  <Badge variant="outline" className={statusStyle[order.status]}>
                    {statusLabel[order.status]}
                  </Badge>
                }
              />
            </Section>
            <Section title="Customer Info">
              <div className="text-sm font-medium">{order.customer.name}</div>
              {order.customer.company && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" /> {order.customer.company}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> {order.customer.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {order.customer.email}
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {order.customer.address}
              </div>
              {order.customer.gstn && (
                <div className="text-xs">
                  <span className="text-muted-foreground">GSTN: </span>
                  <span className="font-mono">{order.customer.gstn}</span>
                </div>
              )}
            </Section>
          </div>

          {/* Items */}
          <Section title="Order Items">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Base</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Disc%</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">GST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((i, idx) => {
                    const t = lineTotals(i);
                    return (
                      <TableRow key={idx}>
                        <TableCell className="text-sm font-medium">{i.name}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.basePrice)}</TableCell>
                        <TableCell className="text-center tabular-nums">{i.qty}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {i.discount}%
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{inr(t.net)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {inr(t.gst)} <span className="text-[10px]">({i.gstRate}%)</span>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {inr(t.total)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 ml-auto w-full max-w-xs space-y-1.5 rounded-lg bg-muted/40 p-3 text-sm">
              <SummaryRow label="Subtotal" value={inr(subtotals.gross)} />
              <SummaryRow label="Discount" value={`- ${inr(subtotals.discount)}`} />
              <SummaryRow label="Taxable" value={inr(subtotals.net)} />
              <SummaryRow label="GST" value={inr(subtotals.gst)} />
              <Separator className="my-1" />
              <SummaryRow label="Total" value={inr(subtotals.total)} bold />
            </div>
          </Section>

          {/* Shipping */}
          <Section title="Shipping Address">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{order.shippingAddress}</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <iframe
                title="Shipping location"
                aria-label={`Map of ${order.shippingAddress}`}
                className="h-44 w-full"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(order.shippingAddress)}&output=embed`}
              />
            </div>
          </Section>

          {/* Payment */}
          <Section title="Payment Details">
            <Row label="Method" value={order.payment.method} />
            <Row
              label="Status"
              value={
                <Badge
                  variant="outline"
                  className={cn(
                    order.payment.status === "paid" && "bg-success/15 text-success border-success/30",
                    order.payment.status === "pending" && "bg-warning/15 text-warning border-warning/30",
                    order.payment.status === "refunded" && "bg-destructive/15 text-destructive border-destructive/30",
                  )}
                >
                  {order.payment.status}
                </Badge>
              }
            />
            <Row label="Transaction ID" value={<span className="font-mono">{order.payment.txnId}</span>} />
            {order.payment.paidOn && (
              <Row label="Paid On" value={format(parseISO(order.payment.paidOn), "dd MMM yyyy, HH:mm")} />
            )}
          </Section>

          {/* Actions */}
          <Section title="Order Actions">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.info("Marking as shipped")}>
                <Truck className="h-4 w-4" /> Mark Shipped
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Printing invoice")}>
                <Printer className="h-4 w-4" /> Print Invoice
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Refund initiated")}>
                <RefreshCcw className="h-4 w-4" /> Refund
              </Button>
              <Button size="sm" variant="destructive" onClick={() => toast.error("Order cancelled")}>
                <XCircle className="h-4 w-4" /> Cancel Order
              </Button>
            </div>
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between tabular-nums", bold && "text-base font-semibold")}>
      <span className={cn(!bold && "text-muted-foreground text-xs")}>{label}</span>
      <span>{value}</span>
    </div>
  );
}