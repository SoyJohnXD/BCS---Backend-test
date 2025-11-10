import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", hover = false, children, ...props },
    ref
  ) => {
    const baseStyles = "rounded-2xl border border-black/5 transition-shadow";

    const variants = {
      default: "bg-white shadow-sm",
      surface: "bg-(--surface)",
    };

    const hoverStyles = hover ? "hover:shadow-md" : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
