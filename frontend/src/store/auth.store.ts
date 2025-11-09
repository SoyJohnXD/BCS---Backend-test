import { create } from 'zustand';

interface User {
  email: string;
  // Podríamos añadir nombre, etc., si la API de login lo devolviera.
}

/**
 * El estado de autenticación de la UI.
 */
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * La forma completa de nuestro store (estado + acciones).
 */
interface AuthState {
  user: User | null;
  status: AuthStatus;
  
  /**
   * Acción llamada cuando el login (vía API Route) es exitoso.
   */
  login: (user: User) => void;
  
  /**
   * Acción llamada al hacer logout o si la sesión expira.
   */
  logout: () => void;
  
  /**
   * Acción para verificar el estado de la sesión al cargar la app.
   */
  checkAuthStatus: () => Promise<void>;
}

// --- 2. Creación del Store ---

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  user: null,
  status: 'loading', // Empezamos en 'loading' hasta que verifiquemos

  // --- Acciones ---

  login: (user: User) => {
    set({ user, status: 'authenticated' });
  },

  logout: () => {
    set({ user: null, status: 'unauthenticated' });
  },

  /**
   * Esta función es clave.
   * Llama a una API Route (que crearemos) para verificar la cookie HttpOnly.
   */
  checkAuthStatus: async () => {
    try {
      // TODO: Implementar GET /api/auth/session
      // const response = await fetch('/api/auth/session');
      
      // Simulación por ahora:
      const response = { ok: false, json: () => ({ user: null }) }; // Simular no logueado

      if (!response.ok) {
        set({ user: null, status: 'unauthenticated' });
        return;
      }

      const { user } = await response.json();
      set({ user, status: 'authenticated' });
    } catch (error) {
      set({ user: null, status: 'unauthenticated' });
    }
  },
}));