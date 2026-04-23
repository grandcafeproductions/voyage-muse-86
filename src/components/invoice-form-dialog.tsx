import { useMemo, useState } from "react";
import { CalendarIcon, Plus, Trash2, Receipt } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
};

const inr = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v || 0);

function DatePickerField({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value?: Date;
  onChange: (d?: Date) => void;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd MMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

export function InvoiceFormDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const inAWeek = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }, []);

  // Header
  const [invoiceNo, setInvoiceNo] = useState("INV-1042");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(today);
  const [dueDate, setDueDate] = useState<Date | undefined>(inAWeek);
  const [poNumber, setPoNumber] = useState("");

  // Parties
  const [billTo, setBillTo] = useState("");
  const [billAddr, setBillAddr] = useState("");
  const [shipSame, setShipSame] = useState(true);
  const [shipTo, setShipTo] = useState("");
  const [shipAddr, setShipAddr] = useState("");

  // Items
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 },
  ]);

  // Tax / details
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 7 days.");

  // Payment
  const [recordPayment, setRecordPayment] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [txnId, setTxnId] = useState("");
  const [useUnallocated, setUseUnallocated] = useState(false);

  // Mock available unallocated balance for this customer
  const unallocatedAvailable = 25000;

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0),
    [items],
  );
  const taxAmount = useMemo(() => (subtotal - discount) * (taxRate / 100), [subtotal, discount, taxRate]);
  const total = useMemo(() => Math.max(0, subtotal - discount + taxAmount), [subtotal, discount, taxAmount]);

  // Amount actually deducted from unallocated funds (capped at total)
  const fundsApplied = useMemo(
    () => (recordPayment && useUnallocated ? Math.min(unallocatedAvailable, total) : 0),
    [recordPayment, useUnallocated, total, unallocatedAvailable],
  );
  // Remaining due after applying unallocated funds — this is the max for manual payment input
  const remainingAfterFunds = useMemo(() => Math.max(0, total - fundsApplied), [total, fundsApplied]);
  // Funds fully cover the invoice — disable manual input
  const fullyCoveredByFunds = recordPayment && useUnallocated && remainingAfterFunds === 0 && total > 0;
  // Effective manual payment (clamped)
  const effectivePayAmount = useMemo(
    () => (fullyCoveredByFunds ? 0 : Math.min(Math.max(0, payAmount), remainingAfterFunds)),
    [fullyCoveredByFunds, payAmount, remainingAfterFunds],
  );
  const balanceDue = useMemo(
    () => Math.max(0, total - fundsApplied - effectivePayAmount),
    [total, fundsApplied, effectivePayAmount],
  );

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const addItem = () =>
    setItems((prev) => [...prev, { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 }]);

  const removeItem = (id: string) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const handleSave = () => {
    if (!billTo.trim()) {
      toast.error("Please enter the Bill To party.");
      return;
    }
    if (!invoiceDate || !dueDate) {
      toast.error("Invoice date and due date are required.");
      return;
    }
    if (items.some((it) => !it.description.trim())) {
      toast.error("Each line item needs a description.");
      return;
    }
    toast.success(`Invoice ${invoiceNo} created`, {
      description: `${inr(total)} • ${recordPayment ? `${inr(payAmount)} paid` : "Unpaid"}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" /> Create invoice
          </DialogTitle>
          <DialogDescription>
            Fill in invoice details, items, taxes, and optionally record a payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Header fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-no">Invoice number</Label>
              <Input id="inv-no" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} maxLength={40} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-no">PO number</Label>
              <Input id="po-no" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="Optional" maxLength={40} />
            </div>
            <div className="space-y-2">
              <Label>Invoice date</Label>
              <DatePickerField value={invoiceDate} onChange={setInvoiceDate} />
            </div>
            <div className="space-y-2">
              <Label>Due date</Label>
              <DatePickerField value={dueDate} onChange={setDueDate} />
            </div>
          </div>

          <Separator />

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bill-to">Bill to</Label>
              <Input id="bill-to" value={billTo} onChange={(e) => setBillTo(e.target.value)} placeholder="Customer name" maxLength={120} />
              <Textarea
                value={billAddr}
                onChange={(e) => setBillAddr(e.target.value)}
                placeholder="Billing address"
                rows={3}
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ship-to">Ship to</Label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={shipSame} onCheckedChange={(v) => setShipSame(!!v)} />
                  Same as billing
                </label>
              </div>
              <Input
                id="ship-to"
                value={shipSame ? billTo : shipTo}
                onChange={(e) => setShipTo(e.target.value)}
                placeholder="Recipient name"
                disabled={shipSame}
                maxLength={120}
              />
              <Textarea
                value={shipSame ? billAddr : shipAddr}
                onChange={(e) => setShipAddr(e.target.value)}
                placeholder="Shipping address"
                rows={3}
                disabled={shipSame}
                maxLength={500}
              />
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Invoice items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add item
              </Button>
            </div>
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {items.map((it) => {
                const amount = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                return (
                  <div key={it.id} className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-border/60 items-center">
                    <div className="col-span-6">
                      <Input
                        value={it.description}
                        onChange={(e) => updateItem(it.id, { description: e.target.value })}
                        placeholder="Service or product"
                        maxLength={200}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={0}
                        value={it.qty}
                        onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })}
                        className="text-right tabular-nums"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={0}
                        value={it.rate}
                        onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) })}
                        className="text-right tabular-nums"
                      />
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium tabular-nums">{inr(amount)}</div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(it.id)}
                        disabled={items.length === 1}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax & details + Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Tax & details</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tax" className="text-xs text-muted-foreground">Tax rate (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    min={0}
                    max={100}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="disc" className="text-xs text-muted-foreground">Discount (₹)</Label>
                  <Input
                    id="disc"
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs text-muted-foreground">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={500} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="terms" className="text-xs text-muted-foreground">Terms</Label>
                <Textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} rows={2} maxLength={500} />
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2 h-fit">
              <Row label="Subtotal" value={inr(subtotal)} />
              <Row label="Discount" value={`- ${inr(discount)}`} />
              <Row label={`Tax (${taxRate}%)`} value={inr(taxAmount)} />
              <Separator className="my-2" />
              <Row label="Total" value={inr(total)} bold />
              {recordPayment && (
                <>
                  <Row label="Paid now" value={`- ${inr(payAmount)}`} />
                  <Row label="Balance due" value={inr(balanceDue)} bold />
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Record payment */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <Checkbox checked={recordPayment} onCheckedChange={(v) => setRecordPayment(!!v)} />
              <span className="text-sm font-medium">Record payment</span>
            </label>

            {recordPayment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="space-y-2">
                  <Label htmlFor="pay-amt">Amount</Label>
                  <Input
                    id="pay-amt"
                    type="number"
                    min={0}
                    max={total}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Select value={payMethod} onValueChange={setPayMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="txn">Transaction ID</Label>
                  <Input
                    id="txn"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="UPI ref / cheque no / bank txn"
                    maxLength={80}
                  />
                </div>
                <label className="sm:col-span-2 flex items-start gap-2 rounded-md bg-background/60 border border-border/60 p-3">
                  <Checkbox
                    checked={useUnallocated}
                    onCheckedChange={(v) => setUseUnallocated(!!v)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Use unallocated funds</div>
                      <div className="text-sm font-semibold text-success">{inr(25000)}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Apply existing on-account balance from this customer toward this invoice.
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between text-sm", bold && "text-base font-semibold")}>
      <span className={cn(!bold && "text-muted-foreground")}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
