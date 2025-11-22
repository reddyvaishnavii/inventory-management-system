import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Receipts = () => {
  const [receipts, setReceipts] = useState([
    { id: "001", supplier: "ABC Metals Inc.", product: "Steel Rods", quantity: 50, date: "2024-01-15" },
    { id: "002", supplier: "XYZ Furniture Co.", product: "Wooden Chairs", quantity: 25, date: "2024-01-16" },
    { id: "003", supplier: "PlastiCore Ltd.", product: "Plastic Pipes", quantity: 100, date: "2024-01-17" },
    { id: "004", supplier: "TileMaster Pro", product: "Ceramic Tiles", quantity: 200, date: "2024-01-18" },
    { id: "005", supplier: "BrightLight Solutions", product: "LED Light Bulbs", quantity: 150, date: "2024-01-19" },
  ]);

  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

useEffect(() => {
  // Fetch products for dropdown
  fetch("http://localhost:3000/products")
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);
  useEffect(() => {
  fetch("http://localhost:3000/receipts")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((item: any) => ({
        id: String(item.id).padStart(3, "0"),
        supplier: item.supplier_name,
        product: "N/A",
        quantity: item.total_quantity,
        date: item.created_at?.split("T")[0],
      }));

      setReceipts(formatted);
    });
}, []);


  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    product: "",
    quantity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    supplier_name: formData.supplier,
    product_name: formData.product,        // ← now sent!
    quantity: parseInt(formData.quantity), // ← match backend expectation
  };

  try {
    const response = await fetch("http://localhost:3000/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || "Failed to create receipt");
      return;
    }

    // Reset form
    setFormData({ supplier: "", product: "", quantity: "" });
    setIsOpen(false);

    // Refresh list
    await loadReceipts();
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};

const loadReceipts = async () => {
  try {
    const res = await fetch("http://localhost:3000/receipts");
    const data = await res.json();
    const formatted = data.map((item: any) => ({
      id: String(item.id).padStart(3, "0"),
      supplier: item.supplier_name,
      product: "N/A", // You can improve this later with JOIN
      quantity: item.total_quantity,
      date: item.created_at?.split("T")[0],
    }));
    setReceipts(formatted);
  } catch (err) {
    console.error("Failed to load receipts", err);
  }
};

// Call it in useEffect and after submit
useEffect(() => {
  loadReceipts();
}, []);


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Receipts</h1>
              <p className="text-muted-foreground">View and manage your receipts</p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={20} />
                  New Receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Receipt</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      placeholder="Enter supplier name"
                      required
                    />
                  </div>
                  <div>
  <Label htmlFor="product">Product</Label>
  <select
    id="product"
    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    value={formData.product}
    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
    required
  >
    <option value="">Select a product</option>
    {products.map((p) => (
      <option key={p.id} value={p.name}>
        {p.name}
      </option>
    ))}
  </select>
</div>
                  <div>
                    <Label htmlFor="quantity">Quantity Received</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Validate & Create Receipt
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {receipts.map((receipt) => (
              <ListCard
                key={receipt.id}
                title={`Receipt #${receipt.id}`}
                subtitle={`${receipt.supplier} • ${receipt.quantity} units ${receipt.product} • ${receipt.date}`}
                icon={<Receipt size={20} />}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default Receipts;