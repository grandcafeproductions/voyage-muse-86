import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, FolderTree, MoreHorizontal, Eye, Pencil, Copy, Power, Trash2, Tags, Image as ImageIcon } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type CatalogueItem = {
  id: string;
  name: string;
  type: "Service" | "Product";
  image: string;
  domain: string;
  route: string;
  status: "Active" | "Draft" | "Archived";
  position: number;
  productCount: number;
};

export type GroupItem = {
  id: string;
  name: string;
  catalogue: string;
  position: number;
  status: "Active" | "Draft";
  productCount: number;
};

export const sampleCatalogues: CatalogueItem[] = [
  { id: "CAT-001", name: "Electronics", type: "Product", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200", domain: "shop.voyager.com", route: "/electronics", status: "Active", position: 1, productCount: 24 },
  { id: "CAT-002", name: "Fashion & Apparel", type: "Product", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200", domain: "shop.voyager.com", route: "/fashion", status: "Active", position: 2, productCount: 56 },
  { id: "CAT-003", name: "Travel Packages", type: "Service", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200", domain: "voyager.com", route: "/travel", status: "Active", position: 3, productCount: 12 },
  { id: "CAT-004", name: "Home & Kitchen", type: "Product", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200", domain: "shop.voyager.com", route: "/home", status: "Draft", position: 4, productCount: 18 },
  { id: "CAT-005", name: "Visa Consulting", type: "Service", image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=200", domain: "voyager.com", route: "/visa", status: "Active", position: 5, productCount: 8 },
];

export const sampleGroups: GroupItem[] = [
  { id: "GRP-001", name: "Smartphones", catalogue: "Electronics", position: 1, status: "Active", productCount: 12 },
  { id: "GRP-002", name: "Laptops", catalogue: "Electronics", position: 2, status: "Active", productCount: 8 },
  { id: "GRP-003", name: "Men's Wear", catalogue: "Fashion & Apparel", position: 1, status: "Active", productCount: 22 },
  { id: "GRP-004", name: "Women's Wear", catalogue: "Fashion & Apparel", position: 2, status: "Active", productCount: 30 },
  { id: "GRP-005", name: "Beach Holidays", catalogue: "Travel Packages", position: 1, status: "Active", productCount: 6 },
  { id: "GRP-006", name: "Cookware", catalogue: "Home & Kitchen", position: 1, status: "Draft", productCount: 9 },
];

export default function Catalogue() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createType, setCreateType] = useState<"catalogue" | "group">("catalogue");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [activeCatalogue, setActiveCatalogue] = useState<string>("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string; description: string; image: string }>>([
    { id: "CT-01", name: "Mobiles", description: "All mobile phones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120" },
    { id: "CT-02", name: "Accessories", description: "Phone & laptop accessories", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120" },
    { id: "CT-03", name: "Wearables", description: "Smart watches & bands", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=120" },
  ]);
  const [newCat, setNewCat] = useState({ name: "", description: "", image: "" });

  const openUpdateCategory = (catalogueName: string) => {
    setActiveCatalogue(catalogueName);
    setCategoryOpen(true);
  };

  const handleAddCategory = () => {
    if (!newCat.name) return;
    setCategories((prev) => [
      ...prev,
      { id: `CT-${String(prev.length + 1).padStart(2, "0")}`, name: newCat.name, description: newCat.description, image: newCat.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120" },
    ]);
    setNewCat({ name: "", description: "", image: "" });
    setAddCategoryOpen(false);
    toast.success("Category added");
  };

  return (
    <PageShell
      title="Catalogue"
      description="Manage your catalogues, groups and product taxonomy."
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setCreateType("catalogue"); setOpen(true); }}>
              <BookOpen className="h-4 w-4 mr-2" /> Create Catalogue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setCreateType("group"); setOpen(true); }}>
              <FolderTree className="h-4 w-4 mr-2" /> Create Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <Tabs defaultValue="catalogues">
        <TabsList>
          <TabsTrigger value="catalogues">Catalogues</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogues">
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catalogue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleCatalogues.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/catalogue/catalogue/${c.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={c.image} alt={c.name} className="h-10 w-10 rounded-md object-cover" />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.type === "Service" ? "secondary" : "outline"}>{c.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.domain}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{c.route}</TableCell>
                    <TableCell>{c.productCount}</TableCell>
                    <TableCell>{c.position}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "Active" ? "default" : c.status === "Draft" ? "secondary" : "outline"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/catalogue/catalogue/${c.id}`)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUpdateCategory(c.name)}><Tags className="h-4 w-4 mr-2" />Update Category</DropdownMenuItem>
                          <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem>
                          <DropdownMenuItem><Power className="h-4 w-4 mr-2" />{c.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Catalogue</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleGroups.map((g) => (
                  <TableRow
                    key={g.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/catalogue/group/${g.id}`)}
                  >
                    <TableCell>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.id}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{g.catalogue}</TableCell>
                    <TableCell>{g.productCount}</TableCell>
                    <TableCell>{g.position}</TableCell>
                    <TableCell>
                      <Badge variant={g.status === "Active" ? "default" : "secondary"}>{g.status}</Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/catalogue/group/${g.id}`)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem><Power className="h-4 w-4 mr-2" />{g.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{createType === "catalogue" ? "Create Catalogue" : "Create Group"}</SheetTitle>
            <SheetDescription>
              {createType === "catalogue"
                ? "Add a new catalogue to organise products or services."
                : "Add a new group within a catalogue."}
            </SheetDescription>
          </SheetHeader>

          {createType === "catalogue" ? (
            <div className="grid gap-4 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="Product">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="Active">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="e.g. Electronics" />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Input placeholder="shop.voyager.com" />
                </div>
                <div className="space-y-2">
                  <Label>Route</Label>
                  <Input placeholder="/electronics" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input type="number" defaultValue={1} />
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">SEO Settings</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input placeholder="Page title for search engines" />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea placeholder="Short description (max 160 chars)" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input placeholder="comma, separated, keywords" />
                  </div>
                  <div className="space-y-2">
                    <Label>Canonical URL</Label>
                    <Input placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="e.g. Smartphones" />
              </div>
              <div className="space-y-2">
                <Label>Catalogue</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select catalogue" /></SelectTrigger>
                  <SelectContent>
                    {sampleCatalogues.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input type="number" defaultValue={1} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="Active">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success(`${createType === "catalogue" ? "Catalogue" : "Group"} created`); setOpen(false); }}>
              Create
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Update Category modal */}
      <Sheet open={categoryOpen} onOpenChange={setCategoryOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update Categories</SheetTitle>
            <SheetDescription>
              Manage categories for <span className="font-medium">{activeCatalogue}</span>
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 flex justify-end">
            <Button size="sm" onClick={() => setAddCategoryOpen(true)}>
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 rounded-md border p-3">
                <img src={cat.image} alt={cat.name} className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{cat.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{cat.description}</div>
                </div>
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCategories((prev) => prev.filter((x) => x.id !== cat.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">No categories yet.</div>
            )}
          </div>

          {addCategoryOpen && (
            <div className="mt-6 rounded-md border p-4 space-y-3">
              <div className="flex items-center gap-2 font-medium">
                <ImageIcon className="h-4 w-4" /> Add Category
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="e.g. Tablets" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} placeholder="Short description" />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setNewCat({ ...newCat, image: URL.createObjectURL(file) });
                }} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setAddCategoryOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAddCategory}>Save</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}