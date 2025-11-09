import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const state = useAuthStore((state) => state);

  return state;
};
