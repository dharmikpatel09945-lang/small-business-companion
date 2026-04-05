export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  visits: number;
  lastVisit: string;
  tier: "gold" | "silver" | "bronze";
}

export const products: Product[] = [
  { id: "1", name: "Wireless Earbuds Pro", category: "Electronics", sku: "WEP-001", price: 79.99, cost: 35, stock: 45, minStock: 10, status: "in_stock" },
  { id: "2", name: "Organic Coffee Beans", category: "Food & Beverage", sku: "OCB-012", price: 18.50, cost: 8, stock: 8, minStock: 15, status: "low_stock" },
  { id: "3", name: "Yoga Mat Premium", category: "Fitness", sku: "YMP-005", price: 49.99, cost: 20, stock: 32, minStock: 5, status: "in_stock" },
  { id: "4", name: "Stainless Steel Bottle", category: "Accessories", sku: "SSB-008", price: 24.99, cost: 10, stock: 0, minStock: 10, status: "out_of_stock" },
  { id: "5", name: "LED Desk Lamp", category: "Electronics", sku: "LDL-003", price: 39.99, cost: 15, stock: 67, minStock: 10, status: "in_stock" },
  { id: "6", name: "Notebook Set (3-pack)", category: "Stationery", sku: "NS3-021", price: 12.99, cost: 4, stock: 120, minStock: 20, status: "in_stock" },
  { id: "7", name: "Bluetooth Speaker", category: "Electronics", sku: "BTS-007", price: 59.99, cost: 25, stock: 5, minStock: 8, status: "low_stock" },
  { id: "8", name: "Protein Bar Box", category: "Food & Beverage", sku: "PBB-015", price: 29.99, cost: 14, stock: 22, minStock: 10, status: "in_stock" },
];

export const sales: Sale[] = [
  { id: "S001", date: "2026-04-05", customer: "Sarah Johnson", items: [{ product: "Wireless Earbuds Pro", quantity: 1, price: 79.99 }], total: 79.99, paymentMethod: "Credit Card" },
  { id: "S002", date: "2026-04-05", customer: "Mike Chen", items: [{ product: "Yoga Mat Premium", quantity: 2, price: 49.99 }], total: 99.98, paymentMethod: "Cash" },
  { id: "S003", date: "2026-04-04", customer: "Emily Davis", items: [{ product: "Organic Coffee Beans", quantity: 3, price: 18.50 }, { product: "Notebook Set (3-pack)", quantity: 1, price: 12.99 }], total: 68.49, paymentMethod: "Debit Card" },
  { id: "S004", date: "2026-04-04", customer: "James Wilson", items: [{ product: "LED Desk Lamp", quantity: 1, price: 39.99 }], total: 39.99, paymentMethod: "Credit Card" },
  { id: "S005", date: "2026-04-03", customer: "Sarah Johnson", items: [{ product: "Protein Bar Box", quantity: 2, price: 29.99 }], total: 59.98, paymentMethod: "Credit Card" },
  { id: "S006", date: "2026-04-03", customer: "Lisa Anderson", items: [{ product: "Bluetooth Speaker", quantity: 1, price: 59.99 }], total: 59.99, paymentMethod: "Cash" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Sarah Johnson", email: "sarah@email.com", phone: "(555) 123-4567", totalSpent: 1249.85, visits: 28, lastVisit: "2026-04-05", tier: "gold" },
  { id: "C002", name: "Mike Chen", email: "mike@email.com", phone: "(555) 234-5678", totalSpent: 892.40, visits: 19, lastVisit: "2026-04-05", tier: "silver" },
  { id: "C003", name: "Emily Davis", email: "emily@email.com", phone: "(555) 345-6789", totalSpent: 2105.20, visits: 42, lastVisit: "2026-04-04", tier: "gold" },
  { id: "C004", name: "James Wilson", email: "james@email.com", phone: "(555) 456-7890", totalSpent: 345.60, visits: 8, lastVisit: "2026-04-04", tier: "bronze" },
  { id: "C005", name: "Lisa Anderson", email: "lisa@email.com", phone: "(555) 567-8901", totalSpent: 678.90, visits: 15, lastVisit: "2026-04-03", tier: "silver" },
  { id: "C006", name: "Robert Taylor", email: "robert@email.com", phone: "(555) 678-9012", totalSpent: 1567.30, visits: 35, lastVisit: "2026-04-02", tier: "gold" },
];

export const revenueData = [
  { month: "Oct", revenue: 12400, profit: 4200 },
  { month: "Nov", revenue: 15800, profit: 5600 },
  { month: "Dec", revenue: 22100, profit: 8400 },
  { month: "Jan", revenue: 18300, profit: 6800 },
  { month: "Feb", revenue: 16900, profit: 5900 },
  { month: "Mar", revenue: 21500, profit: 7800 },
];

export const categoryData = [
  { name: "Electronics", value: 42 },
  { name: "Food & Beverage", value: 25 },
  { name: "Fitness", value: 15 },
  { name: "Stationery", value: 10 },
  { name: "Accessories", value: 8 },
];
