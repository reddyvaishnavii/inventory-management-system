import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { Receipt } from "lucide-react";

const receipts = [
  { id: "001", description: "50 units Steel Rods" },
  { id: "002", description: "25 units Wooden Chairs" },
  { id: "003", description: "100 units Plastic Pipes" },
  { id: "004", description: "200 units Ceramic Tiles" },
  { id: "005", description: "150 units LED Light Bulbs" },
];

const Receipts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Receipts</h1>
            <p className="text-muted-foreground">View and manage your receipts</p>
          </div>

          <div className="space-y-3">
            {receipts.map((receipt) => (
              <ListCard
                key={receipt.id}
                title={`Receipt #${receipt.id}`}
                subtitle={receipt.description}
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
