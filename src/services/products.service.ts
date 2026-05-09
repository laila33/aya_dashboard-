import { api } from "@/lib/api";
import type { Product } from "@/types/product";

interface RawCategory {
  _id: string;
  name: string;
}

interface RawProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  priceAfterDiscount?: number;
  image?: string;
  category?: RawCategory | null;
  isActive: boolean;
}

interface ProductsResponse {
  products: RawProduct[];
  page: number;
  pages: number;
  total: number;
}

function mapProduct(raw: RawProduct): Product {
  const hasDiscount = typeof raw.discount === "number" && raw.discount > 0;
  return {
    id: raw._id,
    name: raw.name,
    description: raw.description ?? "",
    image: raw.image ?? "",
    categoryId: raw.category?._id ?? "",
    price: raw.price,
    discountPercent: hasDiscount ? raw.discount : undefined,
    priceAfterDiscount:
      hasDiscount && raw.priceAfterDiscount != null
        ? raw.priceAfterDiscount
        : undefined,
    isActive: raw.isActive,
    hasDiscount,
  };
}

export async function getProducts(): Promise<Product[]> {
  const data = await api.get<ProductsResponse>("/products");
  return data.products.map(mapProduct);
}

export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  isActive: boolean;
}): Promise<Product> {
  const raw = await api.post<RawProduct>("/products", product);
  return mapProduct(raw);
}

export async function updateProduct(id: string, product: {
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  isActive: boolean;
}): Promise<Product> {
  const raw = await api.put<RawProduct>(`/products/${id}`, product);
  return mapProduct(raw);
}

// TODO: replace with real API mutation when endpoint is available
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.categoryId === categoryId);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

// TODO: replace with real API mutation when endpoint is available
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}
