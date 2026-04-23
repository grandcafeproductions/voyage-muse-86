import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Building2,
  CreditCard,
  Download,
  FileBarChart,
  Filter,
  Landmark,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { InvoiceFormDialog } from "@/components/invoice-form-dialog";

/* ---------------------------------------------------------------------------
 * Mock data
 * ------------------------------------------------------------------------ */

type SaleStatus = "Paid" | "Partial" | "Unpaid" | "Overdue";
const sales = [
  { id: "INV-1041", date: "23 Apr 2026", customer: "Doe Enterprises Pvt. Ltd", amount: 156940, paid: 156940, status: "Paid" as SaleStatus, due: "23 Apr 2026" },
  { id: "INV-1040", date: "22 Apr 2026", customer: "Rahwwwm", amount: 86000, paid: 40000, status: "Partial" as SaleStatus, due: "29 Apr 2026" },
  { id: "INV-1039", date: "20 Apr 2026", customer: "zk company 39", amount: 140420, paid: 140420, status: "Paid" as SaleStatus, due: "20 Apr 2026" },
  { id: "INV-1038", date: "18 Apr 2026", customer: "Omaygodness", amount: 14250, paid: 0, status: "Unpaid" as SaleStatus, due: "02 May 2026" },
  { id: "INV-1037", date: "10 Apr 2026", customer: "Skyline Tours", amount: 89500, paid: 0, status: "Overdue" as SaleStatus, due: "17 Apr 2026" },
  { id: "INV-1036", date: "08 Apr 2026", customer: "Doe Enterprises Pvt. Ltd", amount: 56000, paid: 56000, status: "Paid" as SaleStatus, due: "08 Apr 2026" },
];

type PurchaseStatus = "Received" | "Pending" | "Partial";
const purchases = [
  { id: "PO-220", date: "21 Apr 2026", vendor: "BlueSky Hotels", amount: 245000, paid: 245000, status: "Received" as PurchaseStatus },
  { id: "PO-219", date: "19 Apr 2026", vendor: "Indigo Air Charters", amount: 128400, paid: 64200, status: "Partial" as PurchaseStatus },
  { id: "PO-218", date: "16 Apr 2026", vendor: "Mountain Cab Co.", amount: 38900, paid: 0, status: "Pending" as PurchaseStatus },
  { id: "PO-217", date: "12 Apr 2026", vendor: "Coastal Resorts Ltd", amount: 412000, paid: 412000, status: "Received" as PurchaseStatus },
];

const expenses = [
  { id: "EXP-512", date: "22 Apr 2026", category: "Marketing", payee: "Meta Ads", amount: 28500, method: "UPI" },
  { id: "EXP-511", date: "20 Apr 2026", category: "Office Rent", payee: "Skyline Realty", amount: 65000, method: "Bank Transfer" },
  { id: "EXP-510", date: "18 Apr 2026", category: "Salaries", payee: "Payroll Apr", amount: 312000, method: "Bank Transfer" },
  { id: "EXP-509", date: "15 Apr 2026", category: "Utilities", payee: "City Power", amount: 8200, method: "UPI" },
  { id: "EXP-508", date: "12 Apr 2026", category: "Travel", payee: "Cab fleet refuel", amount: 14600, method: "Cash" },
];

type PayMethod = "Cash" | "Bank Transfer" | "UPI" | "Card" | "Cheque";
type PayType = "Received" | "Made";
const payments = [
  { id: "PAY-018", date: "23 Apr 2026", type: "Received" as PayType, counterparty: "Doe Enterprises Pvt. Ltd", amount: 156940, allocated: 156940, method: "Bank Transfer" as PayMethod, note: "INV-1041 settlement" },
  { id: "PAY-017", date: "22 Apr 2026", type: "Received" as PayType, counterparty: "Rahwwwm", amount: 60000, allocated: 40000, method: "UPI" as PayMethod, note: "Partial against INV-1040" },
  { id: "PAY-016", date: "21 Apr 2026", type: "Made" as PayType, counterparty: "BlueSky Hotels", amount: 245000, allocated: 245000, method: "Bank Transfer" as PayMethod, note: "PO-220 settled in full" },
  { id: "PAY-015", date: "20 Apr 2026", type: "Received" as PayType, counterparty: "zk company 39", amount: 140420, allocated: 140420, method: "Card" as PayMethod, note: "INV-1039" },
  { id: "PAY-014", date: "19 Apr 2026", type: "Made" as PayType, counterparty: "Indigo Air Charters", amount: 64200, allocated: 64200, method: "Cheque" as PayMethod, note: "Advance for PO-219" },
  { id: "PAY-013", date: "18 Apr 2026", type: "Received" as PayType, counterparty: "Walk-in Customer", amount: 25000, allocated: 0, method: "Cash" as PayMethod, note: "On account / unallocated" },
  { id: "PAY-012", date: "15 Apr 2026", type: "Made" as PayType, counterparty: "City Power", amount: 8200, allocated: 8200, method: "UPI" as PayMethod, note: "EXP-509" },
  { id: "PAY-011", date: "12 Apr 2026", type: "Made" as PayType, counterparty: "Cab fleet refuel", amount: 14600, allocated: 14600, method: "Cash" as PayMethod, note: "EXP-508" },
];

