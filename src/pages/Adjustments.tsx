import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { FileEdit, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    product_id: "",
    amount: "",
    reason: "",
    type: "Gain",
  });

  const formatDate = (iso) => new Date(iso).toLocaleString();

  // Load adjustments + products on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const adjRes = await fetch(`${API_URL}/adjustments`);
        if (!adjRes.ok) throw new Error("Failed to fetch adjustments");

        const adjData = await adjRes.json();
        console.log("Fetched Adjustments:", adjData);
        setAdjustments(adjData);

        const prodRes = await fetch(`${API_URL}/products`);
        if (!prodRes.ok) throw new Error("Failed to fetch products");

        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Add Adjustment
  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: parseInt(form.amount, 10),
    };

    try {
      const res = await fetch(`${API_URL}/adjustments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add adjustment");

      const newAdj = await res.json();
      setAdjustments((prev) => [newAdj, ...prev]);

      setIsModalOpen(false);
      setForm({ product_id: "", amount: "", reason: "", type: "Gain" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Adjustments</h1>
              <p className="text-muted-foreground">Stock adjustments & corrections</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-primary text-white px-4 py-2 rounded-lg gap-2"
            >
              <Plus size={18} /> Add Adjustment
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              Loading adjustments...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && adjustments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No adjustment records found.
            </div>
          )}

          {/* List */}
          {!loading && !error && adjustments.length > 0 && (
            <div className="space-y-3">
              {adjustments.map((adj) => (
                <ListCard
                  key={adj.id}
                  title={`${adj.product_name || "Unknown Product"} (${adj.type})`}
                  subtitle={`${adj.amount > 0 ? "+" : ""}${adj.amount} • ${adj.reason} • ${formatDate(adj.date)}`}
                  icon={<FileEdit size={20} />}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">

            <h2 className="text-xl font-semibold">New Adjustment</h2>

            {/* Product Dropdown */}
            <select
              className="w-full border p-2 rounded"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.stock_total})
                </option>
              ))}
            </select>

            {/* Amount */}
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Adjustment amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            {/* Reason */}
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            {/* Type */}
            <select
              className="w-full border p-2 rounded"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="Gain">Gain</option>
              <option value="Loss">Loss</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded" onClick={handleSubmit}>
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Adjustments;
