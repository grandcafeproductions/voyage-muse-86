import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MoreHorizontal, Eye, Pencil, Copy, Power, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { sampleCatalogues, sampleGroups } from "./Catalogue";

type Product = {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  catalogue: string;
  category: string;
  group: string;
  orderCount: number;
};

const sampleProducts: Product[] = [
  { id: "P-1001", name: "iPhone 15 Pro", sku: "APL-IP15P-256", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120", price: 119900, stock: 24, status: "Active", catalogue: "Electronics", category: "Mobiles", group: "Smartphones", orderCount: 138 },
  { id: "P-1002", name: "Samsung Galaxy S24", sku: "SAM-GS24-128", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120", price: 79999, stock: 15, status: "Active", catalogue: "Electronics", category: "Mobiles", group: "Smartphones", orderCount: 94 },
  { id: "P-1003", name: 'MacBook Pro 14"', sku: "APL-MBP14-M3", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120", price: 199900, stock: 8, status: "Active", catalogue: "Electronics", category: "Computers", group: "Laptops", orderCount: 41 },
  { id: "P-1004", name: "Dell XPS 15", sku: "DEL-XPS15-I7", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120", price: 159000, stock: 0, status: "Out of Stock", catalogue: "Electronics", category: "Computers", group: "Laptops", orderCount: 29 },
  { id: "P-1005", name: "Cotton Casual Shirt", sku: "FAS-MS-CS-01", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120", price: 1499, stock: 80, status: "Active", catalogue: "Fashion & Apparel", category: "Men's Wear", group: "Casual Shirts", orderCount: 206 },
  { id: "P-1006", name: "Slim Fit Jeans", sku: "FAS-MS-JN-04", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=120", price: 2299, stock: 50, status: "Active", catalogue: "Fashion & Apparel", category: "Men's Wear", group: "Denim", orderCount: 172 },
  { id: "P-1007", name: "Floral Summer Dress", sku: "FAS-WS-DR-12", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=120", price: 2799, stock: 35, status: "Active", catalogue: "Fashion & Apparel", category: "Women's Wear", group: "Dresses", orderCount: 143 },
  { id: "P-1008", name: "Goa Beach Holiday 5N", sku: "TRV-GOA-5N", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=120", price: 24999, stock: 100, status: "Active", catalogue: "Travel Packages", category: "Beach Holidays", group: "Goa", orderCount: 76 },
  { id: "P-1009", name: "Maldives Honeymoon", sku: "TRV-MAL-7N", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=120", price: 89999, stock: 50, status: "Active", catalogue: "Travel Packages", category: "Beach Holidays", group: "Maldives", orderCount: 58 },
  { id: "P-1010", name: "Non-Stick Cookware Set", sku: "HK-CK-01", image: "https://images.unsplash.com/photo-1584990347449-a8d2b1c2c44d?w=120", price: 4999, stock: 22, status: "Draft", catalogue: "Home & Kitchen", category: "Cookware", group: "Kitchen Essentials", orderCount: 19 },
];

export default function CatalogueDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  return (
    <PageShell
      title={title}
      description={subtitle}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/catalogue")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button>
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
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id}>
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
    </PageShell>
  );
}
