import { useState } from "react";
import { Users, Search, Crown, Mail, Phone } from "lucide-react";
import { customers, Customer } from "@/data/mockData";
import { Input } from "@/components/ui/input";

const tierStyles: Record<Customer["tier"], { bg: string; text: string; label: string }> = {
  gold: { bg: "bg-warning/10", text: "text-warning", label: "Gold" },
  silver: { bg: "bg-muted", text: "text-muted-foreground", label: "Silver" },
  bronze: { bg: "bg-warning/5", text: "text-warning", label: "Bronze" },
};

const Customers = () => {
  const [search, setSearch] = useState("");

  const filtered = customers
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-1">Track customer visits, purchases, and loyalty tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-xl font-bold text-card-foreground mt-1">{customers.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Gold Members</p>
          <p className="text-xl font-bold text-card-foreground mt-1">{customers.filter((c) => c.tier === "gold").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Avg. Lifetime Value</p>
          <p className="text-xl font-bold text-card-foreground mt-1">${(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toFixed(2)}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((customer) => {
          const tier = tierStyles[customer.tier];
          return (
            <div key={customer.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{customer.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{customer.name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.bg} ${tier.text}`}>
                      <Crown className="h-3 w-3" /> {tier.label}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold text-card-foreground">${customer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Visits</p>
                  <p className="font-semibold text-card-foreground">{customer.visits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="font-semibold text-card-foreground">{customer.lastVisit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg/Visit</p>
                  <p className="font-semibold text-card-foreground">${(customer.totalSpent / customer.visits).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> {customer.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Customers;
