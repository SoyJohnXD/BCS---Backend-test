"use client";
import { forwardRef, InputHTMLAttributes, useState, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  error?: string;
  label?: string;
  currency?: string;
  name?: string;
  value?: number | null;
  onValueChange?: (value: number | null) => void;
}

const formatNumber = (raw: number | null): string => {
  if (raw === null || Number.isNaN(raw)) return "";
  const [intPart, decPart] = raw.toFixed(2).split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // Si los decimales son 00 los ocultamos para una vista más limpia
  return decPart === "00" ? formattedInt : `${formattedInt}.${decPart}`;
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      error,
      label,
      id,
      currency = "USD",
      name,
      value = null,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    // Estado crudo mientras el usuario edita (sin separadores de miles)
    const [rawValue, setRawValue] = useState<string>(
      value !== null ? value.toString() : ""
    );
    const [isFocused, setIsFocused] = useState(false);

    // Nota: no sincronizamos rawValue en efectos para evitar warning de lint.
    // Al enfocar recalculamos desde value actual.

    const sanitize = (input: string): string => {
      if (input === "") return "";
      // Permitimos dígitos y un solo punto decimal
      let cleaned = input.replace(/[^\d.,]/g, "").replace(/,/g, ".");
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        // Más de un separador decimal: ignoramos el último carácter
        cleaned = parts.slice(0, 2).join(".");
      }
      // Limitar a dos decimales si existen
      if (parts.length === 2 && parts[1].length > 2) {
        cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
      return cleaned;
    };

    const maybeParseNumber = (input: string): number | null => {
      if (!input) return null;
      if (input.endsWith(".")) return null; // parcial: usuario aún escribiendo decimales
      const num = Number(input);
      return Number.isNaN(num) ? null : num;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const nextRaw = sanitize(e.target.value);
      setRawValue(nextRaw);
      const parsed = maybeParseNumber(nextRaw);
      if (parsed !== null) onValueChange?.(parsed);
      else if (nextRaw === "") onValueChange?.(null); // vacío resetea valor
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Al perder foco formateamos si hay un número válido (parcial '1234.' -> 1234)
      let current = rawValue;
      if (current.endsWith(".")) current = current.slice(0, -1);
      const parsed = maybeParseNumber(current);
      if (parsed !== null) {
        onValueChange?.(parsed); // aseguramos valor final
        setRawValue(parsed.toString()); // base para futuros focuses
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      // Al enfocar mostramos versión sin separadores (rawValue ya lo es). Si venimos de formato, quitar puntos.
      if (value !== null) {
        setRawValue(value.toString());
      }
    };

    const display = isFocused
      ? rawValue
      : value !== null
      ? formatNumber(value)
      : "";

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
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
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
