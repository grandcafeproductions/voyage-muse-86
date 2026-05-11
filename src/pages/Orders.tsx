import { useEffect, useMemo, useState } from "react";
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
  Navigation,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
      address: "B-204, 2nd Floor, Sunrise Heights, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400058",
      gstn: "27AABCM1234L1Z5",
    },
    shippingAddress: "B-204, 2nd Floor, Sunrise Heights, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400058, India",
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
      address: "1450 Market Street, Apt 12B, Civic Center, San Francisco, CA 94103, USA",
    },
    shippingAddress: "1450 Market Street, Apt 12B, Civic Center, San Francisco, CA 94103, USA",
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
      address: "Plot 12, 3rd Floor, Tower B, Cyber Greens, Sector 44, Gurugram, Haryana 122003",
      gstn: "06AAACS9988P1ZQ",
    },
    shippingAddress: "Plot 12, 3rd Floor, Tower B, Cyber Greens, Sector 44, Gurugram, Haryana 122003, India",
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
      address: "88 Orchard Road, #14-09, Paragon Tower, Orchard, Singapore 238888",
    },
    shippingAddress: "88 Orchard Road, #14-09, Paragon Tower, Orchard, Singapore 238888",
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
      address: "21 George Street, Level 5, Quay Quarter, Sydney CBD, Sydney NSW 2000, Australia",
    },
    shippingAddress: "21 George Street, Level 5, Quay Quarter, Sydney CBD, Sydney NSW 2000, Australia",
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
      address: "1st Floor, Samuel Sons Building, Sobha Road, Chakkaraparambu, Palarivattom, Kochi, Ernakulam, Kerala 682028",
      gstn: "32AAFCN5566K1Z2",
    },
    shippingAddress: "1st Floor, Samuel Sons Building, Sobha Road, Chakkaraparambu, Palarivattom, Kochi, Ernakulam, Kerala 682028, India",
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
  const [editId, setEditId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

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
  const editing = orders.find((o) => o.id === editId) ?? null;

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success(`Order ${id} removed`);
  };

  return (
    <PageShell
      title="Orders"
      description="Manage e-commerce orders, fulfillment and payments."
      actions={
        <Button onClick={() => setCreateOpen(true)}>
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
                        <DropdownMenuItem onClick={() => setEditId(o.id)}>
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

      <EditOrderSheet
        order={editing}
        open={!!editing}
        onOpenChange={(v) => !v && setEditId(null)}
        onSave={(updated, note) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          setEditId(null);
          toast.success(`Order ${updated.id} updated`, { description: note || undefined });
        }}
      />

      <CreateOrderSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(order, withInvoice) => {
          setOrders((prev) => [order, ...prev]);
          setCreateOpen(false);
          toast.success(`Order ${order.id} created`, {
            description: withInvoice ? "Invoice generated alongside order." : undefined,
          });
        }}
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
        className="w-[80vw] !max-w-none overflow-y-auto p-0 sm:!max-w-none"
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

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-3">
          {/* LEFT: Order details */}
          <div className="space-y-6 lg:col-span-2">
          {/* Bill To / Ship To / Dispatch Point */}
          <Section title="Addresses">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Bill To
                </div>
                <div className="text-sm font-medium">{order.customer.name}</div>
                {order.customer.company && (
                  <div className="text-xs text-muted-foreground">{order.customer.company}</div>
                )}
                <div className="mt-1 text-xs text-muted-foreground">{order.customer.address}</div>
                {order.customer.gstn && (
                  <div className="mt-1 text-[11px]">
                    <span className="text-muted-foreground">GSTN: </span>
                    <span className="font-mono">{order.customer.gstn}</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Ship To
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.shippingAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-primary hover:bg-primary/10"
                    title="Navigate with Google Maps"
                    aria-label="Navigate with Google Maps"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="text-sm font-medium">{order.customer.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{order.shippingAddress}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  <Phone className="inline h-3 w-3 mr-1" />{order.customer.phone}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Dispatch Point
                </div>
                <div className="text-sm font-medium">Mumbai Central Warehouse</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Plot 7, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">Code: DP-MUM-01</div>
              </div>
            </div>
          </Section>

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

          {/* Payment */}
          <Section title="Payment Details">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const records = [
                      {
                        date: order.payment.paidOn ?? order.date,
                        method: order.payment.method,
                        txnId: order.payment.txnId,
                        amount: subtotals.total * 0.6,
                        status: order.payment.status,
                      },
                      {
                        date: order.date,
                        method: "Wallet",
                        txnId: `TXN${Math.floor(Math.random() * 9000000 + 1000000)}`,
                        amount: subtotals.total * 0.4,
                        status: order.payment.status,
                      },
                    ];
                    return records.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs text-muted-foreground tabular-nums">
                          {format(parseISO(p.date), "dd MMM yyyy, HH:mm")}
                        </TableCell>
                        <TableCell className="text-sm">{p.method}</TableCell>
                        <TableCell className="font-mono text-xs">{p.txnId}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(p.amount)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              p.status === "paid" && "bg-success/15 text-success border-success/30",
                              p.status === "pending" && "bg-warning/15 text-warning border-warning/30",
                              p.status === "refunded" && "bg-destructive/15 text-destructive border-destructive/30",
                            )}
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </div>
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

          {/* RIGHT: Order info, Customer, Invoices */}
          <div className="space-y-6 lg:col-span-1">
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
              <Row label="Items" value={itemsCount(order)} />
              <Row label="Shipping Method" value="Standard Courier (Bluedart)" />
              <Row label="Total" value={<span className="font-semibold">{inr(subtotals.total)}</span>} />
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

            <Section title="Invoices">
              <div className="space-y-2">
                {[
                  { id: `INV-${order.id.replace("ORD-", "")}`, date: order.date, amount: subtotals.total, status: order.payment.status },
                ].map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-2.5"
                  >
                    <div className="flex flex-col leading-tight">
                      <span className="font-mono text-xs font-medium">{inv.id}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {format(parseISO(inv.date), "dd MMM yyyy")} · {inr(inv.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          inv.status === "paid" && "bg-success/15 text-success border-success/30",
                          inv.status === "pending" && "bg-warning/15 text-warning border-warning/30",
                          inv.status === "refunded" && "bg-destructive/15 text-destructive border-destructive/30",
                        )}
                      >
                        {inv.status}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => toast.info(`Viewing ${inv.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => toast.info(`Downloading ${inv.id}`)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={() => toast.info("Creating invoice")}>
                  <Plus className="h-4 w-4" /> New Invoice
                </Button>
              </div>
            </Section>
          </div>
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

function EditOrderSheet({
  order,
  open,
  onOpenChange,
  onSave,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: Order, note: string) => void;
}) {
  const [billTo, setBillTo] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [note, setNote] = useState("");
  const [originalItems, setOriginalItems] = useState<OrderItem[]>([]);

  // reset form when a new order is opened
  const orderId = order?.id;
  useEffect(() => {
    if (order) {
      setBillTo(order.customer.address);
      setShipTo(order.shippingAddress);
      setItems(order.items.map((i) => ({ ...i })));
      setOriginalItems(order.items.map((i) => ({ ...i })));
      setNote("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // diff for change-log note (must run before any early return)
  const changes = useMemo(() => {
    const added: string[] = [];
    const removed: string[] = [];
    const qtyChanged: string[] = [];
    const origByName = new Map(originalItems.map((o) => [o.name, o]));
    const newByName = new Map(items.map((o) => [o.name, o]));
    for (const it of items) {
      const orig = origByName.get(it.name);
      if (!orig) added.push(`${it.name} × ${it.qty}`);
      else if (orig.qty !== it.qty) qtyChanged.push(`${it.name}: ${orig.qty} → ${it.qty}`);
    }
    for (const it of originalItems) {
      if (!newByName.has(it.name)) removed.push(`${it.name} × ${it.qty}`);
    }
    return { added, removed, qtyChanged };
  }, [items, originalItems]);

  if (!order) return null;

  const updateQty = (idx: number, qty: number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, qty: Math.max(1, qty) } : it)));
  };
  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };
  const addItem = () => {
    setItems((prev) => [...prev, { name: "New Item", basePrice: 0, qty: 1, discount: 0, gstRate: 18 }]);
  };
  const updateField = <K extends keyof OrderItem>(idx: number, key: K, value: OrderItem[K]) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  };

  const hasChanges = changes.added.length + changes.removed.length + changes.qtyChanged.length > 0;

  const handleSave = () => {
    const updated: Order = {
      ...order,
      customer: { ...order.customer, address: billTo },
      shippingAddress: shipTo,
      items,
    };
    const noteParts: string[] = [];
    if (changes.added.length) noteParts.push(`Added: ${changes.added.join(", ")}`);
    if (changes.removed.length) noteParts.push(`Removed: ${changes.removed.join(", ")}`);
    if (changes.qtyChanged.length) noteParts.push(`Qty changed: ${changes.qtyChanged.join(", ")}`);
    if (note.trim()) noteParts.push(`Note: ${note.trim()}`);
    onSave(updated, noteParts.join(" | "));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[70vw] !max-w-none overflow-y-auto p-0 sm:!max-w-none"
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <SheetTitle className="font-mono text-base">Edit {order.id}</SheetTitle>
          <SheetDescription>Update addresses and order items.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bill To</Label>
              <Textarea rows={3} value={billTo} onChange={(e) => setBillTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ship To</Label>
              <Textarea rows={3} value={shipTo} onChange={(e) => setShipTo(e.target.value)} />
            </div>
          </div>

          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Order Items
              </h3>
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-28 text-right">Price</TableHead>
                  <TableHead className="w-24 text-center">Qty</TableHead>
                  <TableHead className="w-32 text-right">Total</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                      No items. Add at least one.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Input
                          value={it.name}
                          onChange={(e) => updateField(idx, "name", e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={it.basePrice}
                          onChange={(e) => updateField(idx, "basePrice", Number(e.target.value))}
                          className="h-8 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) => updateQty(idx, Number(e.target.value))}
                          className="h-8 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {inr(lineTotals(it).total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </section>

          {hasChanges && (
            <section className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Change Summary
              </h3>
              <ul className="space-y-1 text-sm">
                {changes.added.map((c, i) => (
                  <li key={`a-${i}`} className="text-success">+ Added: {c}</li>
                ))}
                {changes.removed.map((c, i) => (
                  <li key={`r-${i}`} className="text-destructive">− Removed: {c}</li>
                ))}
                {changes.qtyChanged.map((c, i) => (
                  <li key={`q-${i}`} className="text-warning">~ Qty: {c}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea
              rows={3}
              placeholder="Reason for edit, additional context..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={items.length === 0}>
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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

const dispatchPoints = [
  "Mumbai Warehouse",
  "Delhi Hub",
  "Bangalore Center",
  "Kochi Office",
];

const customerDirectory = [
  { id: "c1", name: "Aarav Mehta", email: "aarav@mehtatrading.in", phone: "+91 98200 11223", address: "B-204, Sunrise Heights, Andheri West, Mumbai 400058" },
  { id: "c2", name: "Sara Wilson", email: "sara.w@example.com", phone: "+1 415 555 0132", address: "1450 Market Street, San Francisco, CA 94103" },
  { id: "c3", name: "Rahul Singh", email: "rahul@singhent.com", phone: "+91 99100 44556", address: "Cyber Greens, Sector 44, Gurugram 122003" },
  { id: "c4", name: "Priya Nair", email: "priya@nairholidays.in", phone: "+91 90400 22113", address: "Sobha Road, Palarivattom, Kochi 682028" },
];

type NewItem = {
  name: string;
  basePrice: number;
  salesPrice: number;
  qty: number;
  taxRate: number;
};

function CreateOrderSheet({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (order: Order, withInvoice: boolean) => void;
}) {
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [dispatchPoint, setDispatchPoint] = useState(dispatchPoints[0]);
  const [billingAddress, setBillingAddress] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [items, setItems] = useState<NewItem[]>([
    { name: "", basePrice: 0, salesPrice: 0, qty: 1, taxRate: 18 },
  ]);
  const [shippingCharge, setShippingCharge] = useState(0);

  const [customerId, setCustomerId] = useState<string>("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [addingCustomer, setAddingCustomer] = useState(false);

  const [paymentMode, setPaymentMode] = useState("cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [createInvoice, setCreateInvoice] = useState(true);

  useEffect(() => {
    if (!open) {
      setShippingEnabled(true);
      setDispatchPoint(dispatchPoints[0]);
      setBillingAddress("");
      setSameAsBilling(true);
      setShippingAddress("");
      setItems([{ name: "", basePrice: 0, salesPrice: 0, qty: 1, taxRate: 18 }]);
      setShippingCharge(0);
      setCustomerId("");
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      setAddingCustomer(false);
      setPaymentMode("cash");
      setPaidAmount(0);
      setCreateInvoice(true);
    }
  }, [open]);

  const lineCalc = (i: NewItem) => {
    const net = i.salesPrice * i.qty;
    const tax = (net * i.taxRate) / 100;
    return { net, tax, total: net + tax };
  };

  const totals = items.reduce(
    (acc, i) => {
      const t = lineCalc(i);
      acc.net += t.net;
      acc.tax += t.tax;
      acc.total += t.total;
      return acc;
    },
    { net: 0, tax: 0, total: 0 },
  );
  const grandTotal = totals.total + (shippingEnabled ? shippingCharge : 0);

  const paymentStatus: "paid" | "pending" =
    paidAmount >= grandTotal && grandTotal > 0 ? "paid" : "pending";

  const updateItem = (idx: number, patch: Partial<NewItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const handleCreate = () => {
    const customer = addingCustomer
      ? newCustomer
      : customerDirectory.find((c) => c.id === customerId);
    if (!customer || !customer.name) {
      toast.error("Please select or add a customer");
      return;
    }
    if (items.length === 0 || items.some((i) => !i.name)) {
      toast.error("Add at least one valid item");
      return;
    }
    const ship = sameAsBilling ? billingAddress : shippingAddress;
    const order: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      source: "Manual Entry",
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: billingAddress || customer.address,
      },
      shippingAddress: ship || billingAddress || customer.address,
      shippingAvailable: shippingEnabled,
      status: "pending",
      items: items.map((i) => ({
        name: i.name,
        basePrice: i.salesPrice,
        qty: i.qty,
        discount: 0,
        gstRate: i.taxRate,
      })),
      payment: {
        method: paymentMode.toUpperCase(),
        status: paymentStatus,
        txnId: paymentStatus === "paid" ? `TXN${Date.now()}` : "—",
        paidOn: paymentStatus === "paid" ? new Date().toISOString() : undefined,
      },
    };
    onCreate(order, createInvoice);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[85vw] !max-w-none overflow-y-auto p-0 sm:!max-w-none"
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>Add items, customer and payment details to create an order.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ship-enable"
                  checked={shippingEnabled}
                  onCheckedChange={(v) => setShippingEnabled(!!v)}
                />
                <Label htmlFor="ship-enable" className="cursor-pointer">Enable shipping for this order</Label>
              </div>

              {shippingEnabled && (
                <div>
                  <Label className="text-xs text-muted-foreground">Dispatch Point</Label>
                  <Select value={dispatchPoint} onValueChange={setDispatchPoint}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {dispatchPoints.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Billing Address</Label>
                  <Textarea
                    rows={3}
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="Enter billing address"
                    className="mt-1"
                  />
                </div>
                {shippingEnabled && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Shipping Address</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Checkbox
                        id="same-addr"
                        checked={sameAsBilling}
                        onCheckedChange={(v) => setSameAsBilling(!!v)}
                      />
                      <Label htmlFor="same-addr" className="cursor-pointer text-xs">Same as billing address</Label>
                    </div>
                    {!sameAsBilling && (
                      <Textarea
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter shipping address"
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h4 className="text-sm font-semibold">Order Items</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setItems((p) => [...p, { name: "", basePrice: 0, salesPrice: 0, qty: 1, taxRate: 18 }])
                  }
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Base Price</TableHead>
                      <TableHead className="text-right">Sales Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Tax %</TableHead>
                      <TableHead className="text-right">Tax Amt</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => {
                      const t = lineCalc(it);
                      return (
                        <TableRow key={idx}>
                          <TableCell>
                            <Input
                              value={it.name}
                              onChange={(e) => updateItem(idx, { name: e.target.value })}
                              placeholder="Product / service"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="text-right"
                              value={it.basePrice}
                              onChange={(e) => updateItem(idx, { basePrice: Number(e.target.value) })}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="text-right"
                              value={it.salesPrice}
                              onChange={(e) => updateItem(idx, { salesPrice: Number(e.target.value) })}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-20 text-right"
                              value={it.qty}
                              onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-20 text-right"
                              value={it.taxRate}
                              onChange={(e) => updateItem(idx, { taxRate: Number(e.target.value) })}
                            />
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">{inr(t.tax)}</TableCell>
                          <TableCell className="text-right tabular-nums text-sm font-medium">{inr(t.total)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {shippingEnabled && (
              <div className="rounded-xl border border-border p-4">
                <Label className="text-xs text-muted-foreground">Shipping Charge</Label>
                <Input
                  type="number"
                  className="mt-1 max-w-xs"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Customer</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAddingCustomer((v) => !v)}
                >
                  {addingCustomer ? "Select existing" : "+ Add new"}
                </Button>
              </div>
              {!addingCustomer ? (
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                  <SelectContent>
                    {customerDirectory.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                  <Input placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                  <Input placeholder="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                  <Textarea placeholder="Address" rows={2} value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border p-4 space-y-3">
              <h4 className="text-sm font-semibold">Record Payment</h4>
              <div>
                <Label className="text-xs text-muted-foreground">Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Paid Amount</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={
                    paymentStatus === "paid"
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-warning/15 text-warning border-warning/30"
                  }
                >
                  {paymentStatus === "paid" ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2">
              <h4 className="text-sm font-semibold">Summary</h4>
              <SummaryRow label="Subtotal" value={inr(totals.net)} />
              <SummaryRow label="Tax" value={inr(totals.tax)} />
              {shippingEnabled && <SummaryRow label="Shipping" value={inr(shippingCharge)} />}
              <Separator className="my-1" />
              <SummaryRow label="Grand Total" value={inr(grandTotal)} bold />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border p-4">
              <Checkbox
                id="create-inv"
                checked={createInvoice}
                onCheckedChange={(v) => setCreateInvoice(!!v)}
              />
              <Label htmlFor="create-inv" className="cursor-pointer text-sm">
                Create invoice with this order
              </Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Order</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}