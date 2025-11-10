import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-(--primary) text-white rounded-xl shadow-[0_6px_16px_rgba(255,94,120,0.25)] hover:shadow-[0_8px_20px_rgba(255,94,120,0.3)] hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:shadow-[0_4px_12px_rgba(255,94,120,0.25)]",
      ghost:
        "bg-transparent text-(--foreground) rounded-xl hover:bg-black/6 hover:-translate-y-0.5",
      outline:
        "bg-transparent text-(--foreground) border border-black/10 rounded-xl hover:border-black/20 hover:bg-black/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
