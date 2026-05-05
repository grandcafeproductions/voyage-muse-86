import { useState } from "react";
import { MoreVertical, Plus, Truck, Search, Printer, Bell, Pencil, Trash2 } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type ShipmentStatus = "Pending" | "In Transit" | "Out for Delivery" | "Delivered" | "Delayed";

interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  destination: string;
  eta: string;
  status: ShipmentStatus;
}

const initialShipments: Shipment[] = [
  { id: "SHP-1001", orderId: "ORD-2041", carrier: "Bluedart", destination: "Mumbai, Maharashtra", eta: "2026-05-08", status: "In Transit" },
  { id: "SHP-1002", orderId: "ORD-2042", carrier: "DHL Express", destination: "San Francisco, CA", eta: "2026-05-12", status: "Pending" },
  { id: "SHP-1003", orderId: "ORD-2043", carrier: "Delhivery", destination: "Gurugram, Haryana", eta: "2026-05-06", status: "Out for Delivery" },
  { id: "SHP-1004", orderId: "ORD-2044", carrier: "FedEx", destination: "Singapore", eta: "2026-05-10", status: "Delivered" },
  { id: "SHP-1005", orderId: "ORD-2045", carrier: "Aramex", destination: "Sydney, Australia", eta: "2026-05-14", status: "Delayed" },
  { id: "SHP-1006", orderId: "ORD-2046", carrier: "India Post", destination: "Kochi, Kerala", eta: "2026-05-09", status: "In Transit" },
];

const statusVariant = (s: ShipmentStatus) => {
  switch (s) {
    case "Delivered":
      return "default";
    case "Delayed":
      return "destructive";
    case "Pending":
      return "secondary";
    default:
      return "outline";
  }
};

export default function Shipping() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Shipment>>({ status: "Pending" });

  const filtered = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.orderId.toLowerCase().includes(query.toLowerCase()) ||
      s.destination.toLowerCase().includes(query.toLowerCase()),
  );

  const addShipment = () => {
    if (!draft.orderId || !draft.carrier || !draft.destination || !draft.eta) {
      toast({ title: "Missing fields", description: "Please complete all fields." });
      return;
    }
    const id = `SHP-${1000 + shipments.length + 1}`;
    setShipments((p) => [
      { id, orderId: draft.orderId!, carrier: draft.carrier!, destination: draft.destination!, eta: draft.eta!, status: (draft.status as ShipmentStatus) || "Pending" },
      ...p,
    ]);
    setDraft({ status: "Pending" });
    setOpen(false);
    toast({ title: "Shipment created", description: id });
  };

  const remove = (id: string) => {
    setShipments((p) => p.filter((s) => s.id !== id));
    toast({ title: "Shipment deleted", description: id });
  };

  return (
    <PageShell
      title="Shipping"
      description="Track all outbound shipments and manage delivery status."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" /> Add Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create shipment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Order ID</Label>
                <Input value={draft.orderId ?? ""} onChange={(e) => setDraft({ ...draft, orderId: e.target.value })} placeholder="ORD-XXXX" />
              </div>
              <div className="grid gap-1.5">
                <Label>Carrier</Label>
                <Input value={draft.carrier ?? ""} onChange={(e) => setDraft({ ...draft, carrier: e.target.value })} placeholder="Bluedart, DHL..." />
              </div>
              <div className="grid gap-1.5">
                <Label>Destination</Label>
                <Input value={draft.destination ?? ""} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} placeholder="City, Country" />
              </div>
              <div className="grid gap-1.5">
                <Label>ETA</Label>
                <Input type="date" value={draft.eta ?? ""} onChange={(e) => setDraft({ ...draft, eta: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select value={draft.status as string} onValueChange={(v) => setDraft({ ...draft, status: v as ShipmentStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Pending", "In Transit", "Out for Delivery", "Delivered", "Delayed"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={addShipment}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search shipments..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    {s.orderId}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.id}</div>
                </TableCell>
                <TableCell>{s.carrier}</TableCell>
                <TableCell>{s.destination}</TableCell>
                <TableCell>{s.eta}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(s.status) as any}>{s.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "Update shipment", description: s.id })}>
                        <Pencil className="mr-2 h-4 w-4" /> Update
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Printing label", description: s.id })}>
                        <Printer className="mr-2 h-4 w-4" /> Print Label
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Notification sent", description: s.orderId })}>
                        <Bell className="mr-2 h-4 w-4" /> Send Notification
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => remove(s.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No shipments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}