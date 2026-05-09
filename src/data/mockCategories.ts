import type { Category } from "@/types/category";

export const mockCategories: Category[] = [
  { id: "cat-tort", name: "تورت", image: "/assets/categories/tort.jpg", isActive: true, productCount: 6, sortOrder: 1 },
  { id: "cat-eastern", name: "حلويات شرقية", image: "/assets/categories/eastern.jpg", isActive: true, productCount: 5, sortOrder: 2 },
  { id: "cat-kunafa", name: "كنافة", image: "/assets/categories/kunafa.jpg", isActive: true, productCount: 4, sortOrder: 3 },
  { id: "cat-basbousa", name: "بسبوسة", image: "/assets/categories/basbousa.jpg", isActive: true, productCount: 3, sortOrder: 4 },
  { id: "cat-chocolate", name: "شوكولاتة", image: "/assets/categories/chocolate.jpg", isActive: true, productCount: 3, sortOrder: 5 },
  { id: "cat-offers", name: "عروض خاصة", image: "/assets/categories/offers.jpg", isActive: true, productCount: 3, sortOrder: 6 },
];
