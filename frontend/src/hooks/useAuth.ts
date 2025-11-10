"use client";
import { useEffect } from "react";
import { useAuthStore, type AuthState } from "@/store/auth.store";

export const useAuth = () => {
  const status = useAuthStore((s: AuthState) => s.status);
  const checkAuthStatus = useAuthStore((s: AuthState) => s.checkAuthStatus);
  const fullState = useAuthStore();

  useEffect(() => {
    if (status === "loading") {
      checkAuthStatus();
    }
  }, [status, checkAuthStatus]);

  return fullState;
};
