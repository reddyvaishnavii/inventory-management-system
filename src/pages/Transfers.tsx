import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { ArrowRightLeft } from "lucide-react";

const transfers = [
  { id: "001", description: "Main Warehouse to Production Rack", date: "2024-01-15" },
  { id: "002", description: "Warehouse 1 to Warehouse 2", date: "2024-01-14" },
  { id: "003", description: "Production Rack to Quality Control", date: "2024-01-13" },
  { id: "004", description: "Storage A to Distribution Center", date: "2024-01-12" },
  { id: "005", description: "Warehouse 2 to Main Warehouse", date: "2024-01-11" },
];

const Transfers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Transfers</h1>
            <p className="text-muted-foreground">Track internal transfers between locations</p>
          </div>

          <div className="space-y-3">
            {transfers.map((transfer) => (
              <ListCard
                key={transfer.id}
                title={`Transfer #${transfer.id}`}
                subtitle={`${transfer.description} • ${transfer.date}`}
                icon={<ArrowRightLeft size={20} />}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transfers;
