// src/pages/Dashboard.tsx
import { Navigation } from "@/components/Navigation";
import { KPICard } from "@/components/KPICard";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/products";
import { useMemo } from "react";

const Dashboard = () => {
  // use object form required by v5
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,
  });

  const kpis = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => (p.stock_total ?? 0) < 20).length; // threshold 20
    const pendingReceipts = 0; // placeholder until backend endpoint available
    const pendingDeliveries = 0;
    const transfersScheduled = 0;
    return { totalProducts, lowStock, pendingReceipts, pendingDeliveries, transfersScheduled };
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your inventory.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <KPICard title="Total Products" value={isLoading ? "..." : kpis.totalProducts} />
            <KPICard title="Low Stock Items" value={isLoading ? "..." : kpis.lowStock} />
            <KPICard title="Pending Receipts" value={kpis.pendingReceipts} />
            <KPICard title="Pending Deliveries" value={kpis.pendingDeliveries} />
            <KPICard title="Transfers Scheduled" value={kpis.transfersScheduled} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Quick actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-medium">Create Product</h3>
                  <p className="text-sm text-muted-foreground">Add a new product to your catalog.</p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-medium">Create Receipt</h3>
                  <p className="text-sm text-muted-foreground">Record incoming stock from supplier.</p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-medium">Create Transfer</h3>
                  <p className="text-sm text-muted-foreground">Move stock across warehouses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
