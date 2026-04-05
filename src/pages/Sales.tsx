import { ShoppingCart, Search, Plus, CreditCard, Banknote } from "lucide-react";
import { sales } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sales = () => {
  const [search, setSearch] = useState("");

  const filtered = sales.filter((s) =>
    s.customer.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const todayTotal = sales.filter((s) => s.date === "2026-04-05").reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales</h1>
          <p className="text-muted-foreground mt-1">Track and record all your transactions.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Today's Sales</p>
          <p className="text-xl font-bold text-card-foreground mt-1">${todayTotal.toFixed(2)}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Transactions Today</p>
          <p className="text-xl font-bold text-card-foreground mt-1">{sales.filter((s) => s.date === "2026-04-05").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-xl font-bold text-card-foreground mt-1">${(sales.reduce((s, a) => s + a.total, 0) / sales.length).toFixed(2)}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search sales..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((sale) => (
          <div key={sale.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-card-foreground">{sale.customer}</p>
                    <span className="text-xs text-muted-foreground font-mono">#{sale.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sale.items.map((i) => `${i.quantity}x ${i.product}`).join(" · ")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-card-foreground">${sale.total.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  {sale.paymentMethod === "Cash" ? <Banknote className="h-3 w-3 text-muted-foreground" /> : <CreditCard className="h-3 w-3 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">{sale.paymentMethod}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{sale.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sales;
