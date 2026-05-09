import { api } from "@/lib/api";
import type { Store } from "@/types/store";

export async function getSettings(): Promise<Store> {
  return api.get<Store>("/settings");
}

export async function updateSettings(payload: Omit<Store, "_id">): Promise<Store> {
  return api.put<Store>("/settings", payload);
}