type ContactType = "Customer" | "Vendor" | "Payee";
const contacts = [
  { name: "Doe Enterprises Pvt. Ltd", type: "Customer" as ContactType, received: 212940, allocated: 212940, outstanding: 0 },
  { name: "Rahwwwm", type: "Customer" as ContactType, received: 60000, allocated: 40000, outstanding: 46000 },
  { name: "zk company 39", type: "Customer" as ContactType, received: 140420, allocated: 140420, outstanding: 0 },
  { name: "Omaygodness", type: "Customer" as ContactType, received: 0, allocated: 0, outstanding: 14250 },
  { name: "Skyline Tours", type: "Customer" as ContactType, received: 0, allocated: 0, outstanding: 89500 },
  { name: "Walk-in Customer", type: "Customer" as ContactType, received: 25000, allocated: 0, outstanding: 0 },
  { name: "BlueSky Hotels", type: "Vendor" as ContactType, received: 245000, allocated: 245000, outstanding: 0 },
  { name: "Indigo Air Charters", type: "Vendor" as ContactType, received: 64200, allocated: 64200, outstanding: 64200 },
  { name: "Mountain Cab Co.", type: "Vendor" as ContactType, received: 0, allocated: 0, outstanding: 38900 },
  { name: "Coastal Resorts Ltd", type: "Vendor" as ContactType, received: 412000, allocated: 412000, outstanding: 0 },
  { name: "Meta Ads", type: "Payee" as ContactType, received: 28500, allocated: 28500, outstanding: 0 },
  { name: "Skyline Realty", type: "Payee" as ContactType, received: 65000, allocated: 65000, outstanding: 0 },
];

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const methodIcon: Record<PayMethod, typeof Banknote> = {
  Cash: Banknote,
  "Bank Transfer": Landmark,
  UPI: Smartphone,
  Card: CreditCard,
  Cheque: Receipt,
};

const saleStatusTone: Record<SaleStatus, string> = {
  Paid: "bg-success/10 text-success ring-success/20",
  Partial: "bg-warning/10 text-warning ring-warning/20",
  Unpaid: "bg-muted text-muted-foreground ring-border",
  Overdue: "bg-destructive/10 text-destructive ring-destructive/20",
};

const purchaseStatusTone: Record<PurchaseStatus, string> = {
  Received: "bg-success/10 text-success ring-success/20",
  Partial: "bg-warning/10 text-warning ring-warning/20",
  Pending: "bg-info/10 text-info ring-info/20",
};

const contactTypeTone: Record<ContactType, string> = {
  Customer: "bg-primary/10 text-primary ring-primary/20",
  Vendor: "bg-info/10 text-info ring-info/20",
  Payee: "bg-accent/15 text-accent-foreground ring-accent/30",
};

function StatusPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------ */

