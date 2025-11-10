"use client";
import { Alert } from "@/components/ui";
export default function OnboardingError({ error }: { error: Error }) {
  return (
    <div className="py-16">
      <Alert variant="error" title="Error">
        {error.message || "No se pudo cargar la solicitud."}
      </Alert>
    </div>
  );
}
