import { useState } from "react";
import { MoreVertical, Search, ShoppingCart, Bell, Gift } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

interface AbandonedCart {
  id: string;
  customer: string;
  email: string;
  cartValue: number;
  itemCount: number;
  idle: string;
}

const carts: AbandonedCart[] = [
  { id: "CART-9001", customer: "Aarav Mehta", email: "aarav@example.com", cartValue: 12499, itemCount: 3, idle: "2h" },
  { id: "CART-9002", customer: "Sara Williams", email: "sara@example.com", cartValue: 4599, itemCount: 1, idle: "5h" },
  { id: "CART-9003", customer: "Rohit Sharma", email: "rohit@example.com", cartValue: 28999, itemCount: 6, idle: "1d" },
  { id: "CART-9004", customer: "Mei Lin", email: "mei@example.com", cartValue: 7250, itemCount: 2, idle: "3d" },
  { id: "CART-9005", customer: "Liam O'Connor", email: "liam@example.com", cartValue: 1899, itemCount: 1, idle: "12h" },
  { id: "CART-9006", customer: "Anjali Nair", email: "anjali@example.com", cartValue: 16400, itemCount: 4, idle: "6h" },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function AbandonedCarts() {
  const [query, setQuery] = useState("");

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
              <TableRow key={c.id}>
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
                <TableCell>
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
    </PageShell>
  );
}