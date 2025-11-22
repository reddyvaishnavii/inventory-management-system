import { ReactNode } from "react";

// components/ListCard.tsx

export interface ListCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void; // <-- FIX ADDED
}

export function ListCard({ title, subtitle, icon, onClick }: ListCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm cursor-pointer hover:bg-muted transition"
    >
      <div>{icon}</div>

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
