import { create } from "zustand";

interface User {
  email: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  login: (user: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  login: (user: User) => {
    set({ user, status: "authenticated" });
  },
  logout: () => {
    set({ user: null, status: "unauthenticated" });
  },
  checkAuthStatus: async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        set({ user: null, status: "unauthenticated" });
        return;
      }
      const { user } = await response.json();
      set((current: AuthState) => ({
        user: user?.email ? user : current.user,
        status: "authenticated",
      }));
    } catch (error) {
      console.error("Error comprobando sesión:", error);
      set({ user: null, status: "unauthenticated" });
    }
  },
}));
