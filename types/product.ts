export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
};

export type EmiPlan = {
  id: string;
  tenureMonths: number;
  interestRate: string | number;
  cashbackAmount?: number | null;
  cashbackText?: string | null;
  tag?: string | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string;
  colorName?: string | null;
  colorHex?: string | null;
  attributes: Record<string, string>;
  mrp: number;
  price: number;
  imageUrl: string;
  images: string[];
  isDefault: boolean;
  stockQuantity: number;
  emiPlans: EmiPlan[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  badge?: string | null;
  description?: string | null;
  specs?: Record<string, unknown> | null;

  category?: {
    id?: string;
    name: string;
    slug: string;
  };

  variants: ProductVariant[];
};
