import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, name, ...props }, ref) => {
    const inputId =
      id || (name ? name : label?.toLowerCase().replace(/\s+/g, "-"));

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-black/70 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-xl border transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)",
            error
              ? "border-red-400 bg-red-50"
              : "border-black/10 bg-white hover:border-black/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
