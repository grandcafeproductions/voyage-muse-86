import { useState } from "react";
import { MoreVertical, Search, ShoppingCart, Bell, Gift, Mail, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  image?: string;
}

interface AbandonedCart {
  id: string;
  customer: string;
  email: string;
  cartValue: number;
  itemCount: number;
  idle: string;
  phone?: string;
  items: CartItem[];
}

const carts: AbandonedCart[] = [
  {
    id: "CART-9001", customer: "Aarav Mehta", email: "aarav@example.com", phone: "+91 98765 43210",
    cartValue: 12499, itemCount: 3, idle: "2h",
    items: [
      { name: "Wireless Headphones Pro", sku: "WH-PRO-01", qty: 1, price: 8999 },
      { name: "USB-C Cable 2m", sku: "USB-C-2M", qty: 2, price: 1750 },
    ],
  },
  {
    id: "CART-9002", customer: "Sara Williams", email: "sara@example.com", phone: "+1 415 555 0142",
    cartValue: 4599, itemCount: 1, idle: "5h",
    items: [{ name: "Leather Wallet", sku: "LW-22", qty: 1, price: 4599 }],
  },
  {
    id: "CART-9003", customer: "Rohit Sharma", email: "rohit@example.com", phone: "+91 99887 11223",
    cartValue: 28999, itemCount: 6, idle: "1d",
    items: [
      { name: "Smart Watch Series 7", sku: "SW-7", qty: 1, price: 18999 },
      { name: "Phone Case", sku: "PC-12", qty: 3, price: 999 },
      { name: "Charger 30W", sku: "CH-30", qty: 2, price: 3500 },
    ],
  },
  {
    id: "CART-9004", customer: "Mei Lin", email: "mei@example.com", phone: "+65 8123 4567",
    cartValue: 7250, itemCount: 2, idle: "3d",
    items: [
      { name: "Yoga Mat Premium", sku: "YM-PR", qty: 1, price: 4250 },
      { name: "Water Bottle 1L", sku: "WB-1L", qty: 1, price: 3000 },
    ],
  },
  {
    id: "CART-9005", customer: "Liam O'Connor", email: "liam@example.com", phone: "+353 86 123 4567",
    cartValue: 1899, itemCount: 1, idle: "12h",
    items: [{ name: "Coffee Beans 500g", sku: "CB-500", qty: 1, price: 1899 }],
  },
  {
    id: "CART-9006", customer: "Anjali Nair", email: "anjali@example.com", phone: "+91 90876 54321",
    cartValue: 16400, itemCount: 4, idle: "6h",
    items: [
      { name: "Bluetooth Speaker", sku: "BT-SP", qty: 1, price: 7900 },
      { name: "LED Desk Lamp", sku: "LED-DL", qty: 1, price: 4500 },
      { name: "Notebook A5", sku: "NB-A5", qty: 2, price: 2000 },
    ],
  },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function AbandonedCarts() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AbandonedCart | null>(null);

  const filtered = carts.filter(
    (c) =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.customer.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageShell
      title="Abandoned Carts"
      description="Recover lost sales with timely nudges and offers."
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search carts..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cart ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cart Value</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Idle</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    {c.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{c.customer}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </TableCell>
                <TableCell>{inr.format(c.cartValue)}</TableCell>
                <TableCell>{c.itemCount}</TableCell>
                <TableCell>
                  <Badge variant="outline">{c.idle}</Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "Notification sent", description: c.customer })}>
                        <Bell className="mr-2 h-4 w-4" /> Send Notification
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Offer sent", description: c.customer })}>
                        <Gift className="mr-2 h-4 w-4" /> Send Offer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No abandoned carts.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-[60vw] !max-w-none overflow-y-auto p-0 sm:!max-w-none">
          {selected && (
            <div className="flex flex-col">
              <SheetHeader className="border-b p-6">
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> {selected.id}
                </SheetTitle>
                <SheetDescription>Abandoned cart details</SheetDescription>
              </SheetHeader>

              <div className="grid gap-6 p-6">
                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Customer</div>
                    <div className="font-medium">{selected.customer}</div>
                    <div className="text-xs text-muted-foreground">{selected.email}</div>
                    {selected.phone && <div className="text-xs text-muted-foreground">{selected.phone}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Idle since</div>
                    <Badge variant="outline" className="mt-1">{selected.idle}</Badge>
                    <div className="mt-2 text-xs text-muted-foreground">Cart Value</div>
                    <div className="text-lg font-semibold">{inr.format(selected.cartValue)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Items ({selected.itemCount})</h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.items.map((it) => (
                          <TableRow key={it.sku}>
                            <TableCell className="font-medium">{it.name}</TableCell>
                            <TableCell className="text-muted-foreground">{it.sku}</TableCell>
                            <TableCell className="text-right">{it.qty}</TableCell>
                            <TableCell className="text-right">{inr.format(it.price)}</TableCell>
                            <TableCell className="text-right font-medium">{inr.format(it.price * it.qty)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <Button onClick={() => toast({ title: "Reminder email sent", description: selected.customer })}>
                    <Mail className="mr-2 h-4 w-4" /> Send Reminder
                  </Button>
                  <Button variant="secondary" onClick={() => toast({ title: "Notification sent", description: selected.customer })}>
                    <Bell className="mr-2 h-4 w-4" /> Notify
                  </Button>
                  <Button variant="secondary" onClick={() => toast({ title: "Offer sent", description: selected.customer })}>
                    <Gift className="mr-2 h-4 w-4" /> Send Offer
                  </Button>
                  <Button variant="destructive" onClick={() => { toast({ title: "Cart removed", description: selected.id }); setSelected(null); }}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}