import { api } from "@/lib/api";
import {
  clearAuth,
  getToken,
  getUser,
  isAuthenticated,
  setToken,
  setUser,
} from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";
import type { AuthUser, LoginPayload } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<AuthUser> {
  return api.post<AuthUser>("/auth/login", payload);
}

export function saveAuth(user: AuthUser): void {
  setToken(user.token);
  setUser({ _id: user._id, name: user.name, email: user.email });
}

export function logout(): void {
  clearAuth();
  window.location.href = "/login";
}

export { getToken, getUser, isAuthenticated };
export type { StoredUser };
