import { useMemo, useState } from "react";
import { Gift, MoreHorizontal, Pencil, Plus, Power, Search, ShoppingBag, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Promotion = {
  id: string;
  name: string;
  code: string;
  type: string;
  status: "Enabled" | "Disabled";
  usage: number;
  expiry: string;
};

type AnnualWish = {
  id: string;
  customerName: string;
  phoneNumber: string;
  type: "Birthday" | "Wedding Anniversary";
  eventDate: string;
  notificationDate: string;
};

type BogoProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
};

const seedPromotions: Promotion[] = [
  { id: "PR-001", name: "Summer Splash", code: "SUMMER25", type: "Flat 25% Off", status: "Enabled", usage: 128, expiry: "2026-06-30" },
  { id: "PR-002", name: "First Order", code: "WELCOME10", type: "10% Welcome", status: "Enabled", usage: 84, expiry: "2026-12-31" },
  { id: "PR-003", name: "Travel Fest", code: "TRAVEL500", type: "Flat ₹500 Off", status: "Disabled", usage: 22, expiry: "2026-07-15" },
];

const seedAnnualWishes: AnnualWish[] = [
  { id: "AW-001", customerName: "Aarav Mehta", phoneNumber: "+91 98200 11223", type: "Birthday", eventDate: "2026-05-12", notificationDate: "2026-05-10" },
  { id: "AW-002", customerName: "Neha Kapoor", phoneNumber: "+91 98990 22334", type: "Wedding Anniversary", eventDate: "2026-06-03", notificationDate: "2026-06-01" },
  { id: "AW-003", customerName: "Rohit Sharma", phoneNumber: "+91 98765 33445", type: "Birthday", eventDate: "2026-07-22", notificationDate: "2026-07-20" },
];

const bogoProducts: BogoProduct[] = [
  { id: "PRD-001", name: "iPhone 15 Pro", sku: "APL-IP15P-256", category: "Mobiles" },
  { id: "PRD-002", name: "Samsung Galaxy S24", sku: "SAM-GS24-128", category: "Mobiles" },
  { id: "PRD-003", name: 'MacBook Pro 14"', sku: "APL-MBP14-M3", category: "Computers" },
  { id: "PRD-004", name: "Cotton Casual Shirt", sku: "FAS-MS-CS-01", category: "Men's Wear" },
  { id: "PRD-005", name: "Floral Summer Dress", sku: "FAS-WS-DR-12", category: "Women's Wear" },
  { id: "PRD-006", name: "Goa Beach Holiday 5N", sku: "TRV-GOA-5N", category: "Travel Packages" },
];

