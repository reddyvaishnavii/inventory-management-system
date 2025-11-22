import { ReactNode } from "react";

interface ListCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export const ListCard = ({ title, subtitle, icon }: ListCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-all duration-200 flex items-center gap-4">
      {icon && (
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-semibold text-base truncate">{title}</h3>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
