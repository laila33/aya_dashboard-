export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
  productCount: number;
  sortOrder: number;
}

export interface CategoryStats {
  totalProducts: number;
  totalCategories: number;
  activeCategories: number;
}
