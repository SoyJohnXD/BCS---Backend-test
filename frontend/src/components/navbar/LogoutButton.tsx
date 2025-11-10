"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        throw new Error("Error cerrando sesión");
      }
      logout();
      router.push("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Saliendo..." : "Cerrar sesión"}
      </Button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
