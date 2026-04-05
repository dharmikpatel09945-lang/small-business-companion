import { useState } from "react";
import { Package, Search, Plus, Filter } from "lucide-react";
import { products, Product } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<Product["status"], string> = {
  in_stock: "bg-success/10 text-success border-success/20",
  low_stock: "bg-warning/10 text-warning border-warning/20",
  out_of_stock: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<Product["status"], string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Product["status"]>("all");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your products and stock levels.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(["all", "in_stock", "low_stock", "out_of_stock"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {f === "all" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Product</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">SKU</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Category</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Stock</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground font-mono">{product.sku}</td>
                <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                <td className="p-4 text-sm font-medium text-card-foreground text-right">${product.price.toFixed(2)}</td>
                <td className="p-4 text-sm font-medium text-card-foreground text-right">{product.stock}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[product.status]}`}>
                    {statusLabels[product.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
