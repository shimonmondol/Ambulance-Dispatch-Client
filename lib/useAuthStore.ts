import { create } from "zustand";
import { AuthSession, clearAuthSession, getAuthSession, Role, setAuthSession } from "./auth";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: Role | null;
  name: string | null;
  email: string | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  syncFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  role: null,
  name: null,
  email: null,
  login: (session) => {
    setAuthSession(session);
    set({
      isAuthenticated: true,
      token: session.token,
      role: session.role,
      name: session.name,
      email: session.email,
    });
  },
  logout: () => {
    clearAuthSession();
    set({ isAuthenticated: false, token: null, role: null, name: null, email: null });
  },
  syncFromCookies: () => {
    const session = getAuthSession();
    if (session.token && session.role) {
      set({
        isAuthenticated: true,
        token: session.token,
        role: session.role,
        name: session.name || null,
        email: session.email || null,
      });
    }
  },
}));