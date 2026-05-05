import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Globe, Ruler, Calculator, Plus, Truck, Settings } from "lucide-react";
import { PageShell } from "@/components/page-shell";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const dispatchPoints = [
  { id: "DP-01", name: "Kochi Warehouse", address: "Palarivattom, Kochi, Kerala", contact: "+91 98765 43210", status: "Active" },
  { id: "DP-02", name: "Mumbai Hub", address: "Andheri West, Mumbai, Maharashtra", contact: "+91 99887 11223", status: "Active" },
  { id: "DP-03", name: "Delhi Depot", address: "Sector 44, Gurugram, Haryana", contact: "+91 90876 54321", status: "Inactive" },
];

const shippingZones = [
  { id: "ZN-01", name: "South India", countries: "India", regions: "KL, TN, KA, AP, TS", carriers: "Bluedart, Delhivery" },
  { id: "ZN-02", name: "North India", countries: "India", regions: "DL, HR, UP, PB", carriers: "Delhivery, India Post" },
  { id: "ZN-03", name: "International - APAC", countries: "Singapore, Australia", regions: "All", carriers: "DHL, FedEx" },
  { id: "ZN-04", name: "International - Americas", countries: "USA, Canada", regions: "All", carriers: "FedEx, Aramex" },
];

const shippingRules = [
  { id: "RL-01", name: "Free shipping over ₹2000", zone: "South India", condition: "Order ≥ ₹2000", rate: "₹0", status: "Enabled" },
  { id: "RL-02", name: "Standard South", zone: "South India", condition: "0–5 kg", rate: "₹80", status: "Enabled" },
  { id: "RL-03", name: "Express North", zone: "North India", condition: "0–2 kg", rate: "₹150", status: "Enabled" },
  { id: "RL-04", name: "International Standard", zone: "APAC", condition: "0–1 kg", rate: "₹1200", status: "Enabled" },
];

export default function ShippingSetup() {
  const navigate = useNavigate();
  const [zone, setZone] = useState("ZN-01");
  const [weight, setWeight] = useState("1");
  const [value, setValue] = useState("1500");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const w = parseFloat(weight) || 0;
    const v = parseFloat(value) || 0;
    let rate = 80;
    if (zone === "ZN-02") rate = 150;
    if (zone === "ZN-03") rate = 1200;
    if (zone === "ZN-04") rate = 1500;
    const total = v >= 2000 && zone === "ZN-01" ? 0 : Math.round(rate * Math.max(1, w));
    setResult(`Estimated shipping: ₹${total}`);
  };

  return (
    <PageShell
      title="Setup Shipping"
      description="Configure dispatch points, zones, rules and rate calculator."
    >
      <Tabs
        value="setup"
        onValueChange={(v) => {
          if (v === "orders") navigate("/shipping");
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="orders">
            <Truck className="mr-2 h-4 w-4" /> Shipping Orders
          </TabsTrigger>
          <TabsTrigger value="setup">
            <Settings className="mr-2 h-4 w-4" /> Setup Shipping
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs defaultValue="dispatch">
        <TabsList>
          <TabsTrigger value="dispatch"><MapPin className="mr-2 h-4 w-4" /> Dispatch Points</TabsTrigger>
          <TabsTrigger value="zones"><Globe className="mr-2 h-4 w-4" /> Shipping Zones</TabsTrigger>
          <TabsTrigger value="rules"><Ruler className="mr-2 h-4 w-4" /> Shipping Rules</TabsTrigger>
          <TabsTrigger value="calculator"><Calculator className="mr-2 h-4 w-4" /> Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="dispatch" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => toast({ title: "Add dispatch point" })}><Plus className="mr-1 h-4 w-4" /> Add Dispatch Point</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatchPoints.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell className="text-muted-foreground">{d.address}</TableCell>
                    <TableCell>{d.contact}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === "Active" ? "default" : "secondary"}>{d.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => toast({ title: "Add shipping zone" })}><Plus className="mr-1 h-4 w-4" /> Add Zone</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead>Regions</TableHead>
                  <TableHead>Carriers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingZones.map((z) => (
                  <TableRow key={z.id}>
                    <TableCell className="font-medium">{z.id}</TableCell>
                    <TableCell>{z.name}</TableCell>
                    <TableCell>{z.countries}</TableCell>
                    <TableCell className="text-muted-foreground">{z.regions}</TableCell>
                    <TableCell>{z.carriers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => toast({ title: "Add shipping rule" })}><Plus className="mr-1 h-4 w-4" /> Add Rule</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingRules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.zone}</TableCell>
                    <TableCell className="text-muted-foreground">{r.condition}</TableCell>
                    <TableCell>{r.rate}</TableCell>
                    <TableCell><Badge>{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="mt-4">
          <div className="max-w-xl rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-base font-semibold">Shipping Rate Calculator</h3>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>Zone</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {shippingZones.map((z) => (
                      <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Order Value (₹)</Label>
                  <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
              </div>
              <Button onClick={calculate}><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
              {result && (
                <div className="rounded-md border bg-muted/30 p-3 text-sm font-medium">{result}</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}