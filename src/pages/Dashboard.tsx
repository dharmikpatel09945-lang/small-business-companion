import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { products, sales, customers, revenueData, categoryData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "hsl(210, 90%, 50%)",
  "hsl(170, 60%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
];

const Dashboard = () => {
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const lowStockItems = products.filter((p) => p.status === "low_stock" || p.status === "out_of_stock");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} change="+12.5% from last month" changeType="positive" icon={DollarSign} />
        <StatCard title="Products" value={products.length.toString()} change={`${lowStockItems.length} need attention`} changeType="negative" icon={Package} />
        <StatCard title="Sales Today" value={sales.filter((s) => s.date === "2026-04-05").length.toString()} change="+3 from yesterday" changeType="positive" icon={ShoppingCart} />
        <StatCard title="Customers" value={customers.length.toString()} change="+2 new this week" changeType="positive" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-4">Revenue & Profit</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 12%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 12%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(214, 20%, 90%)" }} />
              <Bar dataKey="revenue" fill="hsl(210, 90%, 50%)" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="hsl(170, 60%, 45%)" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium text-card-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="glass-card rounded-xl p-6 border-l-4 border-l-warning">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="text-base font-semibold text-card-foreground">Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <div>
                  <span className="font-medium text-card-foreground">{item.name}</span>
                  <span className="text-muted-foreground ml-2">({item.sku})</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "out_of_stock" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-semibold text-card-foreground mb-4">Recent Sales</h3>
        <div className="space-y-3">
          {sales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{sale.customer.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground">{sale.items.map(i => i.product).join(", ")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">${sale.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{sale.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
