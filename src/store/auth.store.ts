import { create } from "zustand";
import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "creator" | "buyer" | "admin";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = "/login";
    }
  },

  rehydrate: async () => {
    try {
      // Hit refresh — if the refreshToken cookie is valid, backend sets
      // a new accessToken cookie and we decode the user from the response
      const { data } = await api.post("/auth/refresh");
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));