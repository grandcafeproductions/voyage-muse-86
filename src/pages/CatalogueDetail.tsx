import { useMemo, useState, type ElementType } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MoreHorizontal, Eye, Pencil, Copy, Power, Trash2, CheckCircle2, Sparkles, Shirt, Image as ImageIcon, Boxes, DollarSign, Truck, ShieldCheck, Search, Globe, EyeOff, CalendarDays } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleCatalogues, sampleGroups, sampleProducts } from "@/data/catalogue-data";

export default function CatalogueDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerType, setOfferType] = useState<"bogo" | "discount" | null>(null);
  const [offerPercent, setOfferPercent] = useState("");
  const [offerRule, setOfferRule] = useState("buy1get1");

  const isCatalogue = type === "catalogue";
  const cat = isCatalogue ? sampleCatalogues.find((c) => c.id === id) : null;
  const grp = !isCatalogue ? sampleGroups.find((g) => g.id === id) : null;

  const title = cat?.name ?? grp?.name ?? "Not found";
  const subtitle = isCatalogue
    ? `Products listed under catalogue • ${cat?.id ?? ""}`
    : `Products in group • ${grp?.catalogue ?? ""}`;

  const scopedProducts = useMemo(() => {
    return sampleProducts.filter((p) => {
      if (isCatalogue) return p.catalogue === cat?.name;
      return p.group === grp?.name;
    });
  }, [cat?.name, grp?.name, isCatalogue]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(scopedProducts.map((p) => p.category))).sort(),
    [scopedProducts],
  );

  const products = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    return scopedProducts.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.group.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && p.status === "Active") ||
        (statusFilter === "draft" && p.status === "Draft");
      const matchesMin = min === null || p.price >= min;
      const matchesMax = max === null || p.price <= max;

      return matchesSearch && matchesCategory && matchesStatus && matchesMin && matchesMax;
    });
  }, [categoryFilter, maxPrice, minPrice, scopedProducts, search, statusFilter]);

  const selectedCount = selectedProductIds.length;
  const allVisibleSelected = products.length > 0 && products.every((product) => selectedProductIds.includes(product.id));
  const someVisibleSelected = products.some((product) => selectedProductIds.includes(product.id)) && !allVisibleSelected;

  const toggleProductSelection = (productId: string, checked: boolean) => {
    setSelectedProductIds((prev) => {
      if (checked) {
        return prev.includes(productId) ? prev : [...prev, productId];
      }
      return prev.filter((id) => id !== productId);
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedProductIds((prev) => {
      if (checked) {
        const merged = new Set(prev);
        products.forEach((product) => merged.add(product.id));
        return Array.from(merged);
      }
      const visibleIds = new Set(products.map((product) => product.id));
      return prev.filter((productId) => !visibleIds.has(productId));
    });
  };

  const clearSelectedProducts = () => setSelectedProductIds([]);

  const bulkDeleteProducts = () => {
    if (selectedCount === 0) return;
    setSelectedProductIds([]);
  };

  const bulkApplyOffer = () => {
    if (selectedCount === 0) return;
    setOfferType(null);
    setOfferOpen(true);
  };

  const bulkUpdateStatus = (nextStatus: "Active" | "Draft" | "Out of Stock") => {
    if (selectedCount === 0) return;
  };

  return (
    <PageShell
      title={title}
      description={subtitle}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/catalogue")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={() => setProductOpen(true)}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      }
    >
      <Card className="p-4 mb-4">
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="catalogue-search">Search</Label>
            <Input
              id="catalogue-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, category or group"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="min-price">Min price</Label>
              <Input
                id="min-price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Max price</Label>
              <Input
                id="max-price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="999999"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
            <div className="text-sm">
              <span className="font-semibold">{selectedCount}</span> product{selectedCount === 1 ? "" : "s"} selected
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="destructive" size="sm" onClick={bulkDeleteProducts}>
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={bulkApplyOffer}>
                Apply Offer
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("Active")}>Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("Draft")}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("Out of Stock")}>Out of Stock</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={clearSelectedProducts}>
                Clear selection
              </Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => toggleAllVisible(checked === true)}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order Count</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProductIds.includes(p.id)}
                    onCheckedChange={(checked) => toggleProductSelection(p.id, checked === true)}
                    aria-label={`Select ${p.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                <TableCell>{p.orderCount}</TableCell>
                <TableCell>₹{p.price.toLocaleString("en-IN")}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={p.status === "Active" ? "default" : p.status === "Draft" ? "secondary" : "destructive"}
                  >
                    {p.status === "Active" ? "Published" : p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Power className="h-4 w-4 mr-2" />
                        {p.status === "Active" ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet
        open={offerOpen}
        onOpenChange={(open) => {
            setOfferOpen(open);
          if (!open) {
            setOfferType(null);
            setOfferPercent("");
            setOfferRule("buy1get1");
          }
        }}
      >
        <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Apply Offer</SheetTitle>
            <SheetDescription>
              Apply an offer to {selectedCount} selected product{selectedCount === 1 ? "" : "s"}.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setOfferType("discount")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  offerType === "discount" ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="text-sm font-semibold">Apply discount</div>
                <div className="mt-1 text-xs text-muted-foreground">Enter a percentage discount for selected products.</div>
              </button>
              <button
                type="button"
                onClick={() => setOfferType("bogo")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  offerType === "bogo" ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="text-sm font-semibold">BOGO</div>
                <div className="mt-1 text-xs text-muted-foreground">Buy one get one style promotion.</div>
              </button>
            </div>

            {offerType === "bogo" && (
              <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <div className="grid gap-2">
                  <Label>BOGO Rule</Label>
                  <Select value={offerRule} onValueChange={setOfferRule}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy1get1">Buy 1 Get 1</SelectItem>
                      <SelectItem value="buy2get1">Buy 2 Get 1</SelectItem>
                      <SelectItem value="buy3get1">Buy 3 Get 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {offerType === "discount" && (
              <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <div className="grid gap-2">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={offerPercent}
                    onChange={(e) => setOfferPercent(e.target.value)}
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
            )}

          </div>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOfferOpen(false);
                setOfferType(null);
                setOfferPercent("");
                setOfferRule("buy1get1");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOfferOpen(false);
                setOfferType(null);
                setOfferPercent("");
                setOfferRule("buy1get1");
                setSelectedProductIds([]);
              }}
            >
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={productOpen} onOpenChange={setProductOpen}>
        <SheetContent side="right" className="w-full max-w-[72rem] overflow-y-auto p-0">
          <div className="grid min-h-full grid-rows-[auto,1fr,auto] bg-background lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-[auto,1fr,auto]">
            <SheetHeader className="border-b border-border/60 px-6 py-5 text-left lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Product Builder
              </div>
              <SheetTitle className="mt-2 text-2xl">Add Product</SheetTitle>
              <SheetDescription className="max-w-2xl">
                Create a product with catalog, pricing, inventory, tax, and publishing settings.
              </SheetDescription>
            </SheetHeader>

            <aside className="border-b border-border/60 bg-muted/25 px-6 py-6 lg:border-r lg:border-b-0">
              <div className="sticky top-6 space-y-5">
                <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                      <Shirt className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Product draft</div>
                      <div className="text-xs text-muted-foreground">Use the sections on the right to build the item.</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <StatPill icon={CheckCircle2} label="Core fields" value="Required" />
                    <StatPill icon={Boxes} label="Inventory" value="Ready" />
                    <StatPill icon={DollarSign} label="Pricing" value="Auto" />
                    <StatPill icon={Truck} label="Shipping" value="Physical" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Sections
                  </div>
                  <div className="space-y-1">
                    {sectionNav.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Search className="h-4 w-4" />
                    Design note
                  </div>
                  <p className="mt-2">
                    The form now behaves like a workspace: summary on the left, fields on the right, and larger sections spanning the full width when needed.
                  </p>
                </div>
              </div>
            </aside>

            <div className="space-y-6 overflow-y-auto px-6 py-6">
              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">1. Basic Information</h3>
                      <p className="text-sm text-muted-foreground">Product details and taxonomy</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-3 py-1">Required</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Product Name *" required>
                      <Input placeholder="Enter product name" />
                    </Field>
                    <Field label="Product Slug">
                      <Input placeholder="product-slug" />
                    </Field>
                    <Field label="Product Type">
                      <Select defaultValue="physical">
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Brand">
                      <Input placeholder="Brand name" />
                    </Field>
                    <Field label="Category *" required>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Sub Category">
                      <Input placeholder="Sub category" />
                    </Field>
                    <Field label="Product Code (Master Code)" className="md:col-span-2">
                      <Input placeholder="MASTER-001" />
                    </Field>
                    <Field label="Description *" className="md:col-span-2" required>
                      <Textarea rows={4} placeholder="Product description" />
                    </Field>
                    <Field label="Short Description" className="md:col-span-2">
                      <Textarea rows={3} placeholder="Short summary" />
                    </Field>
                    <Field label="Tags">
                      <Input placeholder="tag1, tag2, tag3" />
                    </Field>
                    <Field label="Key Highlights">
                      <Input placeholder="Highlight 1, Highlight 2" />
                    </Field>
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">2. Media</h3>
                      <p className="text-sm text-muted-foreground">Images and video</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-3 py-1">Visual</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Featured Image *" required>
                      <Input type="file" accept="image/*" />
                    </Field>
                    <Field label="Gallery Images">
                      <Input type="file" accept="image/*" multiple />
                    </Field>
                    <Field label="Variant Images">
                      <Input type="file" accept="image/*" multiple />
                    </Field>
                    <Field label="Product Video URL">
                      <Input placeholder="https://youtube.com/..." />
                    </Field>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">3. Product Configuration</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Options and behavior</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ToggleField label="Has Variants" />
                    <ToggleField label="Requires Shipping" defaultChecked />
                    <ToggleField label="Taxable" defaultChecked />
                    <ToggleField label="Track Inventory" defaultChecked />
                    <ToggleField label="Returnable" />
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">4. Pricing</h3>
                  <p className="mb-4 text-sm text-muted-foreground">For non-variant products</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="SKU *" required>
                      <Input placeholder="SKU-001" />
                    </Field>
                    <Field label="MRP / Regular Price *" required>
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Selling Price">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Discount % (Auto)">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Cost Price">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Profit Margin (Auto)">
                      <Input placeholder="Selling Price - Cost Price" disabled />
                    </Field>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">5. Inventory</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Stock and availability</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Current Stock">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Minimum Stock Alert">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Maximum Purchase Quantity">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Unit">
                      <Select defaultValue="piece">
                        <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="gram">Gram</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Status" className="md:col-span-2">
                      <Select defaultValue="in-stock">
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                          <SelectItem value="preorder">Preorder</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">6. Shipping Details</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Dimensions and delivery controls</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Weight">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Shipping Class">
                      <Input placeholder="Standard / Express" />
                    </Field>
                    <Field label="Length">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Width">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Height">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <div className="space-y-2">
                      <Label>Shipping Settings</Label>
                      <ToggleField label="Free Shipping Eligible" />
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">7. Tax Settings</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Tax information</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tax Rate %">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="HSN Code">
                      <Input placeholder="HSN" />
                    </Field>
                    <Field label="GST Type">
                      <Select defaultValue="exclusive">
                        <SelectTrigger><SelectValue placeholder="Select GST type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inclusive">Inclusive</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-base font-semibold">9. SEO Settings</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Search and sharing</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Meta Title">
                      <Input placeholder="SEO title" />
                    </Field>
                    <Field label="Meta Description">
                      <Textarea rows={3} placeholder="SEO description" />
                    </Field>
                    <Field label="Meta Keywords">
                      <Input placeholder="keyword, keyword" />
                    </Field>
                    <Field label="Open Graph Image">
                      <Input type="file" accept="image/*" />
                    </Field>
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <h3 className="text-base font-semibold">8. Product Variants</h3>
                <p className="mb-4 text-sm text-muted-foreground">Variant groups and child SKU setup</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Variant Title">
                    <Input placeholder="Color / Size / Material" />
                  </Field>
                  <Field label="Variant Attributes">
                    <Input placeholder="Red / M, Red / L, Black / M" />
                  </Field>
                  <Field label="Example Variants" className="md:col-span-2">
                    <Textarea
                      rows={3}
                      placeholder={"Red / M\nRed / L\nBlack / M"}
                    />
                  </Field>
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                    <Boxes className="h-4 w-4" />
                    Each Variant Contains
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Variant Name">
                      <Input placeholder="Variant name" />
                    </Field>
                    <Field label="Variant SKU *" required>
                      <Input placeholder="VAR-001" />
                    </Field>
                    <Field label="Barcode">
                      <Input placeholder="Barcode" />
                    </Field>
                    <Field label="Variant Images">
                      <Input type="file" multiple accept="image/*" />
                    </Field>
                    <Field label="MRP">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Selling Price">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Discount %">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Stock Quantity">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Low Stock Alert">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Weight">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Length">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Width">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Height">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="Tax Rate">
                      <Input type="number" placeholder="0" />
                    </Field>
                    <Field label="HSN Code">
                      <Input placeholder="HSN" />
                    </Field>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <h3 className="text-base font-semibold">10. Visibility & Publishing</h3>
                <p className="mb-4 text-sm text-muted-foreground">Publication controls</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Product Status">
                    <Select defaultValue="draft">
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Visibility">
                    <Select defaultValue="public">
                      <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <ToggleField label="Featured Product" />
                  <Field label="Publish Schedule">
                    <Input type="datetime-local" />
                  </Field>
                </div>
              </section>
            </div>

            <SheetFooter className="border-t border-border/60 px-6 py-4 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                <div className="text-sm text-muted-foreground">
                  Use Save Product when the core fields are ready. You can refine variants later.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setProductOpen(false)}>Save Product</Button>
                </div>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

function Field({
  label,
  children,
  className,
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5">
      <Checkbox defaultChecked={defaultChecked} />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

const sectionNav = [
  { label: "Basic Information", icon: Globe },
  { label: "Media", icon: ImageIcon },
  { label: "Configuration", icon: CheckCircle2 },
  { label: "Pricing", icon: DollarSign },
  { label: "Inventory", icon: Boxes },
  { label: "Shipping", icon: Truck },
  { label: "Tax", icon: ShieldCheck },
  { label: "Variants", icon: Search },
  { label: "SEO", icon: EyeOff },
  { label: "Publishing", icon: CalendarDays },
];

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
