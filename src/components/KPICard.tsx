interface KPICardProps {
  title: string;
  value: string | number;
}

export const KPICard = ({ title, value }: KPICardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
      <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};
