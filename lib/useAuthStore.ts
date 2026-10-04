import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; role: string; name: string; email: string }) => void;
  logout: () => void;
  syncFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  name: null,
  email: null,
  isAuthenticated: false,

  login: (data) => {
    // 7 দিনের জন্য কুকিতে সেভ করা হচ্ছে
    Cookies.set("auth_token", data.token, { expires: 7 });
    Cookies.set("user_role", data.role, { expires: 7 });
    Cookies.set("user_name", data.name, { expires: 7 });
    Cookies.set("user_email", data.email, { expires: 7 });

    set({
      token: data.token,
      role: data.role,
      name: data.name,
      email: data.email,
      isAuthenticated: true,
    });
  },

  logout: () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    Cookies.remove("user_name");
    Cookies.remove("user_email");

    set({
      token: null,
      role: null,
      name: null,
      email: null,
      isAuthenticated: false,
    });
  },

  syncFromCookies: () => {
    const token = Cookies.get("auth_token");
    const role = Cookies.get("user_role");
    const name = Cookies.get("user_name");
    const email = Cookies.get("user_email");

    if (token) {
      set({
        token,
        role: role || "customer",
        name: name || (email ? email.split("@")[0] : "Customer"),
        email: email || null,
        isAuthenticated: true,
      });
    } else {
      set({
        token: null,
        role: null,
        name: null,
        email: null,
        isAuthenticated: false,
      });
    }
  },
}));