"use client";
import { Alert, LinkButton } from "@/components/ui";
export default function ProductError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="py-16">
      <Alert variant="error" title="Error al cargar">
        {error.message || "No se pudo cargar el producto."}
      </Alert>
      <div className="mt-6 flex gap-4">
        <LinkButton href="/" variant="ghost" size="sm">
          Inicio
        </LinkButton>
        <button type="button" onClick={reset} className="text-sm underline">
          Reintentar
        </button>
      </div>
    </div>
  );
}
