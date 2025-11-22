import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton = ({ 
  children, 
  fullWidth = true, 
  className,
  ...props 
}: PrimaryButtonProps) => {
  return (
    <button
      className={cn(
        "bg-primary text-primary-foreground font-semibold py-3.5 px-6 rounded-xl",
        "hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
