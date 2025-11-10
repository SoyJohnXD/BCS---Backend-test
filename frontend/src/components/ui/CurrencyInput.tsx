"use client";
import { forwardRef, InputHTMLAttributes, useState, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  label?: string;
  currency?: string;
  name?: string;
}

const formatNumber = (value: string): string => {
  if (!value) return "";

  // Remover todo excepto números y punto decimal
  const cleaned = value.replace(/[^\d.]/g, "");

  // Asegurar solo un punto decimal
  const parts = cleaned.split(".");
  const integerPart = parts[0] || "0";
  const decimalPart = parts[1];

  // Formatear la parte entera con puntos como separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Retornar con o sin decimales
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart.slice(0, 2)}`
    : formattedInteger;
};

const cleanNumber = (value: string): string => {
  if (!value) return "";
  // Remover todos los puntos de separación de miles
  const cleaned = value.replace(/\./g, "");
  // Reemplazar coma por punto si existe (formato decimal)
  return cleaned.replace(/,/g, ".");
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      error,
      label,
      id,
      currency = "USD",
      onChange,
      defaultValue,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [displayValue, setDisplayValue] = useState(
      defaultValue ? formatNumber(String(defaultValue)) : ""
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Permitir vacío
      if (inputValue === "") {
        setDisplayValue("");
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              name: name || e.target.name,
              value: "",
            },
          } as ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
        return;
      }

      // Solo permitir números y punto decimal
      const cleanInput = inputValue.replace(/[^\d.]/g, "");

      // Validar formato (máximo un punto decimal y 2 decimales)
      const parts = cleanInput.split(".");
      if (parts.length <= 2) {
        const formatted = formatNumber(cleanInput);
        setDisplayValue(formatted);

        // Pasar el valor limpio (sin separadores de miles) a react-hook-form
        const cleanValue = cleanNumber(cleanInput);

        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              name: name || e.target.name,
              value: cleanValue,
            },
          } as ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    };

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
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50 font-medium">
            {currency === "USD" ? "$" : currency}
          </span>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-(--primary)/20 focus:border-(--primary)",
              "font-mono text-lg",
              error
                ? "border-red-400 bg-red-50"
                : "border-black/10 bg-white hover:border-black/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