export default function Accounting() {
  const [tab, setTab] = useState("sales");
  const [query, setQuery] = useState("");
  const [contactFilter, setContactFilter] = useState<"all" | ContactType>("all");

  const totals = useMemo(() => {
    const salesTotal = sales.reduce((s, x) => s + x.amount, 0);
    const purchasesTotal = purchases.reduce((s, x) => s + x.amount, 0);
    const expensesTotal = expenses.reduce((s, x) => s + x.amount, 0);
    const received = payments.filter((p) => p.type === "Received").reduce((s, p) => s + p.amount, 0);
    const paidOut = payments.filter((p) => p.type === "Made").reduce((s, p) => s + p.amount, 0);
    const receivables = contacts.reduce((s, c) => s + (c.type === "Customer" ? c.outstanding : 0), 0);
    const payables = contacts.reduce((s, c) => s + (c.type === "Vendor" ? c.outstanding : 0), 0);
    const profit = salesTotal - purchasesTotal - expensesTotal;
    return { salesTotal, purchasesTotal, expensesTotal, received, paidOut, receivables, payables, profit };
  }, []);

  /* ---- filtered tables ---- */
  const q = query.trim().toLowerCase();
  const filteredSales = sales.filter((s) => !q || s.id.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q));
  const filteredPurchases = purchases.filter((p) => !q || p.id.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q));
  const filteredExpenses = expenses.filter((e) => !q || e.payee.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  const filteredPayments = payments.filter(
    (p) => !q || p.id.toLowerCase().includes(q) || p.counterparty.toLowerCase().includes(q) || p.method.toLowerCase().includes(q),
  );
  const filteredContacts = contacts.filter(
    (c) =>
      (contactFilter === "all" || c.type === contactFilter) &&
      (!q || c.name.toLowerCase().includes(q)),
  );

  return (
    <PageShell
      title="Accounting & Finance"
      description="Sales, purchases, expenses, payments, contacts, and reports — one workspace."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New entry
          </Button>
        </>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sales" value={inr(totals.salesTotal)} hint={`${sales.length} invoices`} icon={Receipt} tone="primary" />
        <StatCard label="Purchases" value={inr(totals.purchasesTotal)} hint={`${purchases.length} POs`} icon={ShoppingBag} tone="info" />
        <StatCard label="Expenses" value={inr(totals.expensesTotal)} hint={`${expenses.length} entries`} icon={Wallet} tone="warning" />
        <StatCard
          label="Net profit"
          value={inr(totals.profit)}
          hint={totals.profit >= 0 ? "In the green" : "Loss this period"}
          icon={totals.profit >= 0 ? TrendingUp : TrendingDown}
          tone={totals.profit >= 0 ? "success" : "destructive"}
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap bg-transparent p-0">
            {[
              { v: "sales", l: "Sales", icon: Receipt },
              { v: "purchases", l: "Purchases", icon: ShoppingBag },
              { v: "expenses", l: "Expenses", icon: Wallet },
              { v: "payments", l: "Payments", icon: Banknote },
              { v: "contacts", l: "Contacts", icon: Users },
              { v: "reports", l: "Reports", icon: FileBarChart },
            ].map(({ v, l, icon: Icon }) => (
              <TabsTrigger
                key={v}
                value={v}
                className="gap-1.5 rounded-xl px-3 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2 px-2 sm:px-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-9 pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* SALES */}
        <TabsContent value="sales" className="mt-6">
          <SectionCard
            title="Sales invoices"
            subtitle="Customer invoices, payment status, and dues."
            action={<InvoiceFormDialog />}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-primary">{s.id}</TableCell>
                    <TableCell className="text-muted-foreground">{s.date}</TableCell>
                    <TableCell>{s.customer}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{inr(s.amount)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(s.paid)}</TableCell>
                    <TableCell className="text-muted-foreground">{s.due}</TableCell>
                    <TableCell>
                      <StatusPill className={saleStatusTone[s.status]}>{s.status}</StatusPill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* PURCHASES */}
        <TabsContent value="purchases" className="mt-6">
          <SectionCard
            title="Purchase orders"
            subtitle="Vendor bills and supplier payments."
            action={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New PO</Button>}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>PO #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((p) => {
                  const pending = Math.max(0, p.amount - p.paid);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-primary">{p.id}</TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                      <TableCell>{p.vendor}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{inr(p.amount)}</TableCell>
                      <TableCell className="text-right tabular-nums">{inr(p.paid)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium tabular-nums",
                        pending > 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {inr(pending)}
                      </TableCell>
                      <TableCell>
                        <StatusPill className={purchaseStatusTone[p.status]}>{p.status}</StatusPill>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* EXPENSES */}
        <TabsContent value="expenses" className="mt-6">
          <SectionCard
            title="Expenses"
            subtitle="Operational spend by category and method."
            action={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Log expense</Button>}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-primary">{e.id}</TableCell>
                    <TableCell className="text-muted-foreground">{e.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{e.category}</Badge>
                    </TableCell>
                    <TableCell>{e.payee}</TableCell>
                    <TableCell className="text-muted-foreground">{e.method}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{inr(e.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* PAYMENTS */}
        <TabsContent value="payments" className="mt-6">
          <SectionCard
            title="Payments ledger"
            subtitle="Money in and out, allocated against invoices and bills."
            action={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Record payment</Button>}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Unallocated</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((p) => {
                  const unalloc = p.amount - p.allocated;
                  const Icon = methodIcon[p.method];
                  const isIn = p.type === "Received";
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-primary">{p.id}</TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                      <TableCell>
                        <StatusPill
                          className={cn(
                            "ring-1",
                            isIn
                              ? "bg-success/10 text-success ring-success/20"
                              : "bg-destructive/10 text-destructive ring-destructive/20",
                          )}
                        >
                          {isIn ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {p.type}
                        </StatusPill>
                      </TableCell>
                      <TableCell>{p.counterparty}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">{inr(p.amount)}</TableCell>
                      <TableCell className="text-right tabular-nums">{inr(p.allocated)}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          unalloc > 0 ? "font-medium text-warning" : "text-muted-foreground",
                        )}
                      >
                        {inr(unalloc)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.method}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground" title={p.note}>
                        {p.note}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* CONTACTS */}
        <TabsContent value="contacts" className="mt-6">
          <SectionCard
            title="Contacts"
            subtitle="Customers, vendors, and payees with their balance position."
            action={
              <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
                {(["all", "Customer", "Vendor", "Payee"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setContactFilter(t)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                      contactFilter === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "All" : `${t}s`}
                  </button>
                ))}
              </div>
            }
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Unallocated</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((c) => {
                  const unalloc = Math.max(0, c.received - c.allocated);
                  return (
                    <TableRow key={c.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusPill className={contactTypeTone[c.type]}>
                          {c.type === "Vendor" && <Building2 className="h-3 w-3" />}
                          {c.type === "Customer" && <Users className="h-3 w-3" />}
                          {c.type === "Payee" && <Wallet className="h-3 w-3" />}
                          {c.type}
                        </StatusPill>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{inr(c.received)}</TableCell>
                      <TableCell className="text-right tabular-nums">{inr(c.allocated)}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          unalloc > 0 ? "font-medium text-warning" : "text-muted-foreground",
                        )}
                      >
                        {inr(unalloc)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold tabular-nums",
                          c.outstanding > 0 ? "text-destructive" : "text-muted-foreground",
                        )}
                      >
                        {inr(c.outstanding)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* REPORTS */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Cash position" subtitle="Money flowing in vs out this period.">
              <div className="space-y-5 p-2">
                <ReportRow label="Money in" value={inr(totals.received)} icon={ArrowDownLeft} tone="success" />
                <ReportRow label="Money out" value={inr(totals.paidOut)} icon={ArrowUpRight} tone="destructive" />
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Net cash flow</p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {inr(totals.received - totals.paidOut)}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Receivables" subtitle="Outstanding customer balances.">
              <ReportBar label="Customers owe you" amount={totals.receivables} max={Math.max(totals.receivables, totals.payables, 1)} tone="warning" />
              <ul className="mt-4 space-y-2">
                {contacts
                  .filter((c) => c.type === "Customer" && c.outstanding > 0)
                  .sort((a, b) => b.outstanding - a.outstanding)
                  .slice(0, 4)
                  .map((c) => (
                    <li key={c.name} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground/90">{c.name}</span>
                      <span className="font-medium tabular-nums text-destructive">{inr(c.outstanding)}</span>
                    </li>
                  ))}
              </ul>
            </SectionCard>

            <SectionCard title="Payables" subtitle="What you owe vendors.">
              <ReportBar label="You owe vendors" amount={totals.payables} max={Math.max(totals.receivables, totals.payables, 1)} tone="info" />
              <ul className="mt-4 space-y-2">
                {contacts
                  .filter((c) => c.type === "Vendor" && c.outstanding > 0)
                  .sort((a, b) => b.outstanding - a.outstanding)
                  .slice(0, 4)
                  .map((c) => (
                    <li key={c.name} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground/90">{c.name}</span>
                      <span className="font-medium tabular-nums text-info">{inr(c.outstanding)}</span>
                    </li>
                  ))}
              </ul>
            </SectionCard>
          </div>

          <SectionCard title="Profit & Loss snapshot" subtitle="Top-line summary across the period." className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PLBlock label="Revenue" value={inr(totals.salesTotal)} tone="success" />
              <PLBlock label="COGS / Purchases" value={`-${inr(totals.purchasesTotal)}`} tone="info" />
              <PLBlock label="Operating expenses" value={`-${inr(totals.expensesTotal)}`} tone="warning" />
              <PLBlock
                label="Net profit"
                value={inr(totals.profit)}
                tone={totals.profit >= 0 ? "success" : "destructive"}
                emphasis
              />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

/* ---------------------------------------------------------------------------
 * Sub-components
 * ------------------------------------------------------------------------ */

function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", className)}>
      <header className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="p-2 sm:p-4">{children}</div>
    </section>
  );
}

function ReportRow({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Banknote;
  tone: "success" | "destructive";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
            tone === "success"
              ? "bg-success/10 text-success ring-success/20"
              : "bg-destructive/10 text-destructive ring-destructive/20",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-display text-base font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function ReportBar({
  label,
  amount,
  max,
  tone,
}: {
  label: string;
  amount: number;
  max: number;
  tone: "warning" | "info";
}) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-display text-xl font-semibold tabular-nums">{inr(amount)}</span>
      </div>
      <Progress value={pct} className={cn("h-2", tone === "warning" ? "[&>div]:bg-warning" : "[&>div]:bg-info")} />
    </div>
  );
}

function PLBlock({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string;
  value: string;
  tone: "success" | "destructive" | "warning" | "info";
  emphasis?: boolean;
}) {
  const toneClass = {
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning",
    info: "text-info",
  }[tone];
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 p-4",
        emphasis ? "bg-gradient-primary/5 ring-1 ring-primary/20" : "bg-muted/20",
      )}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold tabular-nums", emphasis ? toneClass : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}