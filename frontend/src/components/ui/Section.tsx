import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", children, ...props }, ref) => {
    const spacings = {
      sm: "py-8",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
    };

    return (
      <section
        ref={ref}
        className={cn(spacings[spacing], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
