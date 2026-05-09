import { api } from "@/lib/api";
import type { Category, CategoryStats } from "@/types/category";

interface RawCategory {
  _id: string;
  name: string;
  image: string;
  isActive: boolean;
  productCount: number;
}

function mapCategory(raw: RawCategory, index?: number): Category {
  return {
    id: raw._id,
    name: raw.name,
    image: raw.image ?? "",
    isActive: raw.isActive,
    productCount: raw.productCount ?? 0,
    sortOrder: typeof index === "number" ? index + 1 : 0,
  };
}

export async function getCategories(): Promise<Category[]> {
  const raw = await api.get<RawCategory[]>("/categories");
  return raw.map(mapCategory);
}

export async function createCategory(data: Pick<Category, "name" | "image" | "isActive">): Promise<Category> {
  const raw = await api.post<RawCategory>("/categories", data);
  return mapCategory(raw);
}

export async function updateCategory(id: string, data: Pick<Category, "name" | "image" | "isActive">): Promise<Category> {
  const raw = await api.put<RawCategory>(`/categories/${id}`, data);
  return mapCategory(raw);
}

export async function getCategoryStats(): Promise<CategoryStats> {
  return api.get<CategoryStats>("/categories/stats/all");
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

// TODO: replace with real API mutation when endpoint is available
export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id) ?? null;
}
