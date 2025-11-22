import { useState } from "react";
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

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    product: "",
    quantity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReceipt = {
      id: String(receipts.length + 1).padStart(3, "0"),
      supplier: formData.supplier,
      product: formData.product,
      quantity: parseInt(formData.quantity),
      date: new Date().toISOString().split('T')[0],
    };

    setReceipts([...receipts, newReceipt]);
    setFormData({ supplier: "", product: "", quantity: "" });
    setIsOpen(false);
  };

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
                    <Input
                      id="product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      placeholder="Enter product name"
                      required
                    />
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