export default function PromotionsOffers() {
  const [search, setSearch] = useState("");
  const [promotions, setPromotions] = useState(seedPromotions);
  const [annualWishes, setAnnualWishes] = useState(seedAnnualWishes);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);
  const [promotionMode, setPromotionMode] = useState<"coupon" | "bogo" | null>(null);
  const [couponType, setCouponType] = useState<"percentage" | "flat" | "free-shipping">("percentage");
  const [promotionBogoOpen, setPromotionBogoOpen] = useState(false);
  const [promotionOpen, setPromotionOpen] = useState(false);
  const [annualWishOpen, setAnnualWishOpen] = useState(false);
  const [bogoProductSearch, setBogoProductSearch] = useState("");
  const [bogoSelectedProducts, setBogoSelectedProducts] = useState<string[]>([]);
  const [couponPercentage, setCouponPercentage] = useState("");
  const [couponAmount, setCouponAmount] = useState("");
  const [couponMinOrderValue, setCouponMinOrderValue] = useState("");

  const filteredPromotions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return promotions.filter((promo) =>
      !q ||
      promo.name.toLowerCase().includes(q) ||
      promo.code.toLowerCase().includes(q) ||
      promo.type.toLowerCase().includes(q) ||
      promo.status.toLowerCase().includes(q),
    );
  }, [promotions, search]);

  const filteredAnnualWishes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return annualWishes.filter((wish) =>
      !q ||
      wish.customerName.toLowerCase().includes(q) ||
      wish.type.toLowerCase().includes(q),
    );
  }, [annualWishes, search]);

  const togglePromotion = (id: string) => {
    setPromotions((prev) =>
      prev.map((promo) =>
        promo.id === id
          ? { ...promo, status: promo.status === "Enabled" ? "Disabled" : "Enabled" }
          : promo,
      ),
    );
    toast.success("Promotion updated");
  };

  const filteredBogoProducts = useMemo(() => {
    const q = bogoProductSearch.trim().toLowerCase();
    return bogoProducts.filter((product) =>
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q),
    );
  }, [bogoProductSearch]);

  const selectedBogoProductLabels = useMemo(
    () => bogoProducts.filter((p) => bogoSelectedProducts.includes(p.id)),
    [bogoSelectedProducts],
  );

  return (
    <PageShell
      title="Promotions & Offers"
      description="Manage promotions, coupons and annual wish reminders."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setSearch("")}>
            <Search className="h-4 w-4" /> Reset
          </Button>
        </div>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-2 lg:w-[420px]">
            <Label htmlFor="promo-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="promo-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search promotion, code, customer, or type"
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="promotions">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="annual-wish">Annual Wish</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="promotions" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Promotions</h2>
                <p className="text-sm text-muted-foreground">Coupon codes, offers and campaign status.</p>
              </div>
              <Button onClick={() => setPromotionPickerOpen(true)}>
                <Plus className="h-4 w-4" /> Add Promotion
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell className="font-mono text-xs">{promo.code}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{promo.type}</TableCell>
                    <TableCell>
                      <Badge variant={promo.status === "Enabled" ? "default" : "secondary"}>
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{promo.usage}</TableCell>
                    <TableCell>{promo.expiry}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePromotion(promo.id)}>
                            <Power className="h-4 w-4 mr-2" />
                            {promo.status === "Enabled" ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPromotions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No promotions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="annual-wish" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Annual Wish</h2>
                <p className="text-sm text-muted-foreground">Birthday and anniversary reminders.</p>
              </div>
              <Button variant="outline" onClick={() => setAnnualWishOpen(true)}>
                <Plus className="h-4 w-4" /> Add Annual Wish
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Notification Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnualWishes.map((wish) => (
                    <TableRow key={wish.id}>
                    <TableCell className="font-medium">
                      <div>{wish.customerName}</div>
                      <div className="text-xs text-muted-foreground">{wish.phoneNumber}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{wish.type}</Badge>
                    </TableCell>
                    <TableCell>{wish.eventDate}</TableCell>
                    <TableCell>{wish.notificationDate}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAnnualWishes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No annual wishes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
      </TabsContent>
      </Tabs>

      <Sheet open={promotionPickerOpen} onOpenChange={setPromotionPickerOpen}>
        <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Promotion</SheetTitle>
            <SheetDescription>Choose the promotion type you want to create.</SheetDescription>
          </SheetHeader>

          <div className="grid gap-3 py-6">
            <button
              type="button"
              onClick={() => {
                setPromotionPickerOpen(false);
                setPromotionMode("coupon");
                setCouponType("percentage");
                setPromotionOpen(true);
              }}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Gift className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold">Coupon</div>
                <div className="text-sm text-muted-foreground">
                  Standard promotion form with code, type, status and expiry.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPromotionPickerOpen(false);
                setPromotionMode("bogo");
                setPromotionBogoOpen(true);
              }}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold">BOGO</div>
                <div className="text-sm text-muted-foreground">
                  Buy-one-get-one promotion setup.
                </div>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={promotionOpen}
        onOpenChange={(open) => {
          setPromotionOpen(open);
          if (!open) {
            setPromotionMode(null);
            setCouponPercentage("");
            setCouponAmount("");
            setCouponMinOrderValue("");
          }
        }}
      >
        <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{promotionMode === "coupon" ? "Add Coupon" : "Add Promotion"}</SheetTitle>
            <SheetDescription>Create a new coupon code promotion.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input placeholder="Promotion name" />
            </div>
            <div className="grid gap-2">
              <Label>Code</Label>
              <Input placeholder="PROMO10" />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={couponType}
                onValueChange={(value) => setCouponType(value as typeof couponType)}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="flat">Flat Discount</SelectItem>
                  <SelectItem value="free-shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {couponType === "percentage" && (
              <div className="grid gap-2">
                <Label>Percentage Off</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={couponPercentage}
                  onChange={(e) => setCouponPercentage(e.target.value)}
                  placeholder="Enter percentage"
                />
              </div>
            )}
            {couponType === "flat" && (
              <div className="grid gap-2">
                <Label>Discount Amount</Label>
                <Input
                  type="number"
                  min={1}
                  value={couponAmount}
                  onChange={(e) => setCouponAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Coupon Condition - Minimum Order Value</Label>
              <Input
                type="number"
                min={0}
                value={couponMinOrderValue}
                onChange={(e) => setCouponMinOrderValue(e.target.value)}
                placeholder="Enter minimum order value"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select defaultValue="enabled">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPromotionOpen(false);
                setPromotionMode(null);
                setCouponPercentage("");
                setCouponAmount("");
                setCouponMinOrderValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPromotionOpen(false);
                setPromotionMode(null);
                setCouponPercentage("");
                setCouponAmount("");
                setCouponMinOrderValue("");
              }}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={promotionBogoOpen}
        onOpenChange={(open) => {
          setPromotionBogoOpen(open);
          if (!open) setPromotionMode(null);
        }}
      >
        <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add BOGO</SheetTitle>
            <SheetDescription>Set up a buy-one-get-one style promotion.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label>Offer Name</Label>
              <Input placeholder="BOGO offer name" />
            </div>
            <div className="grid gap-2">
              <Label>Select Product</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    {bogoSelectedProducts.length > 0
                      ? `${bogoSelectedProducts.length} product(s) selected`
                      : "Choose products"}
                    <Search className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[28rem] p-3">
                  <div className="mb-3">
                    <Input
                      value={bogoProductSearch}
                      onChange={(e) => setBogoProductSearch(e.target.value)}
                      placeholder="Search products"
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto pr-1">
                    {filteredBogoProducts.map((product) => {
                      const checked = bogoSelectedProducts.includes(product.id);
                      return (
                        <DropdownMenuCheckboxItem
                          key={product.id}
                          checked={checked}
                          onCheckedChange={(value) => {
                            setBogoSelectedProducts((prev) =>
                              value
                                ? [...prev, product.id]
                                : prev.filter((id) => id !== product.id),
                            );
                          }}
                        >
                          <div className="flex w-full items-center justify-between gap-3">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {product.sku} • {product.category}
                              </div>
                            </div>
                          </div>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                    {filteredBogoProducts.length === 0 && (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        No products found.
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {selectedBogoProductLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedBogoProductLabels.map((product) => (
                  <Badge key={product.id} variant="secondary" className="rounded-full px-3 py-1">
                    {product.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="grid gap-2">
              <Label>BOGO Rule</Label>
              <Select defaultValue="buy1get1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy1get1">Buy 1 Get 1</SelectItem>
                  <SelectItem value="buy2get1">Buy 2 Get 1</SelectItem>
                  <SelectItem value="buy3get1">Buy 3 Get 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select defaultValue="enabled">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setPromotionBogoOpen(false)}>Cancel</Button>
            <Button onClick={() => setPromotionBogoOpen(false)}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={annualWishOpen} onOpenChange={setAnnualWishOpen}>
        <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Annual Wish</SheetTitle>
            <SheetDescription>Add a birthday or wedding anniversary reminder.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input placeholder="Customer name" />
            </div>
            <div className="grid gap-2">
              <Label>Wish Person Name</Label>
              <Input placeholder="Person to wish" />
            </div>
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input placeholder="+91 98765 43210" />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="wedding-anniversary">Wedding Anniversary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Event Date</Label>
              <Input type="date" />
            </div>
            <div className="grid gap-2">
              <Label>Notification Date</Label>
              <Input type="date" />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setAnnualWishOpen(false)}>Cancel</Button>
            <Button onClick={() => setAnnualWishOpen(false)}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}
