import { Link, useLocation } from "react-router-dom";
import { Home, Package, Receipt, Settings, User, Warehouse, ChevronDown, ArrowRightLeft, History, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/products", label: "Products", icon: Package },
];

const operationsItems = [
  { path: "/receipts", label: "Receipts", icon: Receipt },
  { path: "/transfers", label: "Transfers", icon: ArrowRightLeft },
  { path: "/adjustments", label: "Adjustments", icon: FileEdit },
  { path: "/move-history", label: "Move History", icon: History },
];

const bottomNavItems = [
  { path: "/warehouse", label: "Warehouse", icon: Warehouse },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const Navigation = () => {
  const location = useLocation();
  const [operationsOpen, setOperationsOpen] = useState(true);

  const isOperationsActive = operationsItems.some(item => location.pathname === item.path);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
        <nav className="flex-1 px-3 overflow-y-auto">
          {/* Main Navigation */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Operations Group */}
          <div className="mt-2 mb-1">
            <button
              onClick={() => setOperationsOpen(!operationsOpen)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200",
                isOperationsActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Receipt size={20} />
              <span className="font-medium flex-1 text-left">Operations</span>
              <ChevronDown 
                size={16} 
                className={cn(
                  "transition-transform duration-200",
                  operationsOpen && "rotate-180"
                )}
              />
            </button>
            
            {operationsOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {operationsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Navigation Items */}
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="grid grid-cols-5 py-2">
          <Link
            to="/dashboard"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200",
              location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home size={22} />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            to="/products"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200",
              location.pathname === "/products" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Package size={22} />
            <span className="text-xs font-medium">Products</span>
          </Link>

          <Link
            to="/receipts"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200",
              isOperationsActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Receipt size={22} />
            <span className="text-xs font-medium">Ops</span>
          </Link>

          <Link
            to="/warehouse"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200",
              location.pathname === "/warehouse" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Warehouse size={22} />
            <span className="text-xs font-medium">Location</span>
          </Link>

          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200",
              location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User size={22} />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
