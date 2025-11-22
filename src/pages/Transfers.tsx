import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { ArrowRightLeft, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

const STATUS_OPTIONS = ["draft", "waiting", "ready", "done", "cancelled"];

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-700",
  waiting: "bg-yellow-100 text-yellow-700",
  ready: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    description: "",
    prod_id: "",
    status: "draft",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchTransfers();
    fetchWarehouses();
    fetchProducts();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch(`${API_URL}/transfers`, { credentials: "include" });
      const data = await res.json();
      setTransfers(data);
    } catch (err) {
      console.error("Fetch transfers error:", err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(`${API_URL}/warehouses`, { credentials: "include" });
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      console.error("Fetch warehouses error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { credentials: "include" });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Get products available in selected "from" warehouse
  // Allow products with no warehouse assigned or matching the from_location
  const availableProducts = products.filter(
    (p) => !p.warehouse || p.warehouse.toString() === form.from_location
  );

  const handleSubmit = async () => {
    if (!form.from_location || !form.to_location) {
      alert("Please select both from and to locations");
      return;
    }

    if (!form.prod_id) {
      alert("Please select a product to transfer");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          from_location: form.from_location,
          to_location: form.to_location,
          description: form.description,
          prod_id: parseInt(form.prod_id),
          status: form.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to create transfer");

      const newTransfer = await res.json();

      // If transfer is marked as "done", update product warehouse
      if (form.status === "done") {
        await fetch(`${API_URL}/products/${form.prod_id}/update-warehouse`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ warehouse: parseInt(form.to_location) }),
        });
      }

      setTransfers((prev) => [newTransfer, ...prev]);
      setIsModalOpen(false);

      // Reset form
      setForm({
        from_location: "",
        to_location: "",
        description: "",
        prod_id: "",
        status: "draft",
      });

      // Refresh products list
      fetchProducts();
    } catch (err) {
      console.error("POST /transfers error:", err);
      alert("Failed to create transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transferId: number, newStatus: string) => {
    try {
      const transfer = transfers.find((t) => t.id === transferId);
      if (!transfer) return;

      const res = await fetch(`${API_URL}/transfers/${transferId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // If status changed to "done", update product warehouse
      if (newStatus === "done" && transfer.prod_id) {
        await fetch(`${API_URL}/products/${transfer.prod_id}/update-warehouse`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ warehouse: parseInt(transfer.to_location) }),
        });
        fetchProducts();
      }

      // Update local state
      setTransfers((prev) =>
        prev.map((t) => (t.id === transferId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w.id.toString() === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Transfers</h1>
              <p className="text-muted-foreground">
                Track internal transfers between warehouses
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
              <Plus size={18} /> Create Transfer
            </button>
          </div>

          {/* Transfers List */}
          <div className="space-y-3">
            {transfers.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No transfers yet. Create one to get started.
              </p>
            )}

            {transfers.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm"
              >
                <div className="flex-shrink-0">
                  <ArrowRightLeft size={20} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {t.product_name || `Transfer #${t.id}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getWarehouseName(t.from_location)} → {getWarehouseName(t.to_location)}
                    {t.description && ` · ${t.description}`}
                    {t.transfer_date && ` · ${t.transfer_date}`}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <select
                    value={t.status || "draft"}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium border-0 ${
                      STATUS_COLORS[t.status || "draft"]
                    }`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-6 rounded-lg w-full max-w-md space-y-4 border">
            <h2 className="text-xl font-bold">New Transfer</h2>

            {/* FROM WAREHOUSE */}
            <div>
              <label className="text-sm font-medium block mb-1">From Warehouse</label>
              <select
                className="w-full border p-2 rounded bg-input"
                value={form.from_location}
                onChange={(e) =>
                  setForm({ ...form, from_location: e.target.value, prod_id: "" })
                }
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRODUCT SELECTION */}
            {form.from_location && (
              <div>
                <label className="text-sm font-medium block mb-1">
                  Product to Transfer
                </label>
                <select
                  className="w-full border p-2 rounded bg-input"
                  value={form.prod_id}
                  onChange={(e) => setForm({ ...form, prod_id: e.target.value })}
                  required
                >
                  <option value="">Select product</option>
                  {availableProducts.length === 0 && (
                    <option disabled>No products in this warehouse</option>
                  )}
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock_total || 0})
                    </option>
                  ))}
                </select>
                {availableProducts.length === 0 && form.from_location && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No products available in the selected warehouse
                  </p>
                )}
              </div>
            )}

            {/* TO WAREHOUSE */}
            <div>
              <label className="text-sm font-medium block mb-1">To Warehouse</label>
              <select
                className="w-full border p-2 rounded bg-input"
                value={form.to_location}
                onChange={(e) => setForm({ ...form, to_location: e.target.value })}
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-medium block mb-1">Status</label>
              <select
                className="w-full border p-2 rounded bg-input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              {form.status === "done" && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Setting status to "Done" will move the product to the destination
                  warehouse
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Description (optional)
              </label>
              <input
                className="w-full border p-2 rounded bg-input"
                placeholder="e.g. Restocking transfer"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-4 py-2 border rounded hover:bg-muted transition"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || !form.from_location || !form.to_location || !form.prod_id}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;