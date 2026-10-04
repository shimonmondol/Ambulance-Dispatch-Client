import Cookies from "js-cookie";

export type Role = "customer" | "driver" | "admin";

export interface AuthSession {
  token: string;
  role: Role;
  name: string;
  email: string;
}

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";
const USER_KEY = "user_data";

export const setAuthSession = (session: AuthSession) => {
  Cookies.set(TOKEN_KEY, session.token, { expires: 7, path: "/" });
  Cookies.set(ROLE_KEY, session.role, { expires: 7, path: "/" });
  Cookies.set(USER_KEY, JSON.stringify({ name: session.name, email: session.email }), {
    expires: 7,
    path: "/",
  });
};

export const clearAuthSession = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(ROLE_KEY, { path: "/" });
  Cookies.remove(USER_KEY, { path: "/" });
};

export const getAuthSession = (): { token?: string; role?: Role; name?: string; email?: string } => {
  const token = Cookies.get(TOKEN_KEY);
  const role = Cookies.get(ROLE_KEY) as Role | undefined;
  const rawUser = Cookies.get(USER_KEY);
  let parsedUser = { name: "", email: "" };
  if (rawUser) {
    try {
      parsedUser = JSON.parse(rawUser);
    } catch {
      // ignore parse error
    }
  }
  return { token, role, ...parsedUser };
};