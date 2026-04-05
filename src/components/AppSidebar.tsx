import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Bell, Settings, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Inventory", icon: Package, path: "/inventory" },
  { label: "Sales", icon: ShoppingCart, path: "/sales" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Analytics", icon: TrendingUp, path: "/analytics" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-primary-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-sidebar-primary" />
          <span className="text-sidebar-accent-foreground">BizTrack</span>
        </h1>
        <p className="text-xs text-sidebar-muted mt-1">Business Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="h-4.5 w-4.5" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;
