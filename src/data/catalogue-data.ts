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

export type Product = {
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

export const sampleProducts: Product[] = [
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
