import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { History } from "lucide-react";

const movements = [
  { id: "101", description: "Steel Rods +50 (Receipt)", type: "In", date: "2024-01-15" },
  { id: "102", description: "Chairs -10 (Delivery)", type: "Out", date: "2024-01-15" },
  { id: "103", description: "Steel Rods moved Rack A → Rack C", type: "Transfer", date: "2024-01-14" },
  { id: "104", description: "Plastic Pipes +100 (Purchase)", type: "In", date: "2024-01-14" },
  { id: "105", description: "Ceramic Tiles -25 (Sale)", type: "Out", date: "2024-01-13" },
  { id: "106", description: "LED Bulbs moved Storage → Display", type: "Transfer", date: "2024-01-13" },
];

const MoveHistory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Move History</h1>
            <p className="text-muted-foreground">Complete history of all inventory movements</p>
          </div>

          <div className="space-y-3">
            {movements.map((move) => (
              <ListCard
                key={move.id}
                title={`Move #${move.id}`}
                subtitle={`${move.description} • ${move.date}`}
                icon={<History size={20} />}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoveHistory;
