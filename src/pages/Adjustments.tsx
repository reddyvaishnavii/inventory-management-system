import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { FileEdit } from "lucide-react";

const adjustments = [
  { id: "001", description: "Steel Rods, -3 (Damaged)", date: "2024-01-15", type: "Loss" },
  { id: "002", description: "Wooden Chairs, +5 (Recount)", date: "2024-01-14", type: "Gain" },
  { id: "003", description: "Plastic Pipes, -2 (Quality Issue)", date: "2024-01-14", type: "Loss" },
  { id: "004", description: "Ceramic Tiles, +10 (Found Stock)", date: "2024-01-13", type: "Gain" },
  { id: "005", description: "LED Bulbs, -7 (Theft)", date: "2024-01-12", type: "Loss" },
];

const Adjustments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Adjustments</h1>
            <p className="text-muted-foreground">Stock adjustments and corrections</p>
          </div>

          <div className="space-y-3">
            {adjustments.map((adjustment) => (
              <ListCard
                key={adjustment.id}
                title={`Adjustment #${adjustment.id}`}
                subtitle={`${adjustment.description} • ${adjustment.date}`}
                icon={<FileEdit size={20} />}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adjustments;
