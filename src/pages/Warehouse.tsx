import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { Warehouse as WarehouseIcon } from "lucide-react";

const warehouses = [
  { id: 1, name: "Main Warehouse", location: "Building A, Floor 1", capacity: "85%" },
  { id: 2, name: "Production Floor", location: "Building B, Floor 2", capacity: "62%" },
  { id: 3, name: "Rack A", location: "Main Warehouse, Section A", capacity: "92%" },
  { id: 4, name: "Rack B", location: "Main Warehouse, Section B", capacity: "78%" },
  { id: 5, name: "Distribution Center", location: "Building C, Ground Floor", capacity: "45%" },
];

const Warehouse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Warehouses</h1>
            <p className="text-muted-foreground">Manage storage locations and capacity</p>
          </div>

          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <ListCard
                key={warehouse.id}
                title={warehouse.name}
                subtitle={`${warehouse.location} • Capacity: ${warehouse.capacity}`}
                icon={<WarehouseIcon size={20} />}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Warehouse;
