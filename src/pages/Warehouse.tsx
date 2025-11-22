import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { Warehouse as WarehouseIcon, Plus } from "lucide-react";
import { useState, useEffect } from "react";

// Change this if your backend URL changes
const API_URL = "http://localhost:3000";

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    w_name: "",
    w_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load warehouses from backend
  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/warehouses`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch warehouses");

        const data = await response.json();
        setWarehouses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  // Handle adding a warehouse via backend API
  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    if (!newWarehouse.w_name || !newWarehouse.w_address) return;

    try {
      setError(null);

      const response = await fetch(`${API_URL}/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newWarehouse.w_name,
          address: newWarehouse.w_address,
        }),
      });

      if (!response.ok) throw new Error("Failed to add warehouse");

      const addedWarehouse = await response.json();

      setWarehouses((prev) => [...prev, addedWarehouse]);
      setNewWarehouse({ w_name: "", w_address: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Warehouses
              </h1>
              <p className="text-muted-foreground">
                Manage your warehouse locations
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              <Plus size={20} />
              Add Warehouse
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              Loading warehouses...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          )}

          {/* No data */}
          {!loading && !error && warehouses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No warehouses added yet. Click "Add Warehouse" to get started.
            </div>
          )}

          {/* List */}
          {!loading && !error && warehouses.length > 0 && (
            <div className="space-y-3">
              {warehouses.map((warehouse) => (
                <ListCard
                  key={warehouse.id}
                  title={warehouse.name}
                  subtitle={warehouse.address}
                  icon={<WarehouseIcon size={20} className="text-primary" />}
                  onClick={() => console.log("Go to warehouse:", warehouse.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition md:hidden z-10"
      >
        <Plus size={28} />
      </button>

      {/* Add Warehouse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-6 rounded-xl shadow-xl max-w-md w-full border">
            <h2 className="text-2xl font-bold mb-4">Add New Warehouse</h2>

            <form onSubmit={handleAddWarehouse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Warehouse Name
                </label>
                <input
                  type="text"
                  value={newWarehouse.w_name}
                  onChange={(e) =>
                    setNewWarehouse({ ...newWarehouse, w_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Central Storage"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address / Location
                </label>
                <input
                  type="text"
                  value={newWarehouse.w_address}
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      w_address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Building D, Zone 3"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  Add Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
