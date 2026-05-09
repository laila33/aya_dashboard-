export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  price: number;
  discountPercent?: number;
  priceAfterDiscount?: number;
  isActive: boolean;
  hasDiscount: boolean;
}